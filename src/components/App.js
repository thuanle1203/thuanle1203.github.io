import React from 'react';
import Chatbot from './chatbot/Chatbot';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = ({ domElement }) => {
    const businessId = domElement.getAttribute("business-id")

    return (
        <div>
            <div className="container">
                <Chatbot businessId={businessId}  id='chatbot' />
            </div>
        </div>
    );
}

export default App;
