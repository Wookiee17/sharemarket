import React, { createRef, useState } from "react";
import moment from "moment";
// icons
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActiveCalendarTab } from "../../../../../../store/stockIndices/StockIndicesSlice";
import { handleChangeDate } from "../../../../../../store/calendar/CalendarSlice";

// component
import VirtualCalendar from "./VirtualCalendar";

const CalendarLayout = ({ page }) => {
  const theme = useSelector((state) => state.Common.theme);
  const calendarTab = useSelector((state) => state.StockIndices.calendarTab);
  const calendarActiveTab = useSelector(
    (state) => state.StockIndices.activeCalendarTab
  );
  const { selectedDate } = useSelector((state) => state.Calendar);

  const dispatch = useDispatch();
  const ref = createRef();
  const handlePrevNext = (action) => {
    if (action === "prev") {
      dispatch(
        handleChangeDate(
          moment(selectedDate).subtract(calendarActiveTab === 0 ? 7 : 1, "d")
        )
      );
    } else if (action === "next") {
      dispatch(
        handleChangeDate(
          moment(selectedDate).add(calendarActiveTab === 0 ? 7 : 1, "d")
        )
      );
    }
  };
  return (
    <div className="calendarRight">
      <div className="calendarRight-top">
        <div className="today calendarRight-top_item">
          <div
            className={`calendarRight-top_tabs ${theme}`}
            onClick={() => {
              dispatch(handleChangeDate(moment()));
            }}
          >
            <div className={`calendarRight-top_tabs-item`}>Today</div>
          </div>
        </div>
        <div className="navigation calendarRight-top_item">
          <div
            className="navigation-item"
            onClick={() => handlePrevNext("prev")}
          >
            <FiChevronLeft />
          </div>
          <div
            className="navigation-item"
            onClick={() => handlePrevNext("next")}
          >
            <FiChevronRight />
          </div>
        </div>
        <div className="date calendarRight-top_item">
          {moment(selectedDate).format("DD MMMM YYYY")}
        </div>
        <div className="switch calendarRight-top_item">
          <div className={`calendarRight-top_tabs ${theme}`}>
            {calendarTab.map((item, i) => (
              <div
                className={`calendarRight-top_tabs-item ${
                  calendarActiveTab == i && "focused"
                } `}
                onClick={() => {
                  dispatch(setActiveCalendarTab(i));
                }}
                key={i}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="calendarRight-bottom" ref={ref}>
        <VirtualCalendar parent={ref} page={page} />
      </div>
    </div>
  );
};

export default CalendarLayout;
