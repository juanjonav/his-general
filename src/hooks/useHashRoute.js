import { useCallback, useEffect, useState } from 'react'

function getCurrentRoute() {
  const hash = window.location.hash || '#/'
  if (hash === '#/estadisticas') return 'estadisticas'
  if (hash === '#/perfil') return 'perfil'
  return 'formulario'
}

export default function useHashRoute() {
  const [route, setRoute] = useState(getCurrentRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(getCurrentRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goTo = useCallback((nextRoute) => {
    const hashMap = {
      formulario: '#/',
      estadisticas: '#/estadisticas',
      perfil: '#/perfil',
    }
    const hash = hashMap[nextRoute] || '#/'
    if (window.location.hash !== hash) {
      window.location.hash = hash
    } else {
      setRoute(nextRoute)
    }
  }, [])

  return { route, goTo }
}
