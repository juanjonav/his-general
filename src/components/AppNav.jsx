export default function AppNav({ hospital, activeRoute, onGoTo, onOpenPerfil, onSignOut }) {
  return (
    <nav className="app-nav mb-5">
      <div className="app-nav-brand" title={hospital}>
        {hospital}
      </div>

      <div className="app-nav-actions">
        <button
          type="button"
          className={`btn btn-sm app-nav-btn ${activeRoute === 'formulario' ? 'is-active' : ''}`}
          onClick={() => onGoTo('formulario')}
        >
          Formulario
        </button>

        <button
          type="button"
          className={`btn btn-sm app-nav-btn ${activeRoute === 'estadisticas' ? 'is-active' : ''}`}
          onClick={() => onGoTo('estadisticas')}
        >
          Estadisticas
        </button>

        <details className="perfil-dropdown">
          <summary className="perfil-dropdown-trigger" aria-label="Perfil">
            <img src="/usuario.svg" alt="Perfil" />
          </summary>

          <div className="perfil-dropdown-menu">
            <button type="button" className="perfil-dropdown-item" onClick={onOpenPerfil}>
              Ver perfil
            </button>
            <button type="button" className="perfil-dropdown-item danger" onClick={onSignOut}>
              Cerrar sesion
            </button>
          </div>
        </details>
      </div>
    </nav>
  )
}
