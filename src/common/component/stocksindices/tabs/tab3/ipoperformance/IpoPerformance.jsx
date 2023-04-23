import { AgGridReact } from "ag-grid-react";
import React from "react";
import Filter from "../../../../filter/Filter";
import List from "../../../../list/List";
import { useQuery } from "@apollo/client";
import {
  GET_IPO_DATA,
  GET_VIEW_IPO_PERFORMANCE,
} from "../../../../../../gql/queries";
import dayjs from "dayjs";

// redux
import { useSelector } from "react-redux";
import { useState } from "react";

const now = dayjs().format("YYYY-MM-DD");
const year = dayjs().subtract(1, "year").format("YYYY-MM-DD");

const IpoPerformance = () => {
  //
  const { newsSearchText, newsSorting } = useSelector(
    (state) => state.StockIndices
  );
  //
  const theme = useSelector((state) => state.Common.theme);
  const [data, setData] = useState([]);

  // const { data: ipoPerformanceData } = useQuery(GET_IPO_DATA, {
  //   variables: {
  //     where: {
  //       _and: [
  //         { company: { stocks: { listed_date: { _gte: year } } } },
  //         { company: { name: { _ilike: `%${newsSearchText}%` } } },
  //       ],
  //     },
  //     // order_by: { company: { stocks: { listed_date: newsSorting } } },
  //   },
  //   onCompleted: (v) => setData(v?.indiacharts_initial_public_offerings),
  // });

  const { data: ipoPerformanceData } = useQuery(GET_VIEW_IPO_PERFORMANCE, {
    variables: {
      where: {
        _and: [
          {
            company_name:
              newsSearchText.length > 0
                ? { _ilike: `%${newsSearchText}%` }
                : undefined,
          },
        ],
      },
      // order_by: { listed_date: newsSorting },
      order_by: { listed_date: newsSorting === 'asc' ? "desc" : "asc" },
    },
    onCompleted: (v) => setData(v?.indiacharts_view_ipo_performance),
  });

  const tableHeader = [
    {
      headerName: "STOCK",
      field: "company_name",
      flex: 1,
      suppressMenu: true,
      minWidth: 300,
    },
    {
      headerName: "LISTING DATE",
      field: "listed_date",
      flex: 1,
      suppressMenu: true,
    },
    {
      headerName: "CMP",
      field: "current_price",
      flex: 1,
      suppressMenu: true,
    },
    {
      headerName: "OFFERED PRICE",
      field: "offer_price",
      flex: 1,
      suppressMenu: true,
    },
    {
      headerName: "%CHANGE",
      field: "offer_change",
      flex: 1,
      suppressMenu: true,
      valueGetter: (params) => {
        return params?.data?.offer_change?.toFixed(2);
      },
    },
    {
      headerName: "LISTING PRICE",
      field: "listed_price",
      flex: 1,
      suppressMenu: true,
    },
    {
      headerName: "%CHANGE",
      field: "listing_change",
      flex: 1,
      suppressMenu: true,
      valueGetter: (params) => {
        return params?.data?.listing_change?.toFixed(2);
      },
    },
  ];

  return (
    <div className="ipoperformance" style={{ height: "100%" }}>
      <Filter />
      <div
        className={`ipo_agTable ${
          theme == "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
        }`}
        // className={`stockIndicesTable`}
        style={{ height: "74vh" }}
      >
        <AgGridReact
          style={{ width: "fit-content", height: "fit-content" }}
          columnDefs={tableHeader}
          rowData={data}
          rowClass="row_cls"
          suppressCellFocus
        />
      </div>
    </div>
  );
};

export default IpoPerformance;
