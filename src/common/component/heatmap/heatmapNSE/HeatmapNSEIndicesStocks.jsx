import React, { useState, useEffect } from "react";

// icons
import { BsZoomIn, BsZoomOut } from "react-icons/bs";

// parts
import HeatmapFnOIndicatorsWrapper from "../heatmapFnO/HeatmapFnOIndicatorsWrapper";
import HeatmapFnOItems from "../heatmapFnO/HeatmapFnOItems";

// redux
import { useSelector } from "react-redux";

import { useQuery } from "@apollo/client";

import {
  GET_VIEW_HEATMAP_ST_TODAY,
  GET_VIEW_HEATMAP_ST_1M,
  GET_VIEW_HEATMAP_ST_1HR,
  GET_VIEW_HEATMAP_ST_1WK,
  GET_VIEW_HEATMAP_ST_3M,
  GET_VIEW_HEATMAP_ST_6M,
  GET_VIEW_HEATMAP_ST_1Y,
  GET_SECURITY_CODE,
} from "../../../../gql/queries";

import { useRouter } from "next/router";

const HeatmapNSEIndicesStocks = ({ sliderValue, loadingState }) => {
  const theme = useSelector((state) => state.Common.theme);

  const { query } = useRouter();

  const id = query?.index;

  const [plusFive, setPlusFive] = useState(false);
  const [plusTwo, setPlusTwo] = useState(false);
  const [plusZero, setPlusZero] = useState(false);
  const [zero, setZero] = useState(false);
  const [minusZero, setMinusZero] = useState(false);
  const [minusTwo, setMinusTwo] = useState(false);
  const [minusFive, setMinusFive] = useState(false);
  const [pos, setPos] = useState(true);
  const [neg, setNeg] = useState(false);

  const [reversed, setReversed] = useState(false);
  const [zoom, setZoom] = useState(4);

  const [data1, setData1] = useState([]);

  const [selectedCode, setSelectedCode] = useState([]);

  //queries

  //security code

  const { data: securityCode } = useQuery(GET_SECURITY_CODE, {
    variables: { id },
    onCompleted: (v) =>
      setSelectedCode(
        v?.indiacharts_indices_stocks?.map((i) => i?.security_code)
      ),
  });

  const { data: indicesQueruResult, loading: loading2 } = useQuery(
    GET_VIEW_HEATMAP_ST_TODAY,
    {
      skip: !id || sliderValue !== 0,
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
      fetchPolicy: "network-only",
      variables: {
        where: {
          security_code: { _in: selectedCode },
        },
      },
      onCompleted: (v) => {
        setData1(v?.indiacharts_view_heat_map_st);
      },
    }
  );

  //ST queries

  const { data: viewOneHour, loading: loading1 } = useQuery(
    GET_VIEW_HEATMAP_ST_1HR,
    {
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
      fetchPolicy: "network-only",
      skip: !id || sliderValue !== 16,
      variables: {
        where: {
          security_code: { _in: selectedCode },
        },
      },
      onCompleted: (v) => setData1(v?.indiacharts_view_heat_map_st_1hr),
    }
  );

  const { data: viewOneWeek, loading: loading3 } = useQuery(
    GET_VIEW_HEATMAP_ST_1WK,
    {
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
      fetchPolicy: "network-only",
      skip: !id || sliderValue !== 32,
      variables: {
        where: {
          security_code: { _in: selectedCode },
        },
      },
      onCompleted: (v) => setData1(v?.indiacharts_view_heat_map_st_1wk),
    }
  );

  const { data: viewOneMonth, loading: loading4 } = useQuery(
    GET_VIEW_HEATMAP_ST_1M,
    {
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
      fetchPolicy: "network-only",
      variables: {
        where: {
          security_code: { _in: selectedCode },
        },
      },
      skip: !id || sliderValue !== 48,
      onCompleted: (v) => setData1(v?.indiacharts_view_heat_map_st_1m),
    }
  );

  const { data: viewThreeMonths, loading: loading5 } = useQuery(
    GET_VIEW_HEATMAP_ST_3M,
    {
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
      fetchPolicy: "network-only",
      skip: !id || sliderValue !== 64,
      variables: {
        where: {
          security_code: { _in: selectedCode },
        },
      },
      onCompleted: (v) => setData1(v?.indiacharts_view_heat_map_st_3m),
    }
  );

  const { data: viewSixMonths, loading: loading6 } = useQuery(
    GET_VIEW_HEATMAP_ST_6M,
    {
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
      fetchPolicy: "network-only",
      skip: !id || sliderValue !== 80,
      variables: {
        where: {
          security_code: { _in: selectedCode },
        },
      },
      onCompleted: (v) => setData1(v?.indiacharts_view_heat_map_st_6m),
    }
  );

  const { data: viewOneYear, loading: loading7 } = useQuery(
    GET_VIEW_HEATMAP_ST_1Y,
    {
      pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
      fetchPolicy: "network-only",
      skip: !id || sliderValue !== 100,
      variables: {
        where: {
          security_code: { _in: selectedCode },
        },
      },
      onCompleted: (v) => setData1(v?.indiacharts_view_heat_map_st_1y),
    }
  );

  const stockPrice = () => {
    if (sliderValue === 0) {
      return indicesQueruResult?.indiacharts_view_heat_map_st;
    }
    if (sliderValue === 16) {
      return viewOneHour?.indiacharts_view_heat_map_st_1hr;
    }
    if (sliderValue === 32) {
      return viewOneWeek?.indiacharts_view_heat_map_st_1wk;
    }
    if (sliderValue === 48) {
      return viewOneMonth?.indiacharts_view_heat_map_st_1m;
    }
    if (sliderValue === 64) {
      return viewThreeMonths?.indiacharts_view_heat_map_st_3m;
    }
    if (sliderValue === 80) {
      return viewSixMonths?.indiacharts_view_heat_map_st_6m;
    }
    if (sliderValue === 100) {
      return viewOneYear?.indiacharts_view_heat_map_st_1y;
    }
  };

  const fun = (i) => {
    return i?.change_percentage?.toFixed(2);
  };

  useEffect(() => {
    const plusFiveData = stockPrice()?.filter((i) => fun(i) > 5);
    const minusFiveData = stockPrice()?.filter((i) => fun(i) < -5);
    const zeroData = stockPrice()?.filter((i) => fun(i) == 0);
    const plusZeroData = stockPrice()?.filter((i) => fun(i) > 0 && fun(i) <= 2);
    const plusTwoData = stockPrice()?.filter((i) => fun(i) > 2 && fun(i) <= 5);
    const minusZeroData = stockPrice()?.filter(
      (i) => fun(i) < 0 && fun(i) >= -2
    );
    const minusTwoData = stockPrice()?.filter(
      (i) => fun(i) < -2 && fun(i) >= -5
    );
    const posData = stockPrice()
      ?.slice()
      ?.sort((a, b) => {
        const first = typeof fun(b) === "undefined" ? 0 : fun(b);
        const second = typeof fun(a) === "undefined" ? 0 : fun(a);
        return first - second;
      });
    const negData = stockPrice()
      ?.slice()
      ?.sort((a, b) => fun(a) - fun(b));

    const data = [
      ...(plusFive ? plusFiveData?.sort((a, b) => fun(b) - fun(a)) : []),
      ...(plusTwo ? plusTwoData?.sort((a, b) => fun(b) - fun(a)) : []),
      ...(plusZero ? plusZeroData?.sort((a, b) => fun(b) - fun(a)) : []),
      ...(zero ? zeroData?.sort((a, b) => fun(b) - fun(a)) : []),
      ...(minusZero ? minusZeroData?.sort((a, b) => fun(b) - fun(a)) : []),
      ...(minusTwo ? minusTwoData?.sort((a, b) => fun(b) - fun(a)) : []),
      ...(minusFive ? minusFiveData?.sort((a, b) => fun(b) - fun(a)) : []),
    ];
    setData1(data);
    if (
      !plusFive &&
      !plusTwo &&
      !plusZero &&
      !zero &&
      !minusZero &&
      !minusTwo &&
      !minusFive &&
      !neg
    ) {
      setPos(true);
      setData1(posData);
    } else {
      setPos(false);
    }
    if (neg) {
      setData1(negData);
    }
  }, [
    plusFive,
    minusFive,
    zero,
    plusZero,
    plusTwo,
    minusZero,
    minusTwo,
    pos,
    neg,
  ]);

  useEffect(() => {
    setPos(true);
    setNeg(false);
    setPlusFive(false);
    setPlusTwo(false);
    setPlusZero(false);
    setZero(false);
    setMinusZero(false);
    setMinusTwo(false);
    setMinusFive(false);
  }, [id, sliderValue]);

  return (
    <div className={`HeatmapFnO ${theme}`}>
      <div className={`HeatmapFnO-top ${theme}`}>
        <HeatmapFnOIndicatorsWrapper
          sliderValue={sliderValue}
          onPositive={() => {
            setPos(true);
            setNeg(false);
            setPlusFive(false);
            setPlusTwo(false);
            setPlusZero(false);
            setZero(false);
            setMinusZero(false);
            setMinusTwo(false);
            setMinusFive(false);
          }}
          onNegative={() => {
            setNeg(true);
            setPos(false);
            setPlusFive(false);
            setPlusTwo(false);
            setPlusZero(false);
            setZero(false);
            setMinusZero(false);
            setMinusTwo(false);
            setMinusFive(false);
          }}
          onZero={() => {
            setZero((prev) => !prev);
            setNeg(false);
          }}
          onMinusFive={() => {
            setNeg(false);
            setMinusFive((prev) => !prev);
          }}
          onPlusFive={() => {
            setPlusFive((prev) => !prev);
            setNeg(false);
          }}
          onMinusTwotoFive={() => {
            setNeg(false);
            setMinusTwo((prev) => !prev);
          }}
          onMinusZerotoTwo={() => {
            setNeg(false);
            setMinusZero((prev) => !prev);
          }}
          onZerotoTwo={() => {
            setPlusZero((prev) => !prev);
            setNeg(false);
          }}
          onTwotoFive={() => {
            setNeg(false);
            setPlusTwo((prev) => !prev);
          }}
          list={stockPrice()}
          plusFive={plusFive}
          plusTwo={plusTwo}
          plusZero={plusZero}
          zero={zero}
          minusZero={minusZero}
          minusTwo={minusTwo}
          minusFive={minusFive}
        />
        <div className={`HeatmapFnO-top right ${theme}`}>
          <div className={`btn-wrapper-chart ${theme}`}>
            <div
              className={`btn-zoom ${theme}`}
              onClick={() => {
                setZoom(zoom < 7 ? zoom + 1 : zoom);
              }}
            >
              <BsZoomIn />
            </div>
            <div
              className={`btn-zoom ${theme}`}
              onClick={() => {
                setZoom(zoom > 1 ? zoom - 1 : zoom);
              }}
            >
              <BsZoomOut />
            </div>
          </div>
        </div>
      </div>
      {loadingState ||
      loading1 ||
      loading2 ||
      loading3 ||
      loading4 ||
      loading5 ||
      loading6 ||
      loading7 ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="HeatmapFnO-body">
          <div
            className={`HeatmapFnO-bottom zoom-${zoom} ${
              reversed && "reversed"
            }`}
          >
            {data1
              ?.map((itm, idx) => {
                return {
                  key: idx,
                  ticker_name: itm?.ticker_name,
                  current_price: itm?.current_price,
                  change_percentage: itm?.change_percentage?.toFixed(2),
                };
              })
              ?.map((item, i) => {
                return (
                  <HeatmapFnOItems
                    key={i}
                    name={item?.ticker_name}
                    qnt={item?.current_price}
                    perc={item?.change_percentage}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
// }

export default HeatmapNSEIndicesStocks;
