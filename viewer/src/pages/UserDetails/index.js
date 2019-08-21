import React from 'react'
import DisplayTweet from '../Display/DisplayTweet'
import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router-dom'

class UserDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = { tweets: [], hasMoreTweets: false }
  }
  fetching(page) {
    const offset = page * 1000
    window
      .fetch(
        `https://us-central1-moe-twitter-analysis2019.cloudfunctions.net/main/details?user_id=${this.props.match.params.userId}&offset=${offset}`
      )
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          tweets: this.state.tweets.concat(data),
          hasMoreTweets: false
        })
        if (this.state.tweets.length % 1000 === 0) {
          this.setState({ hasMoreTweets: true })
        }
      })
  }
  componentDidMount() {
    this.fetching(0)
  }
  render() {
    const loadFunc = (page) => {
      this.fetching(page)
    }
    return (
      <section className='section columns'>
        <div className='column is-2'>
          <div className='box sticky'>
            <aside className='munu'>
              <p className='menu-label'>General</p>
              <ul className='menu-list'>
                <li>
                  <Link to={'/'}>ツイート検索</Link>
                </li>
                <li>
                  <Link to={'/retweeted_ranking'}>ランキング</Link>
                </li>
              </ul>
            </aside>
          </div>
        </div>
        <div className='column is-10'>
          <div className='box'>
            <InfiniteScroll
              pageStart={0}
              loadMore={loadFunc}
              hasMore={this.state.hasMoreTweets}
            >
              {this.state.tweets.map((tweet, i) => {
                return <DisplayTweet key={i} tweet={tweet} />
              })}
            </InfiniteScroll>
          </div>
        </div>
      </section>
    )
  }
}

export default UserDetails
