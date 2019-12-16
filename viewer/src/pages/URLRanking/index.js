import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router'
import { fetchURLRanking } from '../../services/api'
import { usePrevious, setLoading } from '../../services/index'
import DisplayURLRanking from '../Display/DisplayURLRanking'
import URLRankingChart from './URLRankingChart'
import InfiniteScroll from 'react-infinite-scroller'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'

const barCount = 50
const barSize = 20

const URLRanking = (props) => {
  const [tweets, setTweets] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMoreTweets, setHasMoreTweets] = useState(false)
  const [date, setDate] = useState([
    new Date('2011-03-01T00:00:00'),
    new Date()
  ])
  const prevLocation = usePrevious(props.location)

  const keywords = useRef('')

  const loadTweets = () => {
    setLoading(true)
    let params = new URLSearchParams(props.location.search)
    if (!params.toString()) {
      params = buildParams()
    }
    const options = {}
    for (const [key, value] of params) {
      options[key] = value
    }
    fetchURLRanking(options)
      .then((data) => {
        setTweets(tweets.concat(data))
        if (tweets.length % 1000 !== 0 || tweets.length === 0) {
          setHasMoreTweets(false)
        }
        setLoading(false)
      })
      .catch((erorr) => {
        console.error(erorr)
      })
  }

  const onFormSubmit = (e) => {
    e.preventDefault()
    setTweets([])
    setHasMoreTweets(true)
    setOffset(0)
    handleChangeFormValue()
  }

  const buildParams = () => {
    const params = new URLSearchParams()
    params.set('keywords', keywords.current.value)
    params.set('dataSetType', props.dataSetType)
    params.set('offset', offset)
    params.set('startDate', date[0])
    params.set('endDate', date[1])
    return params
  }

  const handleChangeFormValue = () => {
    const params = buildParams()
    props.history.push(`${props.location.pathname}?${params.toString()}`)
  }

  const onChageDate = (date) => {
    setDate(date)
  }

  useEffect(() => {
    if (props.location !== prevLocation) {
      loadTweets()
    }
  })
  return (
    <div className='column is-10'>
      <div className='box'>
        <form onSubmit={onFormSubmit}>
          <div className='field has-addons'>
            <div className='control'>
              <input
                className='input'
                type='text'
                ref={keywords}
                placeholder='keywords'
              />
            </div>
            <div className='control'>
              <button className='button is-info'>search</button>
            </div>
          </div>
          <div>
            <DateRangePicker onChange={onChageDate} value={date} />
          </div>
        </form>
      </div>
      <div className='box'>
        <div style={{ height: [`${barSize * barCount}`, 'px'].join('') }}>
          <URLRankingChart
            data={tweets.slice(0, 50).reverse()}
            // .slice(this.state.lower, this.state.upper)
          />
        </div>
        {/* <div>
          <button
            className='button is-info'
            onClick={() => {
              this.setState({
                lower: this.state.lower - barCount,
                upper: this.state.upper - barCount,
                disableBackButton: this.state.lower - barCount <= 0,
                disableNextButton: false
              })
            }}
            disabled={this.state.disableBackButton}
          >
            back
          </button>
          <button
            className='button is-info'
            onClick={() => {
              this.setState({
                lower: this.state.lower + barCount,
                upper: this.state.upper + barCount,
                disableBackButton: false,
                disableNextButton:
                  this.state.upper + barCount >= this.state.tweets.length
              })
            }}
            disabled={this.state.disableNextButton}
          >
            next
          </button>
        </div> */}
      </div>
      <div className='box'>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadTweets}
          hasMore={hasMoreTweets}
        >
          {tweets.map((tweet, i) => {
            return <DisplayURLRanking key={i} tweet={tweet} />
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

// class URLRanking extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       tweets: [],
//       hasMoreTweets: false,
//       offset: 0,
//       lower: 0,
//       upper: barCount,
//       disableNextButton: false,
//       disabeBackbutton: true,
//       date: [new Date('2011-03-01T00:00:00'), new Date()],
//       loading: false
//     }
//     this.keywordRef = React.createRef()
//     this.startDate = new Date('2011-03-01T00:00:00')
//     this.endDate = new Date('2011-04-01T00:00:00')
//     this.offset = 0
//     this.abortController = new window.AbortController()
//   }
//   fetching(key) {
//     setLoading(true)
//     let searchParams = new URLSearchParams()
//     searchParams.set('dataSetType', this.props.dataSetType)
//     searchParams.set('keywords', key)
//     searchParams.set('offset', this.state.offset)
//     if (this.state.date) {
//       searchParams.set('startDate', this.state.date[0])
//       searchParams.set('endDate', this.state.date[1])
//     }
//     window
//       .fetch(`${process.env.API_ENDPOINT}/url_ranking?${searchParams}`, {
//         signal: this.abortController.signal
//       })
//       .then((res) => res.json())
//       .then((data) => {
//         this.setState({
//           tweets: this.state.tweets.concat(data),
//           hasMoreTweets: false,
//           offset: this.state.offset + 1000,
//           disableNextButton: false,
//           loading: false
//         })
//         if (
//           this.state.tweets.length % 1000 === 0 &&
//           this.state.tweets.length !== 0
//         ) {
//           this.setState({ hasMoreTweets: true })
//         }
//         setLoading(false)
//       })
//       .catch(() => {})
//   }
//   componentDidMount() {
//     this.fetching('')
//   }
//   render() {
//     const loadFunc = (key) => {
//       this.fetching(key)
//     }
//     const setDate = (date) => {
//       this.setState({ date })
//     }
//     const onFormSubmit = (e) => {
//       e.preventDefault()
//       this.setState({
//         tweets: [],
//         hasMoreTweets: true,
//         offset: 0,
//         loading: true
//       })
//       loadFunc(this.keywordRef.current.value)
//     }
//     return (
//       <div className='column is-10'>
//         <div className='box'>
//           <form onSubmit={onFormSubmit}>
//             <div className='field has-addons'>
//               <div className='control'>
//                 <input
//                   className='input'
//                   type='text'
//                   ref={this.keywordRef}
//                   placeholder='keywords'
//                 />
//               </div>
//               <div className='control'>
//                 <button
//                   className={[
//                     'button',
//                     'is-info',
//                     this.state.loading ? 'is-loading' : ''
//                   ].join(' ')}
//                 >
//                   search
//                 </button>
//               </div>
//             </div>
//             <div>
//               <DateRangePicker onChange={setDate} value={this.state.date} />
//             </div>
//           </form>
//         </div>
//         <div className='box'>
//           <div style={{ height: [`${barSize * barCount}`, 'px'].join('') }}>
//             <URLRankingChart
//               data={this.state.tweets
//                 .slice(this.state.lower, this.state.upper)
//                 .reverse()}
//             />
//           </div>
//           <div>
//             <button
//               className='button is-info'
//               onClick={() => {
//                 this.setState({
//                   lower: this.state.lower - barCount,
//                   upper: this.state.upper - barCount,
//                   disableBackButton: this.state.lower - barCount <= 0,
//                   disableNextButton: false
//                 })
//               }}
//               disabled={this.state.disableBackButton}
//             >
//               back
//             </button>
//             <button
//               className='button is-info'
//               onClick={() => {
//                 this.setState({
//                   lower: this.state.lower + barCount,
//                   upper: this.state.upper + barCount,
//                   disableBackButton: false,
//                   disableNextButton:
//                     this.state.upper + barCount >= this.state.tweets.length
//                 })
//               }}
//               disabled={this.state.disableNextButton}
//             >
//               next
//             </button>
//           </div>
//         </div>
//         <div className='box'>
//           <InfiniteScroll
//             pageStart={0}
//             loadMore={loadFunc}
//             hasMore={this.state.hasMoreTweets}
//           >
//             {this.state.tweets.map((tweet, i) => {
//               return <DisplayURLRanking key={i} tweet={tweet} />
//             })}
//           </InfiniteScroll>
//         </div>
//       </div>
//     )
//   }
// }

export default withRouter(URLRanking)
