import React from 'react';

const Card = (props) => {
    return (
        <div  style={{ height: 230, paddingRight:10, float: 'left'}}>
            <div className="card">
                <div className='d-flex'>
                    <div className='img-holder'>
                        <img alt={props.payload.name} src={props.payload.image} />
                    </div>

                    <div className="cart-infor">
                        <div className="card-title m-0">
                            <h5>{props.payload.name}</h5>
                            <span className='m-0'>${props.payload.price}</span>
                            <div>
                                Quantity: <span class='quantity-show'>{props.payload.quantity}</span>
                            </div>
                        </div>
                        {/* <div className="view-btn">
                            <a href="/">View Details</a>
                        </div> */}
                        <p>
                            {props.payload.description}
                        </p>
                    </div>
                </div>
                <div className="card-body">
                    <hr />
                    <div className="btn-group">
                        <div className="btn">
                            <a target="_blank" rel="noopener noreferrer" onClick={props.handleAddClick}>ADD TO CART</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;