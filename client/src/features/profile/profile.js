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
    let ordersArray = [];
    const [currentOrdersObjects, setCurrentOrdersObjects] = useState()

    const getUserOrders = async () => {

        if (userObject.rows[0].google_user_id) {
            const response = await fetch(`http://localhost:5000/orders/${userObject.rows[0].google_user_id}`);
            const toJson = await response.json();
            ordersArray.push(toJson.rows);
        } else {
            const response = await fetch(`http://localhost:5000/orders/${userObject.rows[0].id}`);
            const toJson = await response.json();
            ordersArray.push(toJson.rows);

        };

        return ordersArray;
    }

    const getOrderItemsInOrders = async () => {
        const allOrders = await getUserOrders();
        console.log(allOrders[0]);
        const allItemOrdersInOrders = await Object.values(allOrders[0]).map(async (order) => {
            const response = await fetch(`http://localhost:5000/order_items/${order.id}`);
            const toJson = await response.json();
            return toJson.rows;
        });

        const results = await Promise.all(allItemOrdersInOrders);
        return results;
    }

    const getGamesInOrders = async () => {
        const allOrderItems = await getOrderItemsInOrders();
        const allCorrespondingGames = Object.values(allOrderItems).map(async (orderItem) => {
            const matchOrderItemWithGame = Object.values(orderItem).map(async (indGame) => {
                if (indGame) {
                    const response = await fetch(`http://localhost:5000/games/${indGame.game_id}`);
                    const toJson = await response.json();
                    return toJson.rows[0];
                }
            });
            const results = await Promise.all(matchOrderItemWithGame);
            return results;

        });

        const gamesInAllOrders = await Promise.all(allCorrespondingGames);
        console.log(gamesInAllOrders);
        let customerOrders = [];

        function checkIdMatchAndOrderMatch(game, orderItem, order) {
            ///if their ID matches, and they match the order ID, add the game as part of that order
            if (game.id == orderItem.game_id && orderItem.orders_id == order.id) {
                const thisGame = { "gameName": game.name, "gamePrice": game.price, "orderItemDBID": orderItem.id };
                return thisGame;
            }
        }
        ordersArray[0].forEach(order => {
            const thisOrder = { "orderID": order.id };
            ///is there more than one order?
            if (gamesInAllOrders.length > 1) {
                ///If so, look into the array
                gamesInAllOrders.forEach(arrayOfGames => {
                    ///Then look at the games in the array
                    arrayOfGames.forEach(gameInArray => {
                        ///Also look at the order items array
                        allOrderItems.forEach(arrayOfOrderItems => {
                            ///Then look into each individual order item
                            arrayOfOrderItems.forEach(orderItem => {
                                const getMatches = checkIdMatchAndOrderMatch(gameInArray, orderItem, order);
                                if (getMatches) {
                                    thisOrder[`${orderItem.id}`] = checkIdMatchAndOrderMatch(gameInArray, orderItem, order);
                                }
                            })
                        })
                    })
                })
                /// Otherwise
            } else {
                ///Look into the first item of the games array
                gamesInAllOrders[0].forEach(gameInAllOrders => {
                    ///Then look into the first item order items array
                    allOrderItems[0].forEach(orderItem => {
                        const getMatches = checkIdMatchAndOrderMatch(gameInAllOrders, orderItem, order);
                        if (getMatches) {
                            thisOrder[`${gameInAllOrders.id}`] = checkIdMatchAndOrderMatch(gameInAllOrders, orderItem, order);
                        }
                    });

                })
            }
            customerOrders.push(thisOrder);
        });
        return customerOrders;
    }

    useEffect(async () => {
        if(userObject){
            const fetchedData = await getGamesInOrders();
            setCurrentOrdersObjects(fetchedData);
        }
    }, [userObject]);

    
    const displayOrder = (orderObject) => {
        console.log(orderObject);
        const gameDetails = [];
        for (let content in orderObject) {
            if (orderObject.hasOwnProperty(content)) {
                if (orderObject[content].gameName) {
                    gameDetails.push(
                        <div key = {orderObject[content].orderItemDBID}>
                            <p>Name: {orderObject[content].gameName}</p>
                            <p>Price: {orderObject[content].gamePrice}</p>
                        </div>
                            
                    )
                }
            }
        }

        console.log(orderObject["orderID"] + gameDetails.length);
        return (
            <ul key={orderObject["orderID"] + gameDetails.length}>
                <li key={orderObject["orderID"]}>
                    <h3>orderID: {orderObject["orderID"]}</h3>
                    {gameDetails}
                </li>
            </ul>

        )
    }
    return (
        <div>
            <h1>Hello {userObject ? (userObject.rows[0].display_name || userObject.rows[0].username) : <br/>}</h1>
            {currentOrdersObjects ? <h2>Your Orders:</h2> : <h2>You have not ordered anything yet</h2>}
            {currentOrdersObjects ? currentOrdersObjects.map(orderObject => {
               return displayOrder(orderObject);
            }) : <p></p>}
        </div>
    )
}
