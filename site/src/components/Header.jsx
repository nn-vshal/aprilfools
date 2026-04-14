export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <a className="brand" href="#" aria-label="Home">
          <span className="brand__mark" aria-hidden="true">Agentic</span>
          <span className="brand__text">Verzekeren</span>
        </a>
        <nav className="nav" aria-label="Hoofdnavigatie">
          <a className="nav__item" href="#">Verzekering</a>
          <a className="nav__item" href="#">Schade melden</a>
          <a className="nav__item" href="#">Service &amp; Contact</a>
        </nav>
        <div className="header__cta">
          <a className="btn btn--ghost" href="#">Hulp nodig?</a>
        </div>
      </div>
    </header>
  )
}
