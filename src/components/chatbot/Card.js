import React from 'react';

const Card = (props) => {
    return (
        <div  style={{ height: 265, paddingRight:10, float: 'left'}}>
            <div className="card">
                <div className='d-flex' style={{ flexWrap: 'wrap'}}>
                    <div className='img-holder' style={{ flex: '1 0 50%'}}> 
                        <img alt={props.payload.name} src={props.payload.image} />
                    </div>

                    <div className="cart-infor" style={{ flex: '1 0 50%'}}>
                        <div className="card-title m-0">
                            <h5 className='truncate-text'>{props.payload.name}</h5>
                            <span className='m-0'>${props.payload.price}</span>
                        </div>
                        {/* <div className="view-btn">
                            <a href="/">View Details</a>
                        </div> */}
                        <p className='truncate-text'>
                            {props.payload.description}
                        </p>
                    </div>
                    <div>
                        Quantity: <span class='quantity-show'>{props.payload.quantity}</span>
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