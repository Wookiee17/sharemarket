import React, { useRef } from "react";
import Filter from "../../../../filter/Filter";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@apollo/client";
import { GET_IPO_DATA } from "../../../../../../gql/queries";
import dayjs from "dayjs";

//utils
import { convertCrores, convertLakhs } from "../../../../../utils";

// redux
import { useSelector } from "react-redux";
import { useState } from "react";

const Upcoming = () => {
  //
  const { newsSearchText, newsSorting } = useSelector(
    (state) => state.StockIndices
  );
  //
  const theme = useSelector((state) => state.Common.theme);
  const gridRef = useRef(null);

  const [data, setData] = useState([]);

  useQuery(GET_IPO_DATA, {
    variables: {
      where: {
        _and: [
          {
            company:
              newsSearchText.length > 0
                ? { name: { _ilike: `%${newsSearchText}%` } }
                : undefined,
          },
          { opens_at: { _gt: dayjs().format("YYYY-MM-DD") } },
        ],
      },
      order_by: { opens_at: newsSorting },
    },
    onCompleted: (v) => {
      if (Array.isArray(v?.ipo)) {
        setData(v?.ipo);
      }
    },
  });

  const tableHeader = [
    {
      headerName: "STOCK",
      field: "company.name",
      // suppressSizeToFit: true,
      suppressMenu: true,
    },
    {
      headerName: "FACE VALUE (Rs)",
      field: "face_value",
      flex: 1,
      suppressMenu: true,
      // cellClass: 'ag-right-aligned-cell',
    },
    {
      headerName: "SHARES OFFERED (Lac)",
      field: "offered_shares",
      suppressMenu: true,
      flex: 1,
      valueGetter: (params) => {
        return convertLakhs(params?.data?.offered_shares);
      },
    },
    {
      headerName: "ISSUE SIZE (Cr.)",
      field: "issue_size",
      suppressMenu: true,
      flex: 1,
      valueGetter: (params) => {
        return convertCrores(params?.data?.issue_size);
      },
    },
    {
      headerName: "LOT SIZE",
      field: "lot_size",
      suppressMenu: true,
      flex: 1,
      // cellClass: 'ag-right-aligned-cell'
    },
    {
      headerName: "OFFER PRICE (Rs)",
      field: "offer_price",
      suppressMenu: true,
      flex: 1,
      // cellClass: 'ag-right-aligned-cell'
    },
    {
      headerName: "OPEN DATE",
      field: "opens_at",
      suppressMenu: true,
      flex: 1,
      type: "center",
    },
    {
      headerName: "CLOSE DATE",
      field: "closes_at",
      suppressMenu: true,
      flex: 1,
    },
    {
      headerName: "ALLOTMENT DATE",
      field: "allotment_date",
      suppressMenu: true,
      flex: 1,
    },
  ];
  return (
    <div className="upcoming">
      <Filter />
      <div
        className={`ipo_agTable ${
          theme == "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
        }`}
        style={{ height: "79vh" }}
      >
        <AgGridReact
          onGridReady={{}}
          ref={gridRef}
          columnDefs={tableHeader}
          rowData={data}
          rowClass={"row_cls"}
          suppressCellFocus
          // suppressSizeToFit={true}
        />
      </div>
    </div>
  );
};

export default Upcoming;
