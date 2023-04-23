import React, { useEffect, useState } from "react";
//query
import { useQuery } from "@apollo/client";
import {
  GET_INDICES,
  GET_TRADING_DATES,
  GET_WEEKLY_DATES,
  GET_MONTHLY_DATES
} from "../../../../gql/queries";
//components
import DropDown from "../../dropDown/DropDown";
import DropDownCheckBox from "../../dropDownCheckBox/dropDownCheckBox";
//redux
import { useSelector } from "react-redux";
//dayjs
import dayjs from "dayjs";

//constants
import { SCANNERS_MARKETCAP_OPTIONS } from "../../../constants/data";

const ScannersFilter = ({
  activeDate,
  setActiveDate,
  indicesOptions,
  setIndicesOptions,
  selectedIndicesIds,
  setSelectedIndicesIds,
  marketCap,
  setMarketCap,
  activeType,
  setActiveType,
  setTimeFrame,
  timeFrame,
}) => {
  //redux states
  const { selectedTable, selectedTableName } = useSelector(
    (state) => state.Scanners
  );

  const latestNifty = useSelector((state) => state?.Common?.latestNiftyStock);
  const latestNiftyDate = dayjs(latestNifty?.created_at).format("YYYY-MM-DD");

  //<<=====local states=====>>

  //   //date
  const [dates, setDates] = useState([latestNiftyDate]);
  const [selectedIndices, setSelectedIndices] = useState();

  //label
  const [label, setLabel] = useState();

  const [signal, setSignal] = useState(0);

  //<<=====queries=====>>
  //indices
  useQuery(GET_INDICES, {
    onCompleted: (v) => {
      setSelectedIndices(v?.indices?.[2]?.id);
      setIndicesOptions((prev) => {
        const arr = v?.indices?.map((i) => ({ label: i?.name, value: i?.id }));
        return [...prev, ...arr];
      });
    },
  });

  //tradind dates
  useQuery(GET_TRADING_DATES, {
    skip: timeFrame !== "Daily",
    variables: {
      limit: 6,
      where: {
        _and: [
          { symbol: { _eq: "NSE Index" } },
          {
            created_at: { _neq: latestNiftyDate },
          },
        ],
      },
    },
    onCompleted: (v) => {
      setDates([
        latestNiftyDate,
        ...v?.indiacharts_stock_price_eod?.map((i) => i?.created_at),
      ]);
      setActiveDate(latestNiftyDate);
    },
  });

  useQuery(GET_WEEKLY_DATES, {
    skip: timeFrame !== "Weekly" || ![40, 41, 42, 43].includes(selectedTable),
    onCompleted: (v) => {
      setDates(
        v?.indiacharts_fundamental_technical_metrics_weekly?.map(
          (i) => i?.priced_date
        )
      );
      setActiveDate(
        v?.indiacharts_fundamental_technical_metrics_weekly?.[0]?.priced_date
      );
    },
  });

  useQuery(GET_MONTHLY_DATES, {
    skip: timeFrame !== "Monthly" || ![40, 41, 42, 43].includes(selectedTable),
    onCompleted: (v) => {
      setDates(
        v?.indiacharts_fundamental_technical_metrics_monthly?.map(
          (i) => i?.priced_date
        )
      );
      setActiveDate(
        v?.indiacharts_fundamental_technical_metrics_monthly?.[0]?.priced_date
      );
    },
  });
  //<<=====Handlers=====>>
  const BasketChange = (checkedValues) => {
    if (checkedValues.length === 0) {
      setSelectedIndicesIds([0]);
    } else if (!selectedIndicesIds?.includes(0)) {
      if (checkedValues.includes(0)) {
        setSelectedIndicesIds([0]);
      } else {
        setSelectedIndicesIds(checkedValues?.filter((i) => i !== 0));
      }
    } else if (selectedIndicesIds.includes(0)) {
      setSelectedIndicesIds(checkedValues?.filter((i) => i !== 0));
    }
  };

  const MarketCapOnChange = (checkedValues) => {
    if (checkedValues.length === 0) {
      setMarketCap([0]);
    } else if (!marketCap?.includes(0)) {
      if (checkedValues.includes(0)) {
        setMarketCap([0]);
      } else {
        setMarketCap(checkedValues?.filter((i) => i !== 0));
      }
    } else if (marketCap?.includes(0)) {
      setMarketCap(checkedValues?.filter((i) => i !== 0));
    }
  };

  //<<=====side-effects=====>>
  useEffect(() => {
    setActiveDate(latestNiftyDate);
    setMarketCap([0]);
    setActiveType("high");
    setSelectedIndicesIds([0]);
    setTimeFrame("Daily");
  }, [selectedTable]);

  return (
    <div className="ScannersTable-filter">
      <div className="item">
        {[44].includes(selectedTable) && (
          <DropDown
            lable={signal === 0 ? "Live" : "Last candle close"}
            options={[
              { label: "Live", value: 0 },
              { label: "Last candle close", value: 1 },
            ]}
            setActive={setSignal}
            setLabel={() => {}}
          />
        )}
      </div>
      <div className="item">
        {![44].includes(selectedTable) && (
          <DropDown
            lable={activeDate}
            options={dates}
            setActive={setActiveDate}
            setLabel={setLabel}
          />
        )}
      </div>
      <div className="item">
        <DropDownCheckBox
          lable={"Basket"}
          options={indicesOptions}
          active={selectedIndicesIds}
          onChange={BasketChange}
        />
      </div>
      <div className="item">
        <DropDownCheckBox
          lable={"Market Cap"}
          options={SCANNERS_MARKETCAP_OPTIONS}
          active={marketCap}
          onChange={MarketCapOnChange}
        />
      </div>
      {![40, 41, 42, 43, 44, 45].includes(selectedTable) && (
        <div className="item">
          <DropDown
            options={
              selectedTable === 13
                ? [
                    { label: "Gap up", value: "high" },
                    { label: "Gap Down", value: "low" },
                  ]
                : [
                    { label: "52 Week High", value: "high" },
                    { label: "52 Week Low", value: "low" },
                  ]
            }
            lable={
              selectedTable === 13
                ? activeType === "high"
                  ? "Gap up"
                  : "Gap down"
                : activeType === "high"
                ? "52 week high"
                : "52 week low"
            }
            setActive={setActiveType}
            setLabel={setLabel}
          />
        </div>
      )}
      {[40, 41, 42, 43, 44, 45].includes(selectedTable) && (
        <div className="item">
          <DropDown
            lable={"Time Frame"}
            options={[
              {
                label: "Daily",
                value: "Daily",
              },
              {
                label: "Weekly",
                value: "Weekly",
              },
              {
                label: "Monthly",
                value: "Monthly",
              },
            ]}
            setActive={setTimeFrame}
            setLabel={setLabel}
          />
        </div>
      )}
    </div>
  );
};

export default ScannersFilter;
