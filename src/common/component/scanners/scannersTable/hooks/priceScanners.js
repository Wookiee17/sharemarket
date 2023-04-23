import { useQuery } from "@apollo/client";
import {
  GET_NEAR_FITYTWO_WEEK_HIGH,
  GET_NEAR_FITYTWO_WEEK_LOW,
  GET_FIFTY_TWO_WEEK_EOD,
  GET_FIFTY_TWO_WEEKS_HIGH,
  GET_FIFTY_TWO_WEEKS_LOW,
  GET_NEW_FIFTYtWO_WEEK_HIGHLOW,
  GET_GAP_UP_DOWN_TICKERS_FROM_VIEW,
} from "../../../../../gql/queries";

import dayjs from "dayjs";

export const usePriceScanners = ({
  activeType,
  activeDate,
  selectedTable,
  allIndices,
  selectedIndicesIds,
  filter,
  setTableData,
  latestNiftyDate,
}) => {
  //near 52 week high latestNiftyDate

  useQuery(GET_NEAR_FITYTWO_WEEK_HIGH, {
    skip:
      activeType === "low" ||
      activeDate !== latestNiftyDate ||
      selectedTable !== 10,
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      where: {
        _and: [
          { _or: filter },
          { change: { _gte: -5 } },
          { change: { _lte: 5 } },
          {
            indices_stocks: {
              indices_id:
                selectedIndicesIds?.[0] === 0
                  ? { _in: allIndices }
                  : { _in: selectedIndicesIds },
            },
          },
        ],
      },
    },
    onCompleted: (v) => setTableData(v?.indiacharts_view_near_52_week_high),
  });

  //near 52 week high latestNiftyDate

  useQuery(GET_NEAR_FITYTWO_WEEK_LOW, {
    skip:
      activeType === "high" ||
      activeDate !== latestNiftyDate ||
      selectedTable !== 10,
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      where: {
        _and: [
          { _or: filter },
          { change: { _gte: -5 } },
          { change: { _lte: 5 } },
          {
            indices_stocks: {
              indices_id:
                selectedIndicesIds?.[0] === 0
                  ? { _in: allIndices }
                  : { _in: selectedIndicesIds },
            },
          },
        ],
      },
    },
    onCompleted: (v) => setTableData(v?.indiacharts_view_near_52_week_low),
  });

  //near 52 week eod high low

  const typeFil = () => {
    if (activeType === "high") {
      return [
        {
          percent_away_from_fifty_two_week_high: { _gte: -5 },
        },
        {
          percent_away_from_fifty_two_week_high: { _lte: 5 },
        },
      ];
    }
    if (activeType === "low") {
      return [
        {
          percent_away_from_fifty_two_week_low: { _gte: -5 },
        },
        {
          percent_away_from_fifty_two_week_low: { _lte: 5 },
        },
      ];
    }
  };

  useQuery(GET_FIFTY_TWO_WEEK_EOD, {
    skip: activeDate === latestNiftyDate || selectedTable !== 10,
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      where: {
        _and: [
          {
            created_at: {
              _lt: dayjs(activeDate).add(1, "day").format("YYYY-MM-DD"),
            },
          },
          {
            created_at: {
              _gt: dayjs(activeDate).subtract(1, "day").format("YYYY-MM-DD"),
            },
          },
          { _or: filter },
          {
            indices_stocks: {
              indices_id:
                selectedIndicesIds?.[0] === 0
                  ? { _in: allIndices }
                  : { _in: selectedIndicesIds },
            },
          },
          ...typeFil(),
        ],
      },
    },
    onCompleted: (v) => setTableData(v?.indiacharts_stock_price_eod),
  });

  //new 52 week high latestNiftyDate

  useQuery(GET_FIFTY_TWO_WEEKS_HIGH, {
    skip:
      selectedTable !== 11 ||
      activeType !== "high" ||
      activeDate !== latestNiftyDate,
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      where: {
        _and: [
          {
            created_at: {
              _lt: dayjs(activeDate).add(1, "day").format("YYYY-MM-DD"),
            },
          },
          {
            created_at: {
              _gt: dayjs(activeDate).subtract(1, "day").format("YYYY-MM-DD"),
            },
          },
          {
            indices_stocks: {
              indices_id:
                selectedIndicesIds?.[0] === 0
                  ? { _in: allIndices }
                  : { _in: selectedIndicesIds },
            },
          },
          { _or: filter },
        ],
      },
    },
    onCompleted: (v) => setTableData(v?.fififty_two_week_high),
  });

  //new 52 week low latestNiftyDate

  useQuery(GET_FIFTY_TWO_WEEKS_LOW, {
    skip:
      selectedTable !== 11 ||
      activeType !== "low" ||
      activeDate !== latestNiftyDate,
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      where: {
        _and: [
          {
            created_at: {
              _lt: dayjs(activeDate).add(1, "day").format("YYYY-MM-DD"),
            },
          },
          {
            created_at: {
              _gt: dayjs(activeDate).subtract(1, "day").format("YYYY-MM-DD"),
            },
          },
          {
            indices_stocks: {
              indices_id:
                selectedIndicesIds?.[0] === 0
                  ? { _in: allIndices }
                  : { _in: selectedIndicesIds },
            },
          },
          { _or: filter },
        ],
      },
    },
    onCompleted: (v) => setTableData(v?.fifty_two_week_low),
  });

  //new 52 week high low

  const fil = () => {
    if (activeType === "high") {
      return { fifty_two_week_high_date: { _eq: activeDate } };
    }
    if (activeType === "low") {
      return { fifty_two_week_low_date: { _eq: activeDate } };
    }
  };

  useQuery(GET_NEW_FIFTYtWO_WEEK_HIGHLOW, {
    skip: activeDate === latestNiftyDate || selectedTable !== 11,
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      where: {
        _and: [
          { created_at: { _eq: activeDate } },
          fil(),
          { _or: filter },
          {
            indices_stocks: {
              indices_id:
                selectedIndicesIds?.[0] === 0
                  ? { _in: allIndices }
                  : { _in: selectedIndicesIds },
            },
          },
        ],
      },
    },
    onCompleted: (v) => setTableData(v?.indiacharts_stock_price_eod),
  });

  //gap up/down latestNiftyDate

  const where = () => {
    if (activeType === "high") {
      return [{ change_percentage: { _gt: 0 } }, { gap_up: { _eq: true } }];
    }
    if (activeType === "low") {
      return [{ change_percentage: { _lt: 0 } }, { gap_down: { _eq: true } }];
    }
  };

  useQuery(GET_GAP_UP_DOWN_TICKERS_FROM_VIEW, {
    skip: selectedTable !== 13 || activeDate !== latestNiftyDate,
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      where: {
        _and: [
          ...where(),
          {
            created_at: {
              _lt: dayjs(activeDate).add(1, "day").format("YYYY-MM-DD"),
            },
          },
          {
            created_at: {
              _gt: dayjs(activeDate).subtract(1, "day").format("YYYY-MM-DD"),
            },
          },
          { _or: filter },
          {
            indices_stocks: {
              indices_id:
                selectedIndicesIds?.[0] === 0
                  ? { _in: allIndices }
                  : { _in: selectedIndicesIds },
            },
          },
        ],
      },
    },
    onCompleted: (v) => setTableData(v?.gapdata),
  });

  //gap up/down eod

  //filter
  const gapUpDownEodFil = () => {
    if (activeType === "high") {
      return {
        gap_up: { _eq: true },
      };
    }
    if (activeType === "low") {
      return {
        gap_down: { _eq: true },
      };
    }
  };

  useQuery(GET_NEW_FIFTYtWO_WEEK_HIGHLOW, {
    skip: activeDate === latestNiftyDate || selectedTable !== 13,
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      where: {
        _and: [
          gapUpDownEodFil(),
          { created_at: { _eq: activeDate } },
          { _or: filter },
          {
            indices_stocks: {
              indices_id:
                selectedIndicesIds?.[0] === 0
                  ? { _in: allIndices }
                  : { _in: selectedIndicesIds },
            },
          },
        ],
      },
    },
    onCompleted: (v) => setTableData(v?.indiacharts_stock_price_eod),
  });
};
