import { BrowserRouter as Router, Link, Route, Switch, NavLink } from 'react-router-dom';
import { ItemPage } from '../itemPage/itemPage';
import { Search } from './search';
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentGames, updateGameList } from "./storepageSlice";
import { useContext } from 'react';
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


    function displayImagesURL(item) {
        let bob = '';
        for (let i = 0; i < item.array_imgURL.length; i++) {
            bob += item.array_imgURL[i];
        }
        return bob;
    }

    function dispatchAndAddToLocalStorage(item) {
        dispatch(addToCart(item));
        const { cartState } = { cartState: currentDisplayedCart };
        localStorage.setItem('cartState', cartState);
    }
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
                            {item.array_imgURL ? displayImagesURL(item) : <p></p>}
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