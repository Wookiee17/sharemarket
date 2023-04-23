import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeParticipantsDataTab: 0,
  activeParticipantsDataScreen: 0,
  ParticipantsDataTabs: [
    {
      id: 0,
      name: "Cash Market",
      slug: "cash-market",
    },
    {
      id: 1,
      name: "Derivatives",
      slug: "derivatives",
    },
  ],
  ParticipantsDataScreens: [
    {
      id: 0,
      tabSlug: 'cash-market',
      name: "FII",
      slug: "fii",
    },
    {
      id: 1,
      tabSlug: 'cash-market',
      name: "DII",
      slug: "dii",
    },
  ],
};

export const ParticipantsDataSlice = createSlice({
  name: "ParticipantsData",
  initialState,
  reducers: {
    setActiveParticipantsDataTab: (state, action) => {
      state.activeParticipantsDataTab = action.payload;
    },
    setActiveParticipantsDataScreen: (state, action) => {
      state.activeParticipantsDataScreen = action.payload;
    },
  },
});

export const { setActiveParticipantsDataScreen, setActiveParticipantsDataTab } =
  ParticipantsDataSlice.actions;
export default ParticipantsDataSlice.reducer;
