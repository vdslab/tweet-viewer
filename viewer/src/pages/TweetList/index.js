import React from 'react'
import DisplayTweet from '../Display/DisplayTweet'
import InfiniteScroll from 'react-infinite-scroller'

class TweetList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tweets: [],
			filtered: [],
			hasMoreTweets: false,
			excludeRt: false,
			date: '0001-01-01T00:00:00'
		}
	}
	render() {
		const keywordRef = React.createRef()
		const loadFunc = page => {
			const offset = (page - 1) * 1000
			fetch(
				`https://us-central1-moe-twitter-analysis2019.cloudfunctions.net/main/tweets?keyword=${
					keywordRef.current.value
				}&offset=${offset}&date=${this.state.date}`
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
					<div className="field">
						<label className="checkbox">
							<input
								type="checkbox"
								defaultChecked={this.state.excludeRt}
								onClick={() => {
									this.setState({ excludeRt: this.state.excludeRt ? false : true })
								}}
							/>
							リツイートを除外
						</label>
					</div>

					<div className="field">
						<div className="control">
							<div className="select is=info">
								<select
									onChange={event => {
										this.setState({ date: encodeURIComponent(event.target.value) })
									}}
								>
									<option value="0001-01-01T00:00:00">ALL</option>
									<option value="2011-03-01T00:00:00">2011年3月</option>
									<option value="2011-04-01T00:00:00">4月</option>
									<option value="2011-05-01T00:00:00">5月</option>
									<option value="2011-06-01T00:00:00">6月</option>
									<option value="2011-07-01T00:00:00">7月</option>
									<option value="2011-08-01T00:00:00">8月</option>
									<option value="2011-09-01T00:00:00">9月</option>
									<option value="2011-10-01T00:00:00">10月</option>
									<option value="2011-11-01T00:00:00">11月</option>
									<option value="2011-12-01T00:00:00">12月</option>
									<option value="2012-01-01T00:00:00">2012年1月</option>
									<option value="2012-02-01T00:00:00">2月</option>
									<option value="2012-03-01T00:00:00">3月</option>
									<option value="2012-04-01T00:00:00">4月</option>
									<option value="2012-05-01T00:00:00">5月</option>
									<option value="2012-06-01T00:00:00">6月</option>
									<option value="2012-07-01T00:00:00">7月</option>
									<option value="2012-08-01T00:00:00">8月</option>
									<option value="2012-09-01T00:00:00">9月</option>
									<option value="2012-10-01T00:00:00">10月</option>
									<option value="2012-11-01T00:00:00">11月</option>
									<option value="2012-12-01T00:00:00">12月</option>
									<option value="2013-01-01T00:00:00">2013年1月</option>
									<option value="2013-02-01T00:00:00">2月</option>
									<option value="2013-03-01T00:00:00">3月</option>
								</select>
							</div>
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
						{this.state.tweets
							.filter(d => {
								return !this.state.excludeRt || !d.retweeted_status
							})
							.map((tweet, i) => {
								return <DisplayTweet key={i} tweet={tweet} />
							})}
					</InfiniteScroll>
				</div>
			</section>
		)
	}
}

export default TweetList
