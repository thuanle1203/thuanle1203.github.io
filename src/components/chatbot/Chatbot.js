import React, { Component } from 'react';
import axios from "axios/index";

import Message from './Message';
import orderApi from '../../api/orderApi';
import Card from './Card';
import Cart from './Cart/Cart'
import QuickReplies from './QuickReplies';
import { Carousel } from '@trendyol-js/react-carousel';
import '../../App.css'
import 'reactjs-popup/dist/index.css';
import LeadForm from './LeadForm';

class Chatbot extends Component {
    messagesEnd;
    talkInput;

    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
    
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
        this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);

        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this.state = {
            messages: [],
            showBot: false,
            shopWelcomeSent: false,
            cartIsUpdated: false,
            clientToken: false,
            isOpenCart: false,
            isOpenPayment: false,
            regenerateToken: 0,
            businessId: props.businessId,
            showLead: false,
            currentAddress: null
        };
      
        if (localStorage.getItem('userID') == undefined) {
        this.state.showLead = true
        }
    }

    async df_text_query(text) {
        let says = {
            speaks: 'user',
            msg: {
                text : {
                    text: text
                }
            }
        }
        this.setState({ messages: [...this.state.messages, says]});
        const request = {
            queryInput: {
                text: {
                    text: text,
                    languageCode: 'en-US',
                },
            }
        };
        await this.df_client_call(request);
    };

    handlePaymentMethod = async (payment) => {
        const data = await orderApi.post(payment, localStorage.getItem('userID'), this.state.businessId, this.state.currentAddress);

        // Generate message with order infor

        const says = {
            speaks: 'bot',
            msg: {
                text : {
                    text: 'Thank you for your order\nThis\'s your order infor: \nOrder ID: ' + data.data.order._id
                }
            }
        }

        this.setState({ messages: [...this.state.messages, says]});
        this.setState({ isOpenPayment: false });

        this.df_event_query('WELCOME_SHOP');

        return data

    }

    df_event_query = async (event, parameters) => {
        const request = {
            queryInput: {
                event: {
                    name: event,
                    languageCode: 'en-US',
                    parameters: parameters
                },
            }
        };

        await this.df_client_call(request);

    };

    closeCartPopup = async () => {
        this.setState({ isOpenCart: !this.state.isOpenCart });
    };

    async df_client_call(request) {

        try {

            if (this.state.clientToken === false) {
                const res = await axios.get(process.env.REACT_APP_API_ACCESS + '/api/get_client_token');
                this.setState({clientToken: res.data.token});
            }

            var config = {
                headers: {
                    'Authorization': "Bearer " + this.state.clientToken,
                    'Content-Type': 'application/json; charset=utf-8'
                }
            };


            const res = await axios.post(
                'https://dialogflow.googleapis.com/v2/projects/' + process.env.REACT_APP_GOOGLE_PROJECT_ID +
                '/agent/sessions/' + process.env.REACT_APP_DF_SESSION_ID + localStorage.getItem('userID') + ':detectIntent',
                request,
                config
            );

            let  says = {};

            if (res.data.queryResult.fulfillmentMessages ) {
                for (let msg of res.data.queryResult.fulfillmentMessages) {
                    says = {
                        speaks: 'bot',
                        msg: msg
                    }
                    this.setState({ messages: [...this.state.messages, says]});
                }
            }
        } catch (e) {
            console.log(e);
            if (e.response.status === 401 && this.state.regenerateToken < 1) {
                this.setState({ clientToken: false, regenerateToken: 1 });
                this.df_client_call(request);
            }
            else {
                let says = {
                    speaks: 'bot',
                    msg: {
                        text : {
                            text: "I'm having troubles. I need to terminate. will be back later"}
                    }
                }
                this.setState({ messages: [...this.state.messages, says]});
                let that = this;
                // setTimeout(function(){
                //     that.setState({ showBot: true})
                // }, 2000);
            }
        }

    }

    
    async componentDidMount() {
      
      // if (window.location.pathname === '/shop' && !this.state.shopWelcomeSent) {
          //     await this.resolveAfterXSeconds(1);
          //     // create user
          //     console.log('the first time', cookies.get('userID'));
          //     this.df_event_query('WELCOME_SHOP');
          //     this.setState({ shopWelcomeSent: true, showBot: true });
          // }
          
          
      if (localStorage.getItem('userID') != undefined) {
        this.df_event_query('Welcome');  
        this.df_event_query('WELCOME_SHOP');
      }

    }
        
    // closeModal() {
    //     this.setState({ isOpenCart: false });
    // }

    doneLeadForm = () => {
      this.setState({ showLead: false, showBot: true })
      this.df_event_query('Welcome');  
      this.df_event_query('WELCOME_SHOP');
    }
        
    addProductToCard(productId) {
        this.df_event_query('ADD_TO_CART', { 
            productId: productId, 
            sessionId: localStorage.getItem('userID'),
            businessId: this.state.businessId
        });
    }

    handleSetAddressClick(code) {
      this.setState({ currentAddress: code })
      const says = {
        speaks: 'bot',
        msg: {
            payload : { 
              text: 'Please choose payment method you want?',
              quick_replies: [
                  {
                      text: 'Payment Online',
                      payload: 'view_payment'
                  }, 
                  {
                      text: 'COD',
                      payload: 'cod'
                  }
              ] 
          }
        }
      }

      this.setState({ messages: [...this.state.messages, says]});
    }

    resolveAfterXSeconds(x) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(x);
            }, x * 1000);
        })
    }

    componentDidUpdate() {
        setTimeout(() => {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }, 250)
        if ( this.talkInput ) {
            this.talkInput.focus();
        }
    }

    show(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({showBot: true});
    }

    hide = () => {
        this.setState({showBot: false});
    }

    _handleQuickReplyPayload(event, payload, text, code) {
        event.preventDefault();
        event.stopPropagation();

        switch (payload) {
          case 'set-address-for-order':
            this.handleSetAddressClick(code)
            break;
          case 'cod': 
              this.handlePaymentMethod()
              break;
          case 'checkout':
              this.df_event_query('CHECKOUT');
              break;
          case 'new-address':
            this.df_event_query('GET_ADDRESS', { businessId: this.state.businessId, sessionId: localStorage.getItem('userID') });
            break;
          case 'current-address':
            this.df_event_query('GET_CURRENT_ADDRESIES', { businessId: this.state.businessId, sessionId: localStorage.getItem('userID') });
            break;
          case 'view_cart':
              this.setState({ isOpenCart: !this.state.isOpenCart });
              break;
          case 'view_payment':
              this.setState({ isOpenPayment: !this.state.isOpenPayment });
              break;
          case 'search_by_name':
              this.df_event_query('SEARCH_PRODUC_BY_NAME', { businessId: this.state.businessId });
              break;
          case 'shopping':
              this.df_event_query('BUY_MORE');
              break;
          case 'choose_category':
              this.df_event_query('CHOOSE_CATEGORY', { businessId: this.state.businessId });
              break;
          case 'shopping - choose category':
              this.df_event_query('PRODUCT_BY_CATEGORY', { categoryName: text, businessId: this.state.businessId });
              break;
          case 'recommended_yes':
              this.df_event_query('SHOW_RECOMMENDATIONS');
              break;
          case 'training_masterclass':
              this.df_event_query('MASTERCLASS');
              break;
          default:
              this.df_text_query(text);
              break;
        }
    }

    renderCards(cards) {
        return cards?.map((card, i) => 
            <Card key={i} payload={card} handleAddClick={event => {
                this.addProductToCard(card._id)
                }}
            />);
    }

    renderOneMessage(message, i) {

        if (message.msg && message.msg.text && message.msg.text.text) {
            return <Message key={i} speaks={message.speaks} text={message.msg.text.text}/>;

        } else if (message.msg
            && message.msg.payload
            && message.msg.payload.cards) { //message.msg.payload.fields.cards.listValue.values

            return <div key={i}>
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div style={{overflow: 'hidden'}}>
                        <div className='d-flex'>   
                            <div className="p-2 d-flex align-items-start">
                                <a href="/" className="">
                                    <img style={{ height: '32px', width: '32px' }} className='circle-logo' src='https://cdn-icons-png.flaticon.com/512/7498/7498761.png'/>
                                </a>
                            </div>
                            <div>
                                <div className="mb-2 mt-2 p-2 mess-content">
                                    <span className="black-text">
                                        This is product relate
                                    </span>
                                </div>
                                <div style={{ overflow: 'auto' }}>
                                    <div style={{ height: 230, width: 300 }}>
                                        <Carousel 
                                            infinite={false} 
                                            swipeOn={0.5} 
                                            show={1.25} 
                                            slide={1} 
                                            swiping={true} 
                                            rightArrow={false} 
                                            leftArrow={false}>
                                            {this.renderCards(message.msg.payload.cards)}
                                        </Carousel>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        } else if (message.msg &&
            message.msg.payload &&
            message.msg.payload.quick_replies
        ) {
            return <QuickReplies
                text={message.msg.payload.text ? message.msg.payload.text : null}
                key={i}
                replyClick={this._handleQuickReplyPayload}
                speaks={message.speaks}
                payload={message.msg.payload.quick_replies}/>;
        }
    }

    renderMessages(returnedMessages) {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                    return this.renderOneMessage(message, i);
                }
            )
        } else {
            return null;
        }
    }

    _handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }

    render() {
        if (this.state.showBot) {
            return (
                <div className='widget-show fade-in' style={{ minHeight: 500, width:400, position: 'absolute', bottom: 40, right: 20, border: '1px solid lightgray'}}>
                    <nav>
                        <div className="widget-header d-block m-0 p-2">
                            <div className='d-flex w-100'>
                                <a href="/" className="brand-logo">
                                    <img 
                                    className='brand-img circle-logo' 
                                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVpgu4O5hVuDPbGSf_qplQ777uOfRDzh0izg&usqp=CAU'/>
                                </a>
                                <div className='brand-infor d-flex align-items-center m-2'>
                                    <div>
                                        <a href='/' className='brand-name'>Talker</a>
                                        <div className='d-flex align-items-center' style={{ height: '12px' }}>
                                            <span style={{ color: ' #99ff33', marginRight: '4px', fontSize: '20px' }}>&bull;</span>
                                            <p className='status m-0'>Always Active</p>
                                        </div>
                                    </div>
                                </div>
                                <div id="nav-mobile" className="d-flex align-items-center" style={{ marginLeft: 'auto' }}>
                                    <div>
                                        <div onClick={this.hide}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <div id="chatbot"  style={{ minHeight: 388, maxHeight: 388, width:'100%', overflow: 'auto', marginTop: '10px' }}>

                        {this.renderMessages(this.state.messages)}
                        <div ref={(el) => { this.messagesEnd = el; }}
                             style={{ float:"left", clear: "both", overflow: 'scroll' }}>
                        </div>
                    </div>
                    <div className="input-box">
                        <input className='' ref={(input) => { this.talkInput = input; }} placeholder="Type your message ..."  onKeyPress={this._handleInputKeyPress} id="user_says" type="text" />
                    </div>
                    <Cart sessionId={localStorage.getItem('userID')}
                        isOpenPayment={this.state.isOpenPayment}
                        isOpenCart={this.state.isOpenCart}
                        df_event_query={this.df_event_query}
                        closeCartPopup={this.closeCartPopup}
                        businessId={this.state.businessId}
                        handlePaymentMethod={this.handlePaymentMethod} />
                </div>
            );
        } else if (this.state.showLead) {
          return (
            <div>
              <LeadForm hide={this.hide} 
                showBot={this.state.showBot} showLead={this.state.showLead} doneLeadForm={this.doneLeadForm} businessId={this.state.businessId} />
            </div>
          )
        } else {
          return (
            <div className='chatbot-collapse kreep'>
              <div id="nav-mobile" className="right hide-on-med-and-down d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                <a href="/" onClick={this.show}><img src={require('../../asset/image/bot.png')} /></a>
              </div>
                
              <div ref={(el) => { this.messagesEnd = el; }}
                style={{ float:"left", clear: "both" }}>
              </div>
            </div>
          );
          
        }
    }
}

export default Chatbot;