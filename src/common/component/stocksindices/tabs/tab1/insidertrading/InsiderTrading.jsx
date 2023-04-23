import React, { useState, useEffect, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@apollo/client/react/hooks";

// Graphql
import {
  GET_BULK_DEALS,
  GET_BLOCK_DEALS,
  GET_INSIDER,
} from "../../../../../../gql/queries";

// Component
import Filter from "../../../../filter/Filter";

// Table Header
import {
  bulkDealsTableHeader,
  insiderTableHeader,
  insiderTableHeaderActive,
  bulkDealsTableActiveHeader,
  blokDealsTableHeader,
  blokDealsTableActiveHeader,
} from "../TableHeader";

// Redux
import { useSelector } from "react-redux";

// Default Col Def
const defaultColDef = {
  wrapText: true,
  autoHeight: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  flex: 1,
};

// Detailed Table
const DetailedTable = ({ title, count, onGridReady, loading, tableHeader }) => {
  return (
    <div className="table1" style={{ height: "100%" }}>
      <h2>
        {title}({count})
      </h2>
      <div className={`blankTables`} style={{ height: "calc(100% - 25px)" }}>
        <AgGridReact
          // containerStyle={{
          //   width: "52rem",
          //   minHeight: "fit-content",
          // }}
          rowClass="row"
          className="ag"
          onGridReady={onGridReady}
          cacheBlockSize={50}
          serverSideInfiniteScroll
          rowModelType="serverSide"
          showLoadingOverlay={loading}
          columnDefs={tableHeader}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
};

const InsiderTrading = () => {
  // Redux
  const { newsSearchText, newsSorting } = useSelector(
    (state) => state.StockIndices
  );

  // Ref
  const gridRef = useRef(null);
  const gridRefBulk = useRef(null);
  const gridRefBlock = useRef(null);
  const gridRefInsider = useRef(null);

  // State
  const [activeColumn, setActiveColumn] = useState(0);
  const [bulkDealsData, setBulkDealsData] = useState([]);
  const [bulkDealsCount, setBulkDealsCount] = useState(0);
  const [blockDealsData, setBlockDealsData] = useState([]);
  const [blockDealsCount, setBlockDealsCount] = useState(0);
  const [insiderData, setInsiderData] = useState([]);
  const [insiderCount, setInsiderCount] = useState(0);

  // API

  // Bulk Deals API
  const { loading: bulkDealsLoading, fetchMore: fetchMoreBulkDeals } = useQuery(
    GET_BULK_DEALS,
    {
      variables: {
        where:
          newsSearchText?.length > 0
            ? {
                stock: { company: { name: { _ilike: `%${newsSearchText}%` } } },
              }
            : undefined,
        deal_date: newsSorting === "asc" ? "desc" : "asc",
        limit: 50,
        offset: 0,
      },
      onCompleted: (v) => {
        setBulkDealsData(v?.data);
        setBulkDealsCount(v?.total?.aggregate?.count);
        gridRefBulk.current.api.onFilterChanged();
        gridRefBulk.current.api.onSortChanged();
      },
    }
  );

  // Block Deals API
  const { loading: blockDealsLoading, fetchMore: fetchMoreBlockDeals } =
    useQuery(GET_BLOCK_DEALS, {
      variables: {
        where:
          newsSearchText?.length > 0
            ? {
                stock: { company: { name: { _ilike: `%${newsSearchText}%` } } },
              }
            : undefined,
        deal_date: newsSorting === "asc" ? "desc" : "asc",
        limit: 50,
        offset: 0,
      },
      onCompleted: (v) => {
        setBlockDealsData(v?.data);
        setBlockDealsCount(v?.total?.aggregate?.count);
        gridRefBlock.current.api.onFilterChanged();
        gridRefBlock.current.api.onSortChanged();
      },
    });

  // Insider API
  const { loading: insiderLoading, fetchMore: fetchMoreInsider } = useQuery(
    GET_INSIDER,
    {
      variables: {
        where:
          newsSearchText?.length > 0
            ? { stock: { ticker: { _ilike: `%${newsSearchText}%` } } }
            : undefined,
        acquisition_date: newsSorting === "asc" ? "desc" : "asc",
        limit: 50,
        offset: 0,
      },
      onCompleted: (v) => {
        setInsiderData(v?.data);
        setInsiderCount(v?.total?.aggregate?.count);
        gridRefInsider.current.api.onFilterChanged();
        gridRefInsider.current.api.onSortChanged();
      },
    }
  );

  // Grid

  // Bulk Deals Grid
  const onGridReadyBulk = useCallback((params) => {
    const dataSource = {
      getRows: (params) => {
        fetchMoreBulkDeals({
          variables: {
            offset: params?.request?.startRow || params?.startRow,
          },
        }).then((r) => {
          let lastRow = -1;
          const total = r?.data?.total?.aggregate?.count;
          if ((params?.request?.endRow || params?.endRow) >= total) {
            lastRow = total;
          }
          params.successCallback(r?.data?.data, lastRow);
        });
      },
    };
    gridRefBulk.current = params;
    params.api.setServerSideDatasource(dataSource);
  }, []);

  // Block Deals Grid
  const onGridReadyBlock = useCallback((params) => {
    const dataSource = {
      getRows: (params) => {
        fetchMoreBlockDeals({
          variables: {
            offset: params?.request?.startRow || params?.startRow,
          },
        }).then((r) => {
          let lastRow = -1;
          const total = r?.data?.total?.aggregate?.count;
          if ((params?.request?.endRow || params?.endRow) >= total) {
            lastRow = total;
          }
          params.successCallback(r?.data?.data, lastRow);
        });
      },
    };
    gridRefBlock.current = params;
    params.api.setServerSideDatasource(dataSource);
  }, []);

  // Insider Grid
  const onGridReadyInsider = useCallback((params) => {
    const dataSource = {
      getRows: (params) => {
        fetchMoreInsider({
          variables: {
            offset: params?.request?.startRow || params?.startRow,
          },
        }).then((r) => {
          let lastRow = -1;
          const total = r?.data?.total?.aggregate?.count;
          if ((params?.request?.endRow || params?.endRow) >= total) {
            lastRow = total;
          }
          params.successCallback(r?.data?.data, lastRow);
        });
      },
    };
    gridRefInsider.current = params;
    params.api.setServerSideDatasource(dataSource);
  }, []);

  // UseEffect
  useEffect(() => {
    if (gridRef?.current?.api) {
      gridRef?.current?.api.sizeColumnsToFit();
    }
  }, [gridRef]);

  return (
    <div className="insider-training">
      <Filter />
      <div className="body">
        {/* Left  */}
        <div className="left">
          {/* Bulk Deals */}
          <div
            className={`item ${activeColumn === 0 ? "active" : ""}`}
            style={{ height: 450, width: "100%" }}
            onClick={() => setActiveColumn(0)}
          >
            <h2>BULK DEALS({bulkDealsCount})</h2>
            <div className={`blankTables indiserTradingSideTable`}>
              <AgGridReact
                ref={gridRef}
                containerStyle={{
                  height: "11rem",
                }}
                className="ag"
                rowClass="row"
                rowData={bulkDealsData?.slice(0, 5)}
                columnDefs={bulkDealsTableHeader}
                defaultColDef={defaultColDef}
              />
            </div>
          </div>
          {/* Block Deals */}
          <div
            className={`item ${activeColumn === 1 ? "active" : ""}`}
            style={{ height: 450, width: "100%" }}
            onClick={() => setActiveColumn(1)}
          >
            <h2>BLOCK DEALS({blockDealsCount})</h2>
            <div className={`blankTables indiserTradingSideTable`}>
              <AgGridReact
                ref={gridRef}
                containerStyle={{ height: "11rem" }}
                className="ag"
                rowClass="row"
                rowData={blockDealsData?.slice(0, 6)}
                columnDefs={blokDealsTableHeader}
                defaultColDef={defaultColDef}
              />
            </div>
          </div>
          {/* Insider */}
          <div
            className={`item ${activeColumn === 2 ? "active" : ""}`}
            style={{ height: 450, width: "100%" }}
            onClick={() => setActiveColumn(2)}
          >
            <h2>INSIDER({insiderCount})</h2>
            <div className={`blankTables indiserTradingSideTable`}>
              <AgGridReact
                ref={gridRefInsider}
                containerStyle={{ height: "11rem" }}
                className="ag"
                rowClass="row"
                rowData={insiderData?.slice(0, 5)}
                columnDefs={insiderTableHeader}
                defaultColDef={defaultColDef}
              />
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="right">
          {/* Bulk Deals */}
          {activeColumn === 0 && (
            <DetailedTable
              title={"Bulk Deals"}
              count={bulkDealsCount}
              onGridReady={onGridReadyBulk}
              loading={bulkDealsLoading}
              columnDefs={bulkDealsTableHeader}
              tableHeader={bulkDealsTableActiveHeader}
            />
          )}
          {/* Block Deals */}
          {activeColumn === 1 && (
            <DetailedTable
              title={"Block Deals"}
              count={blockDealsCount}
              onGridReady={onGridReadyBlock}
              loading={blockDealsLoading}
              tableHeader={blokDealsTableActiveHeader}
            />
          )}
          {/* Insider */}
          {activeColumn === 2 && (
            <DetailedTable
              title={"Insider"}
              count={insiderCount}
              onGridReady={onGridReadyInsider}
              loading={insiderLoading}
              tableHeader={insiderTableHeaderActive}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InsiderTrading;
