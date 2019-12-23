const express = require('express')
const cors = require('cors')
const dataSet = require('./dataSet')
const { BigQuery } = require('@google-cloud/bigquery')
const dateFormat = require('dateformat')

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

app.get('/tweets', (req, res) => {
  const conditions = []
  const params = []
  const { keywords, offset, startDate, endDate, includeRT } = req.query
  const dataSetType =
    req.query.dataSetType === void 0 ? 2 : req.query.dataSetType
  if (keywords) {
    decodeURIComponent(keywords)
      .split(' ')
      .map((key) => {
        params.push(`%${key}%`)
        conditions.push(`text LIKE ?`)
      })
  }
  if (includeRT !== 'true') {
    conditions.push('retweeted_status IS NULL')
  }
  if (startDate) {
    params.push(
      dateFormat(new Date(decodeURIComponent(startDate)), 'yyyy-mm-dd HH:MM:ss')
    )
  } else {
    params.push(
      dateFormat(new Date('2011-03-01T00:00:00'), 'yyyy-mm-dd HH:MM:ss')
    )
  }
  conditions.push(
    "DATETIME(TIMESTAMP(?, 'Asia/Tokyo')) <= DATETIME(created_at, 'Asia/Tokyo')"
  )
  if (endDate) {
    params.push(
      dateFormat(new Date(decodeURIComponent(endDate)), 'yyyy-mm-dd HH:MM:ss')
    )
  } else {
    params.push(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'))
  }
  conditions.push(
    "DATETIME(created_at, 'Asia/Tokyo') < DATETIME(TIMESTAMP(?, 'Asia/Tokyo'))"
  )
  params.push(+offset)
  const query = `
	SELECT
		text,
		user,
		retweeted_status,
		created_at,
		DATETIME(created_at, 'Asia/Tokyo') as JSTtime
  FROM
		\`moe-twitter-analysis2019.${dataSet[dataSetType]}.tweets\`
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

app.get('/tweet_times_histogram', (req, res) => {
  const conditions = []
  const { keywords, startDate, endDate, includeRT } = req.query
  const dataSetType =
    req.query.dataSetType === void 0 ? 2 : req.query.dataSetType
  const params = []
  if (keywords) {
    decodeURIComponent(keywords)
      .split(' ')
      .map((key) => {
        params.push(`%${key}%`)
        conditions.push(`text LIKE ?`)
      })
  }
  if (includeRT !== 'true') {
    conditions.push('retweeted_status IS NULL')
  }
  if (startDate) {
    params.push(
      dateFormat(new Date(decodeURIComponent(startDate)), 'yyyy-mm-dd HH:MM:ss')
    )
  } else {
    params.push(
      dateFormat(new Date('2011-03-01T00:00:00'), 'yyyy-mm-dd HH:MM:ss')
    )
  }
  conditions.push(
    "DATETIME(TIMESTAMP(?, 'Asia/Tokyo')) <= DATETIME(created_at, 'Asia/Tokyo')"
  )
  if (endDate) {
    params.push(
      dateFormat(new Date(decodeURIComponent(endDate)), 'yyyy-mm-dd HH:MM:ss')
    )
  } else {
    params.push(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'))
  }
  conditions.push(
    "DATETIME(created_at, 'Asia/Tokyo') < DATETIME(TIMESTAMP(?, 'Asia/Tokyo'))"
  )
  const query = `
  SELECT
    FORMAT_DATETIME("%Y-%m", T1.month) AS month,
    IFNULL(T2.count, 0) AS count
  FROM (
    SELECT
        DATETIME_TRUNC(DATETIME(created_at,
            'Asia/Tokyo'),
          MONTH) AS month
    FROM
      \`moe-twitter-analysis2019.${dataSet[dataSetType]}.tweets\`
    GROUP BY
      month) AS T1
  LEFT OUTER JOIN (
    SELECT
        DATETIME_TRUNC(DATETIME(created_at,
            'Asia/Tokyo'),
          MONTH) AS month,
      COUNT(*) AS count
    FROM
      \`moe-twitter-analysis2019.${dataSet[dataSetType]}.tweets\`
    ${conditions.length !== 0 ? 'WHERE' : ''}
      ${conditions.join(' AND ')}
    GROUP BY
      month) AS T2
  ON
    T1.month = T2.month
  ORDER BY
    T1.month`
  requestQuery(query, params)
    .then(([rows]) => {
      return res.status(200).send(rows)
    })
    .catch((error) => {
      console.error(error)
      return res.status(500).send(error)
    })
})

app.get('/user_details', function(req, res) {
  const conditions = []
  const { userId, offset } = req.query
  const dataSetType =
    req.query.dataSetType === void 0 ? 2 : req.query.dataSetType
  const params = { userId, offset: +offset }
  conditions.push('user.id_str = @userId')
  const query = `
	SELECT
    text,
    user,
    DATETIME(created_at, 'Asia/Tokyo') as JSTtime
	FROM
    \`moe-twitter-analysis2019.${dataSet[dataSetType]}.tweets\`
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
      console.error(error)
      return res.status(500).send(error)
    })
})

app.get('/retweeted_user_ranking', (req, res) => {
  const conditions = []
  const { offset } = req.query
  const dataSetType =
    req.query.dataSetType === void 0 ? 2 : req.query.dataSetType
  const params = { offset: +offset }
  conditions.push('retweeted_status IS NOT NULL')
  const query = `
  SELECT
    retweeted_status.user.id_str,
    COUNT(*) AS count,
    IFNULL(
      ANY_VALUE(entities.user_mentions[
      SAFE_OFFSET
        (0)]).screen_name, '') AS screen_name
  FROM
    \`moe-twitter-analysis2019.${dataSet[dataSetType]}.tweets\`
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
      console.error(error)
      return res.status(500).send(error)
    })
})

app.get('/retweeted_tweet_ranking', function(req, res) {
  const conditions = []
  const { keywords, offset, startDate, endDate } = req.query
  const dataSetType =
    req.query.dataSetType === void 0 ? 2 : req.query.dataSetType
  const params = []
  conditions.push('retweeted_status IS NOT NULL')
  if (keywords !== '') {
    decodeURIComponent(keywords)
      .split(' ')
      .map((key) => {
        params.push(`%${key}%`)
        conditions.push(`text LIKE ?`)
      })
  }
  if (startDate) {
    params.push(
      dateFormat(new Date(decodeURIComponent(startDate)), 'yyyy-mm-dd HH:MM:ss')
    )
    conditions.push(
      "DATETIME(TIMESTAMP(?, 'Asia/Tokyo')) <= DATETIME(created_at, 'Asia/Tokyo')"
    )
  }
  if (endDate) {
    params.push(
      dateFormat(new Date(decodeURIComponent(endDate)), 'yyyy-mm-dd HH:MM:ss')
    )
    conditions.push(
      "DATETIME(created_at, 'Asia/Tokyo') < DATETIME(TIMESTAMP(?, 'Asia/Tokyo'))"
    )
  }
  params.push(+offset)
  const query = `
  SELECT
    ANY_VALUE(text) AS text,
    ANY_VALUE(retweeted_status.id_str) AS id_str,
    IFNULL(
      ANY_VALUE(entities.user_mentions[
        SAFE_OFFSET
          (0)]).screen_name, '') AS screen_name,
    COUNT(*) AS count
  FROM
    \`moe-twitter-analysis2019.${dataSet[dataSetType]}.tweets\`
  ${conditions.length !== 0 ? 'WHERE' : ''}
    ${conditions.join(' AND ')}
  GROUP BY
    retweeted_status.id
  ORDER BY
    COUNT(*) DESC
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

app.get('/retweeted_tweet_ranking_histogram', (req, res) => {
  const conditions = []
  const { keywords, startDate, endDate } = req.query
  const dataSetType =
    req.query.dataSetType === void 0 ? 2 : req.query.dataSetType
  const params = []
  conditions.push('retweeted_status IS NOT NULL')
  if (keywords !== '') {
    decodeURIComponent(keywords)
      .split(' ')
      .map((key) => {
        params.push(`%${key}%`)
        conditions.push(`text LIKE ?`)
      })
  }
  if (startDate) {
    params.push(
      dateFormat(new Date(decodeURIComponent(startDate)), 'yyyy-mm-dd HH:MM:ss')
    )
    conditions.push(
      "DATETIME(TIMESTAMP(?, 'Asia/Tokyo')) <= DATETIME(created_at, 'Asia/Tokyo')"
    )
  }
  if (endDate) {
    params.push(
      dateFormat(new Date(decodeURIComponent(endDate)), 'yyyy-mm-dd HH:MM:ss')
    )
    conditions.push(
      "DATETIME(created_at, 'Asia/Tokyo') < DATETIME(TIMESTAMP(?, 'Asia/Tokyo'))"
    )
  }
  const query = `
  SELECT
    COUNT(*) AS cnt,
    ANY_VALUE(TRUNC(count / 50) * 50) AS level
  FROM (
    SELECT
      ANY_VALUE(retweeted_status.id_str) AS id_str,
      COUNT(*) AS count
    FROM
      \`moe-twitter-analysis2019.${dataSet[dataSetType]}.tweets\`
    ${conditions.length !== 0 ? 'WHERE' : ''}
      ${conditions.join(' AND ')}
    GROUP BY
      retweeted_status.id
    ORDER BY
      COUNT(*) DESC
    )
  GROUP BY
    TRUNC(count / 50)
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

app.get('/url_ranking', (req, res) => {
  const conditions = []
  const { keywords, startDate, endDate, offset } = req.query
  const dataSetType =
    req.query.dataSetType === void 0 ? 2 : req.query.dataSetType
  const params = []
  conditions.push('urls.url IS NOT NULL')
  conditions.push("urls.url <> ''")
  if (keywords !== '') {
    decodeURIComponent(keywords)
      .split(' ')
      .map((key) => {
        params.push(`%${key}%`)
        conditions.push(`urls.url LIKE ?`)
      })
  }
  if (startDate) {
    params.push(
      dateFormat(new Date(decodeURIComponent(startDate)), 'yyyy-mm-dd HH:MM:ss')
    )
    conditions.push(
      "DATETIME(TIMESTAMP(?, 'Asia/Tokyo')) <= DATETIME(created_at, 'Asia/Tokyo')"
    )
  }
  if (endDate) {
    params.push(
      dateFormat(new Date(decodeURIComponent(endDate)), 'yyyy-mm-dd HH:MM:ss')
    )
    conditions.push(
      "DATETIME(created_at, 'Asia/Tokyo') < DATETIME(TIMESTAMP(?, 'Asia/Tokyo'))"
    )
  }
  params.push(+offset)
  const query = `
  SELECT
    urls.url AS URL,
    COUNT(*) AS count
  FROM
    \`moe-twitter-analysis2019.${dataSet[dataSetType]}.tweets\` AS t,
    t.entities.urls AS urls
  ${conditions.length !== 0 ? 'WHERE' : ''}
    ${conditions.join(' AND ')}
  GROUP BY
    urls.url
  ORDER BY
    count DESC
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

app.get('/url_details', (req, res) => {
  const conditions = []
  const { url, offset } = req.query
  const dataSetType =
    req.query.dataSetType === void 0 ? 2 : req.query.dataSetType
  const params = []
  conditions.push(
    `entities.urls[SAFE_OFFSET(0)].url LIKE '${decodeURIComponent(url)}'`
  )
  params.push(+offset)
  const query = `
  SELECT
    text,
    user,
    DATETIME(created_at, 'Asia/Tokyo') AS JSTtime
  FROM
    \`moe-twitter-analysis2019.${dataSet[dataSetType]}.tweets\`
  ${conditions.length !== 0 ? 'WHERE' : ''}
    ${conditions.join(' AND ')}
  ORDER BY
    JSTtime
  LIMIT
    1000
  OFFSET
    ?`
  requestQuery(query, params)
    .then(([rows]) => {
      return res.status(200).send(rows)
    })
    .catch((error) => {
      console.error(error)
      return res.status(500).send(error)
    })
})

app.get('/hashtags_ranking', function(req, res) {
  const conditions = []
  const { offset } = req.query
  const dataSetType =
    req.query.dataSetType === void 0 ? 2 : req.query.dataSetType
  const params = { offset: +offset }
  const query = `
  SELECT
    hashtags.text AS hashtag,
    COUNT(*) AS count
  FROM
    \`moe-twitter-analysis2019.${dataSet[dataSetType]}.tweets\` AS t,
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
      console.error(error)
      return res.status(500).send(error)
    })
})

app.get('/hashtag_details', function(req, res) {
  const conditions = []
  const { hashtag, offset } = req.query
  const dataSetType =
    req.query.dataSetType === void 0 ? 2 : req.query.dataSetType
  const params = { hashtag, offset: +offset }
  conditions.push('hashtags.text = @hashtag')
  const query = `
  SELECT
    t.text,
    t.user,
    hashtags.text AS hashtag,
    DATETIME(created_at, 'Asia/Tokyo') as JSTtime
  FROM
    \`moe-twitter-analysis2019.${dataSet[dataSetType]}.tweets\` AS t,
    t.entities.hashtags AS hashtags
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
      console.error(error)
      return res.status(500).send(error)
    })
})

module.exports = {
  main: app
}
