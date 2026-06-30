import { useState, useEffect } from 'react'

// Hook genérico para consumir promesas asíncronas con estado de carga/error.
// El caller pasa deps explícitas (como React Query) — asyncFn puede ser inline.
export function useAsync(asyncFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    asyncFn()
      .then((result) => {
        if (active) { setData(result); setLoading(false) }
      })
      .catch((err) => {
        if (active) { setError(err); setLoading(false) }
      })

    return () => { active = false }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error }
}
