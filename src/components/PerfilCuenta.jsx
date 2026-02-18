import UsuarioPerfil from './UsuarioPerfil.jsx'

export default function PerfilCuenta({ userAuth, userDoc, error }) {
  return (
    <section className="perfil-page">
      <h2>Perfil de Usuario</h2>

      <UsuarioPerfil userAuth={userAuth} userDoc={userDoc} error={error} />

      <div className="perfil-opciones">
        <article className="perfil-opcion-card">
          <h3>Cambiar contrasena</h3>
          <p className="perfil-opcion-help">Proximamente podras actualizar tu contrasena desde aqui.</p>
          <div className="perfil-opcion-actions">
            <button type="button" className="btn btn-secondary btn-sm" disabled>
              Editar
            </button>
            <button type="button" className="btn btn-primary btn-sm" disabled>
              Confirmar
            </button>
          </div>
        </article>

        <article className="perfil-opcion-card">
          <h3>Actualizar datos del perfil</h3>
          <p className="perfil-opcion-help">Proximamente podras modificar informacion personal y del hospital.</p>
          <div className="perfil-opcion-actions">
            <button type="button" className="btn btn-secondary btn-sm" disabled>
              Editar
            </button>
            <button type="button" className="btn btn-primary btn-sm" disabled>
              Confirmar
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}
