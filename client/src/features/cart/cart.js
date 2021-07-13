import { current } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { myContext } from '../../Context';
import { removeFromCart, selectCurrentCart, removeOneFromItem, updateCart } from "./cartSlice";
import { useContext } from 'react';


export const Cart = () => {
    const currentCart = useSelector(selectCurrentCart);
    const dispatch = useDispatch();

    const currentDisplayedCart = JSON.stringify(useSelector(selectCurrentCart));
    const userObject = useContext(myContext);

    const addCartItemsToDB = async (orderId) => {
        const parsedStoreCartGames = JSON.parse(localStorage.cartState);
        for (let i = 0; i < parsedStoreCartGames.length; i++) {
            
            const order_item = {
                "game_id": parsedStoreCartGames[i].id,
                "order_id": orderId,
                "price": parsedStoreCartGames[i].price
            }
            const response = await fetch("http://localhost:5000/order_items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order_item),
            });
            console.log("this runs");
        }
        return true;
    }

    const pushOrder = async () => {
        const parsedStoreCartGames = JSON.parse(localStorage.cartState);
        let totalPrice = 0;
        for (let i = 0; i < parsedStoreCartGames.length; i++) {
            totalPrice += parseInt(parsedStoreCartGames[i].price);
            
        }
        let newOrder = {};
        if(userObject.rows[0].google_user_id){
            newOrder = {
                "user_id": userObject.rows[0].google_user_id,
                "address": userObject.rows[0].address,
                "price": totalPrice
            }
        }else{
            newOrder = {
                "user_id": userObject.rows[0].id,
                "address": userObject.rows[0].address,
                "price": totalPrice
            }
        }
        
        const response = await fetch("http://localhost:5000/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newOrder),
        });

        const toJson = await response.json();

        return toJson;
    }

    const submitOrder = async (e) => {
        e.preventDefault();


        if (localStorage.getItem("cartState")) {
            const orderPushed = await pushOrder();

            if (orderPushed) {
                console.log("order was pushed");
                const itemsAdded = await addCartItemsToDB(orderPushed.rows[0].id);

                if (itemsAdded) {
                    console.log("items were added");
                    alert("Order Complete");
                    
                    if(sessionStorage.getItem("userGames")){
                        sessionStorage.removeItem("userGames");
                        sessionStorage.removeItem("userOrders");
                    }
                    window.open("http://localhost:3000/profile", "_self");
                    
                    if(localStorage.getItem("cartState")){
                        localStorage.removeItem("cartState");
                        dispatch(updateCart([]));
                      }
                }
            }
        }
    }

    const displayCart = () => {
        return (<div>
            {Object.values(currentCart).map((item) => (
                <li className="item" key={item.id}>
                    <div>
                        {item.id}<br />
                        {item.name}<br />
                        {item.price}<br />
                        {item.description}<br />
                        {item.mainGameType}<br />
                        {item.secundaryGameType}<br />
                        {item.terciaryGameType}<br />
                        {item.duration}<br />
                        {item.quantity}
                        <button onClick={() => {
                            dispatch(removeFromCart(item));
                        }}>Remove</button>

                        {item.quantity > 1 ? <button onClick={() => {
                            dispatch(removeOneFromItem(item))
                        }}>-1</button> : <br />}
                    </div>

                </li>
            ))}
            <button onClick={submitOrder}>Order</button>
        </div>
        )

    }
    return (
        <ul>
            {
                currentCart.length > 0 ? displayCart() :
                    <h1>Cart is empty!</h1>
            }
        </ul>
    )
}