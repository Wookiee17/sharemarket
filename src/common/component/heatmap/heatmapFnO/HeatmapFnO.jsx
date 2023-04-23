import React, { useState, useEffect } from "react";

// icons
import { BsZoomIn, BsZoomOut } from "react-icons/bs";

// parts
import HeatmapFnOIndicatorsWrapper from "./HeatmapFnOIndicatorsWrapper";
import HeatmapFnOItems from "./HeatmapFnOItems";

// redux
import { useSelector, useDispatch } from "react-redux";

import { useQuery } from "@apollo/client";

import {
  GET_VIEW_HEATMAP_FNO_TODAY,
  GET_VIEW_HEATMAP_FNO_1HR,
  GET_VIEW_HEATMAP_FNO_1WK,
  GET_VIEW_HEATMAP_FNO_1M,
  GET_VIEW_HEATMAP_FNO_3M,
  GET_VIEW_HEATMAP_FNO_6M,
  GET_VIEW_HEATMAP_FNO_1YR,
} from "../../../../gql/queries";

const HeatmapFnO = ({ activeTab, sliderCurrent, sliderValue }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Common.theme);
  const latestNifty = useSelector((state) => state.Common.latestNiftyStock);
  const eodNifty = useSelector((state) => state.Common.eodNiftyStock);

  const [reversed, setReversed] = useState(false);
  const [zoom, setZoom] = useState(4);

  const [data1, setData1] = useState();

  const [plusFive, setPlusFive] = useState(false);
  const [plusTwo, setPlusTwo] = useState(false);
  const [plusZero, setPlusZero] = useState(false);
  const [zero, setZero] = useState(false);
  const [minusZero, setMinusZero] = useState(false);
  const [minusTwo, setMinusTwo] = useState(false);
  const [minusFive, setMinusFive] = useState(false);
  const [pos, setPos] = useState(true);
  const [neg, setNeg] = useState(false);

  const { data: dataToday } = useQuery(GET_VIEW_HEATMAP_FNO_TODAY, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    onCompleted: (v) => {
      setData1(
        v?.indiacharts_view_heat_map_fno
          ?.slice()
          ?.sort((a, b) => b?.change_percentage - a?.change_percentage)
      );
    },
    skip: sliderValue !== 0,
  });

  const { data: data1hr } = useQuery(GET_VIEW_HEATMAP_FNO_1HR, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    onCompleted: (v) => {
      setData1(
        v?.indiacharts_view_heat_map_fno_1hr
          ?.slice()
          ?.sort((a, b) => b?.change_percentage - a?.change_percentage)
      );
    },
    skip: sliderValue !== 16,
  });

  const { data: data1wk } = useQuery(GET_VIEW_HEATMAP_FNO_1WK, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    onCompleted: (v) => {
      setData1(
        v?.indiacharts_view_heat_map_fno_1wk
          ?.slice()
          ?.sort((a, b) => b?.change_percentage - a?.change_percentage)
      );
    },
    skip: sliderValue !== 32,
  });

  const { data: data1m } = useQuery(GET_VIEW_HEATMAP_FNO_1M, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    onCompleted: (v) => {
      setData1(
        v?.indiacharts_view_heat_map_fno_1m
          ?.slice()
          ?.sort((a, b) => b?.change_percentage - a?.change_percentage)
      );
    },
    skip: sliderValue !== 48,
  });
  const { data: data3m } = useQuery(GET_VIEW_HEATMAP_FNO_3M, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    onCompleted: (v) => {
      setData1(
        v?.indiacharts_view_heat_map_fno_3m
          ?.slice()
          ?.sort((a, b) => b?.change_percentage - a?.change_percentage)
      );
    },
    skip: sliderValue !== 64,
  });
  const { data: data6m } = useQuery(GET_VIEW_HEATMAP_FNO_6M, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    onCompleted: (v) => {
      setData1(
        v?.indiacharts_view_heat_map_fno_6m
          ?.slice()
          ?.sort((a, b) => b?.change_percentage - a?.change_percentage)
      );
    },
    skip: sliderValue !== 80,
  });
  const { data: data1yr } = useQuery(GET_VIEW_HEATMAP_FNO_1YR, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    onCompleted: (v) => {
      setData1(
        v?.indiacharts_view_heat_map_fno_1yr
          ?.slice()
          ?.sort((a, b) => b?.change_percentage - a?.change_percentage)
      );
    },
    skip: sliderValue !== 100,
  });

  const fun = () => {
    if (sliderValue === 0) {
      return dataToday?.indiacharts_view_heat_map_fno;
    }
    if (sliderValue === 16) {
      return data1hr?.indiacharts_view_heat_map_fno_1hr;
    }
    if (sliderValue === 32) {
      return data1wk?.indiacharts_view_heat_map_fno_1wk;
    }
    if (sliderValue === 48) {
      return data1m?.indiacharts_view_heat_map_fno_1m;
    }
    if (sliderValue === 64) {
      return data3m?.indiacharts_view_heat_map_fno_3m;
    }
    if (sliderValue === 80) {
      return data6m?.indiacharts_view_heat_map_fno_6m;
    }
    if (sliderValue === 100) {
      return data1yr?.indiacharts_view_heat_map_fno_1yr;
    }
  };

  const stockPrice = fun();

  useEffect(() => {
    const plusFiveData = stockPrice?.filter(
      (i) => i?.change_percentage?.toFixed(2) > 5
    );
    const minusFiveData = stockPrice?.filter(
      (i) => i?.change_percentage?.toFixed(2) < -5
    );
    const zeroData = stockPrice?.filter(
      (i) => i?.change_percentage?.toFixed(2) == 0
    );
    const plusZeroData = stockPrice?.filter(
      (i) =>
        i?.change_percentage?.toFixed(2) > 0 &&
        i?.change_percentage?.toFixed(2) <= 2
    );
    const plusTwoData = stockPrice?.filter(
      (i) =>
        i?.change_percentage?.toFixed(2) > 2 &&
        i?.change_percentage?.toFixed(2) <= 5
    );
    const minusZeroData = stockPrice?.filter(
      (i) =>
        i?.change_percentage?.toFixed(2) < 0 &&
        i?.change_percentage?.toFixed(2) >= -2
    );
    const minusTwoData = stockPrice?.filter(
      (i) =>
        i?.change_percentage?.toFixed(2) < -2 &&
        i?.change_percentage?.toFixed(2) >= -5
    );
    const posData = stockPrice
      ?.slice()
      ?.sort(
        (a, b) =>
          b?.change_percentage?.toFixed(2) - a?.change_percentage?.toFixed(2)
      );
    const negData = stockPrice
      ?.slice()
      ?.sort(
        (a, b) =>
          a?.change_percentage?.toFixed(2) - b?.change_percentage?.toFixed(2)
      );

    const data = [
      ...(plusFive
        ? plusFiveData?.sort(
            (a, b) =>
              b?.change_percentage?.toFixed(2) -
              a?.change_percentage?.toFixed(2)
          )
        : []),
      ...(plusTwo
        ? plusTwoData?.sort(
            (a, b) =>
              b?.change_percentage?.toFixed(2) -
              a?.change_percentage?.toFixed(2)
          )
        : []),
      ...(plusZero
        ? plusZeroData?.sort(
            (a, b) =>
              b?.change_percentage?.toFixed(2) -
              a?.change_percentage?.toFixed(2)
          )
        : []),
      ...(zero
        ? zeroData?.sort(
            (a, b) =>
              b?.change_percentage?.toFixed(2) -
              a?.change_percentage?.toFixed(2)
          )
        : []),
      ...(minusZero
        ? minusZeroData?.sort(
            (a, b) =>
              b?.change_percentage?.toFixed(2) -
              a?.change_percentage?.toFixed(2)
          )
        : []),
      ...(minusTwo
        ? minusTwoData?.sort(
            (a, b) =>
              b?.change_percentage?.toFixed(2) -
              a?.change_percentage?.toFixed(2)
          )
        : []),
      ...(minusFive
        ? minusFiveData?.sort(
            (a, b) =>
              b?.change_percentage?.toFixed(2) -
              a?.change_percentage?.toFixed(2)
          )
        : []),
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
  }, [sliderValue]);

  return (
    <div className={`HeatmapFnO ${theme}`}>
      <div className={`HeatmapFnO-top ${theme}`}>
        <HeatmapFnOIndicatorsWrapper
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
          list={stockPrice}
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
      <div className="HeatmapFnO-body">
        <div
          className={`HeatmapFnO-bottom zoom-${zoom} ${reversed && "reversed"}`}
        >
          <>
            {data1
              ?.map((itm, idx) => {
                return {
                  key: idx,
                  ticker: itm?.ticker,
                  current_price: itm?.current_price,
                  change_percentage: itm?.change_percentage?.toFixed(2),
                };
              })
              ?.map((item, i) => (
                <React.Fragment key={i}>
                  <HeatmapFnOItems
                    name={item?.ticker}
                    qnt={item?.current_price}
                    perc={item?.change_percentage}
                  />
                </React.Fragment>
              ))}
          </>
        </div>
      </div>
    </div>
  );
};

export default HeatmapFnO;
