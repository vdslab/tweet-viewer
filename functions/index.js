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
		let start_date;
		let end_date;
		if(date) {
			start_date = new Date(decodeURIComponent(date))
			end_date = new Date(decodeURIComponent(date))
			end_date.setMonth(end_date.getMonth() + 1)
		}else{
			start_date = new Date("1970-01-01T00:00:00")
			end_date = new Date("2100-01-01T00:00:00")
		}
		const params = {
			keyword: `%${keyword}%`,
			offset: +offset,
			start_date,
			end_date
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
		text LIKE @keyword AND DATETIME(@start_date) <= DATETIME(created_at, 'Asia/Tokyo') AND DATETIME(created_at, 'Asia/Tokyo') < DATETIME(@end_date)
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

app.get('/retweeted_ranking', function(req, res) {
	const { offset } = req.query
	const params = { offset: +offset }
	const query = `
		SELECT
			retweeted_status.user.id_str,
			COUNT(*) as count,
			ANY_VALUE(entities.user_mentions[OFFSET(0)]) as e
		FROM
			\`moe-twitter-analysis2019.PQ.tweets\`
		WHERE
			retweeted_status IS NOT NULL
		GROUP BY
			retweeted_status.user.id_str
		ORDER BY COUNT(*) DESC
		LIMIT 1000
		OFFSET @offset
	`
	requestQuery(query, params)
		.then(([rows]) => {
			return res.status(200).send(rows)
		})
		.catch(error => {
			return res.status(500).send(error)
		})
})

exports.main = functions.https.onRequest(app)