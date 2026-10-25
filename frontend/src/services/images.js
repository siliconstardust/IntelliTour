// Photos come from the Wikipedia API at runtime (cached in localStorage). Provide `image_url` from your API to use your own images.
const KEY = 'it_img'
let cache = {}
try { cache = JSON.parse(localStorage.getItem(KEY) || '{}') } catch { /* ignore */ }
const pending = new Map()
export function wikiImage(title, size = 900) {
  const k = `${title}|${size}`
  if (cache[k] !== undefined) return Promise.resolve(cache[k])
  if (pending.has(k)) return pending.get(k)
  const p = fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=${size}&format=json&origin=*`)
    .then(r => r.json()).then(j => {
      const u = Object.values(j.query?.pages || {})[0]?.thumbnail?.source || null
      cache[k] = u
      try { localStorage.setItem(KEY, JSON.stringify(cache)) } catch { /* ignore */ }
      return u
    }).catch(() => null).finally(() => pending.delete(k))
  pending.set(k, p)
  return p
}
