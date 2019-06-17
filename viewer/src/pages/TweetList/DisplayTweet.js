import React from 'react'

class DisplayTweet extends React.Component {
    render() {
        return (
            <div className="media">
                <div className="media-content">
                    <div class="content">
                        <p>
                            <strong>{this.props.name}</strong>
                            <br/>
                            {this.props.text}
                            <br/>
                            <small><a>Like</a> · <a>Reply</a>· 3 hrs</small>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default DisplayTweet