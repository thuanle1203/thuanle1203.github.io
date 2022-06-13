import React from 'react';
import Chatbot from './chatbot/Chatbot';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = ({ domElement }) => {
    const subreddit = domElement.getAttribute("data-subreddit")
    console.log(subreddit, process.env.REACT_APP_API_ACCESS);

    return (
        <div>
            <div className="container">
                <Chatbot />
            </div>
        </div>
    );
}

export default App;
