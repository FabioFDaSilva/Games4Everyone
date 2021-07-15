import { BrowserRouter as Router, Link, Route, Switch, NavLink } from 'react-router-dom';
import { ItemPage } from '../itemPage/itemPage';
import { Search } from './search';
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentGames, updateGameList } from "./storepageSlice";
import { useContext, useEffect } from 'react';
import { myContext } from '../../Context';
import { addToCart, selectCurrentCart } from "../cart/cartSlice";
import "./storepage.css";



export const StorePage = () => {
    const currentGames = useSelector(selectCurrentGames);
    const currentDisplayedGames = JSON.stringify(useSelector(selectCurrentGames));
    const dispatch = useDispatch();
    const userObject = useContext(myContext);
    const currentDisplayedCart = JSON.stringify(useSelector(selectCurrentCart));

    window.onbeforeunload = () => {

        const { storeState } = { storeState: currentDisplayedGames };
        localStorage.setItem('storeState', storeState);
    };

    const { cartState } = { cartState: currentDisplayedCart };

    function dispatchAndAddToLocalStorage(item) {
        dispatch(addToCart(item));
    }

    useEffect (() =>{
        localStorage.setItem('cartState', cartState);
    })
    return (
        <section className="storeContainer">
            <ul className="listContainer">
                <Search />
                {currentGames.length > 0 ? Object.values(currentGames).map((item) => (
                    <li className="item" key={item.id}>
                        <div>
                            <p>itemId</p>{item.id}<br />
                            {item.name}<br />
                            {item.price}<br />
                            {item.description}<br />
                            {item.main_game_type}<br />
                            {item.secundary_game_type}<br />
                            {item.terciary_game_type}<br />
                            {item.duration}<br />
                            <button onClick={() => {
                                userObject ?
                                    dispatchAndAddToLocalStorage(item) : window.location = "http://localhost:3000/loginPage";
                            }}>Add To Cart</button><br />
                            <Link to={`/items/${item.id}`}><button>View Item</button></Link>
                        </div>
                    </li>
                )) :
                    <p> No Items Found!</p>}
            </ul>
        </section>
    )
}