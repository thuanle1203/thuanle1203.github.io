import React from 'react';

const Card = (props) => {
    return (
        <div  style={{ height: 230, paddingRight:10, float: 'left'}}>
            <div class="card">
                <div className='d-flex'>
                    <div className='img-holder'>
                        <img alt={props.payload.name} src={props.payload.image} />
                    </div>

                    <div class="cart-infor">
                        <div class="card-title m-0">
                            <h5>{props.payload.name}</h5>
                            <span className='m-0'>${props.payload.price}</span>
                        </div>
                        {/* <div class="view-btn">
                            <a href="/">View Details</a>
                        </div> */}
                        <p>
                            {props.payload.description}
                        </p>
                    </div>
                </div>
                <div class="card-body">
                    <hr />
                    <div class="btn-group">
                        <div class="btn">
                            <a target="_blank" rel="noopener noreferrer" onClick={props.handleAddClick}>ADD TO CART</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;