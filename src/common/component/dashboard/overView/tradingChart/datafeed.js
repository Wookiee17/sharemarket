import { fetchIndexData } from "./helpers.js";
import moment from "moment";
import { store } from "../../../../../store/store";

const configurationData = {
  supported_resolutions: ["1H", "1D", "1W", "1M", "12M"],
  exchanges: ["NSE"],
  symbols_types: [],
  intraday_multipliers: ["60"],
  weekly_multipliers: ['1'],
  monthly_multipliers: ['1'],
  has_intraday: true,
  has_weekly_and_monthly: true
};

export default {
  onReady: (callback) => {
    // console.log('[onReady]: Method call');
    setTimeout(() => callback(configurationData));
  },
  searchSymbols: async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback
  ) => {
    // console.log('[searchSymbols]: Method call');
    // const symbols = await getAllSymbols();
    // const newSymbols = symbols.filter(symbol => {
    //     const isExchangeValid = exchange === '' || symbol.exchange === exchange;
    //     const isFullSymbolContainsInput = symbol.full_name
    //         .toLowerCase()
    //         .indexOf(userInput.toLowerCase()) !== -1;
    //     return isExchangeValid && isFullSymbolContainsInput;
    // });
    // onResultReadyCallback(newSymbols);
  },
  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
    extension
  ) => {
    // console.log('[resolveSymbol]: Method call', symbolName);
    const holidays = store.getState().Common.holidays;
    let formattedHolidays = "";
    if (holidays.length) {
      formattedHolidays = holidays
        .map((hday) => hday.holiday_date)
        .map((hday) => moment(hday, "YYYY-MM-DD").format("YYYYMMDD"))
        .join(",");
    }
    const symbolInfo = {
      ticker: symbolName,
      name: `NSE:${symbolName}`,
      description: symbolName,
      type: "stock",
      session: "0900-1530",
      timezone: "Asia/Kolkata",
      exchange: "NSE",
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      visible_plots_set: "ohlc",
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: "streaming",
      session_holidays: formattedHolidays,
      monthly_multipliers: ['1'],
      weekly_multipliers: ['1'],
      intraday_multipliers: ["60"],
    };

    // console.log('[resolveSymbol]: Symbol resolved', symbolName);
    setTimeout(() => {
      onSymbolResolvedCallback(symbolInfo);
    }, [0]);
  },
  getBars: async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    const holidayState = store.getState().Common.holidays;
    let holidays = [];
    if (Array.isArray(holidayState) && holidayState.length) {
      holidays = holidayState.map((hday) => hday.holiday_date);
    }
    const { from, to, firstDataRequest } = periodParams;
    let _from = moment.unix(from).format("YYYY-MM-DD");
    let _to = moment.unix(to).format("YYYY-MM-DD");
    // console.log('[getBars]: Method call', symbolInfo, resolution, _from, _to);

    const from_day = moment.unix(from).format("dddd");
    const to_day = moment.unix(to).format("dddd");
    //skip saturday and sundays manually
    if (from_day === "Saturday") {
      _from = moment.unix(from).subtract(1, "d").format("YYYY-MM-DD");
    } else if (from_day === "Sunday") {
      _from = moment.unix(from).add(1, "d").format("YYYY-MM-DD");
    }
    if (to_day === "Saturday") {
      _to = moment.unix(to).subtract(1, "d").format("YYYY-MM-DD");
    } else if (to_day === "Sunday") {
      _to = moment.unix(to).add(1, "d").format("YYYY-MM-DD");
    }
    if (_to === _from) {
      //check if two dates collide
      if (moment.unix(_to).format("dddd") === "Friday") {
        //change Friday to Monday by adding 3 days. We don't need to change other collide days as it's handled by the function itself
        _to = moment(_from).add(3, "d").format("YYYY-MM-DD");
      }
    }
    //skip holidays
    if (holidays.includes(_to) && _from === _to) {
      onHistoryCallback([], { noData: false });
      return;
    }
    try {
      let bars = [];
      let time_gap = "1 day";
      if (resolution === "60") {
        time_gap = "1 hour";
      }else if (resolution === "12M") {
        time_gap = "1 year";
      }else if (resolution === "1W") {
        time_gap = "1 week";
      }else if (resolution === "1M") {
        time_gap = "1 month";
      }
      const data = await fetchIndexData({
        symbolInfo,
        from: _from,
        to: _to,
        time_gap,
      });
      if (data.length === 0) {
        let noData = true;
        // const _checkData =  await fetchIndexData({ symbolInfo, from: moment(_from).subtract(14, 'd').format("YYYY-MM-DD"), to: _to, time_gap }); //check if we have any past records if both from and to date is holiday and difference is 1 day

        // if(_checkData.length){
        // 	noData = false
        // }
        // "noData" should be set if there is no data in the requested period.
        onHistoryCallback([], { noData });
        return;
      }
      data.forEach((bar) => {
        const barTime = bar.unix_timestamp;
        if (barTime >= from && barTime < to) {
          let modifiedBarTime = barTime
          // if(["1D", "1W", "1M"].includes(resolution)){
            modifiedBarTime += (24*60*60)
          // }
          bars = [
            ...bars,
            {
              time: modifiedBarTime * 1000, //temporary fix -- need to fix in production
              low: bar.low_price,
              high: bar.high_price,
              open: bar.open_price,
              close: bar.close_price,
              volume: bar.total_traded_quantity
            },
          ];
        }
      });
      // console.log(`[getBars]: returned ${bars.length} bar(s)`, bars);
      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      // console.log('[getBars]: Get error', error);
      onErrorCallback(error);
    }
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    // console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
  },
  unsubscribeBars: (subscriberUID) => {
    // console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
  },
};
