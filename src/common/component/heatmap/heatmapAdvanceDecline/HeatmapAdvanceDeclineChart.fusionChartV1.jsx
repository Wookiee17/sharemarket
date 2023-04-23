import React, { createRef, useState, useEffect } from "react";

// redux
import { useSelector } from "react-redux";

import moment from "moment/moment";

//graphql
import { useQuery } from "@apollo/client";
import { GET_ADVANCE_DECLINE_RATIO } from "../../../../gql/queries";

//
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.candy";

// Resolves charts dependancy
// charts(FusionCharts);


ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);
const HeatmapAdvanceDeclineChart = ({indicesId}) => {
  const theme = useSelector((state) => state.Common.theme);
  const ref = createRef();
  const [windowDimensions, setWindowDimensions] = useState(null);
  const [load, setLoad] = useState(false);
  const [labels, setLabels] = useState([])
  const [advances, setAdvances] = useState([])
  const [declines, setDeclines] = useState([])

  const chartConfigs = {
    type: "msline",
    width: 1130,
    height: 600,
    dataFormat: "json",
    dataSource: {
      chart: {
        // caption: "Reach of Social Media Platforms amoung youth",
        yaxisname: "",
        // subcaption: "2012-2016",
        showhovereffect: "1",
        numbersuffix: "",
        drawcrossline: "1",
        plottooltext: "<b>$dataValue</b>",
        theme: "candy",
        "palettecolors": "7CC81F,FF1E2C"
      },
      categories: [
        {
          category: labels,
        },
      ],
      dataset: [
        {
          seriesname: "Advances",
          data: advances,
        },
        {
          seriesname: "Declines",
          data: declines,
        },
      ],
    },
  };
  useQuery(GET_ADVANCE_DECLINE_RATIO, {
    variables: {
      start_date: moment().format("YYYY-MM-DD"),
      end_date:  moment().add(1, "day").format("YYYY-MM-DD"),
      // "end_date": "2022-12-23",
      // "start_date": "2022-12-22",
      time_gap: "5 minutes",
      index_id: indicesId
    },
    pollInterval: 900000, //fetch data in every 15 minutes
    skip: !indicesId,
    onCompleted: (d) => {
      if (
        Array.isArray(d?.indiacharts_advance_decline_timegap_fun) &&
        d?.indiacharts_advance_decline_timegap_fun?.length
      ) {
        const arr = d.indiacharts_advance_decline_timegap_fun
        setLabels(arr.map((item) => {
          return {label: moment.utc(item.created_at).format("hh:mm A")}
        }))
        setAdvances(arr.map((item) => {
          return {value: item.advances}
        }))
        setDeclines(arr.map((item) => {
          return {value: item.declines}
        }))
      }
    }
  })
  
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
        <ReactFC
          {...chartConfigs}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};

export default HeatmapAdvanceDeclineChart;
