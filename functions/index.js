const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { BigQuery } = require('@google-cloud/bigquery');

const requestQuery = (query, params) => {
  const bigquery = new BigQuery({
    projectId: 'moe-twitter-analysis2019'
  });
  return bigquery.query({
    query,
    params,
    location: 'asia-northeast1',
    useLegacySql: false
  });
}

const app = express();
app.use(cors({ origin: true }))

app.get('/tweets', function (req, res) {
  if (req.query.keyword === undefined) {
    res.status(400).send('No keyword defined!');
  }else{
    const { keyword } = req.query;
    const params = { keyword:`%${keyword}%`};
    const query = `
      SELECT
        text
      FROM
        \`moe-twitter-analysis2019.PQ.tweets\`
      WHERE
        text
      LIKE
        @keyword
      limit 1000
    `;
    requestQuery(query, params).then(([rows]) => {
      return res.status(200).send(rows);
    }).catch((error) => {
      return res.status(500).send(error);
    });
  }
});

exports.main = functions.https.onRequest(app);