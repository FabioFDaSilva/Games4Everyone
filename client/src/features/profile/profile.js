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
        /* if (sessionStorage.getItem("userOrders") && sessionStorage.getItem("userGames") && sessionStorage.getItem("userOrderItems")) {
             if(sessionStorage.getItem("userOrders") !== JSON.stringify(totalOrders) &&
              sessionStorage.getItem("userGames") !== JSON.stringify(gamesArray) &&
               sessionStorage.getItem("userOrderItems") !== JSON.stringify(totalOrderItems)){
                 setCurrentGames(gamesArray);
                 setCurrentOrders(totalOrders);
                 setCurrentOrderItems(totalOrderItems);
               }
 
         } else {*/
        const fetchData = await getGamesInOrders();
        if (fetchData) {

            setCurrentGames(gamesArray);
            setCurrentOrders(totalOrders);
            setCurrentOrderItems(totalOrderItems);
            const parsedCurrentOrderItems = JSON.stringify(totalOrderItems);
            const parsedCurrentGames = JSON.stringify(gamesArray);
            const parsedCurrentOrders = JSON.stringify(totalOrders);

            sessionStorage.setItem("userOrders", parsedCurrentOrders);
            sessionStorage.setItem("userGames", parsedCurrentGames);
            sessionStorage.setItem("userOrderItems", parsedCurrentOrderItems);
        }
        //}

    }, []);


    const displayGamesInOrder = (order) => {
        let gamesInOrder = [];
        for(let i in currentGames){
            for (let j in currentOrderItems){
                for (let k in currentOrderItems[j]){
                    if(currentOrderItems[j][k].orders_id === order.id && currentOrderItems[j][k].game_id == currentGames[i].id){
                        const itemInOrder = {"orderNumber": order.id, "name": currentGames[i].name, "price": currentGames[i].price};
                        gamesInOrder.push(itemInOrder);
                        
                    }
                    
                }
            }
            
        }
        return gamesInOrder;
        
        
    }

    return (
        <div>
            <h1>Hello {userObject ? (userObject.rows[0].display_name || userObject.rows[0].username) : window.open("http://localhost:3000", "_self")}</h1>
            <h2>Your orders:</h2>
            <ul>{currentOrders[0].map((order) => {
                if (order.id) {
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
            })}

            </ul>
        </div>
    )
}