import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeSidebarLevel1: 0,
  activeSidebarLevel2: 0,
  tableHeader: [
    {
      headerName: "Name",
      field: "name",
      filter: true,
      minWidth: 40,
      width: "270%",
    },
    {
      headerName: "CMP",
      field: "cmp",
      filter: true,
      minWidth: 40,
      width: "150%",
    },
    {
      headerName: "Change",
      field: "change",
      filter: true,
      minWidth: 40,
      width: "150%",
    },
    {
      headerName: "Volume",
      field: "volume",
      filter: true,
      minWidth: 40,
      width: "150%",
    },
  ],
  tableData: [
    {
      id: 1,
      name: "Reliance",
      cmp: "1500(+150)",
      change: "+10%",
      volume: "2.3M",
    },
    {
      id: 2,
      name: "TCS",
      cmp: "3200(-320)",
      change: "-10%",
      volume: "1.2M",
    },
    {
      id: 3,
      name: "Amazon.com",
      cmp: "1500(+150)",
      change: "+10%",
      volume: "2.3M",
    },
    {
      id: 4,
      name: "Reliance",
      cmp: "1500(+150)",
      change: "+10%",
      volume: "2.3M",
    },
    {
      id: 5,
      name: "TCS",
      cmp: "3200(-320)",
      change: "-10%",
      volume: "1.2M",
    },
    {
      id: 6,
      name: "Amazon.com",
      cmp: "1500(+150)",
      change: "+10%",
      volume: "2.3M",
    },
    {
      id: 7,
      name: "Reliance",
      cmp: "1500(+150)",
      change: "+10%",
      volume: "2.3M",
    },
    {
      id: 8,
      name: "TCS",
      cmp: "3200(-320)",
      change: "-10%",
      volume: "1.2M",
    },
    {
      id: 9,
      name: "Amazon.com",
      cmp: "1500(+150)",
      change: "+10%",
      volume: "2.3M",
    },
    {
      id: 10,
      name: "Reliance",
      cmp: "1500(+150)",
      change: "+10%",
      volume: "2.3M",
    },
    {
      id: 11,
      name: "TCS",
      cmp: "3200(-320)",
      change: "-10%",
      volume: "1.2M",
    },
    {
      id: 12,
      name: "Amazon.com",
      cmp: "1500(+150)",
      change: "+10%",
      volume: "2.3M",
    },
  ],
  activeTableData: null,
  tradingChartData: null,
};

export const MarketOverviewSlice = createSlice({
  name: "MarketOverview",
  initialState,
  reducers: {
    setActiveSidebarLevel1: (state, action) => {
      state.activeSidebarLevel1 = action.payload;
    },
    setActiveSidebarLevel2: (state, action) => {
      state.activeSidebarLevel2 = action.payload;
    },
    setTableHeader: (state, action) => {
      state.tableHeader = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setActiveTableData: (state, action) => {
      state.activeTableData = action.payload;
    },
    setTradingChartData: (state, action) => {
      state.tradingChartData = action.payload;
    },
  },
});

export const {
  setActiveSidebarLevel1,
  setActiveSidebarLevel2,
  setTableHeader,
  setTableData,
  setActiveTableData,
  setTradingChartData,
} = MarketOverviewSlice.actions;
export default MarketOverviewSlice.reducer;
