import { createSlice } from "@reduxjs/toolkit"

export const currentUserSlice = createSlice({
    name: "currentUser",
    initialState: {
        currentUser: {
            "user": {
                id: 1,
                username: "Guest",
            }
        }
    },
    reducers: {
        login: (state, action) => {
            try {
                state.currentUser.user.id = action.payload.id;
                state.currentUser.user.username = action.payload.username;
            } catch (err) {
                console.error(err.message);
            }

        },
        logout: (state, action) => {
            state.currentUser.user = { id: 1, userName: "Guest" };
        }
    },

})

export const selectCurrentUser = (state) => state.currentUser.currentUser;
export const { login, logout } = currentUserSlice.actions;
export default currentUserSlice.reducer;