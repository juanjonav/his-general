export default function AppNav({ onGoTo, onOpenPerfil, onSignOut }) {
  return (
    <section className="mb-5">
      <div className="row">
        <div className="col-md-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => onGoTo('formulario')}>
            Ir a Formulario
          </button>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onGoTo('estadisticas')}>
            Ver estadisticas
          </button>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onOpenPerfil}>
            Perfil
          </button>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-danger btn-sm" onClick={onSignOut}>
            Cerrar sesion
          </button>
        </div>
      </div>
    </section>
  )
}
