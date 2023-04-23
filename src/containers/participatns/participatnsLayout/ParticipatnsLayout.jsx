import React, { useState } from "react";
import Slider from "rc-slider";

// redux
import { useSelector } from "react-redux";

// component
import Buttom from "../../../common/component/button/Button";
import DropDown from "../../../common/component/dropDown/DropDown";
import ParticipantsCashMarket from "../../../common/component/participants/cashmarket/ParticipantsCashMarket";
import ParticipantsDerivatives from "../../../common/component/participants/derivatives/ParticipantsDerivatives";
import { useQuery } from "@apollo/client";
import { GET_FII_DATES } from "../../../gql/queries";
import dayjs from "dayjs";

const start = dayjs().format("YYYY-MM-DD");
const end = dayjs().subtract(1, "month").format("YYYY-MM-DD");

const ParticipatnsLayout = () => {
  const theme = useSelector((state) => state.Common.theme);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [submitted, setSubmitted] = useState("");

  const [filterState, setFilterState] = useState(0);

  const { data } = useQuery(GET_FII_DATES, {
    variables: {
      start: start,
      end: end,
    },
    onCompleted: (data) => {
      setSelectedDate(data?.dates?.[0]?.priced_date);
      setSubmitted(data?.dates?.[0]?.priced_date);
    },
  });

  const dates = data?.dates?.map((d) => d?.priced_date);

  const tab = [
    {
      id: 1,
      name: "Cash Market",
    },
    {
      id: 2,
      name: "Derivatives",
    },
  ];

  return (
    <div className={`${theme} Participatns`}>
      <div className="Participatns_top">
        <div className="left">
          <div className={`secondary_tabs ${theme}`}>
            {tab.map((item, i) => (
              <div
                key={i}
                className={`secondary_tabs-item ${activeTab == i && "focused"}`}
                onClick={() => {
                  setActiveTab(i);
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
        {activeTab == 0 && (
          <div className="viewBy">
            <p>View By</p>
            <div className="viewBy-slider">
              <Slider
                min={0}
                defaultValue={16}
                marks={{
                  0: `Daily`,
                  50: `Monthly`,
                  100: `Yearly`,
                }}
                step={null}
                onChange={(v) => setFilterState(v)}
              />
            </div>
          </div>
        )}
        {activeTab == 1 && (
          <div className="viewBy">
            <DropDown
              lable={selectedDate}
              options={dates}
              setActive={(sdate) => {
                setSelectedDate(sdate);
              }}
            />
            <Buttom
              type={"primary"}
              size="sm"
              onClick={() => setSubmitted(selectedDate)}
            >
              GO
            </Buttom>
          </div>
        )}
      </div>
      <div className="Participatns_bottom">
        {activeTab == 0 && (
          <>
            <ParticipantsCashMarket name={"FII"} filterstate={filterState} />
            <ParticipantsCashMarket name={"DII"} filterstate={filterState} />
          </>
        )}
        {activeTab == 1 && <ParticipantsDerivatives date={submitted} />}
      </div>
    </div>
  );
};

export default ParticipatnsLayout;
