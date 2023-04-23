import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeDashboardScreen: null,
  dashboardScreens: [
    {
      id: 1,
      name: "MARKET OVERVIEW",
      slug: "market-overview",
    },
    {
      id: 2,
      name: "ADVANCE DECLINE",
      slug: "advance-decline",
    },
    {
      id: 3,
      name: "OPTIONS",
      slug: "options",
    },
    {
      id: 4,
      name: "FUTURE ACTIVITY",
      slug: "future-activity",
    },
  ],
};

export const DashboardSlice = createSlice({
  name: "Dashboard",
  initialState,
  reducers: {
    setActiveDashboardScreen: (state, action) => {
      state.activeDashboardScreen = action.payload;
    },
  },
});

export const { setActiveDashboardScreen } = DashboardSlice.actions;
export default DashboardSlice.reducer;
