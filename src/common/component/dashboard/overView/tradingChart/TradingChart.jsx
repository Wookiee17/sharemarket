import React, { createRef, useEffect, useRef, useState } from "react";
import { widget } from "../../../../../../public/static/charting_library";
import Datafeed from "./datafeed";
import dayjs from "dayjs";
import _ from "lodash";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActiveSidebarLevel1 } from "../../../../../store/dashboard/MarketOverviewSlice";

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const TradingChart = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.Common.theme);
  const [isChartReady, setChartReady] = useState(false);
  const [isNewSymbolLoaded, setNewSymbolLoaded] = useState(false)
  const symbol = useSelector((state) => state.MarketOverview.tradingChartData);
  const { candleStickPattern, patterns } = useSelector((state) => state.Scanners)
  const selectedQuery = useSelector((state) => state.MarketOverview.activeSidebarLevel1);

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
  const handleCreateShape = (dates) => {
    tvWidgetRef.current.activeChart().createMultipointShape(dates, {
      shape: 'rectangle',
      // lock: true,
      disableSelection: true,
      disableSave: true,
      disableUndo: true,
      filled: false,
      zOrder: "top",
      overrides: {
        color: "#ffffff",
        fontsize: 10,
        fillBackground: false,
        linewidth: 2
      }
    });
  }
  const fetchStockPrices = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const priced_date = candleStickPattern?.priced_date
        const { data } = await tvWidgetRef.current.activeChart().exportData({
          includeTime: true,
          from: dayjs(priced_date).subtract(5, "day").unix(), //temporary fix
          to: dayjs(priced_date).add(2, "day").unix() //temporary fix - holiday and weekend calculation need to be implemented
        })
        resolve(data)
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  }
  const fetchMinMaxPrice = (arr) => {
    const highPrices = arr.map(item => item[2])
    const lowPrices = arr.map(item => item[3])
    return { minPrice: _.min(lowPrices), maxPrice: _.max(highPrices) }
  }
  const getTopBottomPrice = (maxPrice, minPrice) => {
    let topPrice = maxPrice + 3,
      bottomPrice = minPrice - 3;
    const maxPriceLength = parseInt(maxPrice).toString().length
    const minPriceLength = parseInt(minPrice).toString().length
    //set box height based on the stock price
    console.log(maxPriceLength, minPriceLength)
    if (maxPriceLength <= 2) {
      topPrice = maxPrice + 0.3
    }else if (maxPriceLength <= 4) {
      topPrice = maxPrice + 1.5
    }else{
      topPrice = maxPrice + 100
    }
    
    if (minPriceLength <= 2) {
      bottomPrice = minPrice - 0.3
    }else if (minPriceLength <= 4) {
      bottomPrice = minPrice - 1.5
    }else{
      bottomPrice = minPrice - 100
    }
    return {topPrice, bottomPrice}
  }
  const handleGeneratePatterns = async () => {
    try {
      const priced_date = candleStickPattern?.priced_date
      const prices = await fetchStockPrices() //fetch stock prices from tradingview timeseries
      let indexOfPricedDate = -1
      for (let i = 0; i < prices.length; i++) { //get index of the first candle where we have the pattern
        const _price = prices[i]
        if (dayjs.unix(_price[0]).format("YYYY-MM-DD") === priced_date) {
          indexOfPricedDate = i
        }
      }
      if (candleStickPattern.close_candle_triple && patterns.includes(candleStickPattern.close_candle_triple)) { //for 3 candle patterns
        const startRange = prices[indexOfPricedDate + 1]
        const endRange = prices[indexOfPricedDate - 3]
        const { minPrice, maxPrice } = fetchMinMaxPrice([ //fetch min and max price between selected candles
          prices[indexOfPricedDate],
          prices[indexOfPricedDate - 1],
          prices[indexOfPricedDate - 2]
        ])
        const {topPrice, bottomPrice} = getTopBottomPrice(maxPrice, minPrice)
        let _datesTriple = [
          { time: startRange[0], price: topPrice }, //for top and bottom padding adding/subtrating 3
          { time: endRange[0], price: bottomPrice }
        ]
        handleCreateShape(_datesTriple)
      }
      if (candleStickPattern.close_candle_double && patterns.includes(candleStickPattern.close_candle_double)) { //for 2 candle patterns
        const startRange = prices[indexOfPricedDate + 1]
        const endRange = prices[indexOfPricedDate - 2]
        const { minPrice, maxPrice } = fetchMinMaxPrice([ //fetch min and max price between selected candles
          prices[indexOfPricedDate],
          prices[indexOfPricedDate - 1],
        ])
        const {topPrice, bottomPrice} = getTopBottomPrice(maxPrice, minPrice)
        let _datesDouble = [
          { time: startRange[0], price: topPrice }, //for top and bottom padding adding/subtrating 3
          { time: endRange[0], price: bottomPrice }
        ]
        handleCreateShape(_datesDouble)
      }
      if (candleStickPattern.close_candle_single && patterns.includes(candleStickPattern.close_candle_single)) { //for 1 candle patterns
        const startRange = prices[indexOfPricedDate + 1]
        const endRange = prices[indexOfPricedDate - 1]
        const { minPrice, maxPrice } = fetchMinMaxPrice([
          prices[indexOfPricedDate],
        ])
        const {topPrice, bottomPrice} = getTopBottomPrice(maxPrice, minPrice)
        let _datesSingle = [
          { time: startRange[0], price: topPrice }, //for top and bottom padding adding/subtrating 3
          { time: endRange[0], price: bottomPrice }
        ]
        handleCreateShape(_datesSingle)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    if (symbol) {
      if (!isChartReady) {
        const widgetOptions = {
          symbol: symbol,
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
          timeframe: "1M",
          timezone: "Asia/Kolkata",
          overrides: {
            "mainSeriesProperties.style": 1,
          },
          disabled_features: [
            // "header_screenshot",
            "header_saveload",
            "header_compare",
            // "header_chart_type",
            "header_symbol_search",
            // "header_fullscreen_button",
            // "timeframes_toolbar",
            "main_series_scale_menu",
            // "create_volume_indicator_by_default",
          ],
        };
        // craeting widget
        const tvWidget = new widget(widgetOptions);
        tvWidget.onChartReady(async () => {
          // console.log("chart is ready");
          tvWidget.applyOverrides({
            "mainSeriesProperties.style": 1,
          });
          tvWidgetRef.current = tvWidget;
          setChartReady(true);
        });
      } else {
        setNewSymbolLoaded(false)
        tvWidgetRef.current.activeChart().setSymbol(symbol, ()=>{
          setNewSymbolLoaded(true)
        });
      }
    }
  }, [symbol]);
  useEffect(() => {
    if (isChartReady) {
      tvWidgetRef.current.activeChart().removeAllShapes();
      if(isNewSymbolLoaded){
        if (candleStickPattern !== null) {
          handleGeneratePatterns()
        }
      }
    }
  }, [isChartReady, candleStickPattern, isNewSymbolLoaded])
  useEffect(() => {
    if (isChartReady) {
      if (selectedQuery === "Volume Buzzers") {
        tvWidgetRef.current.activeChart().createStudy("Volume", true, false, {}, {
          'volume ma.visible': true,
          'volume ma.color': '#ff9800',
        })
      } else {
        tvWidgetRef.current.activeChart().removeAllStudies()
      }
    }
  }, [selectedQuery, isChartReady])
  useEffect(() => {
    return () => {
      dispatch(setActiveSidebarLevel1(0))
    }
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
