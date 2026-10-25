import { useEffect, useState } from 'react'
const listeners = new Set()
const read = k => { try { return JSON.parse(localStorage.getItem(k) || '[]') } catch { return [] } }
export function useStored(k) {
  const [v, setV] = useState(() => read(k))
  useEffect(() => { const f = () => setV(read(k)); listeners.add(f); return () => listeners.delete(f) }, [k])
  const set = n => { try { localStorage.setItem(k, JSON.stringify(n)) } catch { /* ignore */ } listeners.forEach(f => f()) }
  return [v, set]
}
