import { useState } from 'react'
import { useWikiImage } from '../hooks/useWikiImage.js'

export default function Photo({ src, wiki, alt = '', size = 900, className = '', eager = false }) {
  const w = useWikiImage(src ? null : wiki, size)
  const url = src || w
  const [bad, setBad] = useState(false)
  return (
    <div className={`photo ${className}`}>
      {url && !bad && <img src={url} alt={alt} loading={eager ? 'eager' : 'lazy'} onError={() => setBad(true)} />}
    </div>
  )
}
