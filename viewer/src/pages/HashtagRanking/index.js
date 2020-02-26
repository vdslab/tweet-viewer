import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import DisplayHashtagsRanking from '../Display/DisplayHashtagRanking'
import InfiniteScroll from 'react-infinite-scroller'
import HashtagsRankingChart from './HashtagRankingChart'
import { setLoading } from '../../services/index'
import { fetchHashtagRanking } from '../../services/api'

const barCount = 50
// const barSize = 20

const HashtagRanking = (props) => {
  const [hashtags, setHashtags] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMoreHashtags, setHasMoreHashtags] = useState(false)
  const [lower, setLower] = useState(0)

  const graphData = hashtags.slice(lower, lower + barCount).reverse()

  const loadHashtags = () => {
    setLoading(true)
    const params = new URLSearchParams(props.location.search)
    const options = {}
    for (const [key, value] of params) {
      options[key] = value
    }
    options['offset'] = `${offset}`
    if (!options.dataSetType) {
      options['dataSetType'] = process.env.DEFAULT_DATASET
    }
    fetchHashtagRanking(options)
      .then((data) => {
        setHashtags(hashtags.concat(data))
        if (hashtags.length % 1000 !== 0 || hashtags.length === 0) {
          setHasMoreHashtags(false)
        }
        setOffset(offset + 1000)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const buildParams = () => {
    const params = new URLSearchParams()
    params.set('dataSetType', props.dataSetType)
    return params
  }

  const updateParams = () => {
    const params = buildParams()
    props.history.push(`${props.location.pathname}?${params.toString()}`)
  }

  useEffect(() => {
    setHashtags([])
    setOffset(0)
    setHasMoreHashtags(true)
    setLower(0)
    updateParams()
  }, [props.dataSetType])

  useEffect(() => {
    loadHashtags()
  }, [props.location])

  return (
    <div>
      <div className='box'>
        <HashtagsRankingChart data={graphData} />
        <div>
          <button
            className='button is-info'
            onClick={() => {
              setLower(lower - barCount)
            }}
            disabled={lower === 0}
          >
            {`前の${barCount}件`}
          </button>
          <button
            className='button is-info'
            onClick={() => {
              setLower(lower + barCount)
            }}
            disabled={hashtags.length <= lower + barCount}
          >
            {`次の${barCount}件`}
          </button>
        </div>
      </div>
      <div className='box'>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadHashtags}
          hasMore={hasMoreHashtags}
        >
          {hashtags.map((hashtag, i) => {
            return <DisplayHashtagsRanking key={i} hashtag={hashtag} />
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default withRouter(HashtagRanking)
