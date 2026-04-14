export default function InsuranceForm({ formData, onChange, onSubmit }) {
  return (
    <section className="card">
      <header className="card__header">
        <h2>Stap 1: jouw gegevens</h2>
        <p className="muted">
          Velden met <span aria-hidden="true">*</span>
          <span className="sr-only">sterretje</span> zijn verplicht.
        </p>
      </header>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__row">
          <div className="field">
            <label htmlFor="license">Kenteken <span aria-hidden="true">*</span></label>
            <input
              id="license"
              name="license"
              type="text"
              placeholder="Bijv. 12-AB-34"
              autoComplete="off"
              required
              value={formData.license}
              onChange={onChange}
            />
            <p className="field__hint">Zonder spaties of met streepjes – beide is oké.</p>
          </div>

          <div className="field">
            <label htmlFor="mileage">Kilometers per jaar</label>
            <select id="mileage" name="mileage" value={formData.mileage} onChange={onChange}>
              <option value="5000">0 – 5.000</option>
              <option value="10000">5.000 – 10.000</option>
              <option value="15000">10.000 – 15.000</option>
              <option value="20000">15.000 – 20.000</option>
              <option value="30000">20.000+</option>
            </select>
          </div>
        </div>

        <div className="form__row">
          <div className="field">
            <label htmlFor="postcode">Postcode <span aria-hidden="true">*</span></label>
            <input
              id="postcode"
              name="postcode"
              type="text"
              placeholder="1234 AB"
              autoComplete="postal-code"
              required
              value={formData.postcode}
              onChange={onChange}
            />
          </div>

          <div className="field field--small">
            <label htmlFor="houseNumber">Huisnr. <span aria-hidden="true">*</span></label>
            <input
              id="houseNumber"
              name="houseNumber"
              type="text"
              placeholder="12"
              inputMode="numeric"
              required
              value={formData.houseNumber}
              onChange={onChange}
            />
          </div>

          <div className="field field--small">
            <label htmlFor="addition">Toev.</label>
            <input
              id="addition"
              name="addition"
              type="text"
              placeholder="A"
              value={formData.addition}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="form__row">
          <div className="field">
            <label htmlFor="dob">Geboortedatum <span aria-hidden="true">*</span></label>
            <input
              id="dob"
              name="dob"
              type="date"
              required
              value={formData.dob}
              onChange={onChange}
            />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail <span aria-hidden="true">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="naam@voorbeeld.nl"
              autoComplete="email"
              required
              value={formData.email}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="divider" role="separator" aria-hidden="true" />

        <div className="form__row">
          <div className="field field--full">
            <label className="check">
              <input type="checkbox" required />
              <span>Ik ga akkoord met de verwerking van mijn gegevens voor deze aanvraag.</span>
            </label>
            <p className="field__hint">
              Dit is een voorbeeldtekst. Vervang dit door je echte privacy/voorwaarden tekst.
            </p>
          </div>
        </div>

        <div className="actions">
          <button type="button" className="btn btn--ghost">Opslaan</button>
          <button type="submit" className="btn btn--primary">Verder</button>
        </div>
      </form>
    </section>
  )
}
