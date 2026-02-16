import { useCallback, useEffect, useState } from 'react'

function getCurrentRoute() {
  const hash = window.location.hash || '#/'
  return hash === '#/estadisticas' ? 'estadisticas' : 'formulario'
}

export default function useHashRoute() {
  const [route, setRoute] = useState(getCurrentRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(getCurrentRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goTo = useCallback((nextRoute) => {
    const hash = nextRoute === 'estadisticas' ? '#/estadisticas' : '#/'
    if (window.location.hash !== hash) {
      window.location.hash = hash
    } else {
      setRoute(nextRoute)
    }
  }, [])

  return { route, goTo }
}
