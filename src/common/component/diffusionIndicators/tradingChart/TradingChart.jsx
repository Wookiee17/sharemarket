import React, { createRef, useEffect, useRef, useState } from "react";
import {
  widget,
} from "../../../../../public/static/charting_library";
import Datafeed from "./datafeed";

// redux
import { useSelector } from "react-redux";
import { generateIndicatorConfig } from "./helpers";

//utils
import { camelize } from "../../../utils";

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const TradingChart = ({
  symbol = null,
  indexData,
  indicatorData
}) => {
  const theme = useSelector((state) => state.Common.theme);
  const { selectedIndicatorObj, indicatorsFlatten, selectedIndex } = useSelector((state) => state.DiffusionIndicator);
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

  // useEffect(() => {
   
  // }, []);
  const setIndicator = (indicatorName, overbought, oversold) => {
    tvWidgetRef.current.activeChart().removeAllStudies()
    tvWidgetRef.current.activeChart().createStudy(indicatorName, false, false, {
      plot_1: overbought,
      plot_2: oversold
    })
  }
  useEffect(() => {
    (async () => {
      if (tvWidgetRef?.current && selectedIndicatorObj?.index && selectedIndex) {
        const { overbought, oversold, title } = selectedIndicatorObj
        // setIndicator(`${title} ${selectedIndex.name}`, overbought, oversold)
      }
    })()
  }, [selectedIndicatorObj, tvWidgetRef, isChartReady])
  useEffect(() => {
    (async () => {
      if (tvWidgetRef?.current && selectedIndex) {
        const currentSymbol = tvWidgetRef.current.activeChart().symbol()
        if(currentSymbol !== selectedIndex.value){
          await tvWidgetRef.current.activeChart().setSymbol(selectedIndex.value);
          const { overbought, oversold, title } = selectedIndicatorObj
          setIndicator(`${title} ${selectedIndex.name}`, overbought, oversold)
        }
      }
    })()
  }, [selectedIndex, tvWidgetRef, isChartReady])

  useEffect(()=>{
    if(indicatorsFlatten.length){
      const widgetOptions = {
        symbol: selectedIndex?.value,
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
          tools: indicatorsFlatten.map(ind => {
            return {
              name: ind.name
            }
          })
        },
        overrides: {
          "mainSeriesProperties.style": 2,
        },
        disabled_features: [
          "header_screenshot",
          "header_saveload",
          "header_compare",
          "header_chart_type",
          "header_symbol_search",
          "symbol_search_hot_key",
          "header_fullscreen_button",
          // "timeframes_toolbar",
          "main_series_scale_menu",
          "create_volume_indicator_by_default"
        ],
        // enabled_features: ["study_templates"],
        custom_indicators_getter: function (PineJS) {
          return Promise.resolve(
            indicatorsFlatten.map(ind => {
              return generateIndicatorConfig({
                indicatorId: `${camelize(ind.name)}@tv-basicstudies-1`,
                indicatorDesc: ind.name,
                indicatorName: ind.name,
                PineJS,
              })
            })
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
    }
  }, [indicatorsFlatten])
  return (
    <div
      className={`OverView_chart ${theme}`}
      id={`tv_chart_container`}
      ref={ref}
    ></div>
  );
};

export default TradingChart;
