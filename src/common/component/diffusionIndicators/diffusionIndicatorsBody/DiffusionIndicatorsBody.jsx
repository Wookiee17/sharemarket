import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Select } from "antd";
//graphql
import { useQuery, useApolloClient } from "@apollo/client";
import { GET_INDICATORS } from "../../../../gql/sentimentIndicators/query";
import { GET_INDICES_DIFFUSION_INDICATORS } from "../../../../gql/queries";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  setIndicators,
  setSelectedIndicator,
  setIndicatorsFlatten,
  setSelectedIndex
} from "../../../../store/diffusionIndicator/DiffusionIndicatorSlice";

// components
import DropDown from "../../dropDown/DropDown";

const TradingViewChart = dynamic(() => import("../tradingChart/TradingChart"), {
  ssr: false,
});
const { Option } = Select;
const DiffusionIndicatorsBody = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const { theme, indices } = useSelector((state) => state.Common);
  const {
    indicators,
    selectedIndicatorObj,
    selectedIndex
  } = useSelector((state) => state.DiffusionIndicator);

  // options dropdown
  const [indicesOptions, setIndicesOptions] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState("Nifty 50");
  const fetchIndicesForIndicators = async (indices) => {
    const _indicesDetails = []
    indices.map((index) => {
      const indexDetail = getIndexDetail(index)
      _indicesDetails.push({
        ...indexDetail,
        label: indexDetail.name,
        value: indexDetail.symbol
      })
    })
    setIndicesOptions(_indicesDetails)
    dispatch(setSelectedIndex(_indicesDetails[0]))
    // const resp = await client.query({
    //   query: GET_INDICES_DIFFUSION_INDICATORS,
    //   variables: {
    //     where: {
    //       id: { _in: indices }
    //     }
    //   }
    // })
    // const _indices = resp.data?.indices
    // if (Array.isArray(_indices)) {
    //   setIndicesOptions(_indices.map(ind => ({
    //     label: ind.name,
    //     value: ind.symbol
    //   })))
    //   dispatch(setSelectedIndex(_indices[0]?.symbol))
    // }
  }
  const getIndexDetail = (indexId) => {
    const detail = indices.filter(ind => ind.id === indexId)
    if (detail.length) {
      return detail[0]
    } else {
      return null
    }
  }
  useQuery(GET_INDICATORS, {
    skip: indices.length === 0,
    variables: {
      category: "diffusion"
    },
    onCompleted: ({ indicator_headers, indicators }) => {
      const _indicators = indicator_headers.map((header, i) => {
        let options = indicators
          .filter((ind) => ind.headers.includes(header.id))
          .map((ind, j) => {
            return {
              ...ind,
              title: ind.name,
              index: `${i}.${j}`,
            };
          });
        return {
          title: header.label,
          index: String(i),
          expanded: i === 0 ? true : false, //open first menu by default
          options,
        };
      });
      if (_indicators.length) {
        const allIndicators = []
        indicators.map(ind => {
          ind.indexes.map(indx => {
            const indexDetail = getIndexDetail(indx)
            allIndicators.push({
              ...ind,
              name: `${ind.name} ${indexDetail.name}`,
              index: indexDetail
            })
          })
        })
        dispatch(setIndicators(_indicators));
        dispatch(setIndicatorsFlatten(allIndicators));
        if (_indicators[0].options?.length) {
          dispatch(setSelectedIndicator(_indicators[0].options[0])); //set first indicator as default indicator
        }
      }
    },
  });
  useEffect(() => {
    if (Array.isArray(selectedIndicatorObj?.indexes)) {
      fetchIndicesForIndicators(selectedIndicatorObj?.indexes)
    }
  }, [selectedIndicatorObj])
  return (
    indicators.length > 0 && (
      <div className={`DiffusionIndicatorsBody ${theme}`}>
        <div className="DiffusionIndicatorsBody-header">
          <Select
            onChange={(value, item) => {
              dispatch(setSelectedIndex(item.data))
            }}
            name="index"
            placeholder="Nifty 50"
            value={selectedIndex}
          >
            {indicesOptions.map((index, i) => (
              <Option 
                value={index.value} 
                key={i}
                data={index}
              >{index.label}</Option>
            ))}
          </Select>
        </div>
        <div className="DiffusionIndicatorsBody-bottom">
          <div className="DiffusionIndicatorsBody-bottom_tradingWidget">
            {(selectedIndex !== null) && (
              <TradingViewChart
              // indexData={stockPriceData}
              // indicatorData={dailySwingData}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DiffusionIndicatorsBody;
