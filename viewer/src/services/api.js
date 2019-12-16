const query = (action, params) => {
  const base = process.env.API_ENDPOINT
  const query = new URLSearchParams(params).toString()
  return window.fetch(`${base}${action}?${query}`).then((res) => res.json())
}

export const fetchURLRanking = (params) => {
  return query('url_ranking', params)
}
