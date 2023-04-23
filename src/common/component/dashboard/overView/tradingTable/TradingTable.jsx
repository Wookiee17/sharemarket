import React, { useRef, useMemo, useEffect, useState } from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";

// apollo
import { useQuery } from "@apollo/client";

// components
import TradingTableAction from "./TradingTableAction";
import TradingTableTooltip from "./TradingTableTooltip";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveTableData,
  setTradingChartData,
} from "../../../../../store/dashboard/MarketOverviewSlice";
import {
  GET_GAINERS_LOSERS,
  GET_FIFTY_TWO_WEEKS_HIGH,
  GET_FIFTY_TWO_WEEKS_LOW,
  GET_GAP_UP_DOWN_TICKERS_FROM_VIEW,
  GET_VOL_BUZZER_TICKERS_VIEW,
} from "../../../../../gql/queries";
import { useGenerateWhere, useGenerateOrderby } from "./useGenerateWhere";

function cellStyle(params) {
  const color = numberToColor(params.value);
  return {
    color: color,
    fontWeight: 400,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    padding: "0 17px",
    display: "block",
    lineHeight: "22px",
  };
}

function numberToColor(val) {
  if (val > 0) {
    return "#52C41A";
  } else if (val < 0) {
    return "#FF4A4A";
  }
}
function currencyFormatter(params) {
  if (params?.value) {
    return params.value.toFixed(2) + "%";
  }
}
const formatGainerLoserData = (_stocks) =>
  _stocks.map((st) => {
    return {
      ticker: st.ticker_name,
      symbol: st.symbol,
      current_price: st.stock_current_price?.current_price,
      change_percentage: st.stock_current_price?.change_percentage,
      total_trade_quantity: st.stock_current_price?.total_trade_quantity,
    };
  });

