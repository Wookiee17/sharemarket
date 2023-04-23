import { gql } from "@apollo/client";

export const GET_INDICATORS = gql`
  query GetIndicators(
    $category: String
  ) {
    indicator_headers: indiacharts_sentiment_indicator_headers(
      order_by: {sortno: asc}
      where: { category: {_eq: $category }}
    ) {
      id
      label
      sortno
    }
    indicators: indiacharts_indicators(where: { category: {_eq: $category }}) {
      id
      name
      overbought
      oversold
      headers
      is_parent
      db_field
      indexes
    }
  }`;
export const GET_INDICATOR_DATA = gql`
  query GetIndicatorData(
    $indicator_name: String, 
    $start_date: timestamptz, 
    $end_date: timestamptz,
    $time_gap: interval
  ) {
    indiacharts_indicators: indiacharts_candle_graph_indicator_data(
      args: {
        indicator_name: $indicator_name, 
        start_date: $start_date, 
        end_date: $end_date,
        time_gap: $time_gap
      }
    ) {
      date
      value
    }
  }`;
// export const GET_STOCK_PRICES_SENTIMENT_INDICATOR = gql`
//   query getStockPricesForSentimentIndicator(
//     $limit: Int
//     $offset: Int
//     $where: indiacharts_stock_price_eod_bool_exp
//     $order_by: [indiacharts_stock_price_eod_order_by!]
//   ) {
//     stock_prices: indiacharts_stock_price_eod(
//       limit: $limit
//       offset: $offset
//       where: $where
//       order_by: $order_by
//     ) {
//       ticker
//       symbol
//       current_price
// 			high_price
// 			low_price
// 			open_price
// 			close_price
// 			created_at
//     }
//   }
// `;
export const GET_STOCK_PRICES_SENTIMENT_INDICATOR = gql`
query getStockPricesForSentimentIndicator($start_date: timestamptz, $end_date: timestamptz, $symbol_v: String, $time_gap: interval) {
  stock_prices: indiacharts_candle_graph_symbol_stock_price(
    args: {time_gap: $time_gap, symbol_v: $symbol_v, start_date: $start_date, end_date: $end_date}
    order_by: {
      created_at: asc
    }
  ) {
    close_price
    high_price
    low_price
    open_price
    symbol
    total_traded_quantity
    created_at
    unix_timestamp
  }
}
`;