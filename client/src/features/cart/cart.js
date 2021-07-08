import { current } from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import { useDispatch } from "react-redux";
import {removeFromCart, selectCurrentCart, removeOneFromItem} from "./cartSlice";


export const Cart = () =>{
    const currentCart = useSelector(selectCurrentCart);
    const dispatch = useDispatch();

    console.log(currentCart);

    return(
        <ul>
            {Object.values(currentCart).map((item) =>(
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
                    <button onClick = {() =>{
                        dispatch(removeFromCart(item));
                    }}>Remove</button>

                    {item.quantity > 1 ? <button onClick = { () =>{
                        dispatch(removeOneFromItem(item))}}>-1</button> : <br />}
                </div>

            </li>
            ))}
        </ul>
    )
}