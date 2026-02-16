import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../services/firebase.js'

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      onSuccess()
    } catch (err) {
      const message =
        err?.code === 'auth/invalid-credential'
          ? 'Correo o contraseña inválidos.'
          : 'No se pudo iniciar sesión. Intenta de nuevo.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="login-card">
      <h2>Ingreso</h2>
      <p className="login-help">Acceso solo para usuarios registrados en Firebase.</p>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-4">
            <label htmlFor="login-email">Correo</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="col-4">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
        </div>
        {error ? <p className="login-error">{error}</p> : null}
        <div className="text-end mt-4">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </form>
    </section>
  )
}
