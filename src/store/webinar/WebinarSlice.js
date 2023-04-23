import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeWebinarTab: 0,
  webinarTabs: [
    {
      id: 0,
      name: "All",
      slug: "all",
    },
    {
      id: 1,
      name: "Market Mornings",
      slug: "Market Mornings",
    },
    {
      id: 2,
      name: "Technical Talks",
      slug: "Technical Talks",
    },
  ],
};

export const WebinarSlice = createSlice({
  name: "Webinar",
  initialState,
  reducers: {
    setActiveWebinarTab: (state, action) => {
      state.activeWebinarTab = action.payload;
    },
  },
});

export const { setActiveWebinarTab } = WebinarSlice.actions;
export default WebinarSlice.reducer;
