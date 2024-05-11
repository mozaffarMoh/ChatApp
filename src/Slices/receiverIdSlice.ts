import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    value: "",
};

export const receiverId = createSlice({
    name: "receiverId",
    initialState: initialState,
    reducers: {
        setReceiverId: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setReceiverId } = receiverId.actions;
export default receiverId.reducer;
