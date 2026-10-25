import { useEffect, useState } from 'react'
import { wikiImage } from '../services/images.js'
export function useWikiImage(title, size) {
  const [u, setU] = useState(null)
  useEffect(() => { let ok = true; if (title) wikiImage(title, size).then(x => ok && setU(x)); return () => { ok = false } }, [title, size])
  return u
}
