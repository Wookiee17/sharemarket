import React, { createRef, useState, useEffect } from "react";

// redux
import { useSelector } from "react-redux";

//
import Highcharts from "highcharts";
import {
  HighchartsProvider,
  HighchartsChart,
  Chart,
  XAxis,
  YAxis,
  Legend,
  LineSeries,
  Tooltip,
} from "react-jsx-highcharts";
import moment from "moment/moment";

import { useRouter } from "next/router";

//helpers
import { marketCloseUTC } from "../../../utils";

//graphql
import { useQuery } from "@apollo/client";
import { GET_ADVANCE_DECLINE_RATIO } from "../../../../gql/queries";

const HeatmapAdvanceDeclineChart = () => {
  const theme = useSelector((state) => state.Common.theme);
  const latestNifty = useSelector((state) => state.Common.latestNiftyStock);

  const router = useRouter();
  const indicesId = router?.query?.index;

  const ref = createRef();
  const [windowDimensions, setWindowDimensions] = useState(null);
  const [load, setLoad] = useState(false);
  const [labels, setLabels] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [declines, setDeclines] = useState([]);

  const markerOption = {
    enabled: true,
    symbol: "circle",
    radius: 2,
  };
  useQuery(GET_ADVANCE_DECLINE_RATIO, {
    variables: {
      // start_date: moment(latestNifty?.created_at).format("YYYY-MM-DD"),
      // end_date: `${moment(latestNifty?.created_at).format(
      //   "YYYY-MM-DD"
      // )} ${marketCloseUTC}`,
      // // "end_date": "2022-12-23",
      // // "start_date": "2022-12-22",
      // time_gap: "5 minutes",
      // index_id: indicesId,
      index_id: indicesId,
      start_date: moment(latestNifty?.created_at).format("YYYY-MM-DD"),
      end_date: moment(latestNifty?.created_at)
        .add(1, "day")
        .format("YYYY-MM-DD"),
      eod_timestamp: `${moment(latestNifty?.created_at).format(
        "YYYY-MM-DD"
      )} ${marketCloseUTC}`,
      time_gap: "5 minutes",
    },
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    skip: !indicesId && !latestNifty,
    onCompleted: (d) => {
      if (
        Array.isArray(d?.indiacharts_advance_decline_timegap_fun) &&
        d?.indiacharts_advance_decline_timegap_fun?.length
      ) {
        const arr = d.indiacharts_advance_decline_timegap_fun;
        setLabels(arr.map((item) => moment(item.created_at).format("hh:mm A")));
        setAdvances(arr.map((item) => item.advances));
        setDeclines(arr.map((item) => item.declines));
      }
    },
  });
  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 100);

    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight - 225,
    });

    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 225,
      });
    }
    window.addEventListener("resize", handleResize);

    // console.log(windowDimensions.height);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`HeatmapAdvanceDeclineChart ${theme}`} ref={ref}>
      {load !== false && (
        <HighchartsProvider Highcharts={Highcharts}>
          <HighchartsChart
            // plotOptions={plotOptions}
            className={`highChartStyles ${theme}`}
          >
            <Chart height={windowDimensions.height} />
            <Tooltip />
            <Legend layout="horizontal" align="left" verticalAlign="bottom" />

            <XAxis categories={labels}>
              <XAxis.Title>Time</XAxis.Title>
            </XAxis>

            <YAxis>
              <LineSeries
                name="ADVANCES"
                color={"#7CC81F"}
                data={advances}
                marker={markerOption}
              />
              <LineSeries
                name="DECLINES"
                color={"#FF1E2C"}
                data={declines}
                marker={markerOption}
              />
            </YAxis>
          </HighchartsChart>
        </HighchartsProvider>
      )}
    </div>
  );
};

export default HeatmapAdvanceDeclineChart;
