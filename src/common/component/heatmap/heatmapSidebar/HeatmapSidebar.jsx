import React, { useState, useEffect, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

// icons
import {
  FiChevronDown,
  FiChevronUp,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";

// redux
import { useSelector } from "react-redux";

import { useQuery } from "@apollo/client/react/hooks";
import {
  GET_VIEW_HEATMAP_SB_TODAY,
  GET_VIEW_HEATMAP_SB_1WK,
  GET_VIEW_HEATMAP_SB_1M,
  GET_VIEW_HEATMAP_SB_3M,
  GET_VIEW_HEATMAP_SB_6M,
  GET_VIEW_HEATMAP_SB_1YR,
  GET_VIEW_HEATMAP_SB_1HR,
} from "../../../../gql/queries";

import { useRouter } from "next/router";

import Tooltip from "./Tooltip";

const HeatmapSidebar = ({ sliderValue, setLoadingState }) => {
  const [indices, setIndices] = useState([]);
  const [reverse, setReverse] = useState(false);

  const activeTab = useSelector((state) => state.Heatmap.activeTab);

  const slug = () => {
    if (activeTab === 0) {
      return "nse";
    }
    if (activeTab === 1) {
      return "fno";
    }
    if (activeTab === 2) {
      return "advance-decline-ratio";
    }
  };

  const router = useRouter();
  const { query } = useRouter();

  const routeFun = (val) => {
    if (query.index === "" || query.index === "undefined" || !query.index) {
      return router.push(`${slug()}?index=${val?.[0]?.id}`);
    }
  };

  //QUERIES
  const { data: sbToday, loading: tdLoading } = useQuery(
    GET_VIEW_HEATMAP_SB_TODAY,
    {
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
      skip: sliderValue !== 0,
      variables: {
        order_by: reverse ? "asc" : "desc",
      },
      onCompleted: (v) => {
        setIndices(v?.indiacharts_view_heat_map_sb);
        routeFun(v?.indiacharts_view_heat_map_sb);
      },
    }
  );

  const { data: sb1hr, loading: Loading1hr } = useQuery(
    GET_VIEW_HEATMAP_SB_1HR,
    {
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
      skip: sliderValue !== 16,
      variables: {
        order_by: reverse ? "asc" : "desc",
      },
      onCompleted: (v) => {
        setIndices(v?.indiacharts_view_heat_map_sb_1hr);
        routeFun(v?.indiacharts_view_heat_map_sb_1hr);
      },
    }
  );
  const { data: sb1wk, loading: Loading1wk } = useQuery(
    GET_VIEW_HEATMAP_SB_1WK,
    {
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
      skip: sliderValue !== 32,
      variables: {
        order_by: reverse ? "asc" : "desc",
      },
      onCompleted: (v) => {
        setIndices(v?.indiacharts_view_heat_map_sb_1wk);
        routeFun(v?.indiacharts_view_heat_map_sb_1wk);
      },
    }
  );
  const { data: sb1m, loading: Loading1m } = useQuery(GET_VIEW_HEATMAP_SB_1M, {
    skip: sliderValue !== 48,
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes

    variables: {
      order_by: reverse ? "asc" : "desc",
    },
    onCompleted: (v) => {
      setIndices(v?.indiacharts_view_heat_map_sb_1m);
      routeFun(v?.indiacharts_view_heat_map_sb_1m);
    },
  });
  const { data: sb3m, loading: Loading3m } = useQuery(GET_VIEW_HEATMAP_SB_3M, {
    skip: sliderValue !== 64,
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes

    variables: {
      order_by: reverse ? "asc" : "desc",
    },
    onCompleted: (v) => {
      setIndices(v?.indiacharts_view_heat_map_sb_3m);
      routeFun(v?.indiacharts_view_heat_map_sb_3m);
    },
  });
  const { data: sb6m, loading: Loading6m } = useQuery(GET_VIEW_HEATMAP_SB_6M, {
    skip: sliderValue !== 80,
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes

    variables: {
      order_by: reverse ? "asc" : "desc",
    },
    onCompleted: (v) => {
      setIndices(v?.indiacharts_view_heat_map_sb_6m);
      routeFun(v?.indiacharts_view_heat_map_sb_6m);
    },
  });

  const { data: sb1yr, loading: Loading1yr } = useQuery(
    GET_VIEW_HEATMAP_SB_1YR,
    {
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes

      skip: sliderValue !== 100,
      variables: {
        order_by: reverse ? "asc" : "desc",
      },
      onCompleted: (v) => {
        setIndices(v?.indiacharts_view_heat_map_sb_1y);
        routeFun(v?.indiacharts_view_heat_map_sb_1y);
      },
    }
  );

  const theme = useSelector((state) => state.Common.theme);
  const gridRef = useRef(null);
  const tableHeader = [
    {
      headerName: "",
      field: "name",
      tooltipField: "name",
      maxWidth: 135,
      minWidth: 135,
      cellStyle: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        padding: "0 7px",
        display: "block",
        lineHeight: "22px",
      },
    },
    {
      headerName: "Price",
      field: "current_price",
      tooltipField: "current_price",
      headerClass: "ag-right-aligned-cell",
      cellClass: "ag-right-aligned-cell",
      cellStyle: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        padding: "0 7px",
        display: "block",
        lineHeight: "22px",
      },
      cellRenderer: function (params) {
        return (
          <span>
            {params.data?.change_percentage > 0 ? (
              <FiArrowUp className={`cGreen`} />
            ) : (
              params.data?.change_percentage < 0 && (
                <FiArrowDown className={`cRed`} />
              )
            )}
            {params.value}
          </span>
        );
      },
    },
    {
      headerName: "%",
      field: "change_percentage",
      tooltipField: "change_percentage",
      headerClass: "ag-right-aligned-cell",
      cellClass: "ag-right-aligned-cell ag-cell-last",
      maxWidth: 60,
      minWidth: 60,
      cellStyle: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        padding: "0 7px",
        display: "block",
        lineHeight: "22px",
      },
      cellRenderer: function (params) {
        return (
          <span
            className={
              params.value > 0 ? "cGreen" : params.value < 0 ? "cRed" : ""
            }
          >
            {params.value?.toFixed(2)}%
          </span>
        );
      },
    },
  ];

  const defaultColDef = useMemo(() => {
    return {
      sortable: false,
      resizable: false,
      filter: false,
      sortIcon: true,
      unSortIcon: true,
      suppressMenu: true,
      flex: 1,
      tooltipComponent: Tooltip,
    };
  }, []);

  useEffect(() => {
    if (
      tdLoading ||
      Loading1hr ||
      Loading1wk ||
      Loading1m ||
      Loading3m ||
      Loading6m ||
      Loading1yr
    ) {
      setLoadingState(true);
    }
    if (
      !tdLoading &&
      !Loading1hr &&
      !Loading1wk &&
      !Loading1m &&
      !Loading3m &&
      !Loading6m &&
      !Loading1yr
    )
      setLoadingState(false);
  }, [
    tdLoading,
    Loading1hr,
    Loading1wk,
    Loading1m,
    Loading3m,
    Loading6m,
    Loading1yr,
  ]);

  useEffect(() => {
    if (gridRef?.current?.api) {
      if (
        tdLoading ||
        Loading1hr ||
        Loading1wk ||
        Loading1m ||
        Loading3m ||
        Loading6m ||
        Loading1yr
      ) {
        gridRef.current.api.showLoadingOverlay();
      } else {
        gridRef.current.api.hideOverlay();
      }
    }
  }, [
    tdLoading,
    Loading1hr,
    Loading1wk,
    Loading1m,
    Loading3m,
    Loading6m,
    Loading1yr,
    gridRef,
  ]);
  useEffect(() => {
    if (gridRef?.current?.api) {
      if (sbToday?.indiacharts_view_heat_map_sb?.length === 0) {
        gridRef.current.api.showNoRowsOverlay();
      }
    }
  }, [sbToday, gridRef]);

  return (
    <div className={`Heatmap_sidebar ${theme}`}>
      <div className={`Heatmap_sidebar-header ${theme}`}>
        <p>INDICES</p>
        <div className="sort row" onClick={() => setReverse(!reverse)}>
          <small>Show By:</small>
          <p>
            {reverse ? (
              <>
                <span>Low to High</span>
                <FiChevronDown />
              </>
            ) : (
              <>
                <span>High to Low</span>
                <FiChevronUp />
              </>
            )}
          </p>
        </div>
      </div>
      <div
        className={`Heatmap_sidebar-body general_agTable ${theme} ${
          theme == "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
        }`}
      >
        <AgGridReact
          ref={gridRef}
          columnDefs={tableHeader}
          rowData={indices}
          defaultColDef={defaultColDef}
          animateRows={true}
          tooltipShowDelay={0}
          onRowDataUpdated={(e) => {
            let flag = true,
              _row = null;
            e.api.forEachNode((row, imdex) => {
              if (row.rowIndex === 0) {
                _row = row;
              }
              if (row.data.id === query.index) {
                row.setSelected(true);
                gridRef.current.api.ensureIndexVisible(row.rowIndex, "middle");
                // router.push(`${slug()}?index=${row?.data?.id}`);
                flag = false;
              }
            });
            if (flag && _row !== null) {
              _row.setSelected(true);
            }
          }}
          onGridReady={(e) => {
            gridRef.current.api.sizeColumnsToFit();
            e.api.forEachNode((r) => {
              if (r.rowIndex === 0) r.selectThisNode(true);
            });
          }}
          onRowClicked={(e) => {
            router.push(`${slug()}?index=${e?.data?.id}`);
          }}
          rowSelection="single"
          suppressCellFocus
        />
      </div>
    </div>
  );
};

export default HeatmapSidebar;
