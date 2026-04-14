export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__cols">
          <div>
            <p className="footer__title">Service</p>
            <a className="footer__link" href="#">Contact</a>
            <a className="footer__link" href="#">Cookieverklaring</a>
            <a className="footer__link" href="#">Privacy</a>
          </div>
          <div>
            <p className="footer__title">Producten</p>
            <a className="footer__link" href="#">Autoverzekering</a>
            <a className="footer__link" href="#">Woonverzekering</a>
            <a className="footer__link" href="#">Reisverzekering</a>
          </div>
          <div>
            <p className="footer__title">Over</p>
            <a className="footer__link" href="#">Wie zijn wij</a>
            <a className="footer__link" href="#">Werken bij</a>
          </div>
        </div>
        <p className="footer__fineprint">
          Voorbeeld UI-template (niet-officieel). Vervang logo/teksten/kleuren met je eigen assets.
        </p>
      </div>
    </footer>
  )
}
