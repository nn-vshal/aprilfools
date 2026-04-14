export default function Sidebar({ formData }) {
  return (
    <aside className="sidebar" aria-label="Samenvatting">
      <section className="card card--sticky">
        <header className="card__header">
          <h3>Jouw aanvraag</h3>
          <p className="muted">Samenvatting (voorbeeld)</p>
        </header>
        <dl className="summary">
          <div className="summary__row">
            <dt>Kenteken</dt>
            <dd>{formData.license || '—'}</dd>
          </div>
          <div className="summary__row">
            <dt>Postcode</dt>
            <dd>{formData.postcode || '—'}</dd>
          </div>
          <div className="summary__row">
            <dt>Kilometers</dt>
            <dd>
              {{
                '5000': '0–5.000',
                '10000': '5.000–10.000',
                '15000': '10.000–15.000',
                '20000': '15.000–20.000',
                '30000': '20.000+',
              }[formData.mileage] || '5.000–10.000'}
            </dd>
          </div>
        </dl>
        <div className="callout">
          <p className="callout__title">Hulp nodig?</p>
          <p className="callout__text">Bekijk veelgestelde vragen of neem contact op met een adviseur.</p>
          <a className="btn btn--small btn--ghost" href="#">Veelgestelde vragen</a>
        </div>
      </section>
    </aside>
  )
}
