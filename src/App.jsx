import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import FormularioPaciente from './components/FormularioPaciente.jsx'

const InformeEstadisticas = lazy(() => import('./components/InformeEstadisticas.jsx'))

function getCurrentRoute() {
  const hash = window.location.hash || '#/'
  return hash === '#/estadisticas' ? 'estadisticas' : 'formulario'
}

function App() {
  const [route, setRoute] = useState(getCurrentRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(getCurrentRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goTo = (nextRoute) => {
    const hash = nextRoute === 'estadisticas' ? '#/estadisticas' : '#/'
    if (window.location.hash !== hash) {
      window.location.hash = hash
    } else {
      setRoute(nextRoute)
    }
  }

  return (
    <>
      <section className="mb-5">
        <div className="row">
          <div className="col-md-2">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => goTo('formulario')}>
              Ir a Formulario
            </button>
          </div>
          <div className="col-md-2">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => goTo('estadisticas')}>
              Ver estadisticas
            </button>
          </div>
        </div>
      </section>

      {route === 'formulario' ? (
        <FormularioPaciente />
      ) : (
        <Suspense fallback={<section>Cargando informe...</section>}>
          <InformeEstadisticas />
        </Suspense>
      )}
    </>
  )
}

export default App
