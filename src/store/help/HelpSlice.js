import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeHelpTab: 0,
  HelpTabs: [
    {
      id: 0,
      name: "Demo Video",
      slug: "demo-video",
    },
    {
      id: 1,
      name: "Raise a Ticket",
      slug: "raise-ticket",
    },
    {
      id: 2,
      name: "System Update",
      slug: "system-update",
    },
  ],
  activeRaiseTicketTabs: 0,
  raiseTicketTabs: [
    {
      id: 0,
      name: "All",
      slug: "all-ticket",
      color: null,
    },
    {
      id: 1,
      name: "Open",
      slug: "open-ticket",
      color: "blue",
    },
    {
      id: 2,
      name: "In Progress",
      slug: "in-progress-ticket",
      color: "green",
    },
    {
      id: 3,
      name: "Resolved",
      slug: "resolved-ticket",
      color: "pink",
    },
    {
      id: 4,
      name: "Not Viable",
      slug: "not-viable-ticket",
      color: "red",
    },
  ],
};

export const HelpSlice = createSlice({
  name: "Help",
  initialState,
  reducers: {
    setActiveHelpTab: (state, action) => {
      state.activeHelpTab = action.payload;
    },
    setActiveRaiseTicketTabs: (state, action) => {
      state.activeRaiseTicketTabs = action.payload;
    },
  },
});

export const { setActiveHelpTab, setActiveRaiseTicketTabs } = HelpSlice.actions;
export default HelpSlice.reducer;
