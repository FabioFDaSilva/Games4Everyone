import { current } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { myContext } from '../../Context';
import { removeFromCart, selectCurrentCart, removeOneFromItem } from "./cartSlice";
import { useContext } from 'react';


export const Cart = () => {
    const currentCart = useSelector(selectCurrentCart);
    const dispatch = useDispatch();

    const currentDisplayedCart = JSON.stringify(useSelector(selectCurrentCart));
    const userObject = useContext(myContext);


    const displayCart = () => {
        return Object.values(currentCart).map((item) => (
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
        ))
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