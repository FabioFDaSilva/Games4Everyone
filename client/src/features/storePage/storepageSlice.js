import { createSlice } from "@reduxjs/toolkit"

export const storepageSlice = createSlice({
    name: "storepage",
    initialState: {
        storepage: [
            /*
            {
               id: 0,
               name: "genericGame",
               price: 2,
               description: "this is a game",
               mainGameType: "strategy",
               secundaryGameType: "",
               terciaryGameType: "",
               duration: 60,
               array_imgURL: ["imageURL0", "imageURL1"],
               quantity: 1
           },
           {
               id: 1,
               name: "genericGame1",
               price: 3,
               description: "this is a game1",
               mainGameType: "strategy",
               secundaryGameType: "tactical",
               terciaryGameType: "decadent",
               duration: 90,
               array_imgURL: ["imageURL0", "imageURL1"],
               quantity: 1
           },
           {
               id: 2,
               name: "genericGame2",
               price: 4,
               description: "this is a game2",
               mainGameType: "strategy",
               secundaryGameType: "boring",
               terciaryGameType: "",
               duration: 180,
               array_imgURL: ["imageURL0", "imageURL1"],
               quantity: 1
           }*/
           ]
           
    },
    reducers: {
        updateGameList: (state, action) =>{
            state.storepage = action.payload;
        }
    },

})

export const selectCurrentGames = (state) => state.storepage.storepage;
export const {updateGameList} = storepageSlice.actions;
export default storepageSlice.reducer;