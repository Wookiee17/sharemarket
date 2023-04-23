import React, {
  useState,
  useRef,
  useEffect,
  useDeferredValue,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";

// Icons
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

// redux
import { useSelector } from "react-redux";

// component
import Search from "../../search/Search";

// apollo
import { useQuery } from "@apollo/client";
import { GET_SYSTEM_UPDATE } from "../../../../gql/queries";
import { current } from "immer";

const defaultColDef = {
  wrapText: true,
  autoHeight: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  //   sortable: true,
  // cellClass: "cell-wrap-text",
};

const SystemUpdate = () => {
  const theme = useSelector((state) => state.Common.theme);
  const gridRef = useRef(null);

  const [filterSearch, setFilterSearch] = useState("");
  const searchText = useDeferredValue(filterSearch);
  const [sort, setSort] = useState(true);
  const tableHeader = [
    {
      headerName: "Date",
      field: "Date",
      filter: false,
      // sortIcon: true,
      // unSortIcon: true,
      maxWidth: 150,
      minWidth: 150,
      suppressMenu: true,
      // heigth: "10rem",
      // flex: 1,
      // cellStyle: {
      //   minHeight: "fit-content",
      // },
      // suppressMenu: true,
      // cellStyle: {
      //   textOverflow: "ellipsis",
      //   whiteSpace: "nowrap",
      //   overflow: "hidden",
      //   // padding: "0 17px",
      //   display: "flex",
      //   // lineHeight: "22px",
      // },
      // tooltipField: "Date",
      // tooltipComponentParams: {
      //   color: theme == "dark" ? "#131722" : "#e2e5ec",
      // },
    },
    {
      headerName: "Desciption",
      field: "Desciption",
      suppressMenu: true,
      filter: "agTextColumnFilter",
      // minHeight: 300,
      flex: 1,
      cellStyle: {
        // minHeight: "fit-content",
        heigth: "10rem",
        // display: "flex",
        // lineGap: ".2rem",
        // linegap: 200,
      },
      // maxWidth: "100%",
      // wrapText: true,
      // sortIcon: true,
      // unSortIcon: true,
    },
  ];

  const { loading: systemLoading, fetchMore } = useQuery(GET_SYSTEM_UPDATE, {
    variables: {
      date: sort ? "desc" : "asc",
      where: {
        description:
          searchText.length > 0 ? { _ilike: `%${searchText}%` } : undefined,
      },
      // ilike: `%${filterSearch}%`,
      limit: 50,
      offset: 0,
    },
    onCompleted: (res) => {
      gridRef.current.api.onFilterChanged();
      gridRef.current.api.onSortChanged();
      //   const dataSource = {
      //     getRows: (params) => {
      //       // debugger
      //       console.log(params,"para");
      //       let lastRow = -1;
      //       const total = res?.total?.aggregate?.count;
      //       if ((params?.request?.endRow || params?.endRow) >= total) {
      //         lastRow = total;
      //       }

      //       params.successCallback(res?.data, lastRow);
      //     },
      //   };
      //   if (gridRef?.current) {
      //     gridRef?.current?.api?.setServerSideDatasource(dataSource);
      //   }
    },
  });

  const loading = systemLoading;

  useEffect(() => {
    // if (gridRef?.current?.api) {
    gridRef?.current?.api?.sizeColumnsToFit();
    // }
  }, []);

  const onGridReady = useCallback((params) => {
    const dataSource = {
      getRows: (params) => {
        // console.log(params?.current?.endRow, "Params");
        fetchMore({
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
    gridRef.current = params;
    // console.log(gridRef?.current, "Ref");
    params.api.setServerSideDatasource(dataSource);
  }, []);

  return (
    <div className={`SystemUpdate ${theme}`}>
      <div className="SystemUpdate_header">
        <div
          className="SystemUpdate_header-sort"
          onClick={() => {
            setSort((prev) => !prev);
          }}
        >
          {sort == true ? (
            <div>
              <FiArrowDown style={{ marginRight: 5 }} />
              <span>Latest</span>
            </div>
          ) : (
            <div>
              <FiArrowUp style={{ marginRight: 5 }} />
              <span>Oldest</span>
            </div>
          )}
        </div>
        <div className="SystemUpdate_header-search">
          <Search
            placeholderText="Enter keyword"
            onChange={(v) => setFilterSearch(v.target.value)}
            onClick={() => null}
          />
        </div>
      </div>
      <div className={`blankTables `} style={{ height: "calc(100vh - 203px)" }}>
        <AgGridReact
          ref={gridRef}
          onGridReady={onGridReady}
          columnDefs={tableHeader}
          rowModelType="serverSide"
          defaultColDef={defaultColDef}
          cacheBlockSize={50}
          className="system_update_ag"
          rowClass="row"
          serverSideInfiniteScroll
          onRowClicked={(e) => {}}
          tooltipShowDelay={0}
          tooltipHideDelay={3000}
          showLoadingOverlay={loading}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default SystemUpdate;
