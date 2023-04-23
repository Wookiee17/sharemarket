import React, { useState } from "react";
import dynamic from "next/dynamic";

//graphql
import { useQuery } from "@apollo/client";
import { GET_INDICATORS } from "../../../../gql/sentimentIndicators/query";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setIndicators, setSelectedIndicator, setIndicatorsFlatten } from "../../../../store/sentimentIndicator/SentimentIndicatorSlice";

//utils
import { getSelectedSentimentIndicator } from "../../../../common/utils/index";

const TradingViewChart = dynamic(
  () => import("../tradingChart/TradingChart"),
  { ssr: false }
);

const SentimentIndicatorsBody = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.Common.theme);
  const { selectedIndicator, indicators } = useSelector((state) => state.SentimentIndicator);
  const generateBreadCrumb = () => {
    let breadcrumb = "";
    const items = getSelectedSentimentIndicator(
      indicators,
      selectedIndicator,
      false
    );
    items.map((item, i) => {
      breadcrumb += ` ${i > 0 ? ">" : ""} ${item.title}`;
    });
    return breadcrumb;
  };
  useQuery(GET_INDICATORS, {
    variables: {
      category: "sentiment"
    },
    onCompleted: ({ indicator_headers, indicators }) => {
      const _indicators = indicator_headers.map((header, i) => {
        let options = indicators.filter(ind => ind.headers.includes(header.id)).map((ind, j) => {
          return {
            ...ind,
            title: ind.name,
            index: `${i}.${j}`
          }
        })
        return {
          title: header.label,
          index: String(i),
          expanded: i === 0 ? true : false, //open first menu by default
          options
        }
      })
      if (_indicators.length) {
        dispatch(setIndicators(_indicators))
        dispatch(setIndicatorsFlatten(indicators))
        if (_indicators[0].options?.length) {
          dispatch(setSelectedIndicator(_indicators[0].options[0])) //set first indicator as default indicator
        }
      }
    }
  })
  return (
    indicators.length > 0 &&
    <div className={`SentimentIndicatorsBody ${theme}`}>
      <div className="SentimentIndicatorsBody-header">
        <p>{generateBreadCrumb()}</p>
      </div>
      <div className="SentimentIndicatorsBody-bottom">
        <div className="SentimentIndicatorsBody-bottom_tradingWidget">
          <TradingViewChart
          // indexData={stockPriceData}
          // indicatorData={dailySwingData}
          />
        </div>
      </div>
    </div>
  );
};

export default SentimentIndicatorsBody;
