import React, { useState } from "react";
import { Table } from "antd";
import PropTypes, { number } from "prop-types";
import { GET_CASHMARKET } from "../../../../gql/queries";

import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
const columns = [
  {
    title: "Date",
    dataIndex: "Date",
    key: "Date",
    width: "33%",
    render(text, record) {
      return {
        props: {
          style: { background: "#c7c6c61a" },
        },
        children: <div>{text}</div>,
      };
    },
  },
  {
    title: "Amount",
    dataIndex: "Amount",
    key: "Amount",
    // width: "21%",
  },
  {
    title: "Nifty Closing",
    dataIndex: "NiftyClosing",
    // width: "21%",
    key: "NiftyClosing",
  },
  {
    title: "Change",
    dataIndex: "Change",
    width: "21%",
    key: "Change",
  },
];
var uniqueyear = [];
var uniquemonth = [];
var uniqueday = [];

const ParticipantsCashMarketTable = ({
  fii,
  dii,
  headerLable,
  setSelectedmarket,
  selectedmarket,
  setSelectedDate,
}) => {
  const theme = useSelector((state) => state.Common.theme);
  const [table, setTable] = useState([]);
  const Map = {
    FII: fii,
    DII: dii,
  };
  return (
    <Table
      columns={columns}
      dataSource={Map[headerLable]}
      pagination={false}
      defaultExpandAllRows={true}
      onRow={(record) => {
        return {
          onClick: (event) => {
            setSelectedmarket(record.symbol);
            setSelectedDate(record?.Date);
          },
        };
      }}
    />
  );
};

ParticipantsCashMarketTable.propTypes = {
  name: PropTypes.string,
};

export default ParticipantsCashMarketTable;
