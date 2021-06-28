import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom'; 
import {ItemPage} from '../itemPage/itemPage';
import {Search} from './search';
import {useSelector, useDispatch} from "react-redux";
import {selectCurrentGames} from "./storepageSlice";
import {addToCart} from "../cart/cartSlice";
import "./storepage.css";


export const StorePage = () =>{
    const currentGames = useSelector(selectCurrentGames);
    const dispatch = useDispatch();
    function displayImagesURL(item){
        let bob = '';
        for(let i = 0; i < item.array_imgURL.length; i++){
         bob += item.array_imgURL[i];
        }
        return bob;
    }


    return(
        <section className="storeContainer">
            <ul className="listContainer">
                <Search />
                {currentGames.length > 0 ? Object.values(currentGames).map((item) =>(
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
                        <button onClick = {() =>{
                            dispatch(addToCart(item));
                        }}>Add To Cart</button><br />
                        <Link to ={`/items/${item.id}`}><button>View Item</button></Link>
                    </div>
                </li>
                )) :
                <p> No Items Found!</p>}
            </ul>
        </section>
    )
}