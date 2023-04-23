import React, { useState, useRef, useEffect, useCallback } from "react";
import Filter from "../../../../filter/Filter";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@apollo/client/react/hooks";
import {
  GET_RIGHTS,
  GET_MERGER,
  GET_DIVIDEND,
  GET_SPLIT_BONUS,
} from "../../../../../../gql/queries";
import {
  dividendTableHeader,
  mergerTablesHeader,
  rightsTableHeader,
  splitBonusTableHeader,
  dividendTableHeaderActive,
  mergerTablesHeaderActive,
  rightsTableHeaderActive,
  splitBonusTableHeaderActive,
} from "../TableHeader";
import { useSelector } from "react-redux";
import moment from "moment";

const defaultColDef = {
  wrapText: true,
  autoHeight: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
};

const CorporateActions = () => {
  const gridRef = useRef(null);
  const gridRefDividend = useRef(null);
  const gridRefSplitBonus = useRef(null);
  const gridRefRights1 = useRef(null);
  const gridRefMerger = useRef(null);
  const theme = useSelector((state) => state.Common.theme);
  const { newsSearchText, newsSorting } = useSelector(
    (state) => state.StockIndices
  );
  const latestNifty = useSelector((state) => state.Common.latestNiftyStock);
  //
  const [active, setActive] = useState(0);

  //

  const [dividend1, setDividend1] = useState([]);
  const [splitBonus1, setSplitBonus1] = useState([]);
  const [rights1, setRights1] = useState([]);
  const [merger1, setMerger1] = useState([]);
  const [dividend1Length, setDividend1Length] = useState([]);
  const [splitBonus1Length, setSplitBonus1Length] = useState([]);
  const [rights1Length, setRights1Length] = useState([]);
  const [merger1Length, setMerger1Length] = useState([]);
  const DetailedTable = ({
    title,
    count,
    onGridReady,
    loading,
    tableHeader,
  }) => {
    return (
      <div className="table1" style={{ height: "100%" }}>
        <h2>
          {title}({count})
        </h2>
        <div className={`blankTables corporateActionTable`}>
          <AgGridReact
            // containerStyle={{
            //   // maxWidth: "6 0%",
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

  //queries
  //without limit
  const { loading: dividend1Loading, fetchMore: fetchMoreDividend } = useQuery(
    GET_DIVIDEND,
    {
      variables: {
        where: {
          company:
            newsSearchText.length > 0
              ? { name: { _ilike: `%${newsSearchText}%` } }
              : undefined,
          execution_date: { _gte: moment(latestNifty).format("YYYY-MM-DD") },
        },
        execution_date: newsSorting,
        limit: 50,
        offset: 0,
      },
      onCompleted: (v) => {
        setDividend1(v?.data);
        setDividend1Length(v?.total?.aggregate?.count);
        gridRefDividend.current.api.onFilterChanged();
        gridRefDividend.current.api.onSortChanged();
      },
    }
  );

  const { loading: splitBonus1Loading, fetchMore: fetchMoreSplitBonus } =
    useQuery(GET_SPLIT_BONUS, {
      variables: {
        where: {
          company:
            newsSearchText.length > 0
              ? { name: { _ilike: `%${newsSearchText}%` } }
              : undefined,
          execution_date: { _gte: moment(latestNifty).format("YYYY-MM-DD") },
        },
        execution_date: newsSorting,
        limit: 50,
        offset: 0,
      },

      onCompleted: (v) => {
        setSplitBonus1(v?.data);
        setSplitBonus1Length(v?.total?.aggregate?.count);
        gridRefSplitBonus.current.api.onFilterChanged();
        gridRefSplitBonus.current.api.onSortChanged();
      },
    });

  const { loading: rights1Loading, fetchMore: fetchMoreRights } = useQuery(
    GET_RIGHTS,
    {
      variables: {
        where: {
          company:
            newsSearchText.length > 0
              ? { name: { _ilike: `%${newsSearchText}%` } }
              : undefined,
          execution_date: { _gte: moment(latestNifty).format("YYYY-MM-DD") },
        },
        execution_date: newsSorting,
        limit: 50,
        offset: 0,
      },

      onCompleted: (v) => {
        setRights1(v?.data);
        setRights1Length(v?.total?.aggregate?.count);
        gridRefRights1.current.api.onFilterChanged();
        gridRefRights1.current.api.onSortChanged();
      },
    }
  );

  const { loading: mergerData1Loading, fetchMore: fetchMoreMerger } = useQuery(
    GET_MERGER,
    {
      variables: {
        where: {
          company:
            newsSearchText.length > 0
              ? { name: { _ilike: `%${newsSearchText}%` } }
              : undefined,
          execution_date: { _is_null: false },
        },
        execution_date: newsSorting === "asc" ? "desc" : "asc",
        limit: 50,
        offset: 0,
      },

      onCompleted: (v) => {
        setMerger1(v?.data);
        setMerger1Length(v?.total?.aggregate?.count);
        gridRefMerger.current.api.onFilterChanged();
        gridRefMerger.current.api.onSortChanged();
      },
    }
  );

  const onGridReadyDividend = useCallback((params) => {
    const dataSource = {
      getRows: (params) => {
        fetchMoreDividend({
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

          // setBulkData1Length(r?.data?.total?.aggregate?.count);
        });
      },
    };
    gridRefDividend.current = params;
    params.api.setServerSideDatasource(dataSource);
  }, []);
  const onGridReadySplitBonus = useCallback((params) => {
    const dataSource = {
      getRows: (params) => {
        fetchMoreSplitBonus({
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

          // setBulkData1Length(r?.data?.total?.aggregate?.count);
        });
      },
    };
    gridRefSplitBonus.current = params;
    params.api.setServerSideDatasource(dataSource);
  }, []);
  const onGridReadyRights = useCallback((params) => {
    const dataSource = {
      getRows: (params) => {
        fetchMoreRights({
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

          // setBulkData1Length(r?.data?.total?.aggregate?.count);
        });
      },
    };
    gridRefRights1.current = params;
    params.api.setServerSideDatasource(dataSource);
  }, []);
  const onGridReadyMerged = useCallback((params) => {
    const dataSource = {
      getRows: (params) => {
        fetchMoreMerger({
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

          // setBulkData1Length(r?.data?.total?.aggregate?.count);
        });
      },
    };
    gridRefMerger.current = params;
    params.api.setServerSideDatasource(dataSource);
  }, []);

  useEffect(() => {
    if (gridRef?.current?.api) {
      gridRef?.current?.api.sizeColumnsToFit();
    }
  }, [gridRef]);

  return (
    <div className="corporate-actions">
      <Filter />
      <div className="row">
        <div className="left">
          <div
            className={`item ${active === 0 ? "active" : ""}`}
            style={{ height: 450, width: "100%" }}
            onClick={() => setActive(0)}
          >
            <h2>Dividend({dividend1Length})</h2>
            <div className={`blankTables corporateActionSideTable`}>
              <AgGridReact
                ref={gridRef}
                // containerStyle={{
                //   width: "52rem",
                //   height: "11rem",
                // }}
                className="ag"
                rowClass="row"
                rowData={dividend1?.slice(0, 5)}
                columnDefs={dividendTableHeader}
                defaultColDef={defaultColDef}
                suppressCellFocus
              />
            </div>
          </div>
          <div
            className={`item ${active === 1 ? "active" : ""}`}
            style={{ height: 450, width: "100%" }}
            onClick={() => setActive(1)}
          >
            <h2>Split/Bonus({splitBonus1Length})</h2>
            <div className={`blankTables corporateActionSideTable`}>
              <AgGridReact
                ref={gridRef}
                // containerStyle={{
                //   width: "52rem",
                //   height: "11rem",
                // }}
                rowClass="row"
                className="ag"
                rowData={splitBonus1?.slice(0, 5)}
                columnDefs={splitBonusTableHeader}
                defaultColDef={defaultColDef}
              />
            </div>
          </div>
          <div
            className={`item ${active === 2 ? "active" : ""}`}
            style={{ height: 450, width: "100%" }}
            onClick={() => setActive(2)}
          >
            <h2>Rights({rights1Length})</h2>
            <div className={`blankTables corporateActionSideTable`}>
              <AgGridReact
                ref={gridRef}
                // containerStyle={{
                //   width: "52rem",
                //   height: "11rem",
                // }}
                rowClass="row"
                className="ag"
                rowData={rights1?.slice(0, 5)}
                columnDefs={rightsTableHeader}
                defaultColDef={defaultColDef}
              />
            </div>
          </div>
          <div
            className={`item ${active === 3 ? "active" : ""}`}
            style={{ height: 450, width: "100%" }}
            onClick={() => setActive(3)}
          >
            <h2>Merger({merger1Length})</h2>
            <div className={`blankTables corporateActionSideTable`}>
              <AgGridReact
                ref={gridRef}
                // containerStyle={{
                //   width: "52rem",
                //   height: "11rem",
                // }}
                rowClass="row"
                className="ag"
                rowData={merger1?.slice(0, 5)}
                columnDefs={mergerTablesHeader}
                defaultColDef={defaultColDef}
              />
            </div>
          </div>
        </div>
        <div className="right">
          {active === 0 && (
            <DetailedTable
              ref={gridRefDividend}
              title={"Dividend"}
              count={dividend1Length}
              loading={dividend1Loading}
              onGridReady={onGridReadyDividend}
              tableHeader={dividendTableHeaderActive}
            />
          )}
          {active === 1 && (
            <DetailedTable
              ref={gridRefSplitBonus}
              title={"Split/Bonus"}
              count={splitBonus1Length}
              loading={splitBonus1Loading}
              onGridReady={onGridReadySplitBonus}
              tableHeader={splitBonusTableHeaderActive}
            />
          )}{" "}
          {active === 2 && (
            <DetailedTable
              title={"Rights"}
              ref={gridRefRights1}
              count={rights1Length}
              loading={rights1Loading}
              onGridReady={onGridReadyRights}
              tableHeader={rightsTableHeaderActive}
            />
          )}{" "}
          {active === 3 && (
            <DetailedTable
              ref={gridRefMerger}
              title={"Merger"}
              count={merger1Length}
              loading={mergerData1Loading}
              onGridReady={onGridReadyMerged}
              tableHeader={mergerTablesHeaderActive}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CorporateActions;
