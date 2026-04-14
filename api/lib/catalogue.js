/**
 * Shared fulfillment options catalogue (insurance types).
 * Imported by both checkout_sessions.js and fulfillment_options.js.
 *
 * NOTE: In production replace this with a DB / CMS call.
 */
/**
 * The six standard coverage dimensions used across all insurance types.
 * Each entry in a fulfillment option's `coverage` array references one of these keys.
 */
export const COVERAGE_ITEMS = [
  { key: 'damage_to_others',      label: 'Damage to others' },
  { key: 'window_damage',         label: 'Window damage' },
  { key: 'fire_storm_hail',       label: 'Fire, storm, or hail damage' },
  { key: 'theft_and_joyriding',   label: 'Theft and joyriding' },
  { key: 'animal_collision',      label: 'Collision with animals' },
  { key: 'own_fault_damage',      label: 'Damage to your car that you cause yourself' },
]

/**
 * Add-ons available with every fulfillment option.
 * `price_per_month` is in EUR.
 */
export const ADD_ONS = [
  {
    key: 'legal_assistance',
    label: 'Legal Assistance',
    description: 'Coverage for legal costs if you are involved in a dispute after an accident.',
    price_per_month: 6,
  },
  {
    key: 'occupant_injury',
    label: 'Occupant Injury',
    description: 'Compensation for injuries sustained by all passengers in your car, regardless of fault.',
    price_per_month: 7,
  },
  {
    key: 'roadside_assistance',
    label: 'Roadside Assistance',
    description: '24/7 breakdown and towing service across the Netherlands and Europe.',
    price_per_month: 6,
  },
  {
    key: 'ev_battery_security',
    label: 'EV Battery Security',
    description: 'Covers repair or replacement of your electric vehicle battery due to defects or damage.',
    price_per_month: 30,
  },
]

export const FULFILLMENT_OPTIONS = [
  {
    id: 'opt_wa',
    insurance_type: 'WA',
    name: 'WA – Wettelijke Aansprakelijkheid',
    description:
      'The mandatory minimum coverage required by Dutch law. Covers damage you cause ' +
      'to other people and their property. Does not cover repairs to your own vehicle ' +
      'after a fault accident.',
    suitable_for:
      'Best for cars older than 12 years where own-damage cover is no longer cost-effective.',
    coverage: [
      { key: 'damage_to_others',    covered: true  },
      { key: 'window_damage',       covered: false },
      { key: 'fire_storm_hail',     covered: false },
      { key: 'theft_and_joyriding', covered: false },
      { key: 'animal_collision',    covered: false },
      { key: 'own_fault_damage',    covered: false },
    ],
    coverage_highlights: [
      'Third-party bodily injury and property damage (legally required)',
      '24/7 roadside assistance in the Netherlands and abroad',
    ],
    premium_indication: 'From €4.50 / month',
  },
  {
    id: 'opt_wa_plus',
    insurance_type: 'WA_PLUS',
    name: 'WA Plus – Beperkt Casco',
    description:
      'Everything included in WA, plus limited own-damage cover for a defined set of ' +
      'risks. Your car is protected against theft, fire, natural disasters, and glass ' +
      'damage — but collision damage you cause yourself is not covered.',
    suitable_for: 'Best for cars between 7 and 11 years old.',
    coverage: [
      { key: 'damage_to_others',    covered: true  },
      { key: 'window_damage',       covered: true  },
      { key: 'fire_storm_hail',     covered: true  },
      { key: 'theft_and_joyriding', covered: true  },
      { key: 'animal_collision',    covered: true  },
      { key: 'own_fault_damage',    covered: false },
    ],
    coverage_highlights: [
      'All WA coverage',
      'Glass damage: chips, cracks, or full windscreen replacement',
      'Storm, hail, and flood damage to your own vehicle',
      'Theft and attempted theft',
    ],
    premium_indication: 'From €8.90 / month',
  },
  {
    id: 'opt_all_risk',
    insurance_type: 'ALL_RISK',
    name: 'WA All Risk – Volledig Casco',
    description:
      'Our most comprehensive car insurance. Includes everything in WA Plus and ' +
      'additionally covers damage to your own vehicle regardless of who is at fault — ' +
      'including single-vehicle accidents, collision with another car, and running off ' +
      'the road or into water.',
    suitable_for:
      'Best for new or nearly-new cars (under 7 years old) where protecting your own vehicle is a priority.',
    coverage: [
      { key: 'damage_to_others',    covered: true },
      { key: 'window_damage',       covered: true },
      { key: 'fire_storm_hail',     covered: true },
      { key: 'theft_and_joyriding', covered: true },
      { key: 'animal_collision',    covered: true },
      { key: 'own_fault_damage',    covered: true },
    ],
    coverage_highlights: [
      'All WA Plus coverage',
      'Own-vehicle collision damage, regardless of fault',
      'Single-vehicle accidents (e.g. hitting a kerb or barrier)',
      'Running off the road or into water',
      'Optional: EV battery coverage add-on available',
    ],
    premium_indication: 'From €14.20 / month',
  },
]

export const VALID_INSURANCE_TYPES = FULFILLMENT_OPTIONS.map((o) => o.insurance_type)
