export function parseQueryParams(url: string): Record<string, any> {
  const query: Record<string, any> = {}
  if (!url.includes('?')) return query

  const queryString = url.split('?')[1]
  const params = new URLSearchParams(queryString)

  for (const [key, value] of params.entries()) {
    query[key] = value
  }

  return query
}
