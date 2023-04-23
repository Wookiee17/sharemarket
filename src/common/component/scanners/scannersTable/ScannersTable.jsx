import React, { useRef, useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";

// icon
import { FiX } from "react-icons/fi";

//constants
import { SCANNERS_MARKETCAP_OPTIONS } from "../../../constants/data";
import {
  marketCapZeroTo500cr,
  marketCap500To2500cr,
  marketCap2500To10kcr,
  marketCap10kTo25kcr,
  marketCap25kcrAbove,
  marketCapAll,
} from "./filters";

//custom-hooks
import { useCandleStickScanner } from "./hooks";
import { usePriceScanners } from "./hooks/priceScanners";

//table-headers
import { tableHeaders } from "./TableHeaders";

import { useQuery } from "@apollo/client/react";

import {
  GET_SWING_HIGH_LOW,
  GET_VIEW_ROHIT_SCANNERS_EOD,
  GET_DOW_TREND_SCANNER,
  GET_ROHIT_SCANNERS_EOD,
  GET_ROHIT_SCANNER_TEMP,
} from "../../../../gql/queries";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setTradingChartData } from "../../../../store/dashboard/MarketOverviewSlice";
import { setCandleStickPattern } from "../../../../store/scanners/ScannersSlice";

import ScannersFilter from "../scannersFilter/ScannersFilter";

