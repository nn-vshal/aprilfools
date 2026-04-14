export default function Topbar() {
  return (
    <div className="topbar" role="banner">
      <div className="container topbar__inner">
        <span className="topbar__hint">Particulier</span>
        <div className="topbar__actions">
          <a className="link" href="#">Inloggen</a>
          <a className="link" href="#">Contact</a>
        </div>
      </div>
    </div>
  )
}