const TradingTable = () => {
  const gridRef = useRef(null);
  const theme = useSelector((state) => state.Common.theme);
  const latestNifty = useSelector((state) => state.Common.latestNiftyStock);
  const eodNifty = useSelector((state) => state.Common.eodNiftyStock);
  const selectedQuery = useSelector(
    (state) => state.MarketOverview.activeSidebarLevel1
  );
  const selectedIndex = useSelector(
    (state) => state.MarketOverview.activeSidebarLevel2
  );

  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();

  const tableHeader = [
    {
      headerName: "Name",
      field: "ticker",
      // maxWidth: 150,
      minWidth: 120,
      cellStyle: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        padding: "0 17px",
        display: "block",
        lineHeight: "22px",
      },
      tooltipField: "ticker",
      tooltipComponentParams: {
        color: theme == "dark" ? "#131722" : "#e2e5ec",
      },
    },
    {
      headerName: "CMP",
      field: "current_price",
      cellClass: "ag-right-aligned-cell",
      // tooltipField: "current_price",
    },
    {
      headerName: "Change",
      field: "change_percentage",
      cellStyle: cellStyle,
      valueFormatter: currencyFormatter,
      // maxWidth: 100,
      // minWidth: 100,
      cellClass: "ag-right-aligned-cell",
      tooltipField: "change_percentage",
    },
    {
      headerName: "Volume",
      field: "total_trade_quantity",
      cellClass: "ag-right-aligned-cell",
      // tooltipField: "total_trade_quantity",
    },
    {
      headerName: "Vol Change",
      field: "vol_change",
      cellStyle: cellStyle,
      valueFormatter: currencyFormatter,
      cellClass: "ag-right-aligned-cell",
      tooltipField: "vol_change",
      hide: true,
      // maxWidth: 100,
      // minWidth: 100,
    },
    {
      headerName: "",
      cellRenderer: TradingTableAction,
      cellClass: "ag-cell-last",
      width: 40,
    },
  ];
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: false,
      filter: false,
      sortIcon: true,
      unSortIcon: true,
      suppressMenu: true,
      flex: 1,
      tooltipComponent: TradingTableTooltip,
    };
  }, []);

  const { where, skip } = useGenerateWhere();
  const handleSetTableData = (_stocks, formatNeeded = false) => {
    if (formatNeeded) {
      setTableData(formatGainerLoserData(_stocks));
    } else {
      setTableData(_stocks);
    }
    dispatch(setTradingChartData(_stocks?.[0]?.symbol));
    dispatch(setActiveTableData(0));
  };
  //fetch Gainers/Losers stocks
  const { loading: loadingGainerLoser } = useQuery(GET_GAINERS_LOSERS, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      where: {
        stock_current_price: {
          change_percentage: {
            [selectedQuery === "Gainers" ? "_gt" : "_lt"]: 0,
          },
        },
      },
      index_id: selectedIndex,
      order_by: useGenerateOrderby(),
    },
    onCompleted: (data) => {
      if (Array.isArray(data?.stock_prices?.indices_stocks)) {
        const _stocks = data?.stock_prices?.indices_stocks;
        handleSetTableData(_stocks, true);
      }
    },
    skip: selectedIndex === 0 || !["Gainers", "Losers"].includes(selectedQuery),
    //execute only for gainers and losers tab
  });

  //fetch 52 weeks high stocks
  const { loading: loading52WeekHigh } = useQuery(GET_FIFTY_TWO_WEEKS_HIGH, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      // index_id: selectedIndex,
      order_by: useGenerateOrderby(),
      where: { indices_stocks: { indices_id: { _eq: selectedIndex } } },
    },
    onCompleted: (data) => {
      if (Array.isArray(data?.fififty_two_week_high)) {
        const _stocks = data?.fififty_two_week_high;
        handleSetTableData(_stocks);
      }
    },
    skip: selectedQuery !== "52 Weeks High", //execute only for 52 weeks high
  });

  //fetch 52 weeks low stocks
  const { loading: loading52WeekLow } = useQuery(GET_FIFTY_TWO_WEEKS_LOW, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      where: {
        total_trade_quantity: { _gt: 0 },
        indices_stocks: { indices_id: { _eq: selectedIndex } },
      },
      // index_id: selectedIndex,
      order_by: useGenerateOrderby(),
    },
    onCompleted: (data) => {
      if (Array.isArray(data?.fifty_two_week_low)) {
        const _stocks = data?.fifty_two_week_low;
        handleSetTableData(_stocks);
      }
    },
    skip: selectedQuery !== "52 Weeks Low", //execute only for 52 weeks low
  });

  //fetch gap up/down stocks
  const { loading: loadingGapLoading } = useQuery(
    GET_GAP_UP_DOWN_TICKERS_FROM_VIEW,
    {
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
      variables: {
        where,
        order_by: useGenerateOrderby(),
      },
      onCompleted: (data) => {
        if (Array.isArray(data?.gapdata)) {
          const _stocks = data?.gapdata;
          handleSetTableData(_stocks);
        }
      },
      skip: !["Gap Up", "Gap Down"].includes(selectedQuery), //execute only for gap up and gap down
    }
  );

  //fetch volume buzzer stocks
  const { loading: loadingVolumeBuzzer } = useQuery(
    GET_VOL_BUZZER_TICKERS_VIEW,
    {
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
      variables: {
        where,
        order_by: useGenerateOrderby(),
      },
      onCompleted: (data) => {
        if (Array.isArray(data?.vbdata)) {
          const _stocks = data?.vbdata;
          handleSetTableData(_stocks);
        }
      },
      skip: selectedIndex === 0 || selectedQuery !== "Volume Buzzers", //execute only for volume buzzers
    }
  );

  //check for all loading states for different queries
  const loading =
    loadingGainerLoser ||
    loading52WeekHigh ||
    loading52WeekLow ||
    loadingGapLoading ||
    loadingVolumeBuzzer;

  useEffect(() => {
    if (gridRef?.current?.api) {
      if (loading) {
        //show loading overlay in AG Grid
        gridRef.current.api.showLoadingOverlay();
      } else {
        //hide loading overlay when loading is completed
        gridRef.current.api.hideOverlay();
      }
    }
  }, [loading, gridRef]);
  useEffect(() => {
    if (gridRef?.current?.api) {
      if (tableData?.length === 0) {
        //show no data found if there is no data
        gridRef.current.api.showNoRowsOverlay();
      } else {
        if (selectedQuery === "Volume Buzzers") {
          //show volume change field only for volume buzzer tab
          gridRef?.current?.columnApi.setColumnsVisible(["vol_change"], true);
        } else {
          gridRef?.current?.columnApi.setColumnsVisible(["vol_change"], false);
        }
        gridRef?.current?.api.sizeColumnsToFit();
      }
    }
  }, [tableData, gridRef, selectedQuery]);
  return (
    <div
      className={`OverView_table general_agTable ${
        theme == "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
      }`}
    >
      <AgGridReact
        ref={gridRef}
        columnDefs={tableHeader}
        rowData={tableData}
        defaultColDef={defaultColDef}
        onRowDataUpdated={(e) => {
          e.api.forEachNode((row, imdex) => {
            if (row.rowIndex === 0) row.setSelected(true);
          });
        }}
        onGridReady={(e) => {
          gridRef.current.api.sizeColumnsToFit();
          e.api.forEachNode((row, imdex) => {
            if (row.rowIndex === 0) row.setSelected(true);
          });
        }}
        onRowClicked={(e) => {
          dispatch(setTradingChartData(e?.data?.symbol));
          dispatch(setActiveTableData(e.rowIndex));
        }}
        rowSelection="single"
        suppressCellFocus
        tooltipShowDelay={0}
        tooltipHideDelay={3000}
      ></AgGridReact>
    </div>
  );
};

export default TradingTable;
