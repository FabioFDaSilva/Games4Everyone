import { createSlice } from "@reduxjs/toolkit"

export const currentUserSlice = createSlice({
    name: "currentUser",
    initialState: {
        currentUser: {
            "user": {
                id: "1",
                username: "Guest",
            }
        }
    },
    reducers: {
        login: (state, action) => {
            state.currentUser.user = action.payload;
        },
        logout: (state, action) => {
            state.currentUser.user = { id: "", userName: "Guest" };
        }
    },

})

export const selectCurrentUser = (state) => state.currentUser.currentUser;
export const {login, logout} = currentUserSlice.actions;
export default currentUserSlice.reducer;