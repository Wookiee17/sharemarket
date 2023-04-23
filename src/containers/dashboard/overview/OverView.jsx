import React, { createRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useScreenshot, createFileName } from "use-react-screenshot";

// component
import TabSection from "../../../common/component/tabSections/TabSections";
import TradingTable from "../../../common/component/dashboard/overView/tradingTable/TradingTable";
import TradingSideFilter from "../../../common/component/dashboard/overView/tradingSideFilter/TradingSideFilter";

// trading chart view loading
const DynamicHomeWithNoSSR = dynamic(
  () =>
    import(
      "../../../common/component/dashboard/overView/tradingChart/TradingChart"
    ),
  { ssr: false }
);
const TradingChartWidget = DynamicHomeWithNoSSR;

// redux
import { useDispatch, useSelector } from "react-redux";
import { setActiveDashboardScreen } from "../../../store/dashboard/DashboardSlice";

const OverView = () => {
  const {theme, holidays} = useSelector((state) => state.Common);
  const dispatch = useDispatch();
  const ref = createRef(null);
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
    router.push(`/${globalTabs[0].link}/${dashboardScreens[0].slug}`);
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
  const download = (image, { name = "market overview", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  const _downloadScreenshot = () => takeScreenShot(ref.current).then(download);

  return (
    <TabSection
      headerLable={"MARKET OVERVIEW"}
      maximizeFun={_maximize}
      minimizeFun={_minimize}
      isMaximized={activeDashboardScreen == dashboardScreens[0].id}
      downloadFun={_downloadScreenshot}
    >
      <div className={`${theme} OverView`} ref={ref}>
        <TradingSideFilter />
        <TradingTable />
        {holidays.length > 0 && (
          <TradingChartWidget />
        )}
      </div>
    </TabSection>
  );
};

export default OverView;
