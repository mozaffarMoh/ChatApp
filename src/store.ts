import { configureStore } from "@reduxjs/toolkit";
import receiverIdReducer from './Slices/receiverIdSlice';
import refreshUsersReducer from './Slices/refreshUsers';

const store = configureStore({
    reducer: {
        id: receiverIdReducer,
        refreshUsers: refreshUsersReducer
    }
})

export type RootType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;