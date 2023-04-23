import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTable: 10,
  selectedTableName: "Near 52 Week High/Low",
  candleStickPattern: null,
  patterns: []
};

export const ScannersSlice = createSlice({
  name: "Scanners",
  initialState,
  reducers: {
    setSelectedTable: (state, action) => {
      state.selectedTable = action.payload.id;
      state.selectedTableName = action.payload.title
    },
    setCandleStickPattern: (state, action) => {
      state.candleStickPattern = action.payload.candleStickPattern;
      state.patterns = action.payload.patterns;
    }
  },
});

export const { 
  setSelectedTable, 
  setCandleStickPattern, 
} = ScannersSlice.actions;
export default ScannersSlice.reducer;
