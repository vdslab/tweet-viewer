import React from 'react'
import DisplayTweet from '../Display/DisplayTweet'
import InfiniteScroll from 'react-infinite-scroller'

class UserDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = { tweets: [], hasMoreTweets: false, offset: 0 }
    this.abortController = new window.AbortController()
  }
  fetching() {
    let searchParams = new URLSearchParams()
    searchParams.set('userId', this.props.match.params.userId)
    searchParams.set('dataSetType', this.props.dataSetType)
    searchParams.set('offset', this.state.offset)
    window
      .fetch(`${process.env.API_ENDPOINT}/user_details?${searchParams}`, {
        signal: this.abortController.signal
      })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          tweets: this.state.tweets.concat(data),
          hasMoreTweets: false,
          offset: this.state.offset + 1000
        })
        if (
          this.state.tweets.length % 1000 === 0 &&
          this.state.tweets.length !== 0
        ) {
          this.setState({ hasMoreTweets: true })
        }
      })
      .catch(() => {})
  }
  componentDidMount() {
    this.fetching()
  }
  componentWillUnmount() {
    this.abortController.abort()
  }
  render() {
    const loadFunc = () => {
      this.fetching()
    }
    return (
      <div className='column is-10'>
        <div className='box'>
          <InfiniteScroll
            loadMore={loadFunc}
            hasMore={this.state.hasMoreTweets}
          >
            {this.state.tweets.map((tweet, i) => {
              return <DisplayTweet key={i} tweet={tweet} />
            })}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

export default UserDetails
