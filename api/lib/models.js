/**
 * _models.js — Domain models, validators, and factories for the NN insurance checkout API.
 *
 * Exports:
 *   Classes:   BuyerInfo, CarInfo, SelectedFulfillmentOption, CheckoutSession
 *   Factories: createBuyerInfo(raw), createCarInfo(raw), createCheckoutSession(id, productType, locale)
 *   Validators: validateBuyerInfo(raw), validateCarInfo(raw), validateSelectedFulfillmentOption(raw)
 */

import { randomUUID } from 'crypto'
import { FULFILLMENT_OPTIONS, VALID_INSURANCE_TYPES } from './catalogue.js'

// ─── Constants ────────────────────────────────────────────────────────────────

const DATE_RE        = /^\d{2}-\d{2}-\d{4}$/          // DD-MM-YYYY
const POSTAL_CODE_RE = /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/ // Dutch postal code

// ─── Models ───────────────────────────────────────────────────────────────────

/**
 * Represents the personal information of the policyholder.
 *
 * @property {string} date_of_birth  - Date of birth in DD-MM-YYYY format
 * @property {string} postal_code    - Dutch postal code (e.g. "1234 AB")
 * @property {string} house_number   - House number, optionally with suffix (e.g. "12A")
 */
export class BuyerInfo {
  constructor({ date_of_birth, postal_code, house_number }) {
    this.date_of_birth = date_of_birth
    this.postal_code   = postal_code.toUpperCase().replace(/\s+/, ' ').trim()
    this.house_number  = house_number.trim()
  }
}

/**
 * Represents the vehicle to be insured.
 *
 * @property {string}  license_plate     - Dutch license plate (uppercased, hyphens preserved)
 * @property {string}  registered_owner  - Full name of the RDW-registered owner
 * @property {number}  no_claim_years    - Claim-free years (0–25); determines bonus-malus discount
 * @property {boolean} has_dashcam       - Whether a dashcam is permanently fitted
 */
export class CarInfo {
  constructor({ license_plate, registered_owner, no_claim_years, has_dashcam = false }) {
    this.license_plate    = license_plate.toUpperCase().replace(/\s/g, '').trim()
    this.registered_owner = registered_owner.trim()
    this.no_claim_years   = no_claim_years
    this.has_dashcam      = has_dashcam
  }
}

/**
 * Represents the customer's chosen insurance coverage level (step 1 selection).
 *
 * @property {string} insurance_type - One of: "WA" | "WA_PLUS" | "ALL_RISK"
 */
export class SelectedFulfillmentOption {
  constructor({ insurance_type }) {
    this.insurance_type = insurance_type
  }
}

/**
 * Represents a checkout session and its current state.
 *
 * @property {string}   id                          - Unique session identifier (cs_...)
 * @property {string}   status                      - "pending" | "step_complete" | "completed" | "cancelled"
 * @property {number}   current_step                - Current step number (1 = insurance type, 2 = details, ...)
 * @property {string}   product_type                - Always "car_insurance"
 * @property {string}   locale                      - BCP-47 locale (default "nl-NL")
 * @property {object[]} fulfillment_options         - Available insurance types (returned on create)
 * @property {SelectedFulfillmentOption|null} selected_fulfillment_option
 * @property {BuyerInfo|null}                buyer_info
 * @property {CarInfo|null}                  car_info
 * @property {string}   created_at                  - ISO 8601 timestamp
 * @property {string}   updated_at                  - ISO 8601 timestamp
 */
export class CheckoutSession {
  constructor({ id, product_type, locale = 'nl-NL' }) {
    this.id                         = id
    this.status                     = 'pending'
    this.current_step               = 1
    this.product_type               = product_type
    this.locale                     = locale
    this.fulfillment_options        = FULFILLMENT_OPTIONS
    this.selected_fulfillment_option = null
    this.buyer_info                 = null
    this.car_info                   = null
    this.created_at                 = new Date().toISOString()
    this.updated_at                 = new Date().toISOString()
  }

  /** Touch updated_at timestamp. */
  touch() {
    this.updated_at = new Date().toISOString()
  }

  /**
   * Re-evaluate status based on which step-1 fields are filled.
   * Advances to step 2 once all three step-1 fields are present.
   */
  recalculateStatus() {
    if (this.current_step !== 1) return
    const step1Complete =
      this.selected_fulfillment_option !== null &&
      this.buyer_info !== null &&
      this.car_info !== null

    this.status = step1Complete ? 'step_complete' : 'pending'
    if (step1Complete) this.current_step = 2
  }
}

// ─── Validators ───────────────────────────────────────────────────────────────

/**
 * Validates a raw buyer_info payload.
 * @param {unknown} raw
 * @returns {string|null} Error message, or null if valid.
 */
export function validateBuyerInfo(raw) {
  if (typeof raw !== 'object' || raw === null) {
    return 'buyer_info must be an object.'
  }
  if (!raw.date_of_birth || !DATE_RE.test(raw.date_of_birth)) {
    return 'buyer_info.date_of_birth is required and must be in DD-MM-YYYY format.'
  }
  if (!raw.postal_code || !POSTAL_CODE_RE.test(raw.postal_code)) {
    return 'buyer_info.postal_code is required and must be a valid Dutch postal code (e.g. "1234 AB").'
  }
  if (!raw.house_number || typeof raw.house_number !== 'string' || !raw.house_number.trim()) {
    return 'buyer_info.house_number is required.'
  }
  return null
}

/**
 * Validates a raw car_info payload.
 * @param {unknown} raw
 * @returns {string|null} Error message, or null if valid.
 */
export function validateCarInfo(raw) {
  if (typeof raw !== 'object' || raw === null) {
    return 'car_info must be an object.'
  }
  if (!raw.license_plate || typeof raw.license_plate !== 'string' || !raw.license_plate.trim()) {
    return 'car_info.license_plate is required.'
  }
  if (!raw.registered_owner || typeof raw.registered_owner !== 'string' || !raw.registered_owner.trim()) {
    return 'car_info.registered_owner is required.'
  }
  if (
    raw.no_claim_years === undefined ||
    raw.no_claim_years === null ||
    !Number.isInteger(raw.no_claim_years) ||
    raw.no_claim_years < 0 ||
    raw.no_claim_years > 25
  ) {
    return 'car_info.no_claim_years is required and must be an integer between 0 and 25.'
  }
  if (raw.has_dashcam !== undefined && typeof raw.has_dashcam !== 'boolean') {
    return 'car_info.has_dashcam must be a boolean.'
  }
  return null
}

/**
 * Validates a raw selected_fulfillment_option payload.
 * @param {unknown} raw
 * @returns {string|null} Error message, or null if valid.
 */
export function validateSelectedFulfillmentOption(raw) {
  if (typeof raw !== 'object' || raw === null) {
    return 'selected_fulfillment_option must be an object.'
  }
  if (!raw.insurance_type) {
    return 'selected_fulfillment_option.insurance_type is required.'
  }
  if (!VALID_INSURANCE_TYPES.includes(raw.insurance_type)) {
    return `insurance_type must be one of: ${VALID_INSURANCE_TYPES.join(', ')}. Received: "${raw.insurance_type}".`
  }
  return null
}

// ─── Factories ────────────────────────────────────────────────────────────────

/**
 * Creates a new CheckoutSession instance with a generated ID.
 * @param {string} product_type
 * @param {string} [locale]
 * @returns {CheckoutSession}
 */
export function createCheckoutSession(product_type, locale) {
  const id = `cs_${randomUUID().replace(/-/g, '').slice(0, 12)}`
  return new CheckoutSession({ id, product_type, locale })
}
