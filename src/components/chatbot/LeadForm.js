import React, { useState } from "react";
import axios from "axios";
import uuid from "uuid";

const LeadForm = (props) => {

  const [customerInfor, setCustomerInfor] = useState()
  const [showLead, setShowLead] = useState(true)
  const [messagesEnd, setMessagesEnd] = useState(true)

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    
    setCustomerInfor({ ...customerInfor, [name]: value });
  }

  async function handleSubmit() {
    const customer = await axios.post(process.env.REACT_APP_API_ACCESS + '/api/customers', {
      infor: customerInfor,
      sessionId: uuid.v4(),
      businessId: props.businessId
    });
    if (customer) {
      const { sessionId } = customer.data
      localStorage.setItem('userID', sessionId);
      props.doneLeadForm()
    }
  }

  function closeLead() {
    setShowLead(false)
  }

  function show() {
    setShowLead(true)
  }
  if (showLead) {
    return (
        <div className='widget-show fade-in' style={{ minHeight: 600, width:400, position: 'absolute', bottom: 40, right: 20, border: '1px solid lightgray'}}>
        <nav className='position-relative'>
            <div className="widget-header nav-lead d-block m-0 p-2" style={{ height: '200px'}}>
                <div className='d-flex w-100'>
                    <div className='brand-infor d-flex align-items-center m-2' style={{ color: 'white', fontSize: '20px' }}>
                        <div>
                            <a href='/' style={{ color: 'white', fontSize: '30px' }}  className='brand-name'>Hi there</a>
                            <div className='d-flex align-items-center' style={{ height: '12px' }}>
                                <p className='status m-0'>How can we help you today?</p>
                            </div>
                        </div>
                    </div>
                    <div id="nav-mobile" className="d-flex align-items-center" style={{ marginLeft: 'auto' }}>
                        <div>
                            <div onClick={() => closeLead()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" className="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
  
        <div className='position-absolute' style={{ top: '90px', left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className='input-lead-form'>
            <div className="input-box">
              <div className='d-flex justify-content-center pt-2'>
                <p className='p-2 m-0'>Please fill your information</p>
              </div>
              <div className='d-flex justify-content-center'>
                <div>
                  <p className='m-0 p-2'>Name <span style={{ color: 'red' }}>*</span></p>
                  <div className='w-100'>
                    <input id='user_says' name="name" placeholder="Type your name ..." type="text" onChange={handleInputChange}/>
                  </div>
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <div>
                  <p className='m-0 p-2'>Email <span style={{ color: 'red' }}>*</span></p>
                  <div>
                    <input id='user_says' name="email" placeholder="Type your email ..." type="text" onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <div>
                  <p className='m-0 p-2'>Phone <span style={{ color: 'red'}}>*</span></p>
                  <div>
                    <input id='user_says' name="phone" placeholder="Type your phone ..." type="text" onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </div>
            <div className='d-flex justify-content-center'>
              <button className='start-chat-btn' onClick={handleSubmit}>Start the chat</button>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='chatbot-collapse kreep'>
        <div id="nav-mobile" className="right hide-on-med-and-down d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
          <div onClick={show}><img src={require('../../asset/image/bot.png')} /></div>
        </div>
        {/* <div ref={(el) => { messagesEnd = el; }}
          style={{ float:"left", clear: "both" }}>
        </div> */}
      </div>
    );
  }
}

export default LeadForm