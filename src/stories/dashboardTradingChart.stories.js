import TradingChart from "../common/component/dashboard/overView/tradingChart/TradingChart";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "DashBoard/Trading Chart",
  component: TradingChart,
};

export const Default = () => (
  <div style={{ width: "100%", height: 500 }}>
    <TradingChart />
  </div>
);
