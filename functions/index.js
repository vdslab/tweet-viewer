const functions = require('firebase-functions')
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
	if (req.query.keyword === undefined) {
		res.status(400).send('No keyword defined!')
	} else {
		const { keyword, offset, date } = req.query
		if (req.query.offset === undefined) {
			params.offset = 0
		}
		const params = {
			keyword: `%${keyword}%`,
			offset: +offset,
			date: new Date(decodeURIComponent(date))
		}
		const query = `
	SELECT
		text,
		user,
		retweeted_status,
		created_at,
		DATETIME(created_at, 'Asia/Tokyo') as JSTtime
    FROM
		\`moe-twitter-analysis2019.PQ.tweets\`
    WHERE
		text LIKE @keyword AND DATETIME(@date) <= DATETIME(created_at, 'Asia/Tokyo') AND DATETIME(created_at, 'Asia/Tokyo') < DATETIME_ADD(DATETIME(@date), INTERVAL 1 MONTH)
    ORDER BY
		JSTtime
    LIMIT
		1000
    OFFSET
		@offset
    `
		requestQuery(query, params)
			.then(([rows]) => {
				return res.status(200).send(rows)
			})
			.catch(error => {
				return res.status(500).send(error)
			})
	}
})

app.get('/details', function(req, res) {
	const { user_id, offset } = req.query
	const params = { user_id, offset: +offset }
	const query = `
		SELECT
    text,
    user,
    DATETIME(created_at, 'Asia/Tokyo') as JSTtime
		FROM
    \`moe-twitter-analysis2019.PQ.tweets\`
		WHERE
    user.id_str = @user_id
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
		.catch(error => {
			return res.status(500).send(error)
		})
})

exports.main = functions.https.onRequest(app)