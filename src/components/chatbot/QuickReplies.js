import React, { Component } from 'react';
import QuickReply from './QuickReply';
import '../../App.css'

class QuickReplies extends Component {
    constructor(props) {
        super(props);
        this._handleClick = this._handleClick.bind(this);
    }

    _handleClick(event, payload, text) {
        this.props.replyClick(event, payload, text);
    }

    renderQuickReply(reply, i) {
        return <QuickReply key={i} click={this._handleClick} reply={reply} />;
    }

    renderQuickReplies(quickReplies) {
        if (quickReplies) {
            return quickReplies.map((reply, i) => {
                    return this.renderQuickReply(reply, i);
                }
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="card-panel grey lighten-5 z-depth-1">
                <div className="d-flex">
                    <div className="p-2 d-flex align-items-start">
                        <a href="/" className="">
                            <img style={{ height: '32px', width: '32px' }} className='circle-logo' src='https://cdn-icons-png.flaticon.com/512/7498/7498761.png'/>
                        </a>
                    </div>
                    <div>
                        <div id="quick-replies" className="mb-2 mt-2 p-2 mess-content">
                            {this.props.text && <span className="black-text">
                                {this.props.text}
                            </span>
                            }
                        </div>
                        {this.renderQuickReplies(this.props.payload)}
                    </div>
                </div>
            </div>
        );
    }
}

export default QuickReplies;
