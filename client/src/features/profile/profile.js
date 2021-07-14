import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useContext } from 'react';
import { myContext } from '../../Context';
import { selectCurrentUser } from "../currentUser/currentUserSlice";
import { current } from 'immer';
import { updateCart } from '../cart/cartSlice';




export const ProfilePage = () => {
    const userObject = useContext(myContext);
    let totalOrders = [];
    let totalOrderItems = [];
    let gamesArray = [];
    const [currentGamesInOrder, setGamesInOrder] = useState({})
    const [currentGames, setCurrentGames] = useState([{}]);
    const [currentOrders, setCurrentOrders] = useState([[{}]]);
    const [currentOrderItems, setCurrentOrderItems] = useState([{}]);

    const getUserOrders = async () => {
        if (userObject.rows[0].google_user_id) {
            const response = await fetch(`http://localhost:5000/orders/${userObject.rows[0].google_user_id}`);
            const toJson = await response.json();
            totalOrders.push(toJson.rows);
            return toJson.rows;
        } else {
            const response = await fetch(`http://localhost:5000/orders/${userObject.rows[0].id}`);
            const toJson = await response.json();
            totalOrders.push(toJson.rows);
            return toJson.rows;
        }
    }

    const getOrderItems = async () => {

        const orderIds = await getUserOrders();
        const promises = await Object.values(orderIds).map(async (order) => {
            const response = await fetch(`http://localhost:5000/order_items/${order.id}`);
            const toJson = await response.json();
            totalOrderItems.push(toJson.rows);
            return toJson;
        });

        const results = await Promise.all(promises);
        if (results) {
            return totalOrderItems;
        }
    }

    const getGamesInOrders = async () => {
        const games = await getOrderItems();
        const promises = await Object.values(games).map(async (game) => {
            const individualGames = await Object.values(game).map(async (indGame) => {
                if (indGame) {
                    const response = await fetch(`http://localhost:5000/games/${indGame.game_id}`);
                    const toJson = await response.json();
                    gamesArray.push(toJson.rows[0]);
                    return toJson.rows[0];
                }
            });
            const results = await Promise.all(individualGames);
            return results;

        });

        const results = await Promise.all(promises);
        return results;
    }

    useEffect(async () => {
        const fetchData = await getGamesInOrders();
        console.log(fetchData);
        if (fetchData);
            console.log("this runs!");
            console.log(gamesArray);
            console.log(totalOrders);
            console.log(totalOrderItems);
            setCurrentGames(gamesArray);
            //setCurrentOrders(totalOrders);
            //setCurrentOrderItems(totalOrderItems);
            const parsedCurrentOrderItems = JSON.stringify(totalOrderItems);
            const parsedCurrentGames = JSON.stringify(gamesArray);
            const parsedCurrentOrders = JSON.stringify(totalOrders);

            sessionStorage.setItem("userOrders", parsedCurrentOrders);
            sessionStorage.setItem("userGames", parsedCurrentGames);
            sessionStorage.setItem("userOrderItems", parsedCurrentOrderItems);
    }, []);


    const displayGamesInOrder = (order) => {
        let gamesInOrder = [];
        console.log(totalOrders);
        console.log(gamesArray);
        console.log(order.id);
        for(let i in currentGames){
            for (let j in totalOrderItems){
                for (let k in totalOrderItems[j]){
                    if(currentOrderItems[j][k].orders_id === order.id && currentOrderItems[j][k].game_id == gamesArray[i].id){
                        const itemInOrder = {"orderNumber": order.id, "name": gamesArray[i].name, "price": gamesArray[i].price};
                        gamesInOrder.push(itemInOrder);
                        
                    }
                    
                }
            }
            
        }
        console.log(gamesInOrder);
        return gamesInOrder;
        
        
    }

    return (
        <div>
            <h1>Hello {userObject ? (userObject.rows[0].display_name || userObject.rows[0].username) : window.open("http://localhost:3000", "_self")}</h1>
            {currentOrders.length > 1 ? (console.log(currentOrders), <h2>Your orders:</h2>) : <h2>No orders</h2>}
            <ul>{currentOrders.length > 1 ? currentOrders[0].map((order) => {
                console.log(currentOrders);
                if (order.id) {
                    console.log(order);
                    return (
                        <li key={order.id}>
                            <h3>Order number: {order.id}</h3>
                            {displayGamesInOrder(order).map((game) =>{
                                return (
                                    <div>
                                        <p>Name:{game.name}</p>
                                        <p>Price:{game.price}</p>
                                    </div>
                                    
                                )
                            })
                        }
                        </li>
                    )
                } else {
                    return (
                        <p>Loading...</p>
                    )
                } 
            }) : <p></p>
        }

            </ul>
        </div>
    )
}