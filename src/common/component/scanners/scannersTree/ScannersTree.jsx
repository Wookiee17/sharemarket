import React, { useState } from "react";

// icons
import { AiOutlinePushpin } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";

// component
import ScannersTreeItem from "./ScannersTreeItem";

// redux
import { useSelector } from "react-redux";

//constants
import { SCANNERS_LIST } from "../../../constants/data";

//graphql
import { useQuery } from "@apollo/client";
import { GET_CANDLESTICK_SCANNER_SIDEBAR } from "../../../../gql/queries";

// data
const customScanner = [
  // {
  //   title: "Custome Scanners",
  //   icon: <FiPlus />,
  //   btnFunc: () => {
  //     // console.log("Clicked Scanner");
  //   },
  //   options: [
  //     { id: 0, title: "Near 52 Week High/Low" },
  //     {
  //       id: 1,
  //       title: "New 52 Week High/Low",
  //     },
  //     { id: 2, title: "Relative strength Comparative" },
  //     { id: 3, title: "Swing High/Low Breakout" },
  //     { id: 4, title: "Gap Up/Gap Down Stocks" },
  //   ],
  // },
];
const ScannersTree = () => {
  const theme = useSelector((state) => state.Common.theme);
  const [scannerData, setScannerData] = useState(SCANNERS_LIST);
  useQuery(GET_CANDLESTICK_SCANNER_SIDEBAR, {
    onCompleted: (value) => {
      const candlestick_scanners = value.candlestick_scanners;
      if (Array.isArray(candlestick_scanners)) {
        const _scannerData = [...scannerData];
        console.log(value, "tree");
        _scannerData[3].options = candlestick_scanners.map((sc, i) => {
          return { id: 40 + i, title: sc.type };
        });
        setScannerData(_scannerData);
      }
    },
  });

  return (
    <div className={`Scanner_tree ${theme}`}>
      <div className="Scanner_tree-header">
        <p>Select</p>
        <div className="btn">
          <AiOutlinePushpin />
        </div>
      </div>
      <div className={`Scanner_tree-body ${theme}`}>
        {scannerData.map((item, i) => (
          <React.Fragment key={i}>
            <ScannersTreeItem
              title={item.title}
              options={item.options}
              btnFunc={item.btnFunc}
              icon={item.icon}
              badge={item.badge}
              open={item?.default}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ScannersTree;
