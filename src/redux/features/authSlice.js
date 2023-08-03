import { createSlice } from "@reduxjs/toolkit";

import { getUserFromCookie, logout } from "@/services/authService";

const initialState = {
    token: "",
    user: getUserFromCookie() || {}
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        logOutUser: (state) => {
            logout();
            state.user = {};
        }
    }
})

export const { setUser, logOutUser } = authSlice.actions;
export default authSlice.reducer;