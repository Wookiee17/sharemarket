import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useScreenshot, createFileName } from "use-react-screenshot";

// redux
import { useDispatch, useSelector } from "react-redux";
import { setActiveParticipantsDataScreen } from "../../../../store/participantsData/ParticipantsDataSlice";

// apollo
import { GET_CASHMARKET_DII, GET_DII_AGGRT } from "../../../../gql/queries";
import {
  GET_CASHMARKET_FII,
  GET_FII_CASH_DAILY,
  GET_DII_CASH_DAILY,
  GET_DII_CASH_DETAILS,
  GET_FII_CASH_DETAILS,
} from "../../../../gql/queries";
import { GET_STOCK_PRICE_EOD } from "../../../../gql/queries";
import { useQuery } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";

// component
import TabSection from "../../tabSections/TabSections";
import ParticipantsCashMarketTable from "./ParticipantsCashMarketTable";
const TradingChart = dynamic(() => import("./tradingChart/TradingChart.v2"), {
  ssr: false,
});

import dayjs from "dayjs";

const dataMap = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

const now = dayjs().format("YYYY-MM-DD");
const week = dayjs().subtract(1, "year").format("YYYY-MM-DD");
const year = dayjs().startOf("year").format("YYYY-MM-DD");
const oneYear = dayjs().subtract(1, "year").format("YYYY-MM-DD");
const tenYear = dayjs().subtract(11, "years").format("YYYY-MM-DD");

