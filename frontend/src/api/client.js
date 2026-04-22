const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api'

const r = async (method, path, body) => {
  const opts = { method, headers: {} }
  if (body != null) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  const res = await fetch(BASE + path, opts)
  if (!res.ok) throw new Error(`${res.status}`)
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

const q = (p) => p ? '?' + new URLSearchParams(p) : ''

export const api = {
  get:    (path, params) => r('GET',    path + q(params)),
  post:   (path, body)   => r('POST',   path, body),
  put:    (path, body)   => r('PUT',    path, body),
  delete: (path)         => r('DELETE', path),
}
