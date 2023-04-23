import { initializeApollo } from "../../../../gql/apolloClient";
import {
  GET_CANDLESTICK_SCANNER_PATTERNS,
  GET_CANDLESTICK_SCANNER_DATA_DAILY,
} from "../../../../gql/queries";

export const fetchCandlestickScannerData = async (
  type,
  priced_date,
  index_id
) => {
  console.log(index_id, type, priced_date, "variables candle");

  const apolloClient = initializeApollo();

  const response = await apolloClient.query({
    query: GET_CANDLESTICK_SCANNER_PATTERNS,
    variables: { type },
  });

  let patterns = response?.data?.candlestick_patterns || [];
  patterns = patterns.map((p) => p.name);
  const responseCandlestickData = await apolloClient.query({
    query: GET_CANDLESTICK_SCANNER_DATA_DAILY,
    variables: {
      index_id,
      where: {
        priced_date: { _eq: priced_date },
        _or: [
          {
            close_candle_single: { _in: patterns },
          },
          {
            close_candle_double: { _in: patterns },
          },
          {
            close_candle_triple: { _in: patterns },
          },
        ],
      },
    },
  });

  const candlestickArr =
    responseCandlestickData?.data?.indiacharts_indices_by_pk?.indices_stocks ||
    [];

  const candlestick_data = [];

  candlestickArr.map((cd) => {
    if (cd.candlestick_data?.length) {
      const _cd = cd.candlestick_data[0];
      let candlestick_name = [];
      if (
        _cd.close_candle_single &&
        patterns.includes(_cd.close_candle_single)
      ) {
        candlestick_name.push(_cd.close_candle_single_rel?.comments);
      }
      if (
        _cd.close_candle_double &&
        patterns.includes(_cd.close_candle_double)
      ) {
        candlestick_name.push(_cd.close_candle_double_rel?.comments);
      }
      if (
        _cd.close_candle_triple &&
        patterns.includes(_cd.close_candle_triple)
      ) {
        candlestick_name.push(_cd.close_candle_triple_rel?.comments);
      }
      candlestick_data.push({
        ..._cd,
        candlestick_name: candlestick_name.join(", "),
      });
    }
  });
  console.log(candlestick_data, "result candle");
  return { candlestick_data, patterns };
};
