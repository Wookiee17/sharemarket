import React, { useState, useEffect, useRef } from "react";
// redux
import { useSelector } from "react-redux";

//
import Highcharts from "highcharts/highstock";
import {
  HighchartsChart,
  Chart,
  HighchartsProvider,
  XAxis,
  YAxis,
  Subtitle,
  ColumnSeries,
  Tooltip,
  Loading,
  Scrollbar,
} from "react-jsx-highstock";

const FutureActivityChart = (props) => {
  const theme = useSelector((state) => state.Common.theme);
  const ref = useRef();
  const [windowDimensions, setWindowDimensions] = useState(null);
  const [load, setLoad] = useState(false);

  const required = props?.data;

  const labels = required ? required?.map((p) => p?.symbol) : [];
  const ds1 = required ? required?.map((p) => parseFloat(p?.oi_change)) : [];
  const ds2 = required ? required?.map((p) => parseFloat(p?.price_change)) : [];

  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 100);

    setWindowDimensions({
      width: props?.parent.current.clientWidth,
      height: props?.parent.current.clientHeight - 70,
    });
  }, []);
  return (
    <div className={`FutureActivityChart_chart ${theme}`} ref={ref}>
      {load !== false && (
        <HighchartsProvider Highcharts={Highcharts}>
          <HighchartsChart
            className={`highChartStyles ${theme}`}
            accessibility={{ enabled: false }}
          >
            <Chart inverted height={windowDimensions.height} />
            {/* <Subtitle>Combination chart</Subtitle> */}
            {/* <Legend /> */}
            {required.length > 5 && <Scrollbar />}
            <Tooltip valueSuffix="%" />
            <Loading
              isLoading={props.loading}
              hideDuration={1000}
              showDuration={1000}
              labelStyle={{ color: "#fff" }}
              style={{ background: "#22242f" }}
            />
            {required.length > 5 ? (
              <XAxis categories={labels} max={5}></XAxis>
            ) : (
              <XAxis categories={labels}></XAxis>
            )}
            <YAxis>
              <ColumnSeries color={`#9BB1FF`} name="Price Change" data={ds2} />
              <ColumnSeries color={`#4F6FE0`} name="OI Change" data={ds1} />
            </YAxis>
          </HighchartsChart>
        </HighchartsProvider>
      )}
    </div>
  );
};

export default FutureActivityChart;
