import React, { useCallback, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import _ from "lodash";
import moment from "moment/moment";

// layout
import Layout from "../../common/layouts/Layout";

// redux
import { useSelector, useDispatch } from "react-redux";

//graphql
import { useQuery } from "@apollo/client";
import { GET_STOCK_NEWS } from "../../gql/queries";

const Scanners = () => {
  const createFakeServer = (fakeServerData) => {
    const fakeServer = {
      data: fakeServerData,
      getData: function (request) {
        function extractRowsFromData(groupKeys, data) {
          if (groupKeys.length === 0) {
            return data.map(function (d) {
              return {
                group: !!d.children,
                employeeId: d.employeeId,
                employeeName: d.employeeName,
                employmentType: d.employmentType,
                jobTitle: d.jobTitle,
              };
            });
          }
          var key = groupKeys[0];
          for (var i = 0; i < data.length; i++) {
            if (data[i].employeeId === key) {
              return extractRowsFromData(
                groupKeys.slice(1),
                data[i].children.slice()
              );
            }
          }
        }
        return extractRowsFromData(request.groupKeys, this.data);
      },
    };
    return fakeServer;
  };

  const createServerSideDatasource = (fakeServer) => {
    const dataSource = {
      getRows: (params) => {
        // console.log("ServerSideDatasource.getRows: params = ", params);
        var allRows = fakeServer.getData(params.request);
        var request = params.request;
        var doingInfinite = request.startRow != null && request.endRow != null;
        var result = doingInfinite
          ? {
              rowData: allRows.slice(request.startRow, request.endRow),
              rowCount: allRows.length,
            }
          : { rowData: allRows };
        // console.log("getRows: result = ", result);
        setTimeout(function () {
          params.success(result);
        }, 200);
      },
    };
    return dataSource;
  };

  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const { theme } = useSelector((state) => state.Common);
  const { newsSearchText, newsSorting } = useSelector(
    (state) => state.StockIndices
  );
  const [newsData, setNewsData] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 3000,
    offset: 0,
  });

  const formatData = (data) => {
    let arr = [];
    const grouped = _.groupBy(data, (item) =>
      moment(item.news_date).format("ddd DD MMM YYYY")
    );
    
    for (const [key, value] of Object.entries(grouped)) {
      arr.push({
        id: key,
        company: value[0].company,
        company_code: value[0].company_code,
        company_id: value[0].company_id,
        content: value[0].content,
        created_at: value[0].created_at,
        exchange: value[0].exchange,
        headlines: value[0].headlines,
        modified_at: value[0].modified_at,
        news_classification: value[0].news_classification,
        news_date: key,
        group: true,
        news_type: value[0].news_type,
        source_name: value[0].source_name,
        __typename: value[0].__typename,
        children: [
          value.map((d) => {
            return {
              id: key + d.headlines,
              company: d.company,
              company_code: d.company_code,
              company_id: d.company_id,
              content: d.content,
              created_at: d.created_at,
              exchange: d.exchange,
              headlines: d.headlines,
              modified_at: d.modified_at,
              news_classification: d.news_classification,
              news_date: key,
              group: false,
              news_type: d.news_type,
              source_name: d.source_name,
              __typename: d.__typename,
            };
          }),
        ],
      });
    }
    console.log("data Formated -> ", grouped, arr);
    return arr
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

  const [columnDefs, setColumnDefs] = useState([
    { field: "news_date", hide: true },
    { field: "headlines", hide: true },

  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 240,
      filter: "agTextColumnFilter",
      flex: 1,
    };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      field: "news_date",
      cellRendererParams: {
        innerRenderer: (params) => {
          // display employeeName rather than group key (employeeId)
          return params.data.news_date;
        },
      },
    };
  }, []);
  
  const isServerSideGroupOpenByDefault = useCallback((params) => {
    return params.rowNode.level < 2;
  }, []);

  const isServerSideGroup = useCallback((dataItem) => {
    return dataItem.group;
  }, []);

  const getServerSideGroupKey = useCallback((dataItem) => {
    return dataItem.id;
  }, []);

  const onGridReady = useCallback((params) => {
    
  }, []);

  return (
    <Layout>
      {/* <div className={`tabs-body ${theme}`}> */}
      <Head>
        <title>Test | IC Trading</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={containerStyle}>
        <div style={gridStyle} className="general_agTable ag-theme-alpine-dark">
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            rowData={newsData}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            // rowModelType={"serverSide"}
            treeData={true}
            animateRows={true}
            // isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
            // isServerSideGroup={isServerSideGroup}
            // getServerSideGroupKey={getServerSideGroupKey}
            onGridReady={onGridReady}
          ></AgGridReact>
        </div>
      </div>
      {/* </div> */}
    </Layout>
  );
};

export default Scanners;
