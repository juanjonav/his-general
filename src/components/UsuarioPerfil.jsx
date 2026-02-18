export default function UsuarioPerfil({ userAuth, userDoc, error }) {
  if (error) {
    return (
      <section className="perfil-card">
        <p className="perfil-error">No se pudo cargar el perfil.</p>
      </section>
    )
  }

  return (
    <section className="perfil-card">
      <div className="perfil-row">
        <div className="perfil-item">
          <span className="perfil-label">Nombre</span>
          <p>{userDoc?.nombre || userAuth?.displayName || 'Sin nombre'}</p>
        </div>
        <div className="perfil-item">
          <span className="perfil-label">DNI</span>
          <p>{userDoc?.dni || userAuth?.dni || 'Sin DNI'}</p>
        </div>
      </div>

    </section>
  )
}
