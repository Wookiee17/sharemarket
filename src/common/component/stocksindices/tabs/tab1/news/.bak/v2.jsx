import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import moment from "moment/moment";
import Link from "next/link";

//icons
import { AiOutlineFolderAdd } from "react-icons/ai";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedNews,
  setSelectedAnnouncement,
} from "../../../../../../store/stockIndices/StockIndicesSlice";

//graphql
import { useQuery } from "@apollo/client";
import { GET_STOCK_NEWS } from "../../../../../../gql/queries";

const NewsListing = ({ rowData = [], loading = false, type }) => {
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const { theme } = useSelector((state) => state.Common);
  const { newsSearchText, newsSorting } = useSelector(
    (state) => state.StockIndices
  );
  const [tableReady, setTableReady] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
  });
  let expand = "true";

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: false,
      filter: false,
      sortIcon: true,
      unSortIcon: true,
      suppressMenu: true,
      flex: 1,
    };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      flex: 1,
      cellRenderer: ({ data }) => {
        return (
          <>
            <div className={`icon`}>
              <AiOutlineFolderAdd style={{ fontSize: "1.2rem" }} />
            </div>
            <div className="list" style={{ marginLeft: 10 }}>
              {data?.company?.name && (
                <Link href="#">{data?.company?.name}:</Link>
              )}
              {data?.headlines}
              <span style={{ color: "#758696", marginLeft: "0.5rem" }}>
                {moment(data?.news_date).format("HH:mm A")}
              </span>
            </div>
          </>
        );
      },
    };
  }, []);

  const columnDefs = [
    {
      field: "news_date",
      rowGroup: true,
      hide: true,
      flex: 1,
      valueGetter: (params) => {
        if (params.data.news_date == undefined) return "";
        let date = moment(params.data.news_date).format("DD/MM/YYYY");
        return date;
      },
      cellRenderer: ({ data }) => {
        console.log(data);
        return <>{data?.news_date}</>;
      },
    },
    {
      field: "headlines",
    },
  ];

  const { loading: NewsLoading, fetchMore: fetchMoreNews } = useQuery(
    GET_STOCK_NEWS,
    {
      variables: {
        limit: pagination.limit,
        offset: pagination.offset,
        where: {
          headlines: { _ilike: `%${newsSearchText}%` },
          news_classification: { _eq: "news" },
          news_date: {
            _gte: moment().subtract(1, "months").format("YYYY-MM-DD"),
          },
        },
        order_by: {
          news_date: newsSorting == "ase" ? "ase" : "dsce",
        },
      },
      onCompleted: (data) => {
        // setNewsData([...newsData, ...data?.news])
        setNewsData(data?.news);
        gridRef.current.api.onSortChanged();
        console.log(data?.news);
      },
    }
  );

  const onGridReady = useCallback((params) => {
    const dataSource = {
      getRows: (params) => {
        fetchMoreNews({
          variables: {
            offset: params?.request?.startRow || params?.startRow,
          },
        }).then((r) => {
          let lastRow = -1;
          const total = r?.data?.total?.aggregate?.count;
          if ((params?.request?.endRow || params?.endRow) >= total) {
            lastRow = total;
          }
          params.successCallback(r?.data?.news, lastRow);
          // setBulkData1Length(r?.data?.total?.aggregate?.count);
        });
      },
    };
    gridRef.current = params;
    params.api.setServerSideDatasource(dataSource);
    // setTableReady(true);
  }, []);

  // useEffect(() => {
  //   if (tableReady) {
  //     if (loading) {
  //       //show loading overlay in AG Grid
  //       gridRef.current.api.showLoadingOverlay();
  //     } else {
  //       //hide loading overlay when loading is completed
  //       gridRef.current.api.hideOverlay();
  //     }
  //   }
  // }, [tableReady, NewsLoading]);

  return (
    <div
      className={`StockIndicesNewsTable ${
        theme == "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
      }`}
      style={{ height: "79vh" }}
    >
      <div style={{ height: "calc(100% - 25px)" }}>
        <AgGridReact
          ref={gridRef}
          // rowClass="row"
          // className="news_annoucement_ag"
          // rowData={newsData}
          getChildCount={(data) => data.childCount}
          cacheBlockSize={50}
          serverSideInfiniteScroll
          rowModelType="serverSide"
          showLoadingOverlay={NewsLoading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          groupDisplayType={"groupRows"}
          showOpenedGroup={false}
          suppressAggFuncInHeader={true}
          animateRows={true}
          onGridReady={onGridReady}
          onRowDataUpdated={(e) => {
            e.api.forEachNode((row, index) => {
              if (index === 0) {
                row.setExpanded(true);
              }
            });
            e.api?.getDisplayedRowAtIndex(0)?.selectThisNode(true);
          }}
          onRowClicked={(e) => {
            if (type === "news") {
              dispatch(setSelectedNews(e.data));
            } else if (type === "announcement") {
              dispatch(setSelectedAnnouncement(e.data));
            }
            e.node.setExpanded(!e.node.expanded);
          }}
          // headerHeight="0"
          suppressCellFocus
          // rowSelection="single"
          // onFirstDataRendered={() => {
          //   if (type === "news") {
          //     if (newsSorting == "desc") dispatch(setSelectedNews(rowData[0]));
          //     else dispatch(setSelectedNews(newsData[newsData.length - 1]));
          //   } else if (type === "announcement") {
          //     if (newsSorting == "desc")
          //       dispatch(setSelectedAnnouncement(rowData[0]));
          //     else
          //       dispatch(setSelectedAnnouncement(rowData[rowData.length - 1]));
          //   }
          // }}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default NewsListing;
