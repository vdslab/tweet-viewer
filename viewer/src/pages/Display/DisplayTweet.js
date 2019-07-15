import React from 'react'
import { Link } from 'react-router-dom'

class DisplayTweet extends React.Component {
	render() {
        const jst = new Date(this.props.tweet.JSTtime.value)
		return (
			<div className="media">
				<div className="media-content">
					<div className="content">
						<p>
							<strong>
								<Link to={"/user/" + `${this.props.tweet.user.id_str}`}>
									{this.props.tweet.user.name}
								</Link>
							</strong>
							<br />
							{this.props.tweet.text}
							<br />
							<small>
								<a>Like</a> · {`${jst}`}
							</small>
						</p>
					</div>
				</div>
			</div>
		)
	}
}

export default DisplayTweet
