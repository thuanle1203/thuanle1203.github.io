import React from 'react';
import '../../App.css'

const Message = (props) => {
    return (
        <div className="">
            <div className="card-panel">
                <div className={"d-flex " + (props.speaks === 'bot' ? '' : 'justify-content-end')}>
                    {props.speaks==='bot' &&
                    <div className="p-2 d-flex align-items-end">
                        <a href="/" className="">
                            <img style={{ height: '32px', width: '32px' }} className='circle-logo' src='https://cdn-icons-png.flaticon.com/512/7498/7498761.png'/>
                        </a>
                    </div>
                    }
                    <div className="m-2 p-2 mess-content">
                      <span className="black-text">
                        {props.text}
                      </span>
                    </div>
                    {props.speaks==='user' &&
                    <div className="p-2 d-flex align-items-end">
                        <a href="/" className="">
                            <img style={{ height: '32px', width: '32px' }} className='circle-logo' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdD_5n_V2y158Nau11WR9bYTz8Ldq0PWjZ3Q&usqp=CAU'/>
                        </a>
                    </div>
                    }
                </div>
            </div>
        </div>

    );
};

export default Message;
