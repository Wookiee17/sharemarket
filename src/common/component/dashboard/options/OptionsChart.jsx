import React, { createRef, useState, useEffect } from "react";

// apollo
import { useQuery } from "@apollo/client";
import {
  GET_OPTIONS,
  GET_CURRENT_PRICE_BY_TICKER,
  GET_FUTURE_PRICE_BY_SYMBOL,
} from "../../../../gql/queries";
import dayjs from "dayjs";

// redux
import { useSelector } from "react-redux";

//
import Highcharts from "highcharts";
import {
  HighchartsChart,
  Chart,
  HighchartsProvider,
  XAxis,
  YAxis,
  Tooltip,
  ColumnSeries,
  PlotLine,
  Loading,
} from "react-jsx-highcharts";

const OptionsChart = ({ filters, parent }) => {
  const theme = useSelector((state) => state.Common.theme);
  const ref = createRef();
  const [windowDimensions, setWindowDimensions] = useState(null);
  const [atmStrike, setATMStrike] = useState(undefined);
  const [showATMStrike, setShowATMStrike] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    call_data: [],
    put_data: [],
    pcr_data: [],
  });
  const range = filters?.symbol === "NIFTY" ? 1000 : 2000;
  // const { data: niftyData } = useQuery(GET_CURRENT_PRICE_BY_TICKER, {
  //   variables: {
  //     symbol: filters?.symbol === "NIFTY" ? "NSE Index" : filters?.symbol,
  //   },
  //   onCompleted: (d) => {
  //     if (
  //       Array.isArray(d?.indiacharts_stock_prices) &&
  //       d?.indiacharts_stock_prices?.length
  //     ) {
  //       const price = d.indiacharts_stock_prices[0]?.current_price
  //       setATMStrike(Math.round(price / 50)*50);
  //     }
  //   },
  // });

  let _s = dayjs(filters?.expiry_date);

  useQuery(GET_FUTURE_PRICE_BY_SYMBOL, {
    variables: {
      symbol: filters?.symbol,
      start_date: _s.startOf("month").format("YYYY-MM-DD"),
      end_date: _s.endOf("month").format("YYYY-MM-DD"),
    },
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    onCompleted: (d) => {
      if (
        Array.isArray(d?.indiacharts_view_fno_price) &&
        d?.indiacharts_view_fno_price?.length
      ) {
        setShowATMStrike(false);
        const price = d.indiacharts_view_fno_price[0]?.last_traded_price;
        setATMStrike(Math.round(price / 50) * 50);
      }
    },
  });

  useQuery(GET_OPTIONS, {
    variables: {
      symbol: filters?.symbol,
      expiry_date: filters?.expiry_date,
      // end_date: dayjs().format("YYYY-MM-DD"),
      // start_date: dayjs().subtract(3, "days").format("YYYY-MM-DD"),
      oi_lower: atmStrike ? atmStrike - range : 0,
      oi_upper: atmStrike ? atmStrike + range : 0,
    },
    skip: !filters?.expiry_date || !atmStrike,
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    onCompleted: (data) => {
      // console.log("options", data);
      let pcr_data = [],
        labels = [],
        put_data = [],
        call_data = [];
      for (let opt of data?.indiacharts_view_future_options) {
        let pcr = Number((Math.abs(opt.put_oi / opt.call_oi) || 0).toFixed(1));
        if (pcr > 10) pcr = 10;
        pcr_data.push(pcr);
        labels.push(opt.strike_price);
        put_data.push(opt.put_oi);
        call_data.push(opt.call_oi);
      }
      setChartData({
        labels,
        put_data,
        call_data,
        pcr_data,
      });
      setTimeout(() => {
        setShowATMStrike(true);
      }, 1000);
    },
  });
  const getStrikeIndex = () => {
    const isMatched = chartData?.labels.findIndex(
      (label) => label == atmStrike
    );
    if (isMatched >= 0) {
      return isMatched;
    } else {
      return chartData?.labels.findIndex((label) => label > atmStrike) - 1;
    }
  };
  useEffect(() => {
    setWindowDimensions({
      width: parent.current.clientWidth,
      height: parent.current.clientHeight - 32,
    });
  }, []);
  return (
    <div className={`optionsChart_chart ${theme}`} ref={ref}>
      {windowDimensions !== null && (
        <HighchartsProvider Highcharts={Highcharts}>
          <HighchartsChart
            className={`highChartStyles ${theme}`}
            accessibility={{ enabled: false }}
          >
            <Chart height={windowDimensions.height} zoomEnabled />
            {/* <Subtitle>Combination chart</Subtitle> */}
            {/* <Legend /> */}
            <Tooltip />
            <Loading
              isLoading={chartData.put_data?.length === 0}
              hideDuration={1000}
              showDuration={1000}
              labelStyle={{ color: "#fff" }}
              style={{ background: "#22242f" }}
            />
            <XAxis categories={chartData.labels}>
              {showATMStrike && (
                <PlotLine
                  value={getStrikeIndex()}
                  color={"#f0f"}
                  align="center"
                  dashStyle="dash"
                  zIndex={5}
                >
                  <PlotLine.Label textAlign="center">{`${
                    filters?.symbol === "BANKNIFTY" ? "Bank" : ""
                  } Nifty ATM Stike ${atmStrike.toFixed(2)}`}</PlotLine.Label>
                </PlotLine>
              )}
            </XAxis>
            <YAxis>
              <YAxis.Title>Call/Put OI</YAxis.Title>
              <ColumnSeries
                color={`#FF4A4A`}
                name="Put OI"
                data={chartData?.put_data}
              />
              <ColumnSeries
                color={`#52C41A`}
                name="Call OI"
                data={chartData?.call_data}
              />
            </YAxis>
          </HighchartsChart>
        </HighchartsProvider>
      )}
    </div>
  );
};

export default OptionsChart;
