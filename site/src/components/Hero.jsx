const STEPS = ['Gegevens', 'Dekking', 'Controle', 'Bevestiging']

export default function Hero({ activeStep = 0 }) {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">Autoverzekering</p>
          <h1>Vraag je autoverzekering aan</h1>
          <p className="lead">
            Vul je gegevens in en doorloop de stappen. Je ziet tussendoor een overzicht van je aanvraag.
          </p>
          <ol className="stepper" aria-label="Voortgang">
            {STEPS.map((label, i) => (
              <li key={label} className={`stepper__step${i === activeStep ? ' is-active' : ''}`}>
                <span className="stepper__dot" aria-hidden="true" />
                <span className="stepper__label">{label}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="hero__badge" role="note" aria-label="Korte uitleg">
          <div className="badge">
            <div className="badge__icon" aria-hidden="true">i</div>
            <div className="badge__content">
              <p className="badge__title">Tip</p>
              <p className="badge__text">Houd je kenteken, postcode en rijbewijsgegevens bij de hand.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
