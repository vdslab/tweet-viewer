import React from 'react'
import DisplayTweet from '../Display/DisplayTweet'
import InfiniteScroll from 'react-infinite-scroller'

class TweetList extends React.Component {
	constructor(props) {
		super(props)
		this.state = { tweets: [], hasMoreTweets: false }
	}
	render() {
		const keywordRef = React.createRef()
		const loadFunc = page => {
			const offset = (page - 1) * 1000
			fetch(
				`https://us-central1-moe-twitter-analysis2019.cloudfunctions.net/main/tweets?keyword=${
					keywordRef.current.value
				}&offset=${offset}`
			)
				.then(res => res.json())
				.then(data => {
					this.setState({
						tweets: this.state.tweets.concat(data),
						hasMoreTweets: false
					})
					if (this.state.tweets.length % 1000 === 0) {
						this.setState({ hasMoreTweets: true })
					}
				})
		}
		return (
			<section className="section">
				<div className="conainer">
					<div className="field has-addons">
						<div className="control">
							<input
								className="input"
								type="text"
								ref={keywordRef}
								placeholder="keyword"
							/>
						</div>
						<div className="control">
							<button
								className="button is-info"
								onClick={() => {
									this.setState({ tweets: [], hasMoreTweets: true })
								}}
							>
								search
							</button>
						</div>
					</div>
					<InfiniteScroll
						pageStart={0}
						loadMore={loadFunc}
						hasMore={this.state.hasMoreTweets}
						loader={
							<div className="loader" key={0}>
								!
							</div>
						}
					>
						{this.state.tweets.map((tweet, i) => {
							return <DisplayTweet key={i} tweet={tweet} />
						})}
					</InfiniteScroll>
				</div>
			</section>
		)
	}
}

export default TweetList
