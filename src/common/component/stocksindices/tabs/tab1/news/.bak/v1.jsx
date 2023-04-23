import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import Link from "next/link";
import moment from "moment/moment";
import _ from "lodash";

// ag grid
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";

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

const NewsListing = ({ type }) => {
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const { theme } = useSelector((state) => state.Common);
  const { newsSearchText, newsSorting } = useSelector(
    (state) => state.StockIndices
  );
  const [newsData, setNewsData] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
  });

  const formatData = (data) => {
    let arr = [];
    const grouped = _.groupBy(data, (item) =>
      moment(item.news_date).format("ddd DD MMM YYYY")
    );
    for (const [key, value] of Object.entries(grouped)) {
      arr.push({
        company: value[0].company,
        company_code: value[0].company_code,
        company_id: value[0].company_id,
        content: value[0].content,
        created_at: value[0].created_at,
        exchange: value[0].exchange,
        headlines: value[0].headlines,
        modified_at: value[0].modified_at,
        news_classification: value[0].news_classification,
        news_date: value[0].news_date,
        news_type: value[0].news_type,
        source_name: value[0].source_name,
        __typename: value[0].__typename,
        orgHierarchy: [key],
      });
      value.map((d) => {
        arr.push({
          company: d.company,
          company_code: d.company_code,
          company_id: d.company_id,
          content: d.content,
          created_at: d.created_at,
          exchange: d.exchange,
          headlines: d.headlines,
          modified_at: d.modified_at,
          news_classification: d.news_classification,
          news_date: d.news_date,
          news_type: d.news_type,
          source_name: d.source_name,
          __typename: d.__typename,
          orgHierarchy: [key, d.headlines],
        });
      });
    }
    console.log(arr);
  };

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
          news_date: newsSorting,
        },
      },
      onCompleted: (data) => {
        const gridData = formatData(data?.news || []);
        setNewsData(gridData);
        gridRef.current.api.onSortChanged();
        // console.log(data?.news);
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
          console.log();
          let lastRow = -1;
          const total = r?.data?.total?.aggregate?.count;
          if ((params?.request?.endRow || params?.endRow) >= total) {
            lastRow = total;
          }
          const GridData = formatData(r?.data?.news);
          params.successCallback({
            rowData: GridData,
            rowCount: lastRow,
          });
          // params.successCallback(r?.data?.news, lastRow);
          // setBulkData1Length(r?.data?.total?.aggregate?.count);
        });
      },
    };
    gridRef.current = params;
    params.api.setServerSideDatasource(dataSource);
  }, []);

  const columnDefs = [
    {
      field: "news_date",
    },
  ];

  const autoGroupColumnDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);

  const getDataPath = useMemo(() => {
    return (data) => {
      return data.orgHierarchy;
    };
  }, []);

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
          // getChildCount={(data) => data.childCount}
          treeData={true}
          cacheBlockSize={50}
          serverSideInfiniteScroll
          rowModelType="serverSide"
          showLoadingOverlay={NewsLoading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          animateRows={true}
          onGridReady={onGridReady}
          getDataPath={getDataPath}
          suppressCellFocus
          // groupDisplayType={"groupRows"}
          // showOpenedGroup={false}
          // suppressAggFuncInHeader={true}
          // onRowDataUpdated={(e) => {
          //   e.api.forEachNode((row, index) => {
          //     if (index === 0) {
          //       row.setExpanded(true);
          //     }
          //   });
          //   e.api?.getDisplayedRowAtIndex(0)?.selectThisNode(true);
          // }}
          // onRowClicked={(e) => {
          //   if (type === "news") {
          //     dispatch(setSelectedNews(e.data));
          //   } else if (type === "announcement") {
          //     dispatch(setSelectedAnnouncement(e.data));
          //   }
          //   e.node.setExpanded(!e.node.expanded);
          // }}
          // headerHeight="0"
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
