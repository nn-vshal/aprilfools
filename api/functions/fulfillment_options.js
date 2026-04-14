/**
 * GET /api/fulfillment_options
 *
 * Returns the full catalogue of selectable insurance types for step 1 of checkout.
 * Can be called without an active session (e.g. product-comparison page).
 */
import { FULFILLMENT_OPTIONS, COVERAGE_ITEMS, ADD_ONS } from '../lib/catalogue.js'

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { code: 'method_not_allowed', message: 'Only GET is supported.' })
  }

  return json(200, { coverage_items: COVERAGE_ITEMS, options: FULFILLMENT_OPTIONS, add_ons: ADD_ONS })
}
