import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import Filter from "../../../../filter/Filter";
import { useQuery } from "@apollo/client";
import { GET_IPO_ONGOING } from "../../../../../../gql/queries";
import { useSelector } from "react-redux";
import _ from "lodash";
import { round } from "../../../../../utils";

//utils
import { convertCrores, convertLakhs } from "../../../../../utils";
import dayjs from "dayjs";

const Ongoing = () => {
  const [onGoingRes, setOngoingRes] = useState([]);
  //
  const { newsSearchText, newsSorting } = useSelector(
    (state) => state.StockIndices
  );
  const theme = useSelector((state) => state.Common.theme);
  //
  const [data, setData] = useState([]);

  const formatData = (data) => {
    let arr = [];
    data.map((d) => {
      arr.push({
        stock: d.company_name,
        face_value: d.face_values,
        offered_shares: d.shares_offered,
        shares_subscribed: d.shares_subscribed,
        subscription: d.subscription,
        issue_size: d.issue_size,
        lot_size: d.lot_size,
        offer_price: d.offer_price,
        opens_at: d.open_date,
        closes_at: d.close_date,
        allotment_date: d.allotment_date,
        orgHierarchy: [d.company_name],
      });
      const grouped = _.groupBy(d.subscriptions, (item) => item.category);
      for (const [key, value] of Object.entries(grouped)) {
        var total_shares_bid_for = _.sumBy(value, "shares_bid_for");
        var total_shares_offered_reserved = _.sumBy(
          value,
          "shares_offered_reserved"
        );
        var total_total_meant_for_category = _.sumBy(
          value,
          "total_meant_for_category"
        );
        arr.push({
          stock: d.company?.name || "-",
          face_value: "-",
          offered_shares: total_shares_offered_reserved,
          shares_subscribed: total_shares_bid_for,
          subscription: total_total_meant_for_category,
          issue_size: "-",
          lot_size: "-",
          offer_price: "-",
          opens_at: "-",
          closes_at: "-",
          allotment_date: "-",
          orgHierarchy: [d.company_name, key],
        });
      }
    });
    console.log(arr);
    return arr;
  };
  useQuery(GET_IPO_ONGOING, {
    variables: {
      where: {
        _and: [
          { company_id: { _is_null: false } },
          {
            company_name:
              newsSearchText.length > 0
                ? { _ilike: `%${newsSearchText}%` }
                : undefined,
          },
          // {
          //   open_date: { _lte: dayjs().format("YYYY-MM-DD") },
          // },
          // { close_date: { _gte: dayjs().format("YYYY-MM-DD") } },
        ],
      },
      order_by: { open_date: newsSorting },

      // where: {
      //   _and: [
      //     {
      //       opens_at: { _lte: "2022-01-23" },
      //     },
      //     { closes_at: { _gte: "2023-01-23" } },
      //   ],
      // },
    },
    onCompleted: (v) => {
      const data = formatData(v?.indiacharts_view_ip_ongoing || []);
      // const resArr = [];
      // const data1 = v?.indiacharts_initial_public_offerings?.map(
      //   (item) => item?.subscriptions
      // );
      // const data2 = data1?.map((i) => {
      //   resArr?.push(...i);
      //   return resArr;
      // });
      // const val = resArr?.map((i) => ({
      //   ...i,
      //   name: i?.subcategory,
      //   orgHierarchy: [i?.company?.name, i?.subcategory],
      // }));
      // const parentDatas = v?.indiacharts_initial_public_offerings?.map(
      //   (item) => ({
      //     ...item,
      //     name: item?.company?.name,
      //     orgHierarchy: [item?.company?.name],
      //   })
      // );
      // // console.log(val, "arr");
      // // console.log(parentDatas, "parent");
      // const result = [...parentDatas, ...val];
      setOngoingRes(data);
    },
  });

  // console.log(onGoingRes, "res");

  const tableHeader = [
    {
      headerName: "FACE VALUE(Rs)",
      field: "face_value",
    },
    {
      headerName: "SHARES OFFERED(Lac)",
      field: "offered_shares",
      valueGetter: (params) => {
        return convertLakhs(params?.data?.offered_shares);
      },
    },
    {
      headerName: "SHARES SUBSCRIBED(Lac)",
      field: "shares_subscribed",
      valueGetter: (params) => {
        return convertLakhs(params?.data?.shares_subscribed);
      },
    },
    {
      headerName: "SUBSCRIPTION(In Times)",
      field: "subscription",
      valueGetter: (params) => {
        const _value = params?.data?.subscription;
        return isNaN(_value) || _value === 0 || !_value
          ? "-"
          : round(_value).toFixed(2);
      },
    },
    {
      headerName: "ISSUE SIZE(Cr)",
      field: "issue_size",
      valueGetter: (params) => {
        const _issue_size = params?.data?.issue_size;
        if (!_issue_size || isNaN(_issue_size) || _issue_size === 0) {
          return "-";
        } else {
          return (_issue_size / 10000000).toFixed(2);
        }
      },
    },
    {
      headerName: "LOT SIZE",
      field: "lot_size",
    },
    {
      headerName: "OFFER PRICE(Rs)",
      field: "offer_price",
    },
    {
      headerName: "OPEN DATE",
      field: "opens_at",
    },
    {
      headerName: "CLOSE DATE",
      field: "closes_at",
    },
    {
      headerName: "ALLOTMENT DATE",
      field: "allotment_date",
    },
  ];

  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: "STOCK",
      cellRendererParams: {
        suppressSizeToFit: true,
        suppressMenu: true,
      },
      // flex: 1,
      minWidth: 300,
    };
  }, []);

  const getDataPath = useMemo(() => {
    return (data) => {
      return data.orgHierarchy;
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      sortable: false,
      resizable: false,
      filter: false,
      sortIcon: true,
      unSortIcon: true,
      suppressMenu: true,
      flex: 1,
    };
  }, []);

  return (
    <div className="ongoing">
      <Filter />
      <div
        className={` ipo_agTable ${
          theme == "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
        }`}
        // className={`stockIndicesTable`}
        style={{ height: "73vh" }}
      >
        <AgGridReact
          rowClass={"row_cls"}
          rowData={onGoingRes}
          columnDefs={tableHeader}
          treeData={true}
          animateRows={true}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          getDataPath={getDataPath}
          suppressCellFocus
        />
      </div>
    </div>
  );
};

export default Ongoing;
