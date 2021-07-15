import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom'; 
import {useSelector, useDispatch} from "react-redux";
import {selectCurrentGames, updateGameList} from "./storepageSlice";


export const Search = () =>{
    const dispatch = useDispatch();

    const onSubmitForm = async e =>{
        e.preventDefault();
        try {
            const body = {
                "name": e.target[0].value,
                "max_price": e.target[1].value,
                "min_price": e.target[2].value,
                "main_game_type": e.target[3].value,
                "secundary_game_type": e.target[4].value,
                "terciary_game_type" : e.target[5].value,
                "min_duration": e.target[6].value,
                "max_duration": e.target[7].value,
                "max_difficulty": e.target[8].value,
                "min_difficulty": e.target[9].value
            }

            console.log(JSON.stringify(body));
            const response = await fetch("http://localhost:5000/games",{
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });

            const result = await response.json();
            console.log(result);
            if(result !== "No Items Found"){
                dispatch(updateGameList(result));
            }
        } catch (err) {
            console.error(err.message);
        }

        
    }
    return(
        <div>
            <form id="searchfrm" onSubmit={onSubmitForm}>
                Name: <input type="search" placeholder="Search For A Game Name" id="nameSearch"></input>
                Max Price: <input type="search" placeholder="In Dollars"  id="maxPriceSearch"></input>
                Min Price: <input type="search" placeholder="In Dollars"  id="minPriceSearch"></input>
                Main Game Type: <input type="search" placeholder="Strategy, Card Game " id="mGTypeSearch"></input>
                Secundary Game Type: <input type="search" placeholder="Fighting, City Building" id="sGTypeSearch"></input>
                Terciary Game Type: <input type="search" placeholder="Manufacturing, Deduction" id="tGTypeSearch"></input>
                Min Duration: <input type="search" placeholder="In Minutes" id="minDurationSearch"></input>
                Max Duration: <input type="search" placeholder="In Minutes" id="maxDurationSearch"></input>
                Max Difficulty: <input type="search" placeholder="1 to 5, 5 being hard" id="maxDifficultySearch"></input>
                Min Difficulty: <input type="search" placeholder="1 to 5, 1 being easy" id="minDifficulty"></input>
                <button>Search</button>
            </form>
        </div>
    )
}