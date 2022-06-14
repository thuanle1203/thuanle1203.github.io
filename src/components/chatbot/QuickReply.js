import React from 'react';
import '../../App.css'

const QuickReply = (props) => {
    if (props.reply.payload) {
        return (
            <a style={{ margin: 3}} href="/" className="btn"
               onClick={(event) =>
                   props.click(
                       event,
                       props.reply.payload,
                       props.reply.text
                   )
               }>
                {props.reply.text}
            </a>
        );
    } else {
        return (
            <a style={{ margin: 3}} href={props.reply.link}
               className="btn">
                {props.reply.text}
            </a>
        );
    }

};

export default QuickReply;
