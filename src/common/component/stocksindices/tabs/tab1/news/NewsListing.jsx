import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import moment from "moment/moment";
import Link from "next/link";
import dayjs from "dayjs";

//graphql
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GET_STOCK_NEWS_DISTINCT_DATE,
  GET_STOCK_NEWS,
} from "../../../../../../gql/queries";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedNews,
  setSelectedAnnouncement,
} from "../../../../../../store/stockIndices/StockIndicesSlice";

const NewsListing = ({ type }) => {
  // Redux
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Common.theme);
  const { newsSorting } = useSelector((state) => state.StockIndices);

  // Ref
  const gridRef = useRef(null);

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

  // Distinct Stock News Dates
  const { loading: ndateLoading, fetchMore: fetchStockNewsDatesData } =
    useQuery(GET_STOCK_NEWS_DISTINCT_DATE, {
      variables: {
        // offset: 0,
        limit: 50,
        order_by: { date: newsSorting === "asc" ? "desc" : "asc" },
        where: {
          // news_classification: { _eq: type },
          ...(type === "news" && {
            _and: [
              { source_name: { _nlike: "%NSE%" } },
              { source_name: { _nlike: "%BSE%" } },
            ],
          }),
          ...(type === "announcement" && {
            _or: [
              { source_name: { _ilike: "%NSE%" } },
              { source_name: { _ilike: "%BSE%" } },
            ],
          }),
        },
      },
      onCompleted: (res) => {
        gridRef.current.api.onFilterChanged();
        gridRef.current.api.onSortChanged();
      },
    });

  // Stock News By Dates
  const [loadNews, { called, loading }] = useLazyQuery(GET_STOCK_NEWS);

  // Stock News Count By Date
  // const { loading: newsCountLoading, fetchMore: loadNewsCount } = useQuery(
  //   GET_STOCK_NEWS_COUNT_BY_DATE,
  //   {
  //     variables: {},
  //   }
  // );

  const columnDefs = [
    {
      headerName: "Headlines",
      field: "headlines",
      cellRenderer: ({ data }) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
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
          </div>
        );
      },
    },
  ];

  // Grid Ready
  const onGridReady = useCallback(
    (params) => {
      const dataSource = {
        getRows: (params) => {
          if (params.request.groupKeys.length === 0) {
            fetchStockNewsDatesData({
              variables: {
                limit: 50,
                offset: params?.request?.startRow || params?.startRow,
                where: {
                  // news_classification: { _eq: type },
                  ...(type === "news" && {
                    _and: [
                      { source_name: { _nlike: "%NSE%" } },
                      { source_name: { _nlike: "%BSE%" } },
                    ],
                  }),
                  ...(type === "announcement" && {
                    _or: [
                      { source_name: { _ilike: "%NSE%" } },
                      { source_name: { _ilike: "%BSE%" } },
                    ],
                  }),
                },
              },
            }).then((r) => {
              let lastRow = -1;
              const total = r?.data?.count?.aggregate?.count;

              if ((params?.request?.endRow || params?.endRow) >= total) {
                lastRow = total;
              }

              // Child Count Code Start
              // let rowData = [];
              // async function newsCount() {
              //   let dateRecord = r?.data?.news_dates;
              //   for (let dr = 0; dr < dateRecord.length; dr++) {
              //     let rowDataObj = {};
              //     await loadNewsCount({
              //       variables: {
              //         where: {
              //           date: {
              //             _eq: dayjs(dateRecord[dr]?.date).format("YYYY-MM-DD"),
              //           },
              //           news_classification: { _eq: type },
              //         },
              //       },
              //     }).then((response) => {
              //       rowDataObj = {
              //         group: true,
              //         ...dateRecord[dr],
              //         news_count:
              //           response?.data?.indiacharts_stock_news_aggregate
              //             ?.aggregate?.count,
              //       };
              //       rowData.push(rowDataObj);
              //     });
              //   }
              // }

              // newsCount().then(() => {
              //   params.success({ rowData: rowData, rowCount: lastRow });
              // });

              // Child Count Code End

              const rowData = r?.data?.news_dates?.map((d) => ({
                group: true,
                ...d,
              }));
              params.success({ rowData: rowData, rowCount: lastRow });
            });
          } else {
            var key = params.request.groupKeys[0];

            loadNews({
              variables: {
                where: {
                  date: { _eq: dayjs(key).format("YYYY-MM-DD") },
                  // news_classification: { _eq: type },
                  ...(type === "news" && {
                    _and: [
                      { source_name: { _nlike: "%NSE%" } },
                      { source_name: { _nlike: "%BSE%" } },
                    ],
                  }),
                  ...(type === "announcement" && {
                    _or: [
                      { source_name: { _ilike: "%NSE%" } },
                      { source_name: { _ilike: "%BSE%" } },
                    ],
                  }),
                },
                order_by: { date: newsSorting === "asc" ? "desc" : "asc" },
              },
            }).then((res) => {
              const rowData = res.data?.news;
              if (rowData?.length > 0) {
                if (type === "news") {
                  dispatch(setSelectedNews(rowData[0]));
                }
                if (type === "announcement") {
                  dispatch(setSelectedAnnouncement(rowData[0]));
                }
              }
              params.success({ rowData, rowCount: rowData?.length });
            });
          }
        },
      };
      gridRef.current = params;
      params.api.setServerSideDatasource(dataSource);
    },
    [newsSorting, type]
  );

  const isServerSideGroup = useCallback((dataItem) => {
    // indicate if node is a group
    return dataItem.group;
  }, []);

  const getServerSideGroupKey = useCallback((dataItem) => {
    // specify which group key to use
    return dayjs(dataItem.date).format("ddd DD MMM YYYY");
  }, []);

  // Child Count
  // const getChildCount = (data) => {
  //   return data.news_count;
  // };

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
          onGridReady={onGridReady}
          columnDefs={columnDefs}
          rowModelType="serverSide"
          defaultColDef={defaultColDef}
          cacheBlockSize={50}
          className="system_update_ag"
          rowClass="row"
          serverSideInfiniteScroll
          tooltipShowDelay={0}
          tooltipHideDelay={3000}
          showLoadingOverlay={ndateLoading}
          isServerSideGroup={isServerSideGroup}
          getServerSideGroupKey={getServerSideGroupKey}
          treeData={true}
          groupDisplayType={"groupRows"}
          onRowClicked={(e) => {
            if (type === "news") {
              dispatch(setSelectedNews(e.data));
            } else if (type === "announcement") {
              dispatch(setSelectedAnnouncement(e.data));
            }
            e.node.setExpanded(!e.node.expanded);
          }}
          rowSelection="single"
          // getChildCount={getChildCount}
          onRowDataUpdated={(e) => {
            e.api.forEachNode((row, index) => {
              if (index === 0) {
                row.setExpanded(true);
              }
            });
            e.api?.getDisplayedRowAtIndex(0)?.selectThisNode(true);
          }}
        />
      </div>
    </div>
  );
};

export default NewsListing;
