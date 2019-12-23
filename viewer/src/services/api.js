const query = (action, params) => {
  const base = process.env.API_ENDPOINT
  const query = new URLSearchParams(params).toString()
  return window.fetch(`${base}${action}?${query}`).then((res) => res.json())
}

export const fetchURLRanking = (params) => {
  return query('url_ranking', params)
}

export const fetchTweets = (params) => {
  return query('tweets', params)
}

export const fetchTweetsCount = (params) => {
  return query('tweet_times_histogram', params)
}

export const fetchRetweetedUsers = (params) => {
  return query('retweeted_user_ranking', params)
}
