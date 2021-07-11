import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useContext } from 'react';
import { myContext } from '../../Context';
import { selectCurrentUser } from "../currentUser/currentUserSlice";
import { current } from 'immer';




export const ProfilePage = () => {
    const userObject = useContext(myContext);
    let totalOrders = [];
    let totalOrderItems = [];
    let gamesArray = [];
    const [currentGames, setCurrentGames] = useState();
    const [currentOrders, setCurrentOrders] = useState();

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
            totalOrderItems.push(toJson.rows[0]);
            return toJson.rows[0];
        });

        const results = await Promise.all(promises);
        return results;
    }

    const getGamesInOrders = async () => {
        const games = await getOrderItems();
        const promises = await Object.values(games).map(async (game) => {
            if (game) {
                const response = await fetch(`http://localhost:5000/games/${game.game_id}`);
                const toJson = await response.json();
                gamesArray.push(toJson.rows[0]);
                return toJson.rows[0];
            }

        });

        const results = await Promise.all(promises);
        return results;
    }
    let userOrders;
    useEffect(async () => {
        const updated = await getGamesInOrders();
        if (updated) {
            setCurrentOrders(totalOrders[0]);
            setCurrentGames(gamesArray[0]);
            const parsedCurrentGames = JSON.stringify(currentGames);
            const parsedCurrentOrders = JSON.stringify(currentOrders);
            localStorage.setItem("userOrders", parsedCurrentOrders);
            localStorage.setItem("userGames", parsedCurrentGames);
        }

    }, []);
    return (
        <div>
            <h1>Hello {userObject ? userObject.rows[0].display_name : window.open("http://localhost:3000", "_self")}</h1>
            <h2>Your orders:</h2>
            <ul>
                {/*currentOrders ?
                    currentOrders.map(order => {
                        return (
                            <li key={order.id}>
                                {currentOrders ?
                                    Object.values(currentGames).map(game => {
                                        return (<div>
                                            <p>Name:{game.name}</p>
                                            <p>Price:{game.price}</p>
                                        </div>)
                                    }) : <p>No games!</p>
                                }
                            </li>
                        )
                            }) : <p>No orders!</p>*/}

            </ul>
        </div>
    )
}