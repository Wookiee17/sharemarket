import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import _ from "lodash";
// icon
import { FiArrowRight, FiBell, FiShare2 } from "react-icons/fi";

//
import { Grid } from "react-virtualized";
import AutoSizer from "react-virtualized-auto-sizer";
//
import VirtualCalendarModal from "./VirtualCalendarWebinarModal";

// redux
import { useSelector, useDispatch } from "react-redux";
import { handleSetCellData } from "../../../../../../store/calendar/CalendarSlice";
import { setActiveCalendarTab } from "../../../../../../store/stockIndices/StockIndicesSlice";

import dayjs from "dayjs";

const VirtualCalendar = ({ parent, page }) => {
  const timeFun = (idx, format) => {
    return dayjs("2022-01-01")
      .add(idx * 30, "minutes")
      .format(format);
  };

  const dispatch = useDispatch();
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const ref = useRef();
  const theme = useSelector((state) => state.Common.theme);

  const { daterange, systemUpdates, webinars, myTickets, results } =
    useSelector((state) => state.Calendar);
  const calendarActiveTab = useSelector(
    (state) => state.StockIndices.activeCalendarTab
  );

  const handleClickCellItem = (item) => {
    if (page === "myTickets") {
      router.push({
        pathname: "/help/raise-ticket",
        query: {
          id: item.payload?.id,
        },
      });
    } else if (page === "systemUpdates") {
      router.push({
        pathname: "/help/system-update",
      });
    } else if (page === "webinars") {
      dispatch(handleSetCellData(item));
      setModal(true);
    }
  };

  const getCellValue = (date, rowIndex) => {
    //results
    if (page === "results") {
      const _calendarDataFiltered = calendarData.filter(
        (cd) => cd?.date === dayjs(date)?.format("YYYY-MM-DD")
      );
      if (_calendarDataFiltered.length) {
        return _calendarDataFiltered[rowIndex];
      } else {
        return null;
      }
    } else {
      if (calendarActiveTab === 0) {
        const _calendarDataFiltered = calendarData.filter(
          //
          (cd) =>
            cd?.date === date?.format("YYYY-MM-DD") &&
            dayjs(cd?.payload?.created_at).format("HH:mm:a") <
              timeFun(rowIndex + 1, "HH:mm a") &&
            dayjs(cd?.payload?.created_at).format("HH:mm:a") >
              timeFun(rowIndex, "HH:mm a")
          //
        );
        if (_calendarDataFiltered.length) {
          return _calendarDataFiltered;
        } else {
          return null;
        }
      } else if (calendarActiveTab === 1) {
        const _calendarDataFiltered = calendarData.filter(
          (cd) => cd?.date === date?.format("YYYY-MM-DD")
        );
        if (_calendarDataFiltered.length) {
          return _calendarDataFiltered[rowIndex];
        } else {
          return null;
        }
      }
    }
  };

  //cell render

  const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    //
    const _date = daterange[columnIndex - 1];
    const _cellValue = getCellValue(_date, rowIndex - 1);

    // debugger;
    if (rowIndex == 0 && columnIndex == 0) {
      return <div className="VirtualCalendar_sl" style={style} key={key}></div>;
    } else if (rowIndex == 0) {
      return (
        <div className="VirtualCalendar_dates" style={style} key={key}>
          <div className="VirtualCalendar_dates-top">
            <h4>{_date.format("DD MMMM")}</h4>
            {_date.isSame(new Date(), "day") && <span>Today</span>}
          </div>
          <div className="VirtualCalendar_dates-bottom">
            {_date.format("ddd")}
          </div>
        </div>
      );
    } else if (columnIndex == 0) {
      if (page === "results") {
        return (
          <div className="VirtualCalendar_sl" style={style} key={key}>
            {rowIndex}
          </div>
        );
      } else if (calendarActiveTab === 0) {
        return (
          <div className="VirtualCalendar_sl" style={style} key={key}>
            {timeFun(rowIndex - 1, "hh:mm a")}
          </div>
        );
      } else if (calendarActiveTab === 1) {
        return (
          <div className="VirtualCalendar_sl" style={style} key={key}>
            {calendarData?.length >= rowIndex
              ? dayjs(calendarData?.[rowIndex - 1]?.payload?.created_at).format(
                  "hh:mm a"
                )
              : ""}
          </div>
        );
      }
    } else {
      if (_cellValue) {
        return (
          <div
            className={`VirtualCalendar_cell ${
              calendarActiveTab == 0 ? "week" : "day"
            }`}
            style={style}
            key={key}
          >
            {calendarActiveTab == 0 ? (
              page === "results" ? (
                <>
                  <div
                    className={`VirtualCalendar_cell-inner ${
                      page === "results" && "results"
                    } `}
                    onClick={() => handleClickCellItem(_cellValue)}
                  >
                    <div className="VirtualCalendar_cell-top">
                      <h4
                        className={`${
                          page == "systemUpdates" && "wrappedTextSmall"
                        }`}
                      >
                        {_cellValue.title}
                      </h4>
                      <span>
                        <FiArrowRight />
                      </span>
                    </div>
                    {page !== "systemUpdates" && (
                      <div className="VirtualCalendar_cell-bottom">
                        {_cellValue.subTitle}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {_cellValue
                    ?.filter((item, idx) =>
                      page === "results" ? item : idx < 2
                    )
                    ?.map((i) => (
                      <>
                        <div
                          className={`VirtualCalendar_cell-inner ${
                            page === "results" && "results"
                          } `}
                          onClick={() => handleClickCellItem(i)}
                        >
                          <div className="VirtualCalendar_cell-top">
                            <h4
                              className={`${
                                page == "systemUpdates" && "wrappedTextSmall"
                              }`}
                            >
                              {i.title}
                            </h4>
                            <span>
                              <FiArrowRight />
                            </span>
                          </div>
                          {page !== "systemUpdates" && (
                            <div className="VirtualCalendar_cell-bottom">
                              {page === "myTickets"
                                ? i?.payload?.category
                                : i.subTitle}
                            </div>
                          )}
                        </div>
                      </>
                    ))}
                  <div onClick={() => dispatch(setActiveCalendarTab(1))}>
                    {_cellValue?.length > 2 && `+${_cellValue?.length - 2}more`}
                  </div>
                </>
              )
            ) : (
              <div
                className="VirtualCalendar_cell-inner flex"
                key={key}
                onClick={() => handleClickCellItem(_cellValue)}
              >
                {page !== "systemUpdates" && (
                  <div className="left">
                    <div className="VirtualCalendar_cell-top">
                      <h4>{_cellValue.subTitle}</h4>
                    </div>
                    <div className="VirtualCalendar_cell-bottom">
                      {_cellValue?.payload?.descriptions}
                    </div>
                  </div>
                )}
                <div className="middle">
                  <p>{_cellValue?.title}</p>
                </div>
                <div className="right">
                  <div className="item">
                    <FiBell />
                  </div>
                  <div className="item">
                    <FiShare2 />
                  </div>
                  <div
                    className="btn"
                    onClick={() => handleClickCellItem(_cellValue)}
                  >
                    <span> See More</span> <FiArrowRight />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div className={`VirtualCalendar_cell`} style={style} key={key} />
        );
      }
    }
  };

  //
  useEffect(() => {
    if (page === "systemUpdates") {
      setCalendarData(systemUpdates);
    } else if (page === "webinars") {
      setCalendarData(webinars);
    } else if (page === "myTickets") {
      setCalendarData(myTickets);
    } else if (page === "results") {
      setCalendarData(results);
    }
  }, [page, systemUpdates, webinars, myTickets, results]);

  //row count
  const rowCount = useMemo(() => {
    if (calendarData?.length > 0) {
      const grouped = _.groupBy(calendarData, (item) => item.date);
      let total = 0;
      for (const [key, value] of Object.entries(grouped)) {
        if (value.length > total) {
          total = value.length;
        }
      }
      if (calendarActiveTab === 1) {
        return total < 10 ? 10 : total;
      } else {
        return page === "results" ? total : 49;
      }
    } else {
      return page !== "results" ? 49 : 10;
    }
  }, [calendarData, calendarActiveTab]);

  return (
    <div className={`VirtualCalendar ${theme}`}>
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            cellRenderer={cellRenderer}
            columnCount={calendarActiveTab == 0 ? daterange.length : 2}
            columnWidth={(item, i) =>
              calendarActiveTab == 0
                ? item.index == 0
                  ? 100
                  : (width - 55) / 7
                : item.index == 0
                ? 50
                : width - 55
            }
            height={height}
            rowCount={rowCount}
            rowHeight={(item, i) =>
              calendarActiveTab === 0
                ? item.index == 0
                  ? 55
                  : 95
                : item.index == 0
                ? 55
                : 50
            }
            width={width}
            key={`${daterange[0]}_${calendarData?.length}_${calendarActiveTab}`}
          />
        )}
      </AutoSizer>
      {modal && <VirtualCalendarModal close={() => setModal(false)} />}
    </div>
  );
};

export default VirtualCalendar;
