import React, { useEffect, useState } from 'react';
import { getDatabaseCart, processOrder, removeFromDatabaseCart } from '../../utilities/databaseManager';
import ReviewItem from '../ReviewItem/ReviewItem';
import Cart from '../Cart/Cart';
import happyImage from '../../images/giphy.gif';
import { useHistory } from 'react-router';
import './Review.css';
const Review = () => {
    const [cart, setCart] = useState([]);
    const [orderPlaced, setOrderPlaced] = useState (false);
    const history = useHistory()
    const handleProceedCheckout = () => {
       history.push('/shipment');
        // setCart ([]) ;
        // setOrderPlaced(true);
        // processOrder();
        // console.log('order placed');
    }
    const removeProduct = (productKey) => {
        // console.log ('remove clicked', productKey);
        const newCart = cart.filter(pd => pd.key !== productKey);
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }

    useEffect(() => {
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);
        fetch ( 'https://stark-springs-54483.herokuapp.com/productsByKeys', {
            method : 'POST',
            headers: {
                'content-Type' : 'application/json'
            },
             body : JSON.stringify(productKeys)
        })
        .then(res => res.json())
        .then(data => setCart(data))      
    }, []);
     let thankyou;
     if(orderPlaced){
        thankyou = <img src={happyImage} alt ="" />
     }
    return (
        <div ClassName="twin-container">
           
            <div className="product-container">
                {
                    cart.map(pd => <ReviewItem
                    key={pd.key}
                    removeProduct={removeProduct}
                    product={pd}></ReviewItem>)
                }
                {
                    thankyou
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    <button onClick = {handleProceedCheckout} className ="main-button">Proceed Checkout</button>
                </Cart>
            </div>
        </div>
    );
};

export default Review;