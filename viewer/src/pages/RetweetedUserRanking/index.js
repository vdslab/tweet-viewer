import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { fetchRetweetedUsers } from '../../services/api'
import { setLoading, formatDate } from '../../services/index'
import DisplayRetweetedUserRanking from '../Display/DisplayRetweetedUserRanking'
import InfiniteScroll from 'react-infinite-scroller'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
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
    if (!options.startDate) {
      options['startDate'] = '2011-03-01'
    }
    if (!options.endDate) {
      options['endDate'] = formatDate(new Date(), 'yyyy-MM-dd')
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

  const buildParams = (dates) => {
    const params = new URLSearchParams()
    params.set('dataSetType', props.dataSetType)
    params.set(
      'startDate',
      params.get('startDate') === null ? '2011-03-01' : params.get('startDate')
    )
    params.set(
      'endDate',
      params.get('endDate') === null
        ? formatDate(new Date(), 'yyyy-MM-dd')
        : params.get('endDate')
    )
    return params
  }

  const updateParams = (dates) => {
    const params = buildParams(dates)
    props.history.push(`${props.location.pathname}?${params.toString()}`)
  }

  // useEffect(() => {
  //   setUsers([])
  //   setOffset(0)
  //   setHasMoreUsers(true)
  //   setLower(0)
  //   const dates = [params.get('startDate'), params.get('endDate')]
  //   updateParams(dates)
  // }, [props.dataSetType])

  useEffect(() => {
    loadUsers()
  }, [props.location])

  const onChangeDate = (date) => {
    const dates = [
      formatDate(new Date(date[0]), 'yyyy-MM-dd'),
      formatDate(new Date(date[1]), 'yyyy-MM-dd')
    ]
    updateParams(dates)
  }

  const params = new URLSearchParams(props.location.search)

  return (
    <div>
      <div className='box'>
        <div className='field is-horizontal'>
          <div className='field-label'>
            <label className='label'>検索範囲</label>
          </div>
          <div className='field-body'>
            <DateRangePicker
              onChange={onChangeDate}
              value={[
                new Date(
                  params.get('startDate') === null
                    ? '2011-03-01'
                    : params.get('startDate')
                ),
                new Date(
                  params.get('endDate') === null
                    ? formatDate(new Date(), 'yyyy-MM-dd')
                    : params.get('endDate')
                )
              ]}
            />
          </div>
        </div>
      </div>
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
