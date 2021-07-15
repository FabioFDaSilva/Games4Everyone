import "./homepage.css"
import {selectCurrentGames, updateGameList} from "../storePage/storepageSlice";
import {useSelector, useDispatch} from "react-redux";
import { useEffect } from "react";
export const Homepage = () =>{
     const dispatch = useDispatch();
     const currentDisplayedGames = JSON.stringify(useSelector(selectCurrentGames));
     async function fetchGames (body){
          try {
               const response = await fetch("http://localhost:5000/games",{
                   method:"POST",
                   headers: {"Content-Type": "application/json"},
                   body: JSON.stringify(body)
               });
   
               const result = await response.json();
               console.log(result);
               dispatch(updateGameList(result));
               return result;
           } catch (err) {
               console.error(err.message);
           }
     }

        
     const searchForLowDifGames =async (e) =>{
          e.preventDefault();
        
          const body = {
               "max_difficulty" : 2,
               "min_difficulty" : 1
            };

          const results = await fetchGames(body);
          if(results){
               window.location = "http://localhost:3000/store";
          }
     }
     const searchForMidDifGames = async (e) =>{
          e.preventDefault();
          const body = {
               "max_difficulty" : 3.4,
               "min_difficulty" : 2
            };

          const results = await fetchGames(body);
          if(results){
               window.location = "http://localhost:3000/store";
          }

     }
     const searchForHighDifGames = async (e) =>{
          e.preventDefault();
          const body = {
               "max_difficulty" : 5,
               "min_difficulty" : 3.4
            };

          const results = await fetchGames(body);
          if(results){
               window.location = "http://localhost:3000/store";
          }
     }

     useEffect( () =>{
          const { storeState } = { storeState: currentDisplayedGames };
          localStorage.setItem('storeState', storeState);
     });
    return(
            <main>
                <h2>Welcome to Games4Everyone</h2>
                <div id ="homePageIntro">
                    <p>At Games4Everyone we believe that board-games are a unique way of getting family and friends together.</p>
                    <p>When board games get brought up in discussion there's 2 extremes that come to mind, Monopoly and Dungeons and Dragons.
                         One is super casual (Monopoly) and the other is super deep.</p>
                    <p> We are here to show you that there is a middleground, where everyone from all ages can explore
                         and experience the vast amount of board games there are in the market.</p>
                </div>
                
               <div className="explorePromo">
                    <div className="explorePromoBox" id="casuals" >
                         <p>Monopoly wasn't created to be "fun", it was created to show the harm of monopolies,<br /> but it's easy to pick-up and easy to play,
                          how about we show you some alternatives?</p>
                         <button onClick = {searchForLowDifGames}>Games 4 Replacing Monopoly</button>
                    </div>
                    <div className="explorePromoBox" id="adventurers">
                         <p>You want board-games that have more depth to them?</p>
                         <button onClick = {searchForMidDifGames}>Games 4 Adventurers</button>
                    </div>
                    <div className="explorePromoBox" id="experts" >
                         <p>Do you enjoy reading 50 pages of rules, and spending hours if not days on a single game?</p>
                         <button onClick = {searchForHighDifGames}>Games 4 Experts</button>
                    </div>
                    
               </div>
                
            </main>
        
    );
}