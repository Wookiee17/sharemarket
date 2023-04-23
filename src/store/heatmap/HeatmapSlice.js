import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeSidebarHeatMap: "",
  activeTab: 0,
  tabs: [
    {
      id: 0,
      name: "NSE Indices",
      slug: "nse",
    },
    {
      id: 1,
      name: "FnO",
      slug: "fno",
    },
    {
      id: 2,
      name: "Advance Decline Ratio - Intraday",
      slug: "advance-decline-ratio",
    },
  ],
};

export const HeatmapSlice = createSlice({
  name: "Heatmap",
  initialState,
  reducers: {
    setActiveSidebarHeatMap: (state, action) => {
      state.activeSidebarHeatMap = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveSidebarHeatMap, setActiveTab } = HeatmapSlice.actions;
export default HeatmapSlice.reducer;
