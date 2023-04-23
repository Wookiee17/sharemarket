import TradingSideFilter from "../common/component/dashboard/overView/tradingSideFilter/TradingSideFilter";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "DashBoard/Trading Side Filter",
  component: TradingSideFilter,
};

export const Default = () => (
  <div style={{ width: "100%", height: 500 }}>
    <TradingSideFilter />
  </div>
);
