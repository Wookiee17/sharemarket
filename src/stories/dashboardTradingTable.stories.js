import TradingTable from "../common/component/dashboard/overView/tradingTable/TradingTable";
// styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "../common/assets/styles/main.scss";

export default {
  title: "DashBoard/Trading Table",
  component: TradingTable,
};

export const Default = () => (
  <div style={{ width: "100%", height: 500 }}>
    <TradingTable />
  </div>
);
