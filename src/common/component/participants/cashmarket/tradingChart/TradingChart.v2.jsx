import React, { createRef, useEffect, useRef, useState } from "react";
import {
  widget,
  version,
} from "../../../../../../public/static/charting_library";
import Datafeed from "./datafeed";
import moment from "moment/moment";

// redux
import { useSelector } from "react-redux";
import { generateIndicatorConfig } from "./helpers";

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const TradingChart = ({
  activeScreen,
  filterState,
  date
}) => {
  const theme = useSelector((state) => state.Common.theme);
  const { selectedIndicatorObj } = useSelector((state) => state.SentimentIndicator);
  const [isChartReady, setChartReady] = useState(false)
  const ref = createRef();
  const tvWidgetRef = useRef(null);
  const defaultProps = {
    symbol: "NSE Index",
    interval: "1D",
    libraryPath: "/static/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };

  const setIndicator = (indicatorName) => {
    tvWidgetRef.current.activeChart().removeAllStudies()
    tvWidgetRef.current.activeChart().createStudy(indicatorName, false, false)
  }
  useEffect(() => {
    if (tvWidgetRef?.current) {
      setIndicator(activeScreen === 0 ? "FII" : "DII")
    }
  }, [activeScreen, tvWidgetRef, isChartReady])
  useEffect(()=>{
    if (tvWidgetRef?.current) {
      tvWidgetRef.current.activeChart().setResolution(filterState === 0 ? "1D" : filterState === 50 ? "1M" : "12M");
    }
  }, [filterState, isChartReady])
  useEffect(()=>{
    if (tvWidgetRef?.current) {
      console.log(date)
    }
  }, [date, isChartReady])
  useEffect(() => {
    const widgetOptions = {
      debug: true,
      symbol: defaultProps.symbol,
      datafeed: Datafeed,
      interval: defaultProps.interval,
      container: ref.current,
      library_path: defaultProps.libraryPath,
      locale: getLanguageFromURL() || "en",
      charts_storage_url: defaultProps.chartsStorageUrl,
      charts_storage_api_version: defaultProps.chartsStorageApiVersion,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
      theme: theme === "dark" ? "Dark" : "Light",
      timeframe: "6M",
      timezone: 'Asia/Kolkata',
      studies_access: {
        type: "white",
        tools: ["FII", "DII"]
      },
      overrides: {
        "mainSeriesProperties.style": 2,
      },
      disabled_features: [
        // "header_screenshot",
        "header_saveload",
        "header_compare",
        "header_symbol_search",
        "create_volume_indicator_by_default"
      ],
      custom_indicators_getter: function (PineJS) {
        return Promise.resolve(
          [generateIndicatorConfig({
            indicatorId: `fii@tv-basicstudies-1`,
            indicatorDesc: "FII",
            indicatorName: "FII",
            PineJS,
          }), generateIndicatorConfig({
            indicatorId: `dii@tv-basicstudies-1`,
            indicatorDesc: "DII",
            indicatorName: "DII",
            PineJS,
          })]
        );
      },
    };
    // craeting widget
    const tvWidget = new widget(widgetOptions);
    tvWidget.onChartReady(async () => {
      // console.log("chart is ready");
      tvWidget.applyOverrides({
        "mainSeriesProperties.style": 2,
      })
      tvWidgetRef.current = tvWidget
      setChartReady(true)
    });
  }, [])
  return (
    <div
      className={`OverView_chart ${theme}`}
      id={`tv_chart_container`}
      ref={ref}
    ></div>
  );
};

export default TradingChart;
