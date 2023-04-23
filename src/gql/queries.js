import { gql } from "@apollo/client";

export const GET_OVERVIEW_QUERIES = gql`
  query getSidebarQuery {
    queries(
      where: {
        _and: [
          { name: { _neq: "List of Indicies" } }
          { name: { _neq: "Nifty 50 Advances" } }
        ]
      }
    ) {
      id
      name
    }
  }
`;

export const GET_INDICES = gql`
  query getIndices {
    indices: indiacharts_indices(
      where: { ic_active: { _eq: true } }
      order_by: { name: asc }
    ) {
      name
      id
      security_code
      stock_prices(limit: 1, order_by: { created_at: desc }) {
        close_price
        current_price
        change_percentage
        created_at
      }
    }
  }
`;

export const GET_STOCK_PRICES = gql`
  query getStockPrices(
    $limit: Int
    $offset: Int
    $where: indiacharts_stock_prices_bool_exp
    $order_by: [indiacharts_stock_prices_order_by!]
  ) {
    stock_prices: indiacharts_stock_prices(
      limit: $limit
      offset: $offset
      distinct_on: ticker
      where: $where
      order_by: $order_by
    ) {
      ticker
      symbol
      current_price
      change_percentage
      total_trade_value
      total_trade_quantity
      created_at
    }
  }
`;

export const GET_GAINERS_LOSERS = gql`
  query GetGainersLosers(
    $index_id: uuid!
    $order_by: [indiacharts_indices_stocks_order_by!]
    $where: indiacharts_indices_stocks_bool_exp
  ) {
    stock_prices: indiacharts_indices_by_pk(id: $index_id) {
      indices_stocks(order_by: $order_by, where: $where) {
        security_code
        company_id
        company {
          name
        }
        stock_current_price {
          current_price
          high_price
          low_price
          open_price
          total_trade_quantity
          total_trade_value
          created_at
          change_percentage
        }
        symbol
        ticker_name
      }
    }
  }
`;

export const GET_STOCKS_BY_INDEX = gql`
  query GetStocksByIndex($index_id: uuid) {
    stocks: indiacharts_indices_stocks(
      where: { indices_id: { _eq: $index_id } }
    ) {
      ticker_name
      security_code
      created_at
      symbol
    }
  }
`;

export const GET_INDICES_FOR_AD = gql`
  query getADVIndices($where: indiacharts_indices_bool_exp) {
    sections: indiacharts_indices(where: $where) {
      name
      id
    }
  }
`;

