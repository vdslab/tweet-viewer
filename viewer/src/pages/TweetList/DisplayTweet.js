import React from 'react'

class DisplayTweet extends React.Component {
    render() {
        const jst = new Date(this.props.tweet.JSTtime.value)
        console.log(jst)
        return (
            <div className="media">
                <div className="media-content">
                    <div className="content">
                        <p>
                            <strong>{this.props.tweet.name}</strong>
                            <br/>
                            {this.props.tweet.text}
                            <br/>
                            <small><a>Like</a> · {`${jst}`}</small>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default DisplayTweet