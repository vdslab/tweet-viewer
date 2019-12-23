import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { fetchRetweetedUsers } from '../../services/api'
import { setLoading } from '../../services/index'
import DisplayRetweetedUserRanking from '../Display/DisplayRetweetedUserRanking'
import InfiniteScroll from 'react-infinite-scroller'
import RetweetedUserRankingChart from './RetweetedUserRankingChart'

const barCount = 50

const RetweetedUserRanking = (props) => {
  const [users, setUsers] = useState([])
  const [offset, setOffset] = useState([])
  const [hasMoreUsers, setHasMoreUsers] = useState(false)
  const [lower, setLower] = useState(0)

  const graphData = users.slice(lower, lower + barCount).reverse()

  const loadUsers = () => {
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
    fetchRetweetedUsers(options)
      .then((data) => {
        setUsers(users.concat(data))
        if (users.length % 1000 !== 0 || users.length === 0) {
          setHasMoreUsers(false)
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
    setUsers([])
    setOffset(0)
    setHasMoreUsers(true)
    setLower(0)
    updateParams()
  }, [props.dataSetType])

  useEffect(() => {
    loadUsers()
  }, [props.location])

  return (
    <div>
      <div className='box'>
        <RetweetedUserRankingChart data={graphData} />
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
            disabled={users.length <= lower + barCount}
          >
            {`次の${barCount}件`}
          </button>
        </div>
      </div>
      <div className='box'>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadUsers}
          hasMore={hasMoreUsers}
        >
          {users.map((user, i) => {
            return <DisplayRetweetedUserRanking key={i} user={user} />
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default withRouter(RetweetedUserRanking)