const ScannersTable = () => {
  const latestNifty = useSelector((state) => state?.Common?.latestNiftyStock);
  const latestNiftyDate = dayjs(latestNifty?.created_at).format("YYYY-MM-DD");

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Common.theme);
  const gridRef = useRef(null);

  const [activeDate, setActiveDate] = useState(latestNiftyDate);

  const [activeType, setActiveType] = useState("high");

  const [marketCap, setMarketCap] = useState([0]);

  const { selectedTable, selectedTableName } = useSelector(
    (state) => state.Scanners
  );

  const [tableData, setTableData] = useState([]);

  const [selectedPatterns, setSelectedPatterns] = useState([]);

  const [indicesOptions, setIndicesOptions] = useState([
    { label: "All Indices", value: 0 },
  ]);

  const [selectedIndicesIds, setSelectedIndicesIds] = useState([0]);

  const [timeFrame, setTimeFrame] = useState("Daily");
  //

  const SelectedIndicesLabel = selectedIndicesIds?.map((i) => {
    const filterarr = indicesOptions?.filter((ix) => ix?.value === i)?.[0]
      ?.label;
    const res = filterarr;
    return res;
  });

  const [filterArr, setFilterArr] = useState([
    ...SelectedIndicesLabel,
    ...marketCap?.map((i) => SCANNERS_MARKETCAP_OPTIONS[i]?.label),
    [10, 11, 12, 13].includes(selectedTable) &&
      (activeType === "high"
        ? `${selectedTable === 13 ? "Gap up" : "52 Week high"}`
        : `${selectedTable === 13 ? "Gap down" : "52 Week low"}`),
    [40, 41, 42, 42].includes(selectedTable) && timeFrame,
  ]);

  useEffect(() => {
    setFilterArr([
      ...SelectedIndicesLabel,
      ...marketCap?.map((i) => SCANNERS_MARKETCAP_OPTIONS[i]?.label),
      [10, 11, 12, 13].includes(selectedTable) &&
        (activeType === "high"
          ? `${selectedTable === 13 ? "Gap up" : "52 Week high"}`
          : `${selectedTable === 13 ? "Gap down" : "52 Week low"}`),
      [40, 41, 42, 42].includes(selectedTable) && timeFrame,
    ]);
  }, [marketCap, activeType, selectedTable, selectedIndicesIds, timeFrame]);

  const allIndices = indicesOptions
    ?.filter((i) => i?.value !== 0)
    ?.map((i) => i?.value);

  //===========================//

  const filter = [
    ...(marketCap?.map((i) => i)?.includes(1) ? marketCapZeroTo500cr : []),
    ...(marketCap?.map((i) => i)?.includes(2) ? marketCap500To2500cr : []),
    ...(marketCap?.map((i) => i)?.includes(3) ? marketCap2500To10kcr : []),
    ...(marketCap?.map((i) => i)?.includes(4) ? marketCap10kTo25kcr : []),
    ...(marketCap?.map((i) => i)?.includes(5) ? marketCap25kcrAbove : []),
    ...(marketCap?.map((i) => i)?.includes(0) ? marketCapAll : []),
  ];

  //queries

  //price-scanners
  usePriceScanners({
    activeType: activeType,
    activeDate: activeDate,
    selectedTable: selectedTable,
    allIndices: allIndices,
    selectedIndicesIds: selectedIndicesIds,
    filter: filter,
    setTableData: setTableData,
    latestNiftyDate: latestNiftyDate,
  });

  //candle-stick-scanners
  useCandleStickScanner({
    pattern_type: selectedTableName,
    pattern_id: selectedTable,
    index_id: selectedIndicesIds?.[0] === 0 ? allIndices : selectedIndicesIds,
    priced_date: activeDate,
    marketCap,
    timeFrame,
    onCompleted: (data, pattern) => {
      setTableData(data);
      setSelectedPatterns(pattern);
    },
  });

  //swing high low

  useQuery(GET_SWING_HIGH_LOW, {
    skip: selectedTable !== 12,
    variables: {
      where: { created_at: { _eq: activeDate } },
    },
    onCompleted: (v) => setTableData(v?.indiacharts_swing_high_low_breakout),
  });

  //Rohit scanner

  useQuery(GET_ROHIT_SCANNER_TEMP, {
    skip: selectedTable !== 44,
    variables: {
      index_id: selectedIndicesIds?.[0] === 0 ? allIndices : selectedIndicesIds,
      where: {
        priced_date: { _eq: activeDate },
      },
      wherew: {
        priced_date: { _eq: activeDate },
      },
      wherem: {
        priced_date: { _eq: activeDate },
      },
    },
    onCompleted: (v) => {
      const arr1 = [];
      v?.indiacharts_indices?.map((i) => {
        arr1.push(...i?.indices_stocks);
      }) || [];
      const rohitScannerArr = [];
      const rohitScannerWeek = [];
      const rohitScannerMonth = [];
      arr1?.map((i) => {
        rohitScannerArr.push(i.rohit_data?.[0]);
        rohitScannerWeek.push(i.rohit_data_weekly?.[0]);
        // rohitScannerMonth.push(i.rohit_data_monthly?.[0]);
      });

      const resArr = rohitScannerArr?.reduce(
        (acc, x) =>
          acc.concat(acc.find((y) => y?.ticker === x.ticker) ? [] : [x]),
        []
      );

      const resWeek = rohitScannerWeek?.reduce(
        (acc, x) =>
          acc.concat(acc.find((y) => y?.ticker === x.ticker) ? [] : [x]),
        []
      );

      // const resMonth = rohitScannerMonth?.reduce(
      //   (acc, x) =>
      //     acc.concat(acc.find((y) => y?.ticker === x.ticker) ? [] : [x]),
      //   []
      // );

      setTableData(
        resArr
          ?.filter(
            (f) => f.rmi && f.rmi_ema && f.previous_rmi_ema && f.previous_rmi
          )
          ?.map((i, ix) => {
            const week = () => {
              const item = resWeek[ix];
              if (item?.rmi > item?.rmi_ema) {
                if (i?.rmi < i?.previous_rmi_ema) {
                  return {
                    weekRes: "New Buy",
                  };
                } else {
                  return { weekRes: "Buy" };
                }
              }
              if (item?.rmi < item?.rmi_ema) {
                if (i?.rmi > i?.previous_rmi_ema) {
                  return { weekRes: "New Sell" };
                } else {
                  return { weekRes: "Sell" };
                }
              }
            };

            // const month = () => {
            //   const item = resMonth[ix];
            //   console.log(item, "item");
            //   if (item?.rmi > item?.rmi_ema) {
            //     return { monthRes: "Buy" };
            //   }
            //   if (item?.rmi < item?.rmi_ema) {
            //     return { monthRes: "Sell" };
            //   }
            // };

            if (i?.rmi > i?.rmi_ema) {
              if (i?.rmi < i?.previous_rmi_ema) {
                return {
                  res: "New Buy",
                  ticker: i?.ticker,
                  ...week(),
                  // ...month(),
                };
              } else {
                return {
                  res: "Buy",
                  ticker: i?.ticker,
                  ...week(),
                  //  ...month()
                };
              }
            }
            if (i?.rmi < i?.rmi_ema) {
              if (i?.rmi > i?.previous_rmi_ema) {
                return {
                  res: "New Sell",
                  ticker: i?.ticker,
                  ...week(),
                  // ...month(),
                };
              } else {
                return {
                  res: "Sell",
                  ticker: i?.ticker,
                  ...week(),
                  // ...month(),
                };
              }
            }
          })
      );
    },
  });

  useQuery(GET_ROHIT_SCANNER_TEMP, {
    skip: selectedTable !== 45,
    variables: {
      index_id: selectedIndicesIds?.[0] === 0 ? allIndices : selectedIndicesIds,
      where: {
        priced_date: { _eq: activeDate },
      },
      wherew: {
        priced_date: { _eq: activeDate },
      },
      wherem: {
        priced_date: { _eq: activeDate },
      },
    },
    onCompleted: (v) => {
      const arr1 = [];
      v?.indiacharts_indices?.map((i) => {
        arr1.push(...i?.indices_stocks);
      }) || [];
      const rohitScannerArr = [];
      const weekArr = [];
      arr1?.map((i) => {
        rohitScannerArr.push(i.rohit_data?.[0]);
        weekArr.push(i?.rohit_data_weekly?.[0]);
      });
      const resArr = rohitScannerArr?.reduce(
        (acc, x) =>
          acc.concat(acc.find((y) => y?.ticker === x.ticker) ? [] : [x]),
        []
      );

      const resWeek = weekArr?.reduce(
        (acc, x) =>
          acc.concat(acc.find((y) => y?.ticker === x.ticker) ? [] : [x]),
        []
      );

      setTableData(
        resArr?.map((i, ix) => {
          const week = resWeek[ix]?.close_trend;

          return {
            close_trend: i?.close_trend,
            ticker: i?.ticker,
            weekCloseTrend: week,
          };
        })
      );
    },
  });

  //

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: false,
      filter: false,
      sortIcon: true,
      unSortIcon: true,
      suppressMenu: true,
      flex: 1,
      wrapText: true,
    };
  }, []);

  const handleClickRow = (rowData) => {
    dispatch(setTradingChartData(rowData?.symbol));
    // row.setSelected(true);
    if ([40, 41, 42, 43].includes(selectedTable)) {
      dispatch(
        setCandleStickPattern({
          candleStickPattern: rowData,
          patterns: selectedPatterns,
        })
      );
    } else {
      dispatch(
        setCandleStickPattern({ candleStickPattern: null, patterns: [] })
      );
    }
  };

  useEffect(() => {
    if (tableData.length === 0) {
      dispatch(
        setCandleStickPattern({ candleStickPattern: null, patterns: [] })
      );
    }
  }, [tableData]);

  useEffect(() => {
    return () => {
      dispatch(
        setCandleStickPattern({ candleStickPattern: null, patterns: [] })
      );
    };
  }, []);

  const FilterCancelHandler = (item) => {
    const SelectedIndices = selectedIndicesIds?.map((i) => {
      const filterarr = indicesOptions?.filter((ix) => ix?.value === i)?.[0];
      return filterarr;
    });

    const selectedMarketCaps = marketCap?.map((i) => {
      const arr = SCANNERS_MARKETCAP_OPTIONS?.filter(
        (ix) => ix?.value === i
      )?.[0];
      return arr;
    });

    const selectedItems = SelectedIndices?.filter((i) => i?.label !== item);
    if (selectedItems.length > 0) {
      setSelectedIndicesIds(selectedItems?.map((i) => i?.value));
    } else if (selectedItems.length === 0) {
      setSelectedIndicesIds([0]);
    }

    const selectedMarketCap = selectedMarketCaps?.filter(
      (i) => i?.label !== item
    );
    if (selectedMarketCap?.length > 0) {
      setMarketCap(selectedMarketCap?.map((i) => i?.value));
    } else if (selectedMarketCap.length === 0) {
      setMarketCap([0]);
    }
  };

  return (
    <div className={`ScannersTable ${theme}`}>
      <div className="ScannersTable-header">
        <p>
          Last Updated :
          {dayjs(latestNifty?.created_at).format("DD MMM YYYY hh:mm A")}
        </p>
      </div>
      <ScannersFilter
        activeDate={activeDate}
        setActiveDate={setActiveDate}
        selectedIndicesIds={selectedIndicesIds}
        setSelectedIndicesIds={setSelectedIndicesIds}
        marketCap={marketCap}
        setMarketCap={setMarketCap}
        activeType={activeType}
        setActiveType={setActiveType}
        indicesOptions={indicesOptions}
        setIndicesOptions={setIndicesOptions}
        setTimeFrame={setTimeFrame}
        timeFrame={timeFrame}
      />
      <div className={`ScannersTable-filter_selected ${theme}`}>
        <p>SELECTED FILTERS</p>
        <div className="ScannersTable-filter_selected_list">
          {filterArr
            .filter((ix) => ix)
            .map((item, i) => (
              <div className="ScannersTable-filter_selected_list-item" key={i}>
                <span>{item}</span>
                <span
                  className="close"
                  onClick={() => FilterCancelHandler(item)}
                >
                  <FiX />
                </span>
              </div>
            ))}
        </div>
      </div>
      <div
        className={`ScannersTable-table general_agTable ${
          theme == "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
        }`}
      >
        <AgGridReact
          ref={gridRef}
          columnDefs={tableHeaders(activeType, selectedTable, timeFrame)}
          rowData={tableData}
          defaultColDef={defaultColDef}
          animateRows={true}
          onGridReady={(e) => {
            gridRef.current.api.sizeColumnsToFit();
          }}
          onRowClicked={(e) => {
            handleClickRow(e?.data);
          }}
          onRowDataUpdated={(e) => {
            e.api.forEachNode((row, index) => {
              if (row.rowIndex === 0) {
                handleClickRow(row?.data);
                row.setSelected(true);
              }
            });
          }}
          rowSelection="single"
          suppressCellFocus
        />
      </div>
    </div>
  );
};

export default ScannersTable;
