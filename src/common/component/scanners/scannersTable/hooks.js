import { useQuery } from "@apollo/client";
import {
  GET_CANDLESTICK_SCANNER_DATA_DAILY,
  GET_CANDLESTICK_SCANNER_PATTERNS,
  GET_CANDLESTICK_SCANNER_DATA_DAILY_TEST,
  GET_CANDLE_STICK_SCANNER_DATA,
} from "../../../../gql/queries";
import { setTableData } from "../../../../store/dashboard/MarketOverviewSlice";

export const useCandleStickScanner = ({
  pattern_type,
  pattern_id,
  index_id,
  priced_date,
  marketCap,
  timeFrame,
  onCompleted = (d, p) => { },
}) => {
  let marketCapFormatted = "";
  if (Array.isArray(marketCap)) {
    if (marketCap[0] === 0 && marketCap.length === 1) {
      marketCapFormatted = "All";
    } else {
      marketCap.map((mcap) => {
        if (mcap === 1) {
          marketCapFormatted += "A";
        } else if (mcap === 2) {
          marketCapFormatted += "B";
        } else if (mcap === 3) {
          marketCapFormatted += "C";
        } else if (mcap === 4) {
          marketCapFormatted += "D";
        } else if (mcap === 5) {
          marketCapFormatted += "E";
        }
      });
    }
  }
  //pattern
  const { data, loading: pnLoading } = useQuery(
    GET_CANDLESTICK_SCANNER_PATTERNS,
    {
      skip: ![40, 41, 42, 43]?.includes(pattern_id) || !pattern_type,
      variables: { type: pattern_type },
    }
  );

  const patterns = data?.candlestick_patterns?.map((p) => p?.name);

  const patternFun = () => {
    if (pattern_id === 40) {
      return "Bearish Continuation";
    } else if (pattern_id === 41) {
      return "Bearish Reversal";
    } else if (pattern_id === 42) {
      return "Bullish Continuation";
    } else if (pattern_id === 43) {
      return "Bullish Reversal";
    }
  };
  const getPatternName = (patternName) => {
    const selectedPattern = data?.candlestick_patterns?.filter(cp => cp.name === patternName)
    if (selectedPattern.length) {
      return selectedPattern[0].comments
    }
  }
  useQuery(GET_CANDLE_STICK_SCANNER_DATA, {
    skip: !patterns?.length > 0 || ![40, 41, 42, 43]?.includes(pattern_id),
    variables: {
      args: {
        b_filter: `{${index_id}`,
        m_filter: marketCapFormatted,
        pattern: patternFun(),
        pdate: priced_date,
        time_frame: timeFrame,
        uid: `{${index_id}}`,
      },
    },
    onCompleted: (v) => {
      const candlestickArr = v?.indiacharts_candlestick_scanner || [];
      const candlestick_data = [];
      candlestickArr.map((cd) => {
        let candlestick_name = [];
        if (
          cd.close_candle_single &&
          patterns.includes(cd.close_candle_single)
        ) {
          candlestick_name.push(getPatternName(cd.close_candle_single));
        }
        if (
          cd.close_candle_double &&
          patterns.includes(cd.close_candle_double)
        ) {
          candlestick_name.push(getPatternName(cd.close_candle_double));
        }
        if (
          cd.close_candle_triple &&
          patterns.includes(cd.close_candle_triple)
        ) {
          candlestick_name.push(getPatternName(cd.close_candle_triple));
        }
        candlestick_data.push({
          ...cd,
          comments: candlestick_name.join(", "),
        });
      });
      onCompleted(candlestick_data, patterns);
    },
  });
};
