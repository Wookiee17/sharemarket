import { createSlice } from "@reduxjs/toolkit";
import { AiOutlineFolder, AiOutlineCalendar } from "react-icons/ai";
import { IoFileTrayFullOutline } from "react-icons/io5";
import { VscProject } from "react-icons/vsc";

const initialState = {
  selectedNews: null,
  sidebarOpen: false,
  selectedAnnouncement: null,
  newsSearchText: "",
  newsSorting: "asc",
  activeTab1: 0,
  activeTab: 0,
  tabs: [
    {
      id: 0,
      name: "info",
      icon: <IoFileTrayFullOutline />,
      slug: "info",
    },
    {
      id: 1,
      name: "Stocks",
      icon: <AiOutlineFolder />,
      slug: "stocks",
    },
    {
      id: 2,
      name: "ipo",
      icon: <VscProject />,
      slug: "ipo",
    },
    {
      id: 3,
      name: "Calendar",
      icon: <AiOutlineCalendar />,
      slug: "calendar",
    },
  ],
  activeInfoTab: 0,
  activeStocksTab: 0,
  activeIPOTab: 0,
  activeCalendarInnerTab: 0,
  innerTabs: [
    {
      tab: 0,
      tabs: [
        {
          id: 0,
          name: "News",
          slug: "news",
        },
        {
          id: 1,
          name: "Announcements",
          slug: "announcements",
        },
        {
          id: 2,
          name: "Corporate Actions",
          slug: "corporate-actions",
        },
        {
          id: 3,
          name: "Insider Trading",
          slug: "insider-trading",
        },
      ],
    },
    {
      tab: 1,
      tabs: [
        {
          id: 0,
          name: "Overview",
          slug: "overview",
        },
        {
          id: 1,
          name: "Charts",
          slug: "charts",
        },
        {
          id: 2,
          name: "IC Report",
          slug: "ic-report",
        },
        {
          id: 3,
          name: "Fundamental",
          slug: "fundamental",
        },
        {
          id: 4,
          name: "Technical",
          slug: "technical",
        },
        {
          id: 5,
          name: "Volume & Delivery",
          slug: "volume-delivery",
        },
        {
          id: 6,
          name: "Futures",
          slug: "futures",
        },
        {
          id: 7,
          name: "Options",
          slug: "options",
        },
        {
          id: 8,
          name: "Peer Comparison",
          slug: "peer-comparison",
        },
        {
          id: 9,
          name: "Corporate Action",
          slug: "corporate-action",
        },
      ],
    },
    {
      tab: 2,
      tabs: [
        {
          id: 0,
          name: "Upcoming",
          slug: "upcoming",
        },
        {
          id: 1,
          name: "Ongoing",
          slug: "ongoing",
        },
        {
          id: 2,
          name: "IPO Performance",
          slug: "performance",
        },
      ],
    },
    {
      tab: 3,
      tabs: [
        {
          id: 0,
          name: "Results",
          slug: "results",
        },
        {
          id: 1,
          name: "Webinars",
          slug: "webinars",
        },
        {
          id: 2,
          name: "STRIKE Release",
          slug: "strike-release",
        },
        {
          id: 3,
          name: "My Tickets",
          slug: "my-tickets",
        },
      ],
    },
  ],
  activeCalendarTab: 0,
  calendarTab: [
    {
      id: 0,
      name: "Week",
      slug: "week",
    },
    {
      id: 1,
      name: "Day",
      slug: "day",
    },
  ],
};

export const StockIndices = createSlice({
  name: "StockIndices",
  initialState,
  reducers: {
    setSelectedAnnouncement: (state, action) => {
      state.selectedAnnouncement = action.payload;
    },
    setSelectedNews: (state, action) => {
      state.selectedNews = action.payload;
    },
    onChangeNewsSearch: (state, action) => {
      state.newsSearchText = action.payload;
    },
    onChangeNewsSorting: (state, action) => {
      state.newsSorting = action.payload;
    },
    onChangeActiveTab1: (state, action) => {
      state.activeTab1 = action.payload;
      state.selectedAnnouncement = null;
      state.selectedNews = null;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setActiveCalendarInnerTab: (state, action) => {
      state.activeCalendarInnerTab = action.payload;
    },
    setActiveIPOTab: (state, action) => {
      state.activeIPOTab = action.payload;
    },
    setActiveStocksTab: (state, action) => {
      state.activeStocksTab = action.payload;
    },
    setActiveInfoTab: (state, action) => {
      state.activeInfoTab = action.payload;
    },
    setActiveCalendarTab: (state, action) => {
      state.activeCalendarTab = action.payload;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const {
  setSelectedNews,
  setSelectedAnnouncement,
  onChangeNewsSearch,
  onChangeNewsSorting,
  onChangeActiveTab1,
  setActiveCalendarTab,
  setActiveTab,
  setActiveCalendarInnerTab,
  setActiveIPOTab,
  setActiveStocksTab,
  setActiveInfoTab,
  setSidebarOpen,
} = StockIndices.actions;
export default StockIndices.reducer;
