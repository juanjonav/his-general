export default function UsuarioPerfil({ userAuth, userDoc, error }) {
  if (error) {
    return (
      <section className="perfil-card">
        <h3>Perfil</h3>
        <p className="perfil-error">No se pudo cargar el perfil.</p>
      </section>
    )
  }

  return (
    <section className="perfil-card">
      <h3>Perfil</h3>
      <div className="perfil-grid">
        <div>
          <span className="perfil-label">Nombre</span>
          <p>{userDoc?.nombre || userAuth?.displayName || 'Sin nombre'}</p>
        </div>
        <div>
          <span className="perfil-label">Correo</span>
          <p>{userDoc?.email || userAuth?.email || 'Sin correo'}</p>
        </div>
        <div>
          <span className="perfil-label">Hospital</span>
          <p>{userDoc?.hospitalId || 'No asignado'}</p>
        </div>
        <div>
          <span className="perfil-label">UID</span>
          <p className="perfil-mono">{userAuth?.uid}</p>
        </div>
      </div>
    </section>
  )
}
