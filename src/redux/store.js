import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/authSlice"
import deliveryReducer from "./features/deliverySlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        delivery: deliveryReducer
    }
})