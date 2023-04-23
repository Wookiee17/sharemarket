import { createChart, ColorType, LineStyle } from "lightweight-charts";
import React, { useEffect, useRef } from "react";
import moment from "moment/moment";
// require("./LightweightMultipane")
export const ChartComponent = (props) => {
  const {
    data,
    indicatorChartData,
  } = props;
  const chartContainerRef = useRef();
  useEffect(() => {
    const chartOptions = {
      layout: {
        textColor: "#666666",
        background: { type: "solid", color: "#22242f" },
      },
      grid: {
        vertLines: { color: "#22242f" },
        horzLines: { color: "#22242f" },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight / 2,
    };
    var chart = createChart(chartContainerRef.current, chartOptions);
    const indexChartSeries = chart.addLineSeries({
      color: "#FF8C00",
      lineWidth: 2,
      priceFormat: {
        minMove: 1,
        precision: 0,
      },
    });
    indexChartSeries.setData(data);

    const indicatorChartSeries = chart.addLineSeries({
      color: "#2962FF",
      lineWidth: 2,
      priceFormat: {
        minMove: 1,
        precision: 0,
      },
      pane: 1
    });
    indicatorChartSeries.setData(indicatorChartData)
    const overboughtLine = {
      price: props.overbought,
      color: "#fcbf49",
      lineWidth: 2,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: "Overbought",
    };
    const oversoldLine = {
      price: props.oversold,
      color: "#fcbf49",
      lineWidth: 2,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: "Oversold",
    };
    indicatorChartSeries.createPriceLine(overboughtLine);
    indicatorChartSeries.createPriceLine(oversoldLine);

    const resize = () => {
      chart.applyOptions({
        width: chartContainerRef?.current?.clientWidth,
        height: chartContainerRef?.current?.clientHeight,
      });
      setTimeout(() => chart.timeScale().fitContent(), 0);
    };
    window.addEventListener("resize", resize, false);
    resize();
    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, [
    data,
    indicatorChartData
  ]);
  return <div ref={chartContainerRef} className="SentimentIndicatorsChart"></div>;
};
const SentimentIndicatorsCandlestickChart = (props) => {
  const indexChartData = props.data.map((d) => {
    return {
      // open: d.open_price,
      // high: d.high_price,
      // low: d.low_price,
      // close: d.close_price,
      value: d.close_price,
      time: moment(d.created_at).unix(),
    };
  });
  const indicatorChartData = props.dailySwingData.map((d) => {
    return {
      value: d.value,
      time: moment(d.date).unix(),
    };
  });
  return (
    <ChartComponent
      {...props}
      data={indexChartData}
      indicatorChartData={indicatorChartData}
    ></ChartComponent>
  );
};
export default SentimentIndicatorsCandlestickChart;
