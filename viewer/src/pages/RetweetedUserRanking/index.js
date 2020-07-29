import React, { useState, useEffect } from 'react'
import { withRouter, useLocation, useHistory } from 'react-router-dom'
import { fetchRetweetedUsers } from '../../services/api'
import { setLoading, formatDate } from '../../services/index'
import DisplayRetweetedUserRanking from '../Display/DisplayRetweetedUserRanking'
import InfiniteScroll from 'react-infinite-scroller'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import RetweetedUserRankingChart from './RetweetedUserRankingChart'

const barCount = 50

const RetweetedUserRanking = () => {
  const location = useLocation()
  const history = useHistory()
  const [users, setUsers] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMoreUsers, setHasMoreUsers] = useState(true)
  const [lower, setLower] = useState(0)

  const graphData = users.slice(lower, lower + barCount).reverse()

  const loadUsers = () => {
    setLoading(true)
    const params = new URLSearchParams(location.search)
    const options = {}
    for (const [key, value] of params) {
      options[key] = value
    }
    console.log(offset)
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
        setUsers((prevUsers) => prevUsers.concat(data))
        if (users.length % 1000 !== 0 || users.length === 0) {
          setHasMoreUsers(false)
        }
        setOffset((prevOffset) => prevOffset + 1000)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const buildParams = ({ startDate, endDate }) => {
    const params = new URLSearchParams()
    if (`${startDate}` !== 'undefined') {
      params.set('startDate', startDate)
    }
    if (`${endDate}` !== 'undefined') {
      params.set('endDate', endDate)
    }
    return params
  }

  const updateParams = ({ startDate, endDate }) => {
    const params = buildParams({ startDate, endDate })
    history.push(`${location.pathname}?${params.toString()}`)
  }

  useEffect(() => {
    loadUsers()
  }, [location])

  const onChangeDate = ([startDate, endDate]) => {
    setUsers([])
    setOffset(0)
    const dates = {
      startDate: formatDate(new Date(startDate), 'yyyy-MM-dd'),
      endDate: formatDate(new Date(endDate), 'yyyy-MM-dd')
    }
    updateParams(dates)
  }

  const params = new URLSearchParams(location.search)

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
          children={users.map((user, i) => {
            return <DisplayRetweetedUserRanking key={i} user={user} />
          })}
        />
      </div>
    </div>
  )
}

export default withRouter(RetweetedUserRanking)