const ParticipantsDerivatives = ({
  name,
  filterstate,
  fullScreen,
  fullScreenId,
}) => {
  const [selectedDate, setSelectedDate] = useState();
  const theme = useSelector((state) => state.Common.theme);

  const dispatch = useDispatch();
  const ref = useRef(null);
  const router = useRouter();
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const Tabs = useSelector(
    (state) => state.ParticipantsData.ParticipantsDataTabs
  );
  const screens = useSelector(
    (state) => state.ParticipantsData.ParticipantsDataScreens
  );
  const activeTab = useSelector(
    (state) => state.ParticipantsData.activeParticipantsDataTab
  );
  const activeScreen = useSelector(
    (state) => state.ParticipantsData.activeParticipantsDataScreen
  );
  // fullscreen
  const _maximize = () => {
    router.push(
      `/${globalTabs[5].link}/${Tabs[activeTab].slug}/${screens[fullScreenId].slug}`
    );
  };

  const _minimize = () => {
    router.push(`/${globalTabs[5].link}/${Tabs[activeTab].slug}/`);
    dispatch(setActiveParticipantsDataScreen(null));
  };

  const _changeScreen = (tabSlug, slug, id) => {
    dispatch(setActiveParticipantsDataScreen(id));
    router.push(`/${globalTabs[5].link}/${tabSlug}/${slug}`);
  };

  // screenshot
  const [image, takeScreenShot] = useScreenshot({
    type: "image/png",
    quality: 1.0,
  });
  const download = (
    image,
    { name = "Cash Market", extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  const _downloadScreenshot = () => takeScreenShot(ref.current).then(download);

  //

  const [selectedmarket, setSelectedmarket] = useState("");

  const f = () => {
    if (filterstate === 0) {
      return {
        priced_date: { _lte: now },
        _and: { priced_date: { _gte: week } },
      };
    }
    if (filterstate === 50) {
      return {
        priced_date: { _lte: now },
        _and: { priced_date: { _gte: tenYear } },
      };
    }
    if (filterstate === 100) {
      return {
        priced_date: { _lte: now },
        _and: { priced_date: { _gte: tenYear } },
      };
    }
  };

  const f1 = () => {
    if (filterstate === 0) {
      return {
        date: { _lte: now },
        _and: { date: { _gte: week } },
      };
    }
    if (filterstate === 50) {
      return {
        date: { _lte: now },
        _and: { date: { _gte: tenYear } },
      };
    }
    if (filterstate === 100) {
      return { date: { _lte: now }, _and: { date: { _gte: tenYear } } };
    }
  };

  const { data: cashData } = useQuery(GET_CASHMARKET_DII, {
    variables: {
      where: f(),
      order_by: {
        priced_date: "desc",
      },
    },
  });

  const { data: fiiData } = useQuery(GET_CASHMARKET_FII, {
    variables: {
      where: f1(),
      order_by: {
        date: "desc",
      },
    },
  });

  //queries

  const { data: fiiDaily } = useQuery(GET_FII_CASH_DAILY, {
    variables: {
      where: f(),
    },
    onCompleted: (v) => console.log(v, "data"),
  });

  const { data: diiDailly } = useQuery(GET_DII_CASH_DAILY, {
    variables: {
      where: f(),
    },
  });

  //queries

  const { data: fiiMonthly } = useQuery(GET_FII_CASH_DETAILS, {
    variables: {
      where: f(),
    },
  });

  const { data: diiMonthly } = useQuery(GET_DII_CASH_DETAILS, {
    variables: {
      where: f(),
    },
  });

  //aggr
  const { data: diiAggr } = useQuery(GET_DII_AGGRT);

  const { data: stockPriceEod } = useQuery(GET_STOCK_PRICE_EOD);

  const dataCheck = diiAggr?.indiacharts_dii_list_metrics
    ?.filter((agg1) => agg1?.year?.slice(0, 4) === "2022")?.[0]
    ?.monthly_data?.filter((agg2) => agg2?.month === "2022-11-01")?.[0]?.amount;

  // console.log(dataCheck, "datacheck");

  const resultData = (v, aggr, dailyData, monthlyData) => {
    const years = [...new Set(v?.map((i) => i?.date?.slice(0, 4)))];
    const month = [...new Set(v?.map((i) => i?.date?.slice(5, 7)))];
    const monthx = [...new Set(v?.map((i) => i?.date?.slice(0, 7)))];

    if (filterstate === 0) {
      const data = dailyData?.map((day) => ({
        key: uuidv4(),
        rowKey: uuidv4(),
        Date:
          Number(day?.priced_date.slice(8, 10)) +
          "/" +
          Number(day?.priced_date.slice(5, 7)) +
          "/" +
          Number(day?.priced_date.slice(0, 4)),
        Amount: day?.amount.toFixed(2),
        NiftyClosing: day?.close_price.toFixed(2),
        Change: `${day?.change_percentage.toFixed(2)}%`,
      }));
      return data;
    }
    if (filterstate === 50) {
      const data = monthx?.map((m) => {
        return {
          key: uuidv4(),
          rowKey: uuidv4(),
          Date: `${dataMap[Number(m?.slice(5, 7))]?.slice(0, 3)} ${m?.slice(
            0,
            4
          )}`,
          Amount: aggr
            ? aggr
                ?.filter(
                  (agg1) => agg1?.priced_date?.slice(0, 4) === m?.slice(0, 4)
                )?.[0]
                ?.monthly_data?.filter(
                  (agg2) => agg2?.month?.slice(0, 7) === m?.slice(0, 7)
                )?.[0]
                ?.amount?.toFixed(2)
            : 0,
          NiftyClosing: aggr
            ?.filter(
              (agg1) => agg1?.priced_date?.slice(0, 4) === m?.slice(0, 4)
            )?.[0]
            ?.monthly_data?.filter(
              (agg2) => agg2?.month?.slice(0, 7) === m?.slice(0, 7)
            )?.[0]
            ?.close_price.toFixed(2),
          Change: `${aggr
            ?.filter(
              (agg1) => agg1?.priced_date?.slice(0, 4) === m?.slice(0, 4)
            )?.[0]
            ?.monthly_data?.filter(
              (agg2) => agg2?.month?.slice(0, 7) === m?.slice(0, 7)
            )?.[0]
            ?.change_percentage?.toFixed(2)} %`,
          children: dailyData
            ?.filter((a) => a?.priced_date?.slice(0, 7) === m?.slice(0, 7))
            ?.map((dat, index) => ({
              key: uuidv4(),
              rowKey: uuidv4(),
              Date:
                Number(dat?.priced_date?.slice(8, 10)) +
                "/" +
                Number(dat?.priced_date?.slice(5, 7)) +
                "/" +
                Number(dat?.priced_date?.slice(0, 4)),
              Amount: dat?.amount?.toFixed(2),
              NiftyClosing: dat?.close_price?.toFixed(2),
              Change: `${dat?.change_percentage?.toFixed(2) ?? 0} %`,
              // symbol: cashmarket?.indiacharts_stock_prices?.[index].symbol,
            })),
        };
      });
      return data;
    }
    if (filterstate === 100) {
      const data = years?.map((i) => {
        return {
          key: uuidv4(),
          rowKey: uuidv4(),
          Date: i,
          Amount: aggr
            ? aggr
                ?.filter((agg3) => agg3?.priced_date?.slice(0, 4) === i)?.[0]
                ?.amount.toFixed(2)
            : 0,
          NiftyClosing: aggr
            ? aggr
                ?.filter((agg3) => agg3?.priced_date?.slice(0, 4) === i)?.[0]
                ?.close_price.toFixed(2)
            : 0,
          Change: aggr
            ? `${aggr
                ?.filter((agg3) => agg3?.priced_date?.slice(0, 4) === i)?.[0]
                ?.change_percentage?.toFixed(2)}%`
            : "0%",

          children: month
            ?.sort((a, b) => Number(b) - Number(a))
            ?.filter((x) => monthx?.includes(`${i}-${x}`))
            ?.map((m) => {
              return {
                key: uuidv4(),
                rowKey: uuidv4(),
                Date: dataMap[Number(m)],
                Amount: aggr
                  ? aggr
                      ?.filter(
                        (item) => item?.priced_date?.slice(0, 4) === i
                      )?.[0]
                      ?.monthly_data?.filter(
                        (monItem) => monItem?.priced_date?.slice(5, 7) === m
                      )?.[0]
                      ?.amount?.toFixed(2)
                  : 0,
                NiftyClosing: aggr
                  ? aggr
                      ?.filter(
                        (item) => item?.priced_date?.slice(0, 4) === i
                      )?.[0]
                      ?.monthly_data?.filter(
                        (monItem) => monItem?.priced_date?.slice(5, 7) === m
                      )?.[0]
                      ?.close_price?.toFixed(2)
                  : 0,
                Change: `${
                  aggr
                    ?.filter(
                      (item) => item?.priced_date?.slice(0, 4) === i
                    )?.[0]
                    ?.monthly_data?.filter(
                      (monItem) => monItem?.priced_date?.slice(5, 7) === m
                    )?.[0]
                    ?.change_percentage?.toFixed(2) ?? 0
                } %`,
                children: dailyData
                  ?.filter((a) => a?.priced_date?.slice(0, 7) === `${i}-${m}`)
                  ?.map((dat, index) => ({
                    key: uuidv4(),
                    rowKey: uuidv4(),
                    Date:
                      Number(dat?.priced_date.slice(8, 10)) +
                      "/" +
                      Number(dat?.priced_date.slice(5, 7)) +
                      "/" +
                      Number(dat?.priced_date.slice(0, 4)),
                    Amount: dat?.amount?.toFixed(2),
                    NiftyClosing: dat?.close_price?.toFixed(2),
                    Change: `${dat?.change_percentage?.toFixed(2) ?? 0} %`,
                    // symbol:
                    //   cashmarket?.indiacharts_stock_prices?.[index].symbol,
                  })),
              };
            }),
        };
      });
      return data;
    }
  };

  return (
    <div className={`Participatns_sections ${fullScreen && "fullScreen"} `}>
      <TabSection
        headerLable={name}
        // maximizeFun={_maximize}
        // minimizeFun={_minimize}
        // isMaximized={activeScreen == fullScreenId}
        downloadFun={_downloadScreenshot}
        headerNull
        tabArr={screens}
        activeTab={activeScreen}
        tabFunc={_changeScreen}
      >
        <div className="Participatns_sections_inner" ref={ref}>
          <div className="Participatns_sections_inner_left">
            <ParticipantsCashMarketTable
              setSelectedDate={setSelectedDate}
              fii={resultData(
                fiiData?.indiacharts_fii_list,
                fiiMonthly?.fii,
                fiiDaily?.fii
                // fiiMonthly?.fii
              )}
              dii={resultData(
                cashData?.indiacharts_dii_list,
                diiMonthly?.dii,
                diiDailly?.dii
                // diiMonthly?.dii
              )}
              headerLable={screens[activeScreen].name}
              setSelectedmarket={setSelectedmarket}
              selectedmarket={selectedmarket}
            />
          </div>
          <div className="Participatns_sections_inner_right">
            {/* <ParticipantChart /> */}
            <TradingChart
              date={selectedDate}
              activeScreen={activeScreen}
              filterState={filterstate}
            />
            {/* <TradingChartWidget symbol={selectedmarket} /> */}
          </div>
        </div>
      </TabSection>
    </div>
  );
};

export default ParticipantsDerivatives;
