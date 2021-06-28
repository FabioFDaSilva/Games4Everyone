import { configureStore } from '@reduxjs/toolkit';
import currentUserReducer from '../features/currentUser/currentUserSlice';
import storepageReducer from '../features/storePage/storepageSlice';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    storepage: storepageReducer,
    cart: cartReducer
  },
});
