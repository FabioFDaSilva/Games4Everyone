import { createSlice } from "@reduxjs/toolkit"

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [
             {
                id: 0,
                gameName: "genericGame",
                price: 2,
                description: "this is a game",
                mainGameType: "strategy",
                secundaryGameType: "",
                terciaryGameType: "",
                duration: 60,
                quantity: 1
            },
            {
                id: 1,
                gameName: "genericGame1",
                price: 3,
                description: "this is a game1",
                mainGameType: "strategy",
                secundaryGameType: "tactical",
                terciaryGameType: "decadent",
                duration: 90,
                quantity: 1
            },
            {
                id: 2,
                gameName: "genericGame2",
                price: 4,
                description: "this is a game2",
                mainGameType: "strategy",
                secundaryGameType: "boring",
                terciaryGameType: "",
                duration: 180,
                quantity: 1
            }
            ]
    },
    reducers: {
        addToCart: (state, action) =>{
            let itemFound = false;
            for (let i = 0; i < state.cart.length; i++){
                if (state.cart[i].id === action.payload.id){
                    state.cart[i].quantity += 1;
                    itemFound = true;
                }
            }
            if(!itemFound){
                let newItem = {...action.payload};
                newItem.quantity = 1;
                state.cart.push(newItem);
            }
            
        },
        removeFromCart: (state,action) =>{
            const thisCart = state.cart.filter(item => item.id !== action.payload.id);
            state.cart = thisCart;
        },

        removeOneFromItem: (state, action) =>{
            for (let i = 0; i <state.cart.length; i++){
                if (state.cart[i].id === action.payload.id){
                    state.cart[i].quantity -= 1;
                }
            }
        }
    },

})


export const selectCurrentCart = (state) => state.cart.cart;
export const {addToCart, removeFromCart, removeOneFromItem} = cartSlice.actions;
export default cartSlice.reducer;