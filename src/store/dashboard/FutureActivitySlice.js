import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tabs: [
    {
      id: 0,
      name: "Long Built Up",
      conditions: { open_interest: "desc", high_price: "desc" },
    },
    {
      id: 1,
      name: "Short Built Up",
      conditions: { open_interest: "asc", high_price: "asc" },
    },
    {
      id: 2,
      name: "Short Covering",
      conditions: { open_interest: "desc", high_price: "asc" },
    },
    {
      id: 3,
      name: "Long Unwinding",
      conditions: { open_interest: "asc", high_price: "desc" },
    },
  ],
  activeTab: {
    id: 0,
    name: "Long Built Up",
    conditions: { open_interest: "desc", high_price: "desc" },
  },
};

export const FutureActivitySlice = createSlice({
  name: "FutureActivity",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = FutureActivitySlice.actions;
export default FutureActivitySlice.reducer;
