import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { createSlice } from "@reduxjs/toolkit";

const moment = extendMoment(Moment);
const start = moment();
const end = moment().add(7, 'days');
const range = moment.range(start, end);
const daterange = Array.from(range.by('day'));
const initialState = {
  daterange,
  modal_open: false,
  selectedDate: new Date(),
  selectedCellData: null,
  webinars: [],
  results: [],
  systemUpdates: [],
  myTickets: [],
};

export const CalendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    handleSetGridFilters(state, action) {
      const start = moment(action.payload.date);
      const end = moment(action.payload.date).add(action.payload.time, action.payload.timeUnit);
      const range = moment.range(start, end);
      const daterange = Array.from(range.by('day'));
      return { ...state, gridFilters: action.payload, daterange: [...daterange] };
    },
    handleChangeDate(state, action) {
      const start = moment(action.payload);
      const end = moment(action.payload).add(7, 'days');
      const range = moment.range(start, end);
      const daterange = Array.from(range.by('day'));
      return { ...state, selectedDate: action.payload, daterange };
    },
    handleChangeData(state, action) {
      return { ...state, [action.payload.key]: action.payload.value };
    },
    handleSetCellData(state, action) {
      return { ...state, selectedCellData: action.payload };
    }
  }
});

export const calendarState = (state) => state.calendar;
export const { 
  handleSetGridFilters, 
  handleChangeDate, 
  handleChangeData,
  handleSetCellData
} = CalendarSlice.actions
export default CalendarSlice.reducer;