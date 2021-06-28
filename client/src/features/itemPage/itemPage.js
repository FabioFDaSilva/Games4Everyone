import { useParams} from 'react-router-dom';  
import {useSelector, useDispatch} from "react-redux";
import {selectCurrentGames} from "../storePage/storepageSlice";
import {addToCart} from "../cart/cartSlice";
import React from 'react';


export const ItemPage = () =>{
    let { itemId } = useParams();
    
    const currentGames = useSelector(selectCurrentGames);
    const currentGame = currentGames.find(item =>{
        const targetId = parseInt(itemId);
        if(item.id  === targetId){
            return item;
        }
        else{
            return '';
        }
    } );
    console.log(currentGame);
    console.log(itemId);
    const dispatch = useDispatch();
    function displayImagesURL(item){
        let bob = '';
        for(let i = 0; i < item.array_imgURL.length; i++){
         bob += item.array_imgURL[i];
        }
        return bob;
    }

    if(currentGame){
        return(
            <div>
                {currentGame.id}<br />
                {currentGame.gameName}<br />
                {currentGame.price}<br />
                {currentGame.description}<br />
                {currentGame.mainGameType}<br />
                {currentGame.secundaryGameType}<br />
                {currentGame.terciaryGameType}<br />
                {currentGame.duration}<br />
                {displayImagesURL(currentGame)}
                <button onClick = {() =>{
                    dispatch(addToCart(currentGame));
                }}>Add To Cart</button>
            </div>
            
        )
    }
    else{
        return(
            <div>
                <p>This game isn't in our database!</p>
            </div>
        )
    }
   
}