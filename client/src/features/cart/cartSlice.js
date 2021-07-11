import { createSlice } from "@reduxjs/toolkit"

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: []
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
        },

        updateCart: (state, action) =>{
            state.cart = action.payload;
        }
    },

})


export const selectCurrentCart = (state) => state.cart.cart;
export const {addToCart, removeFromCart, removeOneFromItem, updateCart} = cartSlice.actions;
export default cartSlice.reducer;