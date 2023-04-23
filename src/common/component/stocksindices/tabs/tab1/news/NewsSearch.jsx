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

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedNews,
  setSelectedAnnouncement,
} from "../../../../../../store/stockIndices/StockIndicesSlice";

// graphql
import { useQuery } from "@apollo/client";
import { GET_STOCK_NEWS } from "../../../../../../gql/queries";

const NewsSearch = ({ type }) => {
  const gridRef = useRef(null);

  // redux
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Common.theme);
  const { newsSorting, newsSearchText } = useSelector(
    (state) => state.StockIndices
  );

  // State
  const [tableReady, setTableReady] = useState(false);
  const [newsData, setNewsData] = useState([]);

  // Stock News Query
  const { loading } = useQuery(GET_STOCK_NEWS, {
    variables: {
      where: {
        headlines: { _ilike: `%${newsSearchText}%` },
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
      order_by: {
        news_date: newsSorting === "asc" ? "desc" : "asc",
      },
    },
    onCompleted: (data) => {
      setNewsData(data?.news);
    },
  });

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

  const columnDefs = [
    {
      field: "news_date",
      rowGroup: true,
      flex: 1,
      valueGetter: (params) => {
        if (params.data.news_date == undefined) return "";
        let date = moment(params.data.news_date).format("DD/MM/YYYY");
        return date;
      },
      valueFormatter: (data) => {
        let date = moment(data.value, "DD/MM/YYYY").format("ddd DD MMM YYYY");
        return data.value ? date : "";
      },
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
    },
  ];

  const onGridReady = useCallback((params) => {
    setTableReady(true);
  }, []);

  useEffect(() => {
    if (tableReady) {
      if (loading) {
        //show loading overlay in AG Grid
        gridRef.current.api.showLoadingOverlay();
      } else {
        //hide loading overlay when loading is completed
        gridRef.current.api.hideOverlay();
      }
    }
  }, [tableReady, loading]);

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
          rowClass="row"
          className="news_annoucement_ag"
          rowData={newsData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          groupDisplayType={"groupRows"}
          showOpenedGroup={true}
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
          headerHeight="0"
          suppressCellFocus
          rowSelection="single"
        ></AgGridReact>
      </div>
    </div>
  );
};

export default NewsSearch;
