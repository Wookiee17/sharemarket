import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  userRole: undefined,
  user: null,
  loading: false,
  myaccount: false,
};

export const ShieldSlice = createSlice({
  name: "Shield",
  initialState,
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMyAccount: (state, action) => {
      state.myaccount = action.payload;
    },
  },
});

export const { setIsAuth, setUserRole, setUser, setLoading, setMyAccount } =
  ShieldSlice.actions;
  
export default ShieldSlice.reducer;
