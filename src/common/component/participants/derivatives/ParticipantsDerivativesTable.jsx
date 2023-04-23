import React from "react";
import { Table } from "antd";
import { v4 as uuidv4 } from "uuid";

// redux
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { GET_FII_DERIVATIVES } from "../../../../gql/queries";
import dayjs from "dayjs";

const columns1 = [
  {
    title: "Type",
    dataIndex: "instrument_type",
    key: "instrument_type",
    width: "12%",
  },
  {
    title: "Date",
    dataIndex: "priced_date",
    key: "priced_date",
    // width: "12%",
  },
  {
    title: "Long",
    dataIndex: "long",
    // width: "30%",
    key: "long",
  },
  {
    title: "Short",
    dataIndex: "short",
    // width: "30%",
    key: "short",
  },
  {
    title: "Total Difference",
    dataIndex: "total_diff",
    // width: "30%",
    key: "total_diff",
  },
  {
    title: "Day's Change in Long",
    dataIndex: "change_in_long",
    // width: "30%",
    key: "change_in_long",
  },
  {
    title: "Day's Change in Short",
    dataIndex: "change_in_short",
    // width: "30%",
    key: "change_in_short",
  },
  {
    title: "Net Change",
    dataIndex: "change_in_total",
    // width: "30%",
    key: "change_in_total",
  },
  {
    title: "Interpretation",
    dataIndex: "Interpretation",
    // width: "30%",
    key: "Interpretation",
    render: (_, record) => {
      if (record?.change_in_total) {
        if (record?.instrument_type?.includes("Put")) {
          if (record?.change_in_total > 0) {
            return <div style={{ color: "#FF4A4A" }}>BEARISH</div>;
          } else {
            return <div style={{ color: "#52C41A" }}>BULLISH</div>;
          }
        } else {
          if (record?.change_in_total < 0) {
            return <div style={{ color: "#FF4A4A" }}>BEARISH</div>;
          } else {
            return <div style={{ color: "#52C41A" }}>BULLISH</div>;
          }
        }
      }
    },
  },
];

const ParticipantsDerivativesTable = ({
  date,
  setSelectedOption,
  selectedOption,
  setSelectedDate,
}) => {
  const dateFrom = dayjs(date).subtract(30, "days").format("YYYY-MM-DD");

  const { data: fiiData, loading: fiiLoading } = useQuery(GET_FII_DERIVATIVES, {
    variables: {
      order_by: { priced_date: "desc" },
      where: {
        _and: [
          { priced_date: { _lte: date } },
          { priced_date: { _gte: dateFrom } },
          { client_type: { _eq: "FII" } },
        ],
      },
    },
    onCompleted: (data) => {
      setSelectedOption(`FII_${data?.derivatives?.[0]?.instrument_type}`);
      setSelectedDate(data?.derivatives?.[0]?.priced_date);
    },
  });

  const { data: diiData, loading: diiLoading } = useQuery(GET_FII_DERIVATIVES, {
    variables: {
      order_by: { priced_date: "desc" },
      where: {
        _and: [
          { priced_date: { _lte: date } },
          { priced_date: { _gte: dateFrom } },
          { client_type: { _eq: "DII" } },
        ],
      },
    },
  });

  const { data: proData, loading: proLoading } = useQuery(GET_FII_DERIVATIVES, {
    variables: {
      order_by: { priced_date: "desc" },
      where: {
        _and: [
          { priced_date: { _lte: date } },
          { priced_date: { _gte: dateFrom } },
          { client_type: { _eq: "Pro" } },
        ],
      },
    },
  });

  const { data: clientData, loading: clientLoading } = useQuery(
    GET_FII_DERIVATIVES,
    {
      variables: {
        order_by: { priced_date: "desc" },
        where: {
          _and: [
            { priced_date: { _lte: date } },
            { priced_date: { _gte: dateFrom } },
            { client_type: { _eq: "Client" } },
          ],
        },
      },
    }
  );

  const data1 = [
    {
      key: "FII",
      instrument_type: "FII",
      children: fiiData?.derivatives
        ?.filter((i) => i.priced_date === date)
        ?.sort((a, b) => {
          let fa = a?.instrument_type;
          let fb = b?.instrument_type;
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        })
        ?.map((d) => ({
          ...d,
          key: `FII_${d?.instrument_type}`,
          children: fiiData?.derivatives
            ?.filter(
              (i) =>
                i?.instrument_type === d?.instrument_type &&
                i?.priced_date !== date
            )
            ?.map((data) => ({
              ...data,
              instrument_type: "",
              key: uuidv4(),
            })),
        })),
    },
    {
      key: "PRO",
      instrument_type: "PRO",
      children: proData?.derivatives
        ?.filter((i) => i.priced_date === date)
        ?.sort((a, b) => {
          let fa = a?.instrument_type;
          let fb = b?.instrument_type;
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        })

        ?.map((d) => ({
          ...d,
          key: `Pro_${d?.instrument_type}`,
          children: proData?.derivatives
            ?.filter(
              (i) =>
                i?.instrument_type === d?.instrument_type &&
                i?.priced_date !== date
            )
            ?.map((data) => ({
              ...data,
              instrument_type: "",
              key: uuidv4(),
            })),
        })),
    },
    {
      key: "DII",
      instrument_type: "DII",
      children: diiData?.derivatives
        ?.filter((i) => i.priced_date === date)
        ?.sort((a, b) => {
          let fa = a?.instrument_type;
          let fb = b?.instrument_type;
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        })

        ?.map((d) => ({
          ...d,
          key: `DII_${d?.instrument_type}`,
          children: diiData?.derivatives
            ?.filter(
              (i) =>
                i?.instrument_type === d?.instrument_type &&
                i?.priced_date !== date
            )
            ?.map((data) => ({
              ...data,
              instrument_type: "",
              key: uuidv4(),
            })),
        })),
    },
    {
      key: "Client",
      instrument_type: "Client",
      children: clientData?.derivatives
        ?.filter((i) => i.priced_date === date)
        ?.sort((a, b) => {
          let fa = a?.instrument_type;
          let fb = b?.instrument_type;
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        })

        ?.map((d) => ({
          ...d,
          key: `Client_${d?.instrument_type}`,
          children: clientData?.derivatives
            ?.filter(
              (i) =>
                i?.instrument_type === d?.instrument_type &&
                i?.priced_date !== date
            )
            ?.map((data) => ({
              ...data,
              instrument_type: "",
              key: uuidv4(),
            })),
        })),
    },
  ];

  const loading = clientLoading || proLoading || diiLoading || fiiLoading;

  const theme = useSelector((state) => state.Common.theme);
  return (
    <Table
      sticky={true}
      rowKey={"key"}
      rowClassName={(record, idx) =>
        record?.key === selectedOption ? "active" : ""
      }
      expandable={{ defaultExpandAllRows: false }}
      defaultExpandedRowKeys={["FII", "DII", "PRO", "Client"]}
      columns={columns1}
      dataSource={data1}
      pagination={false}
      loading={loading}
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            if (record?.hasOwnProperty("children") && record?.change_in_total) {
              setSelectedOption(record?.key);
              setSelectedDate(record?.priced_date);
            }
            // if (
            //   !record?.hasOwnProperty("children") &&
            //   record?.change_in_total
            // ) {
            //   setSelectedDate(record?.priced_date);
            // }
          },
          onMouseOver: (event) => {
            setSelectedDate(record?.priced_date);
          },
        };
      }}
    />
  );
};

export default ParticipantsDerivativesTable;
