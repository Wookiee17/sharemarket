import React, { useRef } from "react";
import { useRouter } from "next/router";
import { useScreenshot, createFileName } from "use-react-screenshot";
import moment from "moment/moment";

// component
import TabSection from "../../../common/component/tabSections/TabSections";
import FutureActivityChart from "../../../common/component/dashboard/futureActivityChart/FutureActivityChart";

// apollo
import { useQuery } from "@apollo/client";
import { GET_FUTURE_ACTIVITY, GET_LONG_BUILDUP, GET_SHORT_BUILDUP, GET_LONG_UNWINDING, GET_SHORT_COVERING } from "../../../gql/queries";

// redux
import { useDispatch, useSelector } from "react-redux";
import { setActiveDashboardScreen } from "../../../store/dashboard/DashboardSlice";
import { setActiveTab } from "../../../store/dashboard/FutureActivitySlice";

const Activity = () => {
  const theme = useSelector((state) => state.Common.theme);
  const dispatch = useDispatch();
  const ref = useRef(null);
  const router = useRouter();
  const activetab = useSelector((state) => state.FutureActivity.activeTab);
  const tabs = useSelector((state) => state.FutureActivity.tabs);
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const dashboardScreens = useSelector(
    (state) => state.Dashboard.dashboardScreens
  );
  const activeDashboardScreen = useSelector(
    (state) => state.Dashboard.activeDashboardScreen
  );
  const latestNifty = useSelector((state) => state.Common.latestNiftyStock);
  const eodNifty = useSelector((state) => state.Common.eodNiftyStock);

  // fullscreen
  const _maximize = () => {
    router.push(`/${globalTabs[0].link}/${dashboardScreens[3].slug}`);
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
  const download = (
    image,
    { name = "future activity", extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  const _downloadScreenshot = () => takeScreenShot(ref.current).then(download);

  const { data: futureActivityData, loading } = useQuery(GET_FUTURE_ACTIVITY, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: { limit: activeDashboardScreen === null ? 5 : null },
    skip: !latestNifty
  });

  const long_builtup = futureActivityData?.long_builtup || []
  const long_unwinding = futureActivityData?.long_unwinding || []
  const short_builtup = futureActivityData?.short_builtup || []
  const short_covering = futureActivityData?.short_covering || []
  const tabData = (_activetab) => _activetab?.id === 0 ? long_builtup : _activetab?.id === 1 ? short_builtup : _activetab?.id === 2 ? short_covering : long_unwinding
  return (
    <TabSection
      headerLable={`FUTURE Activity`}
      maximizeFun={_maximize}
      minimizeFun={_minimize}
      isMaximized={activeDashboardScreen == dashboardScreens[3].id}
      downloadFun={_downloadScreenshot}
    >
      <div className={`${theme} FutureActivity`} ref={ref}>
        {activeDashboardScreen == null ? (
          <>
            <div className={`secondary_tabs ${theme}`}>
              {tabs.map((item, i) => (
                <div
                  key={i}
                  className={`secondary_tabs-item ${activetab?.id == item?.id && "focused"
                    }`}
                  onClick={() => {
                    dispatch(setActiveTab(item));
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
            <FutureActivityChart
              currentTab={activetab}
              parent={ref}
              data={tabData(activetab)}
              loading={loading}
            />
          </>
        ) : (
          <div className="FutureActivity_maximizeList">
            {tabs.map((item, i) => (
              <div className="FutureActivity_maximizeList-item" key={i}>
                <p>{item.name}</p>
                <FutureActivityChart
                  currentTab={item}
                  parent={ref}
                  data={tabData(item)}
                  loading={loading}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </TabSection>
  );
};

export default Activity;
