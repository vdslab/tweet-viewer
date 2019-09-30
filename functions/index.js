const express = require('express')
const cors = require('cors')
const { BigQuery } = require('@google-cloud/bigquery')

const requestQuery = (query, params) => {
  const bigquery = new BigQuery({
    projectId: 'moe-twitter-analysis2019'
  })
  return bigquery.query({
    query,
    params,
    location: 'asia-northeast1',
    useLegacySql: false
  })
}

const app = express()
app.use(cors({ origin: true }))

app.get('/tweets', function(req, res) {
  const conditions = []
  const params = []
  const { keywords, offset, date, exRt } = req.query
  let startDate
  let endDate
  if (date) {
    startDate = new Date(decodeURIComponent(date))
    endDate = new Date(decodeURIComponent(date))
    endDate.setMonth(endDate.getMonth() + 1)
  } else {
    startDate = new Date('1970-01-01T00:00:00')
    endDate = new Date('2100-01-01T00:00:00')
  }
  params.push(startDate, endDate)
  conditions.push(
    "DATETIME(?) <= DATETIME(created_at, 'Asia/Tokyo')",
    "DATETIME(created_at, 'Asia/Tokyo') < DATETIME(?)"
  )
  if (exRt === 'yes') {
    conditions.push('retweeted_status is NULL')
  }
  decodeURIComponent(keywords)
    .split(' ')
    .map((r) => conditions.push(`text LIKE '%${r}%'`))
  if (req.query.offset === undefined) {
    params.offset = 0
  }
  params.push(+offset)
  const query = `
	SELECT
		text,
		user,
		retweeted_status,
		created_at,
		DATETIME(created_at, 'Asia/Tokyo') as JSTtime
  FROM
		\`moe-twitter-analysis2019.PQ.tweets\`
    ${conditions.length !== 0 ? 'WHERE' : ''}
		${conditions.join(' AND ')}
  ORDER BY
		JSTtime
  LIMIT
		1000
  OFFSET
		?
  `
  requestQuery(query, params)
    .then(([rows]) => {
      return res.status(200).send(rows)
    })
    .catch((error) => {
      console.error(error)
      return res.status(500).send(error)
    })
})

app.get('/details', function(req, res) {
  const conditions = []
  const { userId, offset } = req.query
  const params = { userId, offset: +offset }
  conditions.push('user.id_str = @userId')
  const query = `
	SELECT
    text,
    user,
    DATETIME(created_at, 'Asia/Tokyo') as JSTtime
	FROM
    \`moe-twitter-analysis2019.PQ.tweets\`
	${conditions.length !== 0 ? 'WHERE' : ''}
	${conditions.join(' AND ')}
	ORDER BY
    JSTtime
	LIMIT
    1000
	OFFSET
    @offset`
  requestQuery(query, params)
    .then(([rows]) => {
      return res.status(200).send(rows)
    })
    .catch((error) => {
      return res.status(500).send(error)
    })
})

app.get('/retweeted_ranking', function(req, res) {
  const conditions = []
  const { offset } = req.query
  const params = { offset: +offset }
  conditions.push('retweeted_status IS NOT NULL')
  const query = `
  SELECT
    retweeted_status.user.id_str,
    COUNT(*) AS count,
    ANY_VALUE(entities.user_mentions[
    OFFSET
      (0)]).screen_name AS screen_name
  FROM
    \`moe-twitter-analysis2019.PQ.tweets\`
  ${conditions.length !== 0 ? 'WHERE' : ''}
  ${conditions.join(' AND ')}
  GROUP BY
    retweeted_status.user.id_str
  ORDER BY
    COUNT(*) DESC
  LIMIT
    1000
  OFFSET
    @offset
  `
  requestQuery(query, params)
    .then(([rows]) => {
      return res.status(200).send(rows)
    })
    .catch((error) => {
      return res.status(500).send(error)
    })
})

app.get('/hashtags_ranking', function(req, res) {
  const conditions = []
  const { offset } = req.query
  const params = { offset: +offset }
  const query = `
  SELECT
    hashtags.text AS hashtag,
    COUNT(*) AS count
  FROM
    \`moe-twitter-analysis2019.PQ.tweets\` AS t,
    t.entities.hashtags AS hashtags
  ${conditions.length !== 0 ? 'WHERE' : ''}
  ${conditions.join(' AND ')}
  GROUP BY
    hashtags.text
  ORDER BY
    count DESC
  LIMIT
    1000
  OFFSET
    @offset
  `
  requestQuery(query, params)
    .then(([rows]) => {
      return res.status(200).send(rows)
    })
    .catch((error) => {
      return res.status(500).send(error)
    })
})

module.exports = {
  main: app
}
