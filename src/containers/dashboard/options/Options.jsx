import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useScreenshot, createFileName } from "use-react-screenshot";

// apollo
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";

// component
import TabSection from "../../../common/component/tabSections/TabSections";
import OptionsChart from "../../../common/component/dashboard/options/OptionsChart";
import DropDown from "../../../common/component/dropDown/DropDown";

// redux
import { useDispatch, useSelector } from "react-redux";
import { setActiveDashboardScreen } from "../../../store/dashboard/DashboardSlice";
import { GET_EXPIRY_DATE_FOR_OPTIONS } from "../../../gql/queries";

const Options = () => {
  const theme = useSelector((state) => state.Common.theme);
  const dispatch = useDispatch();
  const ref = useRef(null);
  const router = useRouter();
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const dashboardScreens = useSelector(
    (state) => state.Dashboard.dashboardScreens
  );
  const activeDashboardScreen = useSelector(
    (state) => state.Dashboard.activeDashboardScreen
  );
  // fullscreen
  const _maximize = () => {
    router.push(`/${globalTabs[0].link}/${dashboardScreens[2].slug}`);
  };

  const _minimize = () => {
    router.push(`/${globalTabs[0].link}`);
    dispatch(setActiveDashboardScreen(null));
  };

  // screenshot
  const [image, takeScreenShot] = useScreenshot({
    type: "image/png",
    quality: 1.0,
  });
  const download = (image, { name = "options", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  const _downloadScreenshot = () => takeScreenShot(ref.current).then(download);

  // options dropdown
  const [option1] = useState([
    { label: "Nifty", value: "NIFTY" },
    { label: "Bank Nifty", value: "BANKNIFTY" },
  ]);

  const now = dayjs();
  let start_d = now.clone().day(4);
  if (start_d.isBefore(now)) {
    start_d = start_d.add(7, "days").day(4);
  }

  const [selectedOpt, setSelectedOpt] = useState("NIFTY");
  const [selectedDate, setSelectedDate] = useState(
    start_d.format("YYYY-MM-DD")
  );

  const { data } = useQuery(GET_EXPIRY_DATE_FOR_OPTIONS, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      start_date: now.format("YYYY-MM-DD"),
      symbols: ["NIFTY", "BANKNIFTY"],
      end_date: now.add(1, "month").endOf("month").format("YYYY-MM-DD"),
    },
    onCompleted: (res) => {
      // console.log(res?.fnodates?.[0]?.expiry_date, "first date");
      setSelectedDate(res?.fnodates?.[0]?.expiry_date);
    },
  });

  let dates = [];

  dates = data?.fnodates?.map((f) => f?.expiry_date);

  return (
    <TabSection
      headerLable={"OPTIONS"}
      maximizeFun={_maximize}
      minimizeFun={_minimize}
      isMaximized={activeDashboardScreen == dashboardScreens[2].id}
      downloadFun={_downloadScreenshot}
    >
      <div className={`${theme} options`} ref={ref}>
        <div className="options-flex-end">
          <div className="item">
            <DropDown
              lable={selectedOpt}
              options={option1}
              setActive={(item) => {
                setSelectedOpt(item);
              }}
            />
          </div>
          <div className="item">
            <DropDown
              lable={selectedDate || "Dates"}
              options={dates}
              setActive={(date) => {
                setSelectedDate(date);
              }}
            />
          </div>
        </div>
        <OptionsChart
          filters={{ symbol: selectedOpt, expiry_date: selectedDate }}
          parent={ref}
        />
      </div>
    </TabSection>
  );
};

export default Options;
