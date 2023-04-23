import { gql } from "@apollo/client";

export const FetchAdvanceDeclineItem = gql`
  query StockGapUpGapDown {
    gapup: indiacharts_stock_gapup_gapdown_aggregate(
      where: {
        _and: [
          { ticker: { _eq: "Nifty50 EWI" } }
          { gap: { _gt: 0 } }
          { priced_date: { _eq: "2022-11-10" } }
        ]
      }
    ) {
      aggregate {
        count(columns: gap)
      }
      nodes {
        ticker
      }
    }
    gapdown: indiacharts_stock_gapup_gapdown_aggregate(
      where: {
        _and: [
          { ticker: { _eq: "Nifty50 EWI" } }
          { gap: { _lt: 0 } }
          { priced_date: { _eq: "2022-11-10" } }
        ]
      }
    ) {
      aggregate {
        count
      }
      nodes {
        ticker
        priced_date
      }
    }
    unchanged: indiacharts_stock_gapup_gapdown_aggregate(
      where: {
        _and: [
          { ticker: { _eq: "Nifty50 EWI" } }
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
