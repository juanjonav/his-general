import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import FormularioPaciente from './components/FormularioPaciente.jsx'
import AppNav from './components/AppNav.jsx'
import useHashRoute from './hooks/useHashRoute.js'
import Login from './components/Login.jsx'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from './services/firebase.js'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import PerfilCuenta from './components/PerfilCuenta.jsx'

const InformeEstadisticas = lazy(() => import('./components/InformeEstadisticas.jsx'))

function App() {
  const [user, setUser] = useState(null)

  const { route, goTo } = useHashRoute()
  const [authReady, setAuthReady] = useState(false)
  const [userDoc, setUserDoc] = useState(null)
  const [perfilError, setPerfilError] = useState('')

  useEffect(() => {
    let active = true
    const ensureUserDocument = async (firebaseUser) => {
      const userRef = doc(db, 'usuarios', firebaseUser.uid)
      const snapshot = await getDoc(userRef)

      if (!snapshot.exists()) {
        await setDoc(userRef, {
          nombre: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          dni: '',
          hospitalId: '',
          createdAt: serverTimestamp(),
        })
      }

      const freshSnapshot = await getDoc(userRef)
      if (active) {
        setUserDoc(freshSnapshot.exists() ? freshSnapshot.data() : null)
        setPerfilError('')
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setAuthReady(true)
      if (firebaseUser) {
        ensureUserDocument(firebaseUser).catch((error) => {
          console.error('Error asegurando usuario en Firestore:', error)
          if (active) {
            setPerfilError('No se pudo cargar el perfil.')
          }
        })
      } else {
        setUserDoc(null)
        setPerfilError('')
      }
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [goTo])

  if (!authReady) {
    return <section>Cargando sesión...</section>
  }

  if (!user) {
    return <Login onSuccess={() => goTo('formulario')} />
  }

  return (
    <>
      <AppNav
        hospital={userDoc?.hospitalId || 'Hospital no asignado'}
        activeRoute={route}
        onGoTo={(nextRoute) => goTo(nextRoute)}
        onOpenPerfil={() => goTo('perfil')}
        onSignOut={() => signOut(auth)}
      />

      {route === 'formulario' ? <FormularioPaciente userAuth={user} userDoc={userDoc} /> : null}

      {route === 'estadisticas' ? (
        <Suspense fallback={<section>Cargando informe...</section>}>
          <InformeEstadisticas />
        </Suspense>
      ) : null}

      {route === 'perfil' ? (
        <PerfilCuenta userAuth={user} userDoc={userDoc} error={perfilError} />
      ) : null}
    </>
  )
}

export default App
