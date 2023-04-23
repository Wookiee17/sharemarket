import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  availableTheme: ["dark", "light"],
  theme: "dark",
  GlobalTabs: [
    {
      name: "Dashboard",
      link: "dashboard",
      userDefined: false,
    },
    {
      name: "Scanners",
      link: "scanners",
      userDefined: false,
    },
    {
      name: "Heatmap",
      link: "heatmap",
      userDefined: false,
    },
    {
      name: "Sentiment Indicators",
      link: "sentiment-indicators",
      userDefined: false,
    },
    {
      name: "Diffusion Indicators",
      link: "diffusion-indicators",
      userDefined: false,
    },
    {
      name: "FII/DII participant data",
      link: "participants-data",
      userDefined: false,
    },
    {
      name: "Stocks / Indices",
      link: "stocks-indices",
      userDefined: false,
    },
  ],
  latestNiftyStock: null,
  eodNiftyStock: null,
  holidays: [],
  indices: []
};

export const CommonSlice = createSlice({
  name: "Common",
  initialState,
  reducers: {
    setLatestNiftyStock: (state, action) => {
      state.latestNiftyStock = action.payload;
    },
    setEODNiftyStock: (state, action) => {
      state.eodNiftyStock = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    addUserDefineTab: (state, action) => {
      state.GlobalTabs = [...state.GlobalTabs, action.payload];
    },
    removeUserDefineTabs: (state, action) => {
      const index = action.payload;
      if (index > -1) {
        state.GlobalTabs.splice(index, 1);
      }
    },
    setHolidays: (state, action) => {
      state.holidays = action.payload;
    },
    setAllIndices: (state, action) => {
      state.indices = action.payload;
    },
  },
});

export const {
  setLatestNiftyStock,
  setEODNiftyStock,
  setTheme,
  addUserDefineTab,
  removeUserDefineTabs,
  setHolidays,
  setAllIndices
} = CommonSlice.actions;
export default CommonSlice.reducer;
