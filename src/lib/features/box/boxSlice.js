// import { createSlice } from '@reduxjs/toolkit'

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  width: 100,
  height: 100,
  backgroundColor: "red",
  circle: "",
};

export const boxSlice = createSlice({
  name: "box",
  initialState,
  reducers: {
    increaseWidth: (state) => {
      state.width += 10;
    },
    increaseHeight: (state) => {
      state.height += 10;
    },
    ChangeColor: (state) => {
      state.backgroundColor = "blue";
    },
    ChangeCircle: (state) => {
      if (state.circle === "") {
        state.height = state.width;
        state.width = state.height;
        state.circle = "border-none rounded-full";
      } else {
        state.circle = "";
      }
    },
  },
});

export const { increaseHeight, increaseWidth, ChangeColor, ChangeCircle } =
  boxSlice.actions;

export default boxSlice.reducer;
