/**
 * checkout_sessions.js — Netlify function handling all /api/checkout_sessions/* routes.
 *
 * Routes:
 *   POST   /api/checkout_sessions           → createCheckoutSession
 *   GET    /api/checkout_sessions/:id       → getCheckoutSession
 *   POST   /api/checkout_sessions/:id       → updateCheckoutSession
 *   POST   /api/checkout_sessions/:id/cancel → cancelCheckoutSession
 *
 * All domain logic (models, validation, factories) lives in _models.js.
 * Insurance catalogue lives in _catalogue.js.
 *
 * ⚠️  In-memory store: sessions reset on cold-start.
 *     Swap `sessions` Map for a DB (Fauna, Supabase, etc.) in production.
 */
import {
  CheckoutSession,
  BuyerInfo,
  CarInfo,
  SelectedFulfillmentOption,
  createCheckoutSession,
  validateBuyerInfo,
  validateCarInfo,
  validateSelectedFulfillmentOption,
} from '../lib/models.js'

// ─── In-memory store ──────────────────────────────────────────────────────────
/** @type {Map<string, CheckoutSession>} */
const sessions = new Map()

// ─── HTTP helpers ─────────────────────────────────────────────────────────────
const json = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', ...extraHeaders },
  body: JSON.stringify(body),
})

const error = (statusCode, code, message, details) =>
  json(statusCode, { code, message, ...(details ? { details } : {}) })

/**
 * Extracts path segments after "checkout_sessions".
 * Works for both /.netlify/functions/checkout_sessions and /api/checkout_sessions.
 *
 * @example
 *   parseSegments("/.netlify/functions/checkout_sessions/cs_abc/cancel")
 *   // → ["cs_abc", "cancel"]
 */
const parseSegments = (path) => {
  const marker = 'checkout_sessions'
  const idx = path.indexOf(marker)
  if (idx === -1) return []
  const rest = path.slice(idx + marker.length).replace(/^\//, '')
  return rest ? rest.split('/').filter(Boolean) : []
}

// ─── Route handlers ───────────────────────────────────────────────────────────

/** POST /api/checkout_sessions */
function handleCreate(body) {
  if (!body || typeof body !== 'object') {
    return error(400, 'invalid_body', 'Request body must be a JSON object.')
  }

  const { product_type, locale } = body

  if (product_type !== 'car_insurance') {
    return error(400, 'invalid_product_type', "product_type must be 'car_insurance'.", {
      received: product_type,
    })
  }

  const session = createCheckoutSession(product_type, locale)
  sessions.set(session.id, session)

  return json(201, session, { 'Idempotency-Key': session.id })
}

/** GET /api/checkout_sessions/:id */
function handleGet(id) {
  const session = sessions.get(id)
  if (!session) return error(404, 'session_not_found', `No session found with id '${id}'.`)
  return json(200, session)
}

/** POST /api/checkout_sessions/:id */
function handleUpdate(id, body) {
  const session = sessions.get(id)
  if (!session) return error(404, 'session_not_found', `No session found with id '${id}'.`)

  if (session.status === 'completed') {
    return error(409, 'session_completed', 'Cannot update a completed session.')
  }
  if (session.status === 'cancelled') {
    return error(409, 'session_cancelled', 'Cannot update a cancelled session.')
  }
  if (!body || typeof body !== 'object') {
    return error(400, 'invalid_body', 'Request body must be a JSON object.')
  }

  const { selected_fulfillment_option, buyer_info, car_info } = body

  if (selected_fulfillment_option !== undefined) {
    const err = validateSelectedFulfillmentOption(selected_fulfillment_option)
    if (err) return error(400, 'invalid_fulfillment_option', err)
    session.selected_fulfillment_option = new SelectedFulfillmentOption(selected_fulfillment_option)
  }

  if (buyer_info !== undefined) {
    const err = validateBuyerInfo(buyer_info)
    if (err) return error(400, 'invalid_buyer_info', err)
    session.buyer_info = new BuyerInfo(buyer_info)
  }

  if (car_info !== undefined) {
    const err = validateCarInfo(car_info)
    if (err) return error(400, 'invalid_car_info', err)
    session.car_info = new CarInfo(car_info)
  }

  session.recalculateStatus()
  session.touch()
  sessions.set(id, session)

  return json(200, session)
}

/** POST /api/checkout_sessions/:id/cancel */
function handleCancel(id) {
  const session = sessions.get(id)
  if (!session) return error(404, 'session_not_found', `No session found with id '${id}'.`)

  if (session.status === 'completed') {
    return error(405, 'not_cancelable', 'Cannot cancel a session that is already completed.')
  }
  if (session.status === 'cancelled') {
    return error(405, 'not_cancelable', 'Session is already cancelled.')
  }

  session.status = 'cancelled'
  session.touch()
  sessions.set(id, session)

  return json(200, session)
}

// ─── Router ───────────────────────────────────────────────────────────────────
export const handler = async (event) => {
  const method = event.httpMethod
  const segments = parseSegments(event.path)

  let body = null
  if (event.body) {
    try {
      body = JSON.parse(event.body)
    } catch {
      return error(400, 'invalid_json', 'Request body is not valid JSON.')
    }
  }

  if (segments.length === 0 && method === 'POST')                            return handleCreate(body)
  if (segments.length === 1 && method === 'GET')                             return handleGet(segments[0])
  if (segments.length === 1 && method === 'POST')                            return handleUpdate(segments[0], body)
  if (segments.length === 2 && segments[1] === 'cancel' && method === 'POST') return handleCancel(segments[0])

  return error(404, 'not_found', `No route matched: ${method} ${event.path}`)
}

