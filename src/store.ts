import { configureStore } from "@reduxjs/toolkit";
import receiverIdReducer from './Slices/receiverIdSlice';
import refreshUsersReducer from './Slices/refreshUsers';
import CallerNameReducer from './Slices/callerNameSlice';
import isProfileUpdatedReducer from './Slices/isProfileUpdated.ts'



const store = configureStore({
    reducer: {
        id: receiverIdReducer,
        CallerName: CallerNameReducer,
        refreshUsers: refreshUsersReducer,
        isProfileUpdated: isProfileUpdatedReducer
    }
})

export type RootType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;