//price_scanners
//near 52 week high/low

export const tableHeaders = (activeType, selectedTable, timeFrame) => {
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

  if (selectedTable === 10) {
    return [
      {
        headerName: "Stock Name",
        field: "ticker",
      },
      {
        headerName: `52 week ${activeType === "high" ? "high" : "low"}`,
        field:
          activeType === "high" ? "fifty_two_week_high" : "fifty_two_week_low",
        valueFormatter: (params) => params?.value?.toFixed(2) ?? 0,
      },
      {
        headerName: "Last closing Price",
        field: "close_price",
        valueFormatter: (params) => params?.value?.toFixed(2) ?? 0,
      },
      {
        headerName: `% away from 52-week ${
          activeType === "high" ? "high" : "low"
        }`,
        field: activeType === "high" ? "highchange" : "lowchange",
        cellClass: "ag-cell-last",
        cellStyle: cellStyle,
        valueFormatter: (params) =>
          params?.value ? `${params?.value?.toFixed(2)}%` : 0,
      },
    ];
  }
  if (selectedTable === 11) {
    return [
      {
        headerName: "Stock Name",
        field: "ticker",
      },
      {
        headerName: `52 week ${activeType === "high" ? "high" : "low"}`,
        field: activeType === "high" ? "high_price" : "low_price",
        valueFormatter: (params) => params?.value?.toFixed(2) ?? 0,
      },
      {
        headerName: "Last closing price",
        field: "current_price",
        valueFormatter: (params) => params?.value?.toFixed(2) ?? 0,
      },
      {
        headerName: "Day’s Change(%)",
        field: "change_percentage",
        cellClass: "ag-cell-last",
        cellStyle: cellStyle,
        valueFormatter: (params) =>
          params?.value ? `${params?.value?.toFixed(2)}%` : 0,
      },
    ];
  }
  if (selectedTable === 12) {
    return [
      {
        headerName: "Stock Name",
        field: "ticker_name",
      },
      {
        headerName: "Current Price",
        field: "current_price",
        // cellClass: "ag-cell-last",
      },
      {
        headerName: "Market Cap",
        field: "market_cap",
        cellClass: "ag-cell-last",
      },
    ];
  }
  if (selectedTable === 13) {
    return [
      {
        headerName: "Stock Name",
        field: "ticker",
      },
      {
        headerName: `Previous ${activeType === "high" ? "high" : "low"}`,
        field:
          activeType === "high" ? "previous_high_price" : "previous_low_price",
      },
      {
        headerName: "Open Price",
        field: "open_price",
        valueFormatter: (params) =>
          params?.value ? params?.value?.toFixed(2) : 0,
      },
      {
        headerName: "Change",
        field: "change_percentage",
        cellClass: "ag-cell-last",
        cellStyle: cellStyle,
        valueFormatter: (params) =>
          params?.value ? `${params?.value?.toFixed(2)}%` : 0,
      },
    ];
  }
  if ([40, 41, 42, 43].includes(selectedTable)) {
    return [
      {
        headerName: "Stock Name",
        field: "ticker",
      },
      {
        headerName: "Candlestick Name",
        field: "comments",
      },
      {
        headerName: "Last Closing Price",
        field: "close_price",
        valueFormatter: (params) =>
          params?.value ? params?.value?.toFixed(2) : 0,
      },
      {
        headerName: "Change",
        field: "change_percentage",
        cellClass: "ag-cell-last",
        valueFormatter: (params) =>
          params?.value ? `${params?.value?.toFixed(2)}%` : 0,
      },
    ];
  }

  if (selectedTable === 44) {
    return [
      { headerName: "Stock Name", field: "ticker" },
      (timeFrame === "all" || timeFrame === 0) && {
        headerName: "Daily",
        field: "res",
      },
      (timeFrame === "all" || timeFrame === 1) && {
        headerName: "Weekly",
        field: "weekRes",
        // valueFormatter: (params) => (params?.value ? value : "-"),
      },
      (timeFrame === "all" || timeFrame === 2) && {
        headerName: "Monthly",
        field: "monthRes",
        valueFormatter: (params) => (params?.value ? value : "-"),
      },
    ];
  }
  if (selectedTable === 45) {
    return [
      {
        headerName: "Stock Name",
        field: "ticker",
      },
      (timeFrame === "all" || timeFrame === 0) && {
        headerName: "Trend Daily",
        field: "close_trend",
      },
      (timeFrame === "all" || timeFrame === 1) && {
        headerName: "Trend Weekly",
        field: "weekCloseTrend",
        valueFormatter: (params) => (params?.value ? params?.value : "-"),
      },
      (timeFrame === "all" || timeFrame === 2) && {
        headerName: "Trend Monthly",
        field: "",
        valueFormatter: (params) => (params?.value ? params?.value : "-"),
      },
    ];
  } else {
    return [
      {
        headerName: "Stock Name ",
        field: "name",
      },
      {
        headerName: "Traded Volume",
        field: "trdvolume",
        cellClass: "ag-right-aligned-cell",
      },
      {
        headerName: "Average volume",
        field: "avgvolume",
        cellClass: "ag-right-aligned-cell",
      },
      {
        headerName: "Last closing price",
        field: "lclosingprice",
        cellClass: "ag-right-aligned-cell",
      },
      {
        headerName: "Change in %",
        field: "change",
        cellClass: "ag-right-aligned-cell ag-cell-last",
      },
    ];
  }
};