export const GET_ADV_DECLINE_BY_INDEX = gql`
  query StockGapUpGapDown($index_id: uuid, $date: date) {
    gapup: indiacharts_stock_gapup_gapdown_aggregate(
      where: {
        _and: [
          { stock: { indices_id: { _eq: $index_id } } }
          { gap: { _gt: 0 } }
          { priced_date: { _eq: $date } }
        ]
      }
    ) {
      aggregate {
        count(columns: gap)
      }
    }
    gapdown: indiacharts_stock_gapup_gapdown_aggregate(
      where: {
        _and: [
          { stock: { indices: { id: { _eq: $index_id } } } }
          { gap: { _lt: 0 } }
          { priced_date: { _eq: "2022-11-10" } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
    unchanged: indiacharts_stock_gapup_gapdown_aggregate(
      where: {
        _and: [
          { stock: { indices: { id: { _eq: $index_id } } } }
          { gap: { _eq: 0 } }
          { priced_date: { _eq: "2022-11-10" } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_ADV_DECLINE_BY_INDEX_FUN = gql`
  query GetAdvanceDecline(
    $end_date: timestamptz
    $start_date: timestamptz
    $eod_timestamp: timestamptz
    $time_gap: interval
    $index_id: uuid
  ) {
    advance_declines: indiacharts_advance_decline_timegap_fun(
      args: {
        end_date: $end_date
        start_date: $start_date
        time_gap: $time_gap
        index_id: $index_id
      }
      order_by: { created_at: desc }
      where: { created_at: { _lte: $eod_timestamp } }
      limit: 1
    ) {
      advances
      created_at
      declines
    }
    total_stocks: indiacharts_indices_stocks_aggregate(
      where: { indices_id: { _eq: $index_id } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_EXPIRY_DATE_FOR_OPTIONS = gql`
  query getExpiryDates(
    $start_date: date
    $end_date: date
    $symbols: [String!]
  ) {
    fnodates: indiacharts_view_fno_price(
      distinct_on: expiry_date
      where: {
        expiry_date: { _gte: $start_date, _lte: $end_date }
        symbol: { _in: $symbols }
      }
    ) {
      expiry_date
    }
  }
`;

export const GET_FUTURE_ACTIVITY = gql`
  query getGapUpStocks($limit: Int) {
    long_builtup: indiacharts_long_builtup_futures(
      order_by: { oi_change: desc }
      limit: $limit
    ) {
      current_future_price
      oi
      oi_change
      past_future_price
      past_oi
      price_change
      symbol
      ticker
    }
    short_builtup: indiacharts_short_builtup_futures(
      order_by: { oi_change: desc }
      limit: $limit
    ) {
      ticker
      symbol
      price_change
      past_oi
      past_future_price
      oi_change
      oi
      current_future_price
    }
    long_unwinding: indiacharts_long_unwinding_futures(
      order_by: { oi_change: asc }
      limit: $limit
    ) {
      ticker
      symbol
      price_change
      past_oi
      past_future_price
      oi_change
      oi
      current_future_price
    }
    short_covering: indiacharts_short_covering_futures(
      order_by: { oi_change: asc }
      limit: $limit
    ) {
      ticker
      symbol
      price_change
      past_oi
      past_future_price
      oi_change
      oi
      current_future_price
    }
  }
`;
export const GET_LONG_BUILDUP = gql`
  query getLongBuildup(
    $limit: Int
    $order_by: [indiacharts_futures_activity_order_by!]
    $month_end: date
    $month_start: date
  ) {
    long_builtup: indiacharts_long_builtup_futures(
      args: { month_end: $month_end, month_start: $month_start }
      order_by: $order_by
      limit: $limit
    ) {
      oi_change
      price_change
      symbol
      ticker
      current_future_price
      oi
      past_future_price
      past_oi
    }
  }
`;

export const GET_SHORT_BUILDUP = gql`
  query getShortBuildup(
    $limit: Int
    $order_by: [indiacharts_futures_activity_order_by!]
    $month_end: date
    $month_start: date
  ) {
    short_builtup: indiacharts_short_builtup_futures(
      args: { month_end: $month_end, month_start: $month_start }
      order_by: $order_by
      limit: $limit
    ) {
      oi_change
      price_change
      oi
      symbol
      ticker
      current_future_price
      past_future_price
      past_oi
    }
  }
`;
export const GET_SHORT_COVERING = gql`
  query getShortCovering(
    $limit: Int
    $order_by: [indiacharts_futures_activity_order_by!]
    $month_end: date
    $month_start: date
  ) {
    short_covering: indiacharts_short_covering_futures(
      args: { month_end: $month_end, month_start: $month_start }
      order_by: $order_by
      limit: $limit
    ) {
      oi_change
      price_change
      oi
      symbol
      ticker
      current_future_price
      past_future_price
      past_oi
    }
  }
`;
export const GET_LONG_UNWINDING = gql`
  query getLongUnwinding(
    $limit: Int
    $order_by: [indiacharts_futures_activity_order_by!]
    $month_end: date
    $month_start: date
  ) {
    long_unwinding: indiacharts_long_unwinding_futures(
      args: { month_end: $month_end, month_start: $month_start }
      order_by: $order_by
      limit: $limit
    ) {
      oi_change
      price_change
      oi
      symbol
      ticker
      current_future_price
      past_future_price
      past_oi
    }
  }
`;
export const GET_CURRENT_PRICE_BY_TICKER = gql`
  query GetCurrentPriceByTicker($symbol: String) {
    indiacharts_stock_prices(
      where: { symbol: { _eq: $symbol } }
      order_by: { created_at: desc }
      limit: 1
    ) {
      current_price
      ticker
      symbol
      created_at
    }
  }
`;

export const GET_FUTURE_PRICE_BY_SYMBOL = gql`
  query GetFuturePrice($symbol: String, $start_date: date, $end_date: date) {
    indiacharts_view_fno_price(
      limit: 1
      order_by: { created_at: desc }
      where: {
        instrument_name: { _eq: "FUTIDX" }
        symbol: { _eq: $symbol }
        expiry_date: { _gte: $start_date, _lte: $end_date }
      }
    ) {
      last_traded_price
    }
  }
`;

export const GET_OPTIONS = gql`
  query GetOptions(
    $expiry_date: date
    $oi_upper: numeric
    $oi_lower: numeric
    $symbol: String
  ) {
    indiacharts_view_future_options(
      where: {
        strike_price: { _gte: $oi_lower, _lte: $oi_upper }
        symbol: { _eq: $symbol }
        expiry_date: { _eq: $expiry_date }
      }
    ) {
      strike_price
      call_oi: call
      expiry_date
      put_oi: put
      symbol
    }
  }
`;

export const GET_VOL_BUFFER_TICKERS = gql`
  query getVBTickers(
    $limit: Int
    $offset: Int
    $where: indiacharts_stock_volume_buzzers_bool_exp
    $order_by: [indiacharts_stock_volume_buzzers_order_by!]
  ) {
    vbdata: indiacharts_stock_volume_buzzers(
      distinct_on: ticker
      where: $where
      limit: $limit
      order_by: [{ ticker: asc }, { change_percentage: asc }]
    ) {
      ticker
    }
  }
`;

export const GET_VOL_BUFFER_TICKERS_FUNC = gql`
  query getVolumeBuzzers {
    vbdata: indiacharts_stock_volume_buzzers_fun(
      order_by: { vol_change: desc }
      where: { vol_change: { _gt: 0 } }
    ) {
      volume
      vol_change
      twenty_day_avg_volume
      ticker
      symbol
      securitycode
      date
      current_price
      created_at
      change_percentage
    }
  }
`;

export const GET_VOL_BUZZER_TICKERS_VIEW = gql`
  query getVolumeBuzzers(
    $where: indiacharts_view_volume_buzzer_stocks_bool_exp
    $order_by: [indiacharts_view_volume_buzzer_stocks_order_by!]
  ) {
    vbdata: indiacharts_view_volume_buzzer_stocks(
      where: $where
      order_by: $order_by
    ) {
      change_percentage
      created_at
      current_price
      date
      security_code
      symbol
      ticker
      twenty_day_avg_volume
      vol_change
      total_trade_quantity: volume
    }
  }
`;

export const GET_GAP_TICKERS = gql`
  query getGapTickers(
    $limit: Int
    $offset: Int
    $where: indiacharts_stock_gapup_gapdown_bool_exp
    $order_by: [indiacharts_stock_gapup_gapdown_order_by!]
  ) {
    gapdata: indiacharts_stock_gapup_gapdown(
      where: $where
      distinct_on: ticker
    ) {
      ticker
      gap
    }
  }
`;
export const GET_GAP_UP_TICKERS_FROM_FUNC = gql`
  query getGapUpTickers {
    gapdata: indiacharts_gapup_stocks_fun {
      change_percentage
      created_at
      current_price
      gap
      high_price
      low_price
      previous_high_price
      priced_date
      previous_low_price
      symbol
      ticker
    }
  }
`;
export const GET_GAP_DOWN_TICKERS_FROM_FUNC = gql`
  query getGapDownTickers {
    gapdata: indiacharts_gapdown_stocks_fun {
      change_percentage
      created_at
      current_price
      gap
      high_price
      low_price
      previous_high_price
      priced_date
      previous_low_price
      symbol
      ticker
    }
  }
`;
export const GET_GAP_UP_DOWN_TICKERS_FROM_VIEW = gql`
  query getGapUpDownStocks(
    $where: indiacharts_view_gapupdown_stocks_bool_exp
    $order_by: [indiacharts_view_gapupdown_stocks_order_by!]
  ) {
    gapdata: indiacharts_view_gapupdown_stocks(
      order_by: $order_by
      where: $where
    ) {
      symbol
      ticker
      gap
      created_at
      current_price
      change_percentage
      total_trade_quantity
      gap_down
      gap_up
      previous_high_price
      previous_low_price
      open_price
    }
  }
`;
// export const GET_GAP_DOWN_TICKERS_FROM_VIEW = gql`
//   query getGapDownStocks {
//     gapdata: indiacharts_view_gapupdown_stocks(
//       order_by: {change_percentage: asc},
//       where: {
//         gap_down: {_eq: true},
//         change_percentage: {_lt: 0}
//       }
//     ) {
//       symbol
//       ticker
//       gap
//       created_at
//       current_price
//       change_percentage
//     }
//   }
// `;
//<<<<<<<USING FUNCTIONS>>>>>>>>>
// export const GET_FIFTY_TWO_WEEKS_HIGH = gql`
//   query GetFiftyTwoWeeksHigh($start_date: date, $end_date: date) {
//     fififty_two_week_high: indiacharts_fifty_two_week_high_fun(
//       args: { start_date: $start_date, end_date: $end_date }
//     ) {
//       created_at
//       current_price
//       fifty_two_week_high
//       symbol
//       ticker
//     }
//   }
// `;
// export const GET_FIFTY_TWO_WEEKS_LOW = gql`
//   query GetFiftyTwoWeeksLow($start_date: date, $end_date: date) {
//     fifty_two_week_low: indiacharts_fifty_two_week_low_fun(
//       args: { start_date: $start_date, end_date: $end_date }
//     ) {
//       created_at
//       current_price
//       fifty_two_week_low
//       symbol
//       ticker
//     }
//   }
// `;
//<<<<<<<USING FUNCTIONS>>>>>>>>>

export const GET_FIFTY_TWO_WEEKS_HIGH = gql`
  query GetFiftyTwoWeeksHigh(
    $order_by: [indiacharts_view_fifty_two_week_high_stocks_order_by!]
    $where: indiacharts_view_fifty_two_week_high_stocks_bool_exp
  ) {
    fififty_two_week_high: indiacharts_view_fifty_two_week_high_stocks(
      order_by: $order_by
      where: $where
    ) {
      created_at
      current_price
      high: fifty_two_week_high
      high_price
      symbol
      ticker
      change_percentage
      current_price
      total_trade_quantity
      market_cap
    }
  }
`;
export const GET_FIFTY_TWO_WEEKS_LOW = gql`
  query GetFiftyTwoWeeksLow(
    $order_by: [indiacharts_view_fifty_two_week_low_stocks_order_by!]
    $where: indiacharts_view_fifty_two_week_low_stocks_bool_exp
  ) {
    fifty_two_week_low: indiacharts_view_fifty_two_week_low_stocks(
      order_by: $order_by
      where: $where
    ) {
      created_at
      current_price
      low: fifty_two_week_high
      low_price
      symbol
      ticker
      change_percentage
      current_price
      total_trade_quantity
      market_cap
    }
  }
`;
export const GET_FII_HEADERS = gql`
  query getDerivativeHeader {
    headers: indiacharts_fii_participant_list(
      distinct_on: client_type
      where: { client_type: { _neq: "TOTAL" } }
    ) {
      client_type
    }
  }
`;

export const GET_FII_DATES = gql`
  query getDerivateDates($start: date, $end: date) {
    dates: indiacharts_fii_participant_list(
      distinct_on: priced_date
      order_by: { priced_date: desc }
      where: {
        _and: [
          { priced_date: { _lte: $start } }
          { priced_date: { _gte: $end } }
        ]
      }
    ) {
      priced_date
    }
  }
`;

export const GET_FII_DERIVATIVES = gql`
  query getFiiDerivatives(
    $limit: Int
    $offset: Int
    $where: indiacharts_fii_participant_list_bool_exp
    $order_by: [indiacharts_fii_participant_list_order_by!]
    $distinct_on: [indiacharts_fii_participant_list_select_column!]
  ) {
    derivatives: indiacharts_fii_participant_list(
      where: $where
      distinct_on: $distinct_on
      order_by: $order_by
    ) {
      long: long_open_interest
      short: short_open_interest
      total_diff: total
      change_in_long
      change_in_short
      change_in_total
      instrument_type
      priced_date
      amount: change_in_total
    }
  }
`;
export const GET_CASHMARKET_DII = gql`
  query getcashmarket(
    $limit: Int
    $offset: Int
    $where: indiacharts_dii_list_bool_exp
    $order_by: [indiacharts_dii_list_order_by!]
  ) {
    indiacharts_dii_list(where: $where, order_by: $order_by) {
      date: priced_date
      amount: net_investment
    }
  }
`;
export const GET_CASHMARKET_FII = gql`
  query GetInvestorTurnovers(
    $limit: Int
    $offset: Int
    $where: indiacharts_investor_turnovers_bool_exp
    $order_by: [indiacharts_investor_turnovers_order_by!]
  ) {
    indiacharts_fii_list: indiacharts_investor_turnovers(
      offset: $offset
      limit: $limit
      where: $where
      order_by: $order_by
    ) {
      date
      amount: fiibse_nse_net
    }
  }
`;
export const GET_CASHMARKET_FII_TIMEBUCKET = gql`
  query GetInvestorTurnoversTimebucket(
    $start_date: timestamptz
    $end_date: timestamptz
    $time_gap: interval
    $order_by: [indiacharts_fii_cash_order_by!]
  ) {
    indiacharts_fii_list: indiacharts_candle_graph_fii_cash(
      args: {
        end_date: $end_date
        start_date: $start_date
        time_gap: $time_gap
      }
      order_by: $order_by
    ) {
      date: priced_date
      amount: net_investment
    }
  }
`;
export const GET_CASHMARKET_DII_TIMEBUCKET = gql`
  query GetDiiTimebucket(
    $start_date: timestamptz
    $end_date: timestamptz
    $time_gap: interval
    $order_by: [indiacharts_dii_list_order_by!]
  ) {
    indiacharts_dii_list: indiacharts_candle_graph_dii_cash(
      args: {
        end_date: $end_date
        start_date: $start_date
        time_gap: $time_gap
      }
      order_by: $order_by
    ) {
      date: priced_date
      amount: net_investment
    }
  }
`;
export const GET_CASH_DETAILS = gql`
  query GetFiiDiiAggregation(
    $where: indiacharts_fii_dii_aggregation_bool_exp
    $limit: Int
    $offset: Int
  ) {
    cash: indiacharts_fii_dii_aggregation(
      where: $where
      order_by: { priced_date: desc }
      offset: $offset
      limit: $limit
    ) {
      priced_date
      dii_monthly_data
      fii_monthly_data
      change_percentage
      close_price
      dii_cash
      fii_cash
    }
  }
`;
export const GET_DII_CASH_DETAILS = gql`
  query GetFiiDiiAggregation(
    $where: indiacharts_fii_dii_aggregation_bool_exp
    $limit: Int
    $offset: Int
  ) {
    dii: indiacharts_fii_dii_aggregation(
      where: $where
      order_by: { priced_date: desc }
      offset: $offset
      limit: $limit
    ) {
      priced_date
      monthly_data: dii_monthly_data
      change_percentage
      close_price
      amount: dii_cash
    }
  }
`;
export const GET_FII_CASH_DETAILS = gql`
  query GetFiiDiiAggregation(
    $where: indiacharts_fii_dii_aggregation_bool_exp
    $limit: Int
    $offset: Int
  ) {
    fii: indiacharts_fii_dii_aggregation(
      where: $where
      order_by: { priced_date: desc }
      offset: $offset
      limit: $limit
    ) {
      priced_date
      monthly_data: fii_monthly_data
      change_percentage
      close_price
      amount: fii_cash
    }
  }
`;

export const GET_FII_CASH_DAILY = gql`
  query GetViewFiiCashDaily(
    $where: indiacharts_view_fii_cash_daily_bool_exp
    $limit: Int
    $offset: Int
  ) {
    fii: indiacharts_view_fii_cash_daily(
      where: $where
      offset: $offset
      limit: $limit
      order_by: { priced_date: desc }
    ) {
      priced_date
      amount
      change_percentage
      close_price
    }
  }
`;

export const GET_DII_CASH_DAILY = gql`
  query GetViewDiiCashDaily(
    $where: indiacharts_view_dii_cash_daily_bool_exp
    $limit: Int
    $offset: Int
  ) {
    dii: indiacharts_view_dii_cash_daily(
      where: $where
      offset: $offset
      limit: $limit
      order_by: { priced_date: desc }
    ) {
      priced_date
      amount
      change_percentage
      close_price
    }
  }
`;

export const GET_CASHMARKET = gql`
  query getIndiachartsStockPrices {
    indiacharts_stock_prices(
      where: { last_traded_at: { _gte: "2022-11-02T09:41:16+00:00" } }
      order_by: { last_traded_price: asc }
      limit: 30
    ) {
      close_price
      last_traded_price
      symbol
    }
  }
`;

export const GET_HEATMAP = gql`
  query getOptions($side: uuid!) {
    calls: indiacharts_indices_stocks(
      where: { _and: [{ indices_id: { _eq: $side } }] }
    ) {
      ticker_name
    }
  }
`;

export const GET_HEATMAP_2 = gql`
  query getSFnoPrices($where: indiacharts_fno_prices_bool_exp) {
    fno_prices: indiacharts_fno_prices(where: $where, distinct_on: ticker) {
      ticker
    }
  }
`;

export const GET_ADV_DECLINE_IN_HEATMAP = gql`
  query StockHeatmap($index_id: uuid, $date: date) {
    gapup: indiacharts_stock_prices_aggregate(
      where: {
        _and: [
          { stock: { indices_id: { _eq: $index_id } } }
          { change_percentage: { _gt: 0 } }
          { created_at: { _eq: "2022-12-13T03:42:00+00:00" } }
        ]
      }
    ) {
      aggregate {
        count(columns: change_percentage)
      }
      nodes {
        created_at
      }
    }
    gapdown: indiacharts_stock_prices_aggregate(
      where: {
        _and: [
          { stock: { indices: { id: { _eq: $index_id } } } }
          { change_percentage: { _lt: 0 } }
          { created_at: { _eq: "2022-12-13T03:42:00+00:00" } }
        ]
      }
    ) {
      aggregate {
        count
      }
      nodes {
        created_at
      }
    }
    unchanged: indiacharts_stock_prices_aggregate(
      where: {
        _and: [
          { stock: { indices: { id: { _eq: $index_id } } } }
          { change_percentage: { _eq: 0 } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_DATE_X_AXIS = gql`
  query Created_date_query {
    indiacharts_stock_prices(
      limit: 5
      order_by: { created_at: desc }
      distinct_on: created_at
    ) {
      created_at
    }
  }
`;

export const GET_HEATMAP_AMOUNT = gql`
  query getOptions($side: uuid!) {
    amount: indiacharts_indices_stocks(
      where: { _and: [{ indices_id: { _eq: $side } }] }
    ) {
      ticker_name
    }
  }
`;

export const GET_INDIACHARTS_STOCK_PRICES = gql`
  query MyQuery {
    indiacharts_stock_prices(distinct_on: symbol, limit: 50) {
      symbol
      ticker
      current_price
      change_percentage
    }
  }
`;

export const GET_INDIACHARTS_INDICES_BY_ID = gql`
  query getIndiachartsIndicesById($id: uuid) {
    indiacharts_indices(where: { id: { _eq: $id } }) {
      id
      name
      stock_prices(limit: 1, order_by: { created_at: desc }) {
        change_percentage
        current_price
        created_at
      }
      indices_stocks {
        ticker_name
        stock_prices(limit: 1, order_by: { created_at: desc }) {
          change_percentage
          current_price
          created_at
        }
      }
    }
  }
`;

export const GET_STOCK_PRICE_EOD = gql`
  query getStockPriceEod {
    indiacharts_stock_price_eod(
      order_by: { created_at: desc }
      where: { ticker: { _eq: "NSE Index" } }
      distinct_on: created_at
    ) {
      symbol
      close_price
      change_percentage
      created_at
    }
  }
`;

export const GET_ADVANCE_DECLINE_RATIO = gql`
  query GetAdvanceDecline(
    $end_date: timestamptz
    $start_date: timestamptz
    $eod_timestamp: timestamptz
    $time_gap: interval
    $index_id: uuid
  ) {
    indiacharts_advance_decline_timegap_fun(
      args: {
        end_date: $end_date
        start_date: $start_date
        time_gap: $time_gap
        index_id: $index_id
      }
      order_by: { created_at: asc }
      where: { created_at: { _lte: $eod_timestamp } }
    ) {
      advances
      created_at
      declines
    }
  }
`;

export const GET_VIDEO = gql`
  query GetHelpVideos($where: indiacharts_video_resources_bool_exp) {
    indiacharts_video_resources(
      limit: 30
      order_by: { updated_at: desc }
      where: $where
    ) {
      title
      link_source
      link
      description
    }
  }
`;

export const GET_SYSTEM_UPDATE = gql`
  query GetSystemUpdates(
    $date: order_by
    $where: indiacharts_application_updates_bool_exp
    $limit: Int
    $offset: Int
  ) {
    data: indiacharts_application_updates(
      order_by: { date: $date }
      where: $where
      limit: $limit
      offset: $offset
    ) {
      id
      Date: date
      Desciption: description
      created_at
    }
    total: indiacharts_application_updates_aggregate(
      order_by: { date: $date }
      where: $where
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_LATEST_NIFTY_STOCK = gql`
  query GetLatestNiftyStock {
    stock_prices: indiacharts_stock_prices(
      limit: 1
      order_by: { created_at: desc }
      where: { ticker: { _eq: "NSE Index" } }
    ) {
      created_at
      close_price
      high_price
      low_price
      open_price
      change
      change_percentage
    }
    stock_prices_eod: indiacharts_stock_price_eod(
      order_by: { created_at: desc }
      limit: 1
    ) {
      created_at
      close_price
      high_price
      low_price
      open_price
      change_percentage
    }
  }
`;

export const GET_HEATMAP_SIDEBAR = gql`
  query getHeatmapSidebar($gap: interval, $order: order_by) {
    indiacharts_HEAT_MAP_SIDEBAR(
      args: { gap: $gap }
      order_by: { CHANGE_PERCENTAGE: $order }
    ) {
      change_percentage: CHANGE_PERCENTAGE
      close_price: CLOSE_PRICE
      created_at: CREATED_AT
      current_price: CURRENT_PRICE
      id: ID
      name: NAME
      security_code: SECURITY_CODE
    }
  }
`;
export const GET_HEATMAP_STOCKS = gql`
  query getHeatmapStocks($gap: interval, $uid: uuid) {
    indiacharts_HEAT_MAP_STOCKS(args: { gap: $gap, uid: $uid }) {
      change_percentage: CHANGE_PERCENTAGE
      close_price: CLOSE_PRICE
      created_at: CREATED_AT
      current_price: CURRENT_PRICE
      ticker_name: TICKER_NAME
    }
  }
`;

export const GET_HEATMAP_SIDEBAR_1HR = gql`
  query getHeatmapSidebar1hr($order: order_by) {
    indiacharts_HEAT_MAP_SIDEBAR_1HR(order_by: { CHANGE_PERCENTAGE: $order }) {
      change_percentage: CHANGE_PERCENTAGE
      current_price: CURRENT_PRICE
      id: ID
      created_at: CREATED_AT
      name: NAME
      security_code: SECURITY_CODE
    }
  }
`;

export const GET_HEATMAP_STOCKS_1HR = gql`
  query getHeatmapStocks1hr($uid: uuid) {
    indiacharts_HEAT_MAP_STOCKS_1HR(args: { uid: $uid }) {
      change_percentage: CHANGE_PERCENTAGE
      current_price: CURRENT_PRICE
      ticker_name: TICKER_NAME
    }
  }
`;

export const GET_HEATMAP_FNO_STOCKS_1HR = gql`
  query getHeatmapFnoStocks1hr {
    indiacharts_view_heat_map_fno_1hr(distinct_on: ticker) {
      change_percentage
      current_price
      ticker
    }
  }
`;

export const GET_HEATMAP_FNO_STOCKS_1M = gql`
  query getHeatmapFnoStocks1m {
    indiacharts_view_heat_map_fno_1m(distinct_on: ticker) {
      change_percentage
      current_price
      ticker
    }
  }
`;

export const GET_HEATMAP_FNO_STOCKS_1WK = gql`
  query getHeatmapFnoStocks1wk {
    indiacharts_view_heat_map_fno_1wk(distinct_on: ticker) {
      change_percentage
      current_price
      ticker
    }
  }
`;

export const GET_HEATMAP_FNO_STOCKS_3M = gql`
  query getHeatmapFnoStocks3m {
    indiacharts_view_heat_map_fno_3m(distinct_on: ticker) {
      change_percentage
      current_price
      ticker
    }
  }
`;

export const GET_HEATMAP_FNO_STOCKS_6M = gql`
  query getHeatmapFnoStocks6m {
    indiacharts_view_heat_map_fno_6m(distinct_on: ticker) {
      change_percentage
      current_price
      ticker
    }
  }
`;

export const GET_HEATMAP_FNO_STOCKS_1YR = gql`
  query getHeatmapFnoStocks1yr {
    indiacharts_view_heat_map_fno_1yr(distinct_on: ticker) {
      change_percentage
      current_price
      ticker
    }
  }
`;

export const GET_INFO_COUNTS = gql`
  query getInfoCounts($current_date: timestamptz, $today: date) {
    news: indiacharts_stock_news_aggregate(
      where: {
        news_classification: { _eq: "news" }
        news_date: { _gte: $current_date }
      }
    ) {
      aggregate {
        count
      }
    }
    announcements: indiacharts_stock_news_aggregate(
      where: {
        news_classification: { _eq: "announcement" }
        news_date: { _gte: $current_date }
      }
    ) {
      aggregate {
        count
      }
    }
    dividends: indiacharts_company_dividend_aggregate(
      where: { execution_date: { _gte: $today } }
    ) {
      aggregate {
        count
      }
    }
    splits_bonus: indiacharts_splits_bonus_aggregate(
      where: { execution_date: { _gte: $today } }
    ) {
      aggregate {
        count
      }
    }
    rights: indiacharts_company_rights_aggregate(
      where: { execution_date: { _gte: $today } }
    ) {
      aggregate {
        count
      }
    }
    merger: indiacharts_company_merge_demerge_aggregate(
      where: { expiry_date_no_dealing_date: { _gte: $today } }
    ) {
      aggregate {
        count
      }
    }
    demerger: indiacharts_company_merge_demerge_aggregate(
      where: { record_date: { _gte: $today } }
    ) {
      aggregate {
        count
      }
    }
    bulkdeals: indiacharts_bulk_deals_aggregate(
      where: { deal_date: { _gte: $today } }
    ) {
      aggregate {
        count
      }
    }
    blockdeals: indiacharts_block_deals_aggregate(
      where: { deal_date: { _gte: $today } }
    ) {
      aggregate {
        count
      }
    }
    insiders: indiacharts_insider_tradings_aggregate(
      where: { disclosure_date: { _gte: $today } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

//Indices/stocks corporate actions

export const GET_DIVIDEND = gql`
  query getDividend(
    $execution_date: order_by
    $where: indiacharts_company_dividend_bool_exp
    $limit: Int
    $offset: Int
  ) {
    data: indiacharts_company_dividend(
      where: $where
      limit: $limit
      offset: $offset
      order_by: { execution_date: $execution_date }
    ) {
      type
      company {
        name
        view_stock_price {
          current_price
        }
      }
      announcement_date
      execution_date
      dividend_per_share
      dividend_percentage
    }
    total: indiacharts_company_dividend_aggregate(
      order_by: { execution_date: $execution_date }
      where: $where
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_SPLIT_BONUS = gql`
  query getSplitBonus(
    $execution_date: order_by
    $where: indiacharts_splits_bonus_bool_exp
    $limit: Int
    $offset: Int
  ) {
    data: indiacharts_splits_bonus(
      where: $where
      limit: $limit
      offset: $offset
      order_by: { execution_date: $execution_date }
    ) {
      type
      execution_date
      company {
        name
        view_stock_price {
          current_price
        }
      }
      new_value
      existing_value
      announcement_date
    }
    total: indiacharts_splits_bonus_aggregate(
      order_by: { execution_date: $execution_date }
      where: $where
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_RIGHTS = gql`
  query getRights(
    $where: indiacharts_rights_bool_exp
    $limit: Int
    $offset: Int
    $execution_date: order_by
  ) {
    data: indiacharts_rights(
      where: $where
      limit: $limit
      offset: $offset
      order_by: { execution_date: $execution_date }
    ) {
      execution_date
      offered_ratio
      existing_ratio
      company_id
      issue_price
      announcement_date
      offered_instrument_type_description
      company {
        name
        view_stock_price {
          current_price
        }
      }
    }
    total: indiacharts_rights_aggregate(
      order_by: { execution_date: $execution_date }
      where: $where
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_MERGER = gql`
  query getMerger(
    $where: indiacharts_company_merge_demerge_bool_exp
    $limit: Int
    $offset: Int
    $execution_date: order_by
  ) {
    data: indiacharts_company_merge_demerge(
      where: $where
      limit: $limit
      offset: $offset
      order_by: { execution_date: $execution_date }
    ) {
      company {
        name
        view_stock_price {
          current_price
        }
      }
      allotment_date
      announcement_date
      offered_ratio
      type
      existing_face_value
      face_value_before_demerge
      face_value_after_demerge
      effective_date
      expiry_date_no_dealing_date
      record_date
      execution_date
    }
    total: indiacharts_company_merge_demerge_aggregate(
      order_by: { execution_date: $execution_date }
      where: $where
    ) {
      aggregate {
        count
      }
    }
  }
`;

//insider tradings

export const GET_BULK_DEALS = gql`
  query getBulkDeals(
    $deal_date: order_by
    $where: indiacharts_bulk_deals_bool_exp
    $limit: Int
    $offset: Int
  ) {
    data: indiacharts_bulk_deals(
      order_by: { deal_date: $deal_date }
      where: $where
      offset: $offset
      limit: $limit
    ) {
      id
      client_name
      exchange
      quantity
      deal_date
      type
      price
      stock {
        ticker
        company {
          name
        }
      }
    }
    total: indiacharts_bulk_deals_aggregate(
      order_by: { deal_date: $deal_date }
      where: $where
    ) {
      aggregate {
        count
      }
    }
  }
`;
// export const GET_DEALS_FN = (type) => gql`
//   query getBulkDeals(
//     $deal_date: order_by
//     $where: indiacharts_${type}_deals_bool_exp
//     $limit: Int
//     $offset: Int
//   ) {
//     data: indiacharts_${type}_deals(
//       order_by: { deal_date: $deal_date }
//       where: $where
//       limit: $limit
//       offset: $offset
//     ) {
//       id
//       client_name
//       exchange
//       quantity
//       deal_date
//       type
//       price
//       stock {
//         ticker
//         company {
//           name
//         }
//       }
//     }
//     total: indiacharts_${type}_deals_aggregate(
//       order_by: { deal_date: $deal_date }
//       where: $where
//     ) {
//       aggregate {
//         count
//       }
//     }
//   }
// `;

export const GET_BLOCK_DEALS = gql`
  query getBlockDeals(
    $deal_date: order_by
    $where: indiacharts_block_deals_bool_exp
    $limit: Int
    $offset: Int
  ) {
    data: indiacharts_block_deals(
      order_by: { deal_date: $deal_date }
      where: $where
      limit: $limit
      offset: $offset
    ) {
      id
      client_name
      exchange
      quantity
      deal_date
      type
      price
      stock {
        ticker
        company {
          name
        }
      }
    }
    total: indiacharts_block_deals_aggregate(
      order_by: { deal_date: $deal_date }
      where: $where
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_INSIDER = gql`
  query getInsider(
    $acquisition_date: order_by
    $where: indiacharts_insider_tradings_bool_exp
    $limit: Int
    $offset: Int
  ) {
    data: indiacharts_insider_tradings(
      order_by: { acquisition_date: $acquisition_date }
      where: $where
      limit: $limit
      offset: $offset
    ) {
      id
      acquisition_date
      person_name
      transaction_type
      acquisition_mode
      security_count
      security_value
      pretransaction_shareholding_percent
      posttransaction_shareholding_percent
      stock {
        ticker
      }
    }
    total: indiacharts_insider_tradings_aggregate(
      order_by: { acquisition_date: $acquisition_date }
      where: $where
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_VIEW_HEATMAP_FNO_TODAY = gql`
  query getViewHeatmapFnotoday {
    indiacharts_view_heat_map_fno {
      change_percentage: change
      current_price
      ticker
    }
  }
`;
export const GET_VIEW_HEATMAP_FNO_1HR = gql`
  query getViewHeatmapFno1hr {
    indiacharts_view_heat_map_fno_1hr {
      change_percentage: change
      current_price
      ticker
    }
  }
`;

export const GET_VIEW_HEATMAP_FNO_1M = gql`
  query getViewHeatmapFno1m {
    indiacharts_view_heat_map_fno_1m {
      ticker
      change_percentage: change
      current_price
    }
  }
`;
export const GET_VIEW_HEATMAP_FNO_1WK = gql`
  query getViewHeatmapFno1wk {
    indiacharts_view_heat_map_fno_1wk {
      change_percentage: change
      current_price
      ticker
    }
  }
`;

export const GET_VIEW_HEATMAP_FNO_3M = gql`
  query getViewHeatmapFno3m {
    indiacharts_view_heat_map_fno_3m {
      change_percentage: change
      current_price
      ticker
    }
  }
`;
export const GET_VIEW_HEATMAP_FNO_6M = gql`
  query getViewHeatmapFno6m {
    indiacharts_view_heat_map_fno_6m {
      change_percentage: change
      current_price
      ticker
    }
  }
`;

export const GET_VIEW_HEATMAP_FNO_1YR = gql`
  query getViewHeatmapFno1yr {
    indiacharts_view_heat_map_fno_1yr {
      change_percentage: change
      current_price
      ticker
    }
  }
`;

export const GET_STOCK_NEWS = gql`
  query GetStockNews(
    $where: indiacharts_stock_news_bool_exp
    $offset: Int
    $limit: Int
    $order_by: [indiacharts_stock_news_order_by!]
    $distinct_on: [indiacharts_stock_news_select_column!]
  ) {
    news: indiacharts_stock_news(
      where: $where
      offset: $offset
      limit: $limit
      order_by: $order_by
      distinct_on: $distinct_on
    ) {
      company_code
      content
      exchange
      headlines
      news_classification
      news_type
      source_name
      created_at
      modified_at
      news_date
      company_id
      company {
        name
      }
    }
  }
`;

//Heatmap Sidebar View

export const GET_VIEW_HEATMAP_SB_TODAY = gql`
  query getViewHeatmapSbToday($order_by: order_by) {
    indiacharts_view_heat_map_sb(order_by: { change_percentage: $order_by }) {
      current_price
      id
      name
      change_percentage
    }
  }
`;

export const GET_VIEW_HEATMAP_SB_1HR = gql`
  query getViewHeatmapSb1hr($order_by: order_by) {
    indiacharts_view_heat_map_sb_1hr(order_by: { change: $order_by }) {
      current_price
      id
      name
      change_percentage: change
    }
  }
`;
export const GET_VIEW_HEATMAP_SB_1WK = gql`
  query getViewHeatmapSb1Wk($order_by: order_by) {
    indiacharts_view_heat_map_sb_1wk(order_by: { change: $order_by }) {
      current_price
      id
      name
      change_percentage: change
    }
  }
`;
export const GET_VIEW_HEATMAP_SB_1M = gql`
  query getViewHeatmapSb1m($order_by: order_by) {
    indiacharts_view_heat_map_sb_1m(order_by: { change: $order_by }) {
      current_price
      id
      name
      change_percentage: change
    }
  }
`;
export const GET_VIEW_HEATMAP_SB_3M = gql`
  query getViewHeatmapSb3m($order_by: order_by) {
    indiacharts_view_heat_map_sb_3m(order_by: { change: $order_by }) {
      current_price
      id
      name
      change_percentage: change
    }
  }
`;
export const GET_VIEW_HEATMAP_SB_6M = gql`
  query getViewHeatmapSb6m($order_by: order_by) {
    indiacharts_view_heat_map_sb_6m(order_by: { change: $order_by }) {
      current_price
      id
      name
      change_percentage: change
    }
  }
`;
export const GET_VIEW_HEATMAP_SB_1YR = gql`
  query getViewHeatmapSb1yr($order_by: order_by) {
    indiacharts_view_heat_map_sb_1y(order_by: { change: $order_by }) {
      current_price
      id
      name
      change_percentage: change
    }
  }
`;

//IPO
export const GET_IPO_DATA = gql`
  query GetViewIpoOverview(
    $where: indiacharts_view_ipo_overview_bool_exp
    $order_by: [indiacharts_view_ipo_overview_order_by!]
  ) {
    ipo: indiacharts_view_ipo_overview(where: $where, order_by: $order_by) {
      allotment_date
      closes_at
      opens_at
      bid_from
      bid_to
      coupon_rate
      face_value
      issue_size
      lot_size
      offered_shares
      offer_price
      company {
        name
        stocks {
          listed_date
          current_price {
            current_price
          }
        }
      }
    }
  }
`;
export const GET_HOLIDAY_LIST = gql`
  query GetHolidayList {
    holidays: indiacharts_holidays(where: { exchange_code: { _eq: "NSE" } }) {
      exchange_code
      holiday_date
    }
  }
`;

//dii aggt
export const GET_DII_AGGRT = gql`
  query GetDiiAggrt {
    indiacharts_dii_list_metrics {
      amount
      close_price
      monthly_data
      priced_date
      year
      change_percentage
    }
  }
`;

export const GET_IPO_ONGOING = gql`
  query getIpoData(
    $where: indiacharts_view_ip_ongoing_bool_exp
    $order_by: [indiacharts_view_ip_ongoing_order_by!]
  ) {
    indiacharts_view_ip_ongoing(where: $where, order_by: $order_by) {
      face_values
      shares_offered
      shares_subscribed
      issue_size
      lot_size
      offer_price
      allotment_date
      open_date
      close_date
      company_code
      company_name
      subscription
      subscriptions(
        where: {
          category: { _neq: "Total" }
          subcategory: { _eq: "subcategory_total" }
        }
      ) {
        company {
          name
        }
        company_code
        issue_date
        shares_bid_for
        shares_offered_reserved
        category
        subcategory
        total_meant_for_category
      }
    }
  }
`;

export const GET_VIEW_IPO_PERFORMANCE = gql`
  query getViewIpoPerformance(
    $where: indiacharts_view_ipo_performance_bool_exp
    $order_by: [indiacharts_view_ipo_performance_order_by!]
  ) {
    indiacharts_view_ipo_performance(where: $where, order_by: $order_by) {
      company_name
      listed_date
      current_price
      offer_price
      offer_change
      listed_price
      listing_change
    }
  }
`;

//Raise a Ticket

export const GET_CUSTOMER_TICKETS = gql`
  query getCustomerTickets(
    $where: indiacharts_customer_tickets_bool_exp
    $order_by: [indiacharts_customer_tickets_order_by!]
  ) {
    indiacharts_customer_tickets(where: $where, order_by: $order_by) {
      category
      id
      rejection_reason
      title
      type
      uid
      updated_at
      created_at
      descriptions
      customer_id
      state
      enum_ticket_category {
        name
        comments
      }
      ticket_comments {
        comment
      }
      enum_ticket_type {
        name
        comments
      }
      creator {
        displayName
      }
      ticket_resources {
        name
        id
        link
      }
    }
  }
`;

export const GET_TICKET_CATEGORIES = gql`
  query getTicketCategories {
    indiacharts_enum_ticket_categories {
      comments
      name
    }
  }
`;

export const GET_TICKET_TYPES = gql`
  query getTicketTypes {
    indiacharts_enum_ticket_type {
      comments
      name
    }
  }
`;

export const GET_TICKET_COMMENTTS = gql`
  query getTicketComments($id: uuid) {
    indiacharts_ticket_comments(where: { ticket_id: { _eq: $id } }) {
      comment
      created_by
      created_at
      id
      ticket_id
      creator {
        displayName
      }
      ticket_resources {
        comment_id
        created_by
        link
        name
        id
      }
    }
  }
`;

//mutation
export const MUTATE_TICKETS = gql`
  mutation mutate($id: uuid!, $set: indiacharts_customer_tickets_set_input) {
    update_indiacharts_customer_tickets_by_pk(
      pk_columns: { id: $id }
      _set: $set
    ) {
      category
    }
  }
`;

export const CREATE_NEW_TICKET = gql`
  mutation createNewTicket(
    $object: [indiacharts_customer_tickets_insert_input!]!
  ) {
    insert_indiacharts_customer_tickets(objects: $object) {
      returning {
        category
      }
    }
  }
`;

export const CREATE_TICKET_COMMENT = gql`
  mutation createComment(
    $object: [indiacharts_ticket_comments_insert_input!]!
  ) {
    insert_indiacharts_ticket_comments(objects: $object) {
      affected_rows
    }
  }
`;

//delete ticket
export const DELETE_TICKET_BY_ID = gql`
  mutation deleteTicketById($id: uuid!) {
    delete_indiacharts_customer_tickets_by_pk(id: $id) {
      id
    }
  }
`;
export const GET_WEBINARS = gql`
  query getWebinars(
    $where: indiacharts_webinars_bool_exp
    $order_by: order_by
  ) {
    webinars: indiacharts_webinars(
      where: $where
      order_by: { created_at: $order_by }
    ) {
      category {
        category
        id
      }
      description
      duration
      host_at
      id
      link
      link_source
      presenter
      presenter_img
      thumbnail
      title
      created_at
      creator {
        avatarUrl
        displayName
        email
      }
      analyst {
        name
        position
        biography
        external
        organisation
        image_url
        external
      }
      recorded
    }
  }
`;
export const GET_WEBINARS_AGGREGATE = gql`
  query getWebinarsAggregate {
    total_webinars: indiacharts_webinars_aggregate {
      aggregate {
        count
      }
    }
    ic_webinars: indiacharts_webinars_aggregate(
      where: { category: { category: {_eq: "Market Mornings" } } }
    ) {
      aggregate {
        count
      }
    }
    guest_webinars: indiacharts_webinars_aggregate(
      where: { category: { category: { _eq: "Technical Talks" } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const INSERT_TICKET_RESOURCE = gql`
  mutation createTicketResource(
    $object: [indiacharts_ticket_resources_insert_input!]!
  ) {
    insert_indiacharts_ticket_resources(objects: $object) {
      affected_rows
    }
  }
`;

export const UPDATE_TICKET_RESOURCE = gql`
  mutation updateTicketResource(
    $id: uuid!
    $set: indiacharts_ticket_resources_set_input
  ) {
    update_indiacharts_ticket_resources_by_pk(
      pk_columns: { id: $id }
      _set: $set
    ) {
      id
    }
  }
`;

export const UPDATE_CUSTOMER_TICKET = gql`
  mutation updateCustomerTicket(
    $id: uuid!
    $set: indiacharts_customer_tickets_set_input
  ) {
    update_indiacharts_customer_tickets_by_pk(
      pk_columns: { id: $id }
      _set: $set
    ) {
      id
    }
  }
`;

export const DELETE_TICKET_RESOURCES = gql`
  mutation deleteTicketResources($ids: [uuid!]) {
    delete_indiacharts_ticket_resources(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`;

export const GET_NEAR_FITYTWO_WEEK_HIGH = gql`
  query getViewFiftyTwoWeekHigh(
    $where: indiacharts_view_near_52_week_high_bool_exp
  ) {
    indiacharts_view_near_52_week_high(where: $where) {
      ticker
      fifty_two_week_high
      close_price
      highchange: change
      created_at
      symbol
      market_cap
    }
  }
`;

export const GET_NEAR_FITYTWO_WEEK_LOW = gql`
  query getViewFiftyTwoWeekLow(
    $where: indiacharts_view_near_52_week_low_bool_exp
  ) {
    indiacharts_view_near_52_week_low(where: $where) {
      ticker
      fifty_two_week_low
      close_price
      lowchange: change
      created_at
      symbol
      market_cap
    }
  }
`;

export const GET_TRADING_DATES = gql`
  query getTradingDates(
    $limit: Int
    $where: indiacharts_stock_price_eod_bool_exp
  ) {
    indiacharts_stock_price_eod(
      limit: $limit
      order_by: { created_at: desc }
      where: $where
    ) {
      created_at
    }
  }
`;

export const GET_FIFTY_TWO_WEEK_EOD = gql`
  query getFiftyTwoWeekEod($where: indiacharts_stock_price_eod_bool_exp) {
    indiacharts_stock_price_eod(where: $where) {
      fifty_two_week_low
      fifty_two_week_high
      close_price
      ticker
      market_cap
      lowchange: percent_away_from_fifty_two_week_low
      highchange: percent_away_from_fifty_two_week_high
      symbol
    }
  }
`;

export const GET_NEW_FIFTYTWO_WEEK_HIGH = gql`
  query getNewFiftyTwoWeekHigh(
    $where: indiacharts_new_fifty_two_week_high_low_bool_exp
  ) {
    indiacharts_new_fifty_two_week_high(where: $where) {
      change
      high: high_low
      market_cap
      ticker
      current_price
      created_at
    }
  }
`;

export const GET_NEW_FIFTYTWO_WEEK_LOW = gql`
  query getNewFiftyTwoWeekLow(
    $where: indiacharts_new_fifty_two_week_high_low_bool_exp
  ) {
    indiacharts_new_fifty_two_week_low(where: $where) {
      change
      low: high_low
      market_cap
      ticker
      current_price
      created_at
    }
  }
`;

export const GET_NEW_FIFTYtWO_WEEK_HIGHLOW = gql`
  query getFiftyTwoWeekHighLow($where: indiacharts_stock_price_eod_bool_exp) {
    indiacharts_stock_price_eod(where: $where) {
      ticker
      change_percentage
      market_cap
      low_price: fifty_two_week_low
      high_price: fifty_two_week_high
      current_price
      change: percent_away_from_fifty_two_week_high
      gap_down
      gap_up
      open_price
      previous_high_price
      previous_low_price
      symbol
    }
  }
`;

//heatmap view

export const GET_VIEW_HEATMAP_ST_TODAY = gql`
  query getViewHeatmapStToday($where: indiacharts_view_heat_map_st_bool_exp) {
    indiacharts_view_heat_map_st(
      where: $where
      order_by: { change_percentage: desc }
    ) {
      change_percentage
      current_price
      ticker_name: ticker
    }
  }
`;

export const GET_VIEW_HEATMAP_ST_1HR = gql`
  query getViewHeatmapSt1hr($where: indiacharts_view_heat_map_st_1hr_bool_exp) {
    indiacharts_view_heat_map_st_1hr(
      where: $where
      order_by: { change: desc }
    ) {
      change_percentage: change
      current_price
      ticker_name: ticker
    }
  }
`;

export const GET_VIEW_HEATMAP_ST_1WK = gql`
  query getViewHeatmapSt1wk($where: indiacharts_view_heat_map_st_1wk_bool_exp) {
    indiacharts_view_heat_map_st_1wk(
      where: $where
      order_by: { change: desc }
    ) {
      change_percentage: change
      current_price
      ticker_name: ticker
    }
  }
`;
export const GET_VIEW_HEATMAP_ST_1M = gql`
  query getViewHeatmapSt1m($where: indiacharts_view_heat_map_st_1m_bool_exp) {
    indiacharts_view_heat_map_st_1m(where: $where, order_by: { change: desc }) {
      change_percentage: change
      current_price
      ticker_name: ticker
    }
  }
`;

export const GET_VIEW_HEATMAP_ST_3M = gql`
  query getViewHeatmapSt3m($where: indiacharts_view_heat_map_st_3m_bool_exp) {
    indiacharts_view_heat_map_st_3m(where: $where, order_by: { change: desc }) {
      change_percentage: change
      current_price
      ticker_name: ticker
    }
  }
`;
export const GET_VIEW_HEATMAP_ST_6M = gql`
  query getViewHeatmapSt6m($where: indiacharts_view_heat_map_st_6m_bool_exp) {
    indiacharts_view_heat_map_st_6m(where: $where, order_by: { change: desc }) {
      change_percentage: change
      current_price
      ticker_name: ticker
    }
  }
`;
export const GET_VIEW_HEATMAP_ST_1Y = gql`
  query getViewHeatmapSt1y($where: indiacharts_view_heat_map_st_1y_bool_exp) {
    indiacharts_view_heat_map_st_1y(where: $where, order_by: { change: desc }) {
      change_percentage: change
      current_price
      ticker_name: ticker
    }
  }
`;

export const GET_SECURITY_CODE = gql`
  query getSecurityCode($id: uuid!) {
    indiacharts_indices_stocks(where: { indices_id: { _eq: $id } }) {
      security_code
    }
  }
`;

export const GET_SWING_HIGH_LOW = gql`
  query getSwingHighLow($where: indiacharts_swing_high_low_breakout_bool_exp) {
    indiacharts_swing_high_low_breakout(
      order_by: { created_at: desc }
      where: $where
    ) {
      ticker_name
      created_at
      current_price
      market_cap
    }
  }
`;

export const GET_BOARD_MEETINGS = gql`
  query GetBoardMeetings($where: indiacharts_board_meetings_bool_exp) {
    meetings: indiacharts_board_meetings(
      order_by: { meeting_date: asc }
      where: $where
    ) {
      company_code
      company_id
      meeting_date
      purpose
      remarks
      deleted
      updated_at
      company {
        name
      }
    }
  }
`;
export const GET_CANDLESTICK_SCANNER_SIDEBAR = gql`
  query GetCandlestickScannerSidebar {
    candlestick_scanners: indiacharts_enum_candlestick_patterns(
      distinct_on: type
    ) {
      type
    }
  }
`;
export const GET_CANDLESTICK_SCANNER_PATTERNS = gql`
  query GetCandlestickScannerPatterns($type: String) {
    candlestick_patterns: indiacharts_enum_candlestick_patterns(
      where: { type: { _eq: $type } }
    ) {
      name
      type
      comments
    }
  }
`;
export const GET_CANDLESTICK_SCANNER_DATA_DAILY = gql`
  query GetCandlestickScannerDataDaily(
    $where: indiacharts_fundamental_technical_metrics_eod_bool_exp
    $index_id: [uuid!]!
  ) {
    indiacharts_indices(where: { id: { _in: $index_id } }) {
      id
      name
      indices_stocks(where: { fundamentals_technicals_eod: $where }) {
        security_code

        candlestick_data: fundamentals_technicals_eod(where: $where) {
          ticker
          symbol
          priced_date
          close_candle_single
          close_candle_double
          close_candle_triple
          stock_price {
            change_percentage
            close_price
            high_price
            low_price
            current_price
          }
          close_candle_single_rel {
            name
            comments
          }
          close_candle_double_rel {
            name
            comments
          }
          close_candle_triple_rel {
            name
            comments
          }
        }
      }
    }
  }
`;

export const GET_CANDLESTICK_SCANNER_DATA_DAILY_TEST = gql`
  query GetCandlestickScannerDataDailyTest(
    $where: indiacharts_fundamental_technical_metrics_eod_bool_exp
  ) {
    candlestick_data: indiacharts_fundamental_technical_metrics_eod(
      where: $where
    ) {
      ticker
      symbol
      priced_date
      close_candle_single
      close_candle_double
      close_candle_triple
      stock_price {
        change_percentage
        close_price
        high_price
        low_price
        current_price
      }
      index {
        id
      }
      close_candle_single_rel {
        name
        comments
      }
      close_candle_double_rel {
        name
        comments
      }
      close_candle_triple_rel {
        name
        comments
      }
    }
  }
`;

export const GET_STOCK_NEWS_DISTINCT_DATE = gql`
  query stockNewsDistinctDate(
    $limit: Int
    $offset: Int
    $order_by: [indiacharts_stock_news_order_by!]
    $where: indiacharts_stock_news_bool_exp
  ) {
    news_dates: indiacharts_stock_news(
      distinct_on: date
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      date
    }
    count: indiacharts_stock_news_aggregate(distinct_on: date, where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_DIFFUSION_DATA_DAILY = gql`
  query GetDiffusionDataDaily(
    $where: indiacharts_fundamental_technical_metrics_eod_bool_exp
  ) {
    diffusion_data: indiacharts_fundamental_technical_metrics_eod(
      where: $where
      order_by: { priced_date: asc }
    ) {
      ticker
      symbol
      priced_date
      diff_rsi_30
      diff_rsi_50
      diff_rsi_70
      diff_adx_25
      diff_sma_20
      diff_sma_50
      diff_sma_100
      diff_sma_200
      diff_macd
      diff_high_5
      diff_high_10
      diff_high_30
      diff_high_60
      diff_high_90
      diff_high_180
      diff_high_365
      diff_low_5
      diff_low_30
      diff_low_60
      diff_low_90
      diff_low_180
      diff_low_365
    }
  }
`;
export const GET_INDICES_BASIC = gql`
  query getIndicesBasic($where: indiacharts_indices_bool_exp) {
    indices: indiacharts_indices(where: $where) {
      name
      id
      ticker
      symbol
    }
  }
`;

//rohit scanner

export const GET_ROHIT_SCANNERS_EOD = gql`
  query getRohitScannersEod(
    $where: indiacharts_fundamental_technical_metrics_eod_bool_exp
  ) {
    indiacharts_fundamental_technical_metrics_eod(where: $where) {
      rmi
      rmi_ema
      previous_rmi
      previous_rmi_ema
      priced_date
      ticker
    }
  }
`;

export const GET_VIEW_ROHIT_SCANNERS_EOD = gql`
  query getViewRohitScannersEod($where: indiacharts_view_ftmec_bool_exp) {
    indiacharts_view_ftmec(where: $where) {
      priced_date
      previous_date
      rmi
      rmi_ema
      previous_rmi
      previous_rmi_ema
      ticker
    }
  }
`;

export const GET_DOW_TREND_SCANNER = gql`
  query getDowTrendScanner(
    $where: indiacharts_fundamental_technical_metrics_eod_bool_exp
  ) {
    indiacharts_fundamental_technical_metrics_eod(where: $where) {
      ticker
      close_trend
    }
  }
`;

export const GET_ROHIT_SCANNER_TEMP = gql`
  query getRohitScannersTemp(
    $where: indiacharts_fundamental_technical_metrics_eod_bool_exp
    $wherew: indiacharts_fundamental_technical_metrics_weekly_bool_exp
    $wherem: indiacharts_fundamental_technical_metrics_monthly_bool_exp
    $index_id: [uuid!]!
  ) {
    indiacharts_indices(where: { id: { _in: $index_id } }) {
      id
      name
      indices_stocks(where: { fundamentals_technicals_eod: $where }) {
        security_code
        rohit_data: fundamentals_technicals_eod(where: $where) {
          ticker
          symbol
          priced_date
          rmi
          rmi_ema
          previous_rmi
          previous_rmi_ema
          close_trend
        }
        rohit_data_weekly: fundamentals_technicals_weekly(where: $wherew) {
          ticker
          priced_date
          rmi
          rmi_ema
          close_trend
        }
        rohit_data_monthly: fundamentals_technicals_monthly(where: $wherem) {
          ticker
          priced_date
          rmi
          rmi_ema
          close_trend
        }
      }
    }
  }
`;

export const GET_CANDLE_STICK_SCANNER_DATA = gql`
  query getCandleStickScannerData(
    $args: indiacharts_candlestick_scanner_args!
  ) {
    indiacharts_candlestick_scanner(args: $args) {
      ticker
      change_percentage
      comments
      close_price
      close_candle_double
      close_candle_single
      close_candle_triple
      priced_date
      symbol
    }
  }
`;

export const GET_WEEKLY_DATES = gql`
  query getWeeklyDates {
    indiacharts_fundamental_technical_metrics_weekly(
      where: { symbol: { _eq: "NSE Index" } }
      limit: 5
      order_by: { priced_date: desc }
    ) {
      priced_date
    }
  }
`;
export const GET_MONTHLY_DATES = gql`
  query getMonthlyDates {
    indiacharts_fundamental_technical_metrics_monthly(
      where: { symbol: { _eq: "NSE Index" } }
      limit: 5
      order_by: { priced_date: desc }
    ) {
      priced_date
    }
  }
`;
