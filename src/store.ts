import { configureStore } from "@reduxjs/toolkit";
import receiverIdReducer from './Slices/receiverIdSlice';

const store = configureStore({
    reducer: {
        id: receiverIdReducer
    }
})

export type RootType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;