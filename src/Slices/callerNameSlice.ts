import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    value: "",
};

export const CallerName = createSlice({
    name: "CallerName",
    initialState: initialState,
    reducers: {
        setCallerName: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setCallerName } = CallerName.actions;
export default CallerName.reducer;
