import { useEffect, useState } from 'react'
export function useFetch(fn, deps = []) {
  const [s, setS] = useState({ data: null, loading: true, error: null })
  const [n, setN] = useState(0)
  useEffect(() => {
    let ok = true
    setS(x => ({ ...x, loading: true, error: null }))
    fn().then(d => ok && setS({ data: d, loading: false, error: null }))
      .catch(e => ok && setS({ data: null, loading: false, error: e.message || 'Something went wrong.' }))
    return () => { ok = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, n])
  return { ...s, reload: () => setN(v => v + 1) }
}
