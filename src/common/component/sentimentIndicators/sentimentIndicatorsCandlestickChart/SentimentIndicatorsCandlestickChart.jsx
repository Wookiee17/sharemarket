import { createChart, LineStyle } from "lightweight-charts";
import React, { useEffect, useRef, useLayoutEffect } from "react";
import moment from "moment/moment";

export const ChartComponent = (props) => {
  const {
    data,
    dailySwingData,
    backgroundColor = "#22242f",
    lineColor = "#2962FF",
    textColor = "#666666",
    areaTopColor = "#2962FF",
    areaBottomColor = "rgba(41, 98, 255, 0.28)",
  } = props;
  const chartContainerRef = useRef();

  useEffect(() => {
    // const handleResize = () => {
    //   chart.applyOptions({
    //     width: chartContainerRef.current.clientWidth,
    //     height: chartContainerRef.current.clientHeight/2,
    //   });
    // };
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

    const chart = createChart(chartContainerRef.current, chartOptions);
    const indexChartSeries = chart.addLineSeries({
      color: "#FF8C00",
      lineWidth: 2,
    });

    const indicatorChartSeries = chart.addLineSeries({
      color: "#2962FF",
      lineWidth: 2,
      priceFormat: {
        type: "volume",
      },
      overlay: true,
      scaleMargins: {
        top: 0.93,
        bottom: 0,
      },
    });
    indexChartSeries.setData(data);
    for (let i = 0; i < dailySwingData.length; i++) {
      indicatorChartSeries.update({
        value: dailySwingData[i].value,
        time: moment(dailySwingData[i].date, "YYYY-MM-DD").unix(),
      });
    }
    const overboughtLine = {
      price: props.overbought,
      color: "#fcbf49",
      lineWidth: 2,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: "Overbought",
    };
    var oversoldLine = {
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
    //   console.log(chartContainerRef.current.clientHeight);
      setTimeout(() => chart.timeScale().fitContent(), 0);
    };

    window.addEventListener("resize", resize, false);
    resize();

    // window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", resize, false);
      //   window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);

  return <div className="SentimentIndicatorsChart" ref={chartContainerRef} />;
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
  return (
    <ChartComponent
      {...props}
      data={indexChartData}
      dailySwingData={props.dailySwingData}
      onChange={props.onChange}
    ></ChartComponent>
  );
};
export default SentimentIndicatorsCandlestickChart;
