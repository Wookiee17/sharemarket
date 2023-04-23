import React, { useEffect } from "react";
import PropTypes from "prop-types";

// component
import HeatmapFnOIndicators from "./HeatmapFnOIndicators";

// redux
import { useSelector } from "react-redux";

const HeatmapFnOIndicatorsWrapper = ({
  onPositive,
  onNegative,
  onPlusFive,
  onTwotoFive,
  onZerotoTwo,
  onMinusZerotoTwo,
  onMinusTwotoFive,
  onMinusFive,
  onZero,
  list,
  nestedArr,
  plusFive,
  plusTwo,
  plusZero,
  zero,
  minusZero,
  minusTwo,
  minusFive,
  sliderValue,
}) => {
  const theme = useSelector((state) => state.Common.theme);

  return (
    <div className={`HeatmapFnO-top left  ${theme}`}>
      <span onClick={onPositive}>Positive</span>
      <div>
        <HeatmapFnOIndicators
          onClick={onPlusFive}
          topNum={
            nestedArr && sliderValue === 0
              ? list?.filter((i) => i?.change_percentage?.toFixed(2) > 5).length
              : list?.filter((i) => i?.change_percentage?.toFixed(2) > 5).length
          }
          percentage={`> 5%`}
          level={`g1`}
          active={plusFive ? true : false}
        />
      </div>
      <HeatmapFnOIndicators
        onClick={onTwotoFive}
        topNum={
          nestedArr && sliderValue === 0
            ? list?.filter(
                (i) =>
                  i?.stock_prices?.[0]?.change_percentage?.toFixed(2) > 2 &&
                  i?.stock_prices?.[0]?.change_percentage?.toFixed(2) <= 5
              ).length
            : list?.filter(
                (i) =>
                  i?.change_percentage?.toFixed(2) > 2 &&
                  i?.change_percentage?.toFixed(2) <= 5
              ).length
        }
        percentage={`2-5%`}
        level={`g2`}
        active={plusTwo ? true : false}
      />
      <HeatmapFnOIndicators
        onClick={onZerotoTwo}
        topNum={
          nestedArr && sliderValue === 0
            ? list?.filter(
                (i) =>
                  i?.stock_prices?.[0]?.change_percentage?.toFixed(2) > 0 &&
                  i?.stock_prices?.[0]?.change_percentage?.toFixed(2) <= 2
              ).length
            : list?.filter(
                (i) =>
                  i?.change_percentage?.toFixed(2) > 0 &&
                  i?.change_percentage?.toFixed(2) <= 2
              ).length
        }
        percentage={`0-2%`}
        level={`g3`}
        active={plusZero ? true : false}
      />
      <HeatmapFnOIndicators
        onClick={onZero}
        topNum={
          nestedArr && sliderValue === 0
            ? list?.filter(
                (i) => i?.stock_prices?.[0]?.change_percentage?.toFixed(2) == 0
              ).length
            : list?.filter((i) => i?.change_percentage?.toFixed(2) == 0).length
        }
        percentage={`0%`}
        level={`n`}
        active={zero ? true : false}
      />
      <HeatmapFnOIndicators
        onClick={onMinusZerotoTwo}
        topNum={
          nestedArr && sliderValue === 0
            ? list?.filter(
                (i) =>
                  i?.stock_prices?.[0]?.change_percentage?.toFixed(2) < 0 &&
                  i?.stock_prices?.[0]?.change_percentage?.toFixed(2) >= -2
              ).length
            : list?.filter(
                (i) =>
                  i?.change_percentage?.toFixed(2) < 0 &&
                  i?.change_percentage?.toFixed(2) >= -2
              ).length
        }
        percentage={`0-2%`}
        level={`d1`}
        active={minusZero ? true : false}
      />
      <HeatmapFnOIndicators
        onClick={onMinusTwotoFive}
        topNum={
          nestedArr && sliderValue === 0
            ? list?.filter(
                (i) =>
                  i?.stock_prices?.[0]?.change_percentage?.toFixed(2) < -2 &&
                  i?.stock_prices?.[0]?.change_percentage?.toFixed(2) >= -5
              ).length
            : list?.filter(
                (i) =>
                  i?.change_percentage < -2 &&
                  i?.change_percentage?.toFixed(2) >= -5
              ).length
        }
        percentage={`2-5%`}
        level={`d2`}
        active={minusTwo ? true : false}
      />
      <HeatmapFnOIndicators
        onClick={onMinusFive}
        topNum={
          nestedArr && sliderValue === 0
            ? list?.filter(
                (i) => i?.stock_prices?.[0]?.change_percentage?.toFixed(2) < -5
              ).length
            : list?.filter((i) => i?.change_percentage?.toFixed(2) < -5).length
        }
        percentage={`5% <`}
        level={`d3`}
        active={minusFive ? true : false}
      />
      <span onClick={onNegative}>Negative</span>
    </div>
  );
};

HeatmapFnOIndicatorsWrapper.propTypes = {
  onPositive: PropTypes.bool,
  onNegative: PropTypes.bool,
};

export default HeatmapFnOIndicatorsWrapper;
