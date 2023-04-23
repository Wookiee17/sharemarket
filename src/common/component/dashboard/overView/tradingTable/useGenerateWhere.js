import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const useGenerateWhere = () => {
  const [where, setWhere] = useState([]);
  const [skip, setSkip] = useState(false);
  const [limit, setLimit] = useState(50);
  const [stocks, setStocks] = useState([])
  const selectedQuery = useSelector(
    (state) => state.MarketOverview.activeSidebarLevel1
  );

  const selectedIndex = useSelector(
    (state) => state.MarketOverview.activeSidebarLevel2
  );

  const eodNifty = useSelector((state) => state.Common.eodNiftyStock);
  const latestNifty = useSelector((state) => state.Common.latestNiftyStock);

  useEffect(() => {
    if (selectedQuery === "Gainers") {
      setSkip(false);
      setWhere([
        // { stock: { indices_id: { _eq: selectedIndex } } },
        {stock_current_price: {change_percentage: {_gt: 0}}}
        // OVERVIEW_DATE,
      ]);
    }
    if (selectedQuery === "Losers") {
      setSkip(false);
      setWhere([
        // { stock: { indices_id: { _eq: selectedIndex } } },
        {stock_current_price: {change_percentage: {_lt: 0}}}
        // OVERVIEW_DATE,
      ]);
    }
    if (selectedQuery === "Gap Up") {
      setWhere({
        gap_up: {_eq: true},
        change_percentage: {_gt: 0},
        indices_stocks: {indices_id: {_eq: selectedIndex}},
      });
    }
    if (selectedQuery === "Gap Down") {
      setWhere({
        gap_down: {_eq: true},
        change_percentage: {_lt: 0},
        indices_stocks: {indices_id: {_eq: selectedIndex}},
      });
    }
    if (selectedQuery === "Volume Buzzers") {
      setWhere({
        indices_stocks: {indices_id: {_eq: selectedIndex}},
        vol_change: {_gte: 30}
      });
    }
  }, [selectedIndex, selectedQuery]);

  // useQuery(GET_VOL_BUFFER_TICKERS_FUNC, {
  //   skip: selectedQuery !== "Volume Buzzers",
  //   onCompleted: (data) => {
  //     setWhere([
  //       {
  //         ticker: { _in: data?.vbdata?.map((v) => v?.ticker) },
  //       },
  //       // OVERVIEW_DATE,
  //     ]);
  //   },
  // });
  // const {loading: gapLoading} = useQuery(selectedQuery === "Gap Down" ? GET_GAP_DOWN_TICKERS_FROM_FUNC : GET_GAP_UP_TICKERS_FROM_FUNC, {
  //   skip: selectedQuery !== "Gap Up" && selectedQuery !== "Gap Down",
  //   onCompleted: (data) => {
  //     if (data?.gapData?.length === 0) {
  //       setSkip(true);
  //     }
  //     setWhere([
  //       {
  //         ticker: { _in: data?.gapdata?.map((v) => v?.ticker) },
  //       },
  //       {
  //         change_percentage: { [selectedQuery === "Gap Up" ? "_gt" : "_lt"]: 0}
  //       }
  //     ]);
  //   },
  //   skip: selectedQuery !== "Gap Up" && selectedQuery !== "Gap Down",
  //   onCompleted: (data) => {
  //     if (data?.gapData?.length === 0) {
  //       setSkip(true);
  //     }
  //     setWhere([
  //       {
  //         ticker: { _in: data?.gapdata?.map((v) => v?.ticker) },
  //       },
  //       {
  //         change_percentage: { [selectedQuery === "Gap Up" ? "_gt" : "_lt"]: 0}
  //       }
  //     ]);
  //   },
  // });
  // const {loading: gapLoading} = useQuery(GET_GAP_TICKERS, {
  //   variables: {
  //     where: {
  //       _and: [
  //         // { ticker: { _in: stocks.map((stock) => stock.ticker_name) } },
  //         { [selectedQuery === "Gap Down" ? "gap_down" : "gap_up"]: {_eq: true} },
  //         { priced_date: { _eq: moment(latestNifty?.created_at).format("YYYY-MM-DD") } }
  //       ]
  //     },
  //   },
  //   skip: selectedQuery !== "Gap Up" && selectedQuery !== "Gap Down",
  //   onCompleted: (data) => {
  //     if (data?.gapData?.length === 0) {
  //       setSkip(true);
  //     }
  //     setWhere([
  //       {
  //         ticker: { _in: data?.gapdata?.map((v) => v?.ticker) },
  //       },
  //       {
  //         change_percentage: { [selectedQuery === "Gap Up" ? "_gt" : "_lt"]: 0}
  //       }
  //       // OVERVIEW_DATE,
  //     ]);
  //   },
  // });

  // const {loading: fiftyTwoWeekHighLoading} = useQuery(GET_FIFTY_TWO_WEEKS_HIGH, {
  //   variables: {
  //     // tickers: stocks.map((stock) => stock.ticker_name),
  //     start_date: moment(eodNifty?.created_at).format("YYYY-MM-DD"),
  //     end_date: moment(latestNifty?.created_at).format("YYYY-MM-DD"),
  //     // today_date: moment(latestNifty?.created_at).format("YYYY-MM-DD")
  //   },
  //   skip: selectedQuery !== "52 Weeks High",
  //   // skip: selectedQuery !== "52 Weeks High" && !eodNifty && !latestNifty,
  //   onCompleted: (data) => {
  //     if (data?.fififty_two_week_high?.length === 0) {
  //       setSkip(true);
  //     }
  //     setWhere([
  //       {ticker: { _in: data?.fififty_two_week_high?.map((v) => v?.ticker) }}
  //     ]);
  //   }
  // });

  // const {loading: fiftyTwoWeekLowLoading} = useQuery(GET_FIFTY_TWO_WEEKS_LOW, {
  //   variables: {
  //     // tickers: stocks.map((stock) => stock.ticker_name),
  //     start_date: moment(eodNifty?.created_at).format("YYYY-MM-DD"),
  //     end_date: moment(latestNifty?.created_at).format("YYYY-MM-DD")
  //     // today_date: moment(latestNifty?.created_at).format("YYYY-MM-DD")
  //   },
  //   skip: selectedQuery !== "52 Weeks Low",
  //   onCompleted: (data) => {
  //     if (data?.fifty_two_week_low?.length === 0) {
  //       setSkip(true);
  //     }
  //     setWhere([
  //       {ticker: { _in: data?.fifty_two_week_low?.map((v) => v?.ticker) }}
  //     ]);
  //   }
  // });

  // useQuery(GET_STOCKS_BY_INDEX, {
  //   variables: {
  //     index_id: selectedIndex
  //   },
  //   skip: !selectedIndex,
  //   onCompleted: (data) => {
  //     if(Array.isArray(data?.stocks)){
  //       setStocks(data.stocks)
  //     }
  //   },
  // });
  const loading = false
  return { where, limit, skip, loading };
};
export const useGenerateOrderby = () => {
  const selectedQuery = useSelector(
    (state) => state.MarketOverview.activeSidebarLevel1
  );
  if(selectedQuery === "Gainers"){
    return {stock_current_price: {change_percentage: "desc"}}
  }else if(selectedQuery === "Losers"){
    return {stock_current_price: {change_percentage: "asc"}}
  }else if(selectedQuery === "Volume Buzzers"){
    return {vol_change: "desc"}
  }else if(selectedQuery === "Gap Up" || selectedQuery === "52 Weeks High"){
    return {change_percentage: "desc"}
  }else if(selectedQuery === "Gap Down" || selectedQuery === "52 Weeks Low"){
    return {change_percentage: "asc"}
  }
}
