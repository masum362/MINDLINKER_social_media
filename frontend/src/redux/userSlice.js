import { createSlice } from "@reduxjs/toolkit";
import { user } from "../assets/data";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("user")) ?? {},
  edit: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser(state, actions) {
      state.user = actions.payload;
      localStorage.setItem("user", JSON.stringify(actions.payload));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
    updateUser(state, actions) {
      state.edit = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {loginUser,logout,updateUser} = userSlice.actions;

export default userSlice.reducer;
