import { BrowserRouter as Router, Link, Route, Switch, NavLink } from 'react-router-dom';
import { ItemPage } from '../itemPage/itemPage';
import { Search } from './search';
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentGames, updateGameList } from "./storepageSlice";
import { useContext, useEffect } from 'react';
import { myContext } from '../../Context';
import { addToCart, selectCurrentCart } from "../cart/cartSlice";
import "./storepage.css";
import { selectCurrentUser } from '../currentUser/currentUserSlice';



export const StorePage = () => {
    const currentGames = useSelector(selectCurrentGames);
    const currentDisplayedGames = JSON.stringify(useSelector(selectCurrentGames));
    const dispatch = useDispatch();
    const userObject = useContext(myContext);
    const currentDisplayedCart = JSON.stringify(useSelector(selectCurrentCart));

    const { cartState } = { cartState: currentDisplayedCart };
    const {storeState} = { storeState: currentDisplayedGames};

    function dispatchAndAddToLocalStorage(item) {
        dispatch(addToCart(item));
        localStorage.setItem('cartState', cartState);
    }

    window.onbeforeunload = () =>{
        localStorage.setItem('storeState', storeState);
    }

    useEffect( () =>{
        const updatedGameList = localStorage.getItem('storeState');
        if(userObject){
            dispatch(updateGameList(updatedGameList))
        }
    },[userObject]);
    return (
        <section className="storeContainer">
            <Search />
            <ul className="listContainer">
                {currentGames.length > 0 ? Object.values(currentGames).map((item) => (
                    <li key={item.id}>
                        <div className="item">
                            <section className="vitalInfo">
                                <h2 className="allignCenter">{item.name}</h2>
                                <p>Price:  {item.price}$</p>
                                <p>{item.description}</p>
                                <button className="addToCartButton" onClick={() => {
                                userObject ?
                                    dispatchAndAddToLocalStorage(item) : window.location = "http://localhost:3000/loginPage";
                            }}>Add To Cart</button><br />
                            </section>


                            <section className="complementaryInfo">
                                <p>Overall Rank: {item.popularity}</p>
                                <p>Main Game type:  {item.main_game_type}</p>
                                <p>Secundary Game Type:  {item.secundary_game_type}</p>
                                <p>Terciary Game Type:  {item.terciary_game_type}</p>
                                <p>Average Duration:  {item.duration} minutes</p>
                                <p>Difficulty: {item.difficulty}</p>
                            </section>

                            
                        </div>
                    </li>
                )) :
                    <p> No Items Found!</p>}
            </ul>
        </section>
    )
}