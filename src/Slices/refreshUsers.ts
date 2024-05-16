import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    value: false,
};

export const refreshUsers = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setRefreshUsers: (state, action) => {
            state.value = action.payload;
            setTimeout(() => {
                setRefreshUsers(false)
            }, 1000);
        },
    },
});

export const { setRefreshUsers } = refreshUsers.actions;
export default refreshUsers.reducer;
