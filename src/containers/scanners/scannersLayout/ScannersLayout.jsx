import React from "react";
import dynamic from "next/dynamic";

// redux
import { useSelector } from "react-redux";

// component
import TabSection from "../../../common/component/tabSections/TabSections";
import ScannersTree from "../../../common/component/scanners/scannersTree/ScannersTree";
import ScannersTable from "../../../common/component/scanners/scannersTable/ScannersTable";

// trading chart view loading
const DynamicHomeWithNoSSR = dynamic(
  () =>
    import(
      "../../../common/component/dashboard/overView/tradingChart/TradingChart"
    ),
  { ssr: false }
);
const TradingChartWidget = DynamicHomeWithNoSSR;

const ScannersLayout = () => {
  const theme = useSelector((state) => state.Common.theme);
  return (
    <TabSection headerLable={`Scanners`}>
      <div className={`${theme} Scanners`}>
        <ScannersTree />
        <ScannersTable />
        <TradingChartWidget />
      </div>
    </TabSection>
  );
};

export default ScannersLayout;
