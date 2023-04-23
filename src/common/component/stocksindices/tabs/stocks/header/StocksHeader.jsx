import React from "react";
import { useRouter } from "next/router";

// icons
import { AiOutlineFolderAdd } from "react-icons/ai";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveTab,
  setActiveStocksTab,
  setSidebarOpen,
} from "../../../../../../store/stockIndices/StockIndicesSlice";

// components
import StocksSidebar from "../sidebar/StocksSidebar";

const StocksHeader = () => {
  const theme = useSelector((state) => state.Common.theme);
  const router = useRouter();
  const dispatch = useDispatch();
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const Tabs = useSelector((state) => state.StockIndices.tabs);
  const ActiveTab = useSelector((state) => state.StockIndices.activeTab);
  const InnerTabs = useSelector((state) => state.StockIndices.innerTabs);
  const ActiveStocksTab = useSelector(
    (state) => state.StockIndices.activeStocksTab
  );
  const SidebarOpen = useSelector((state) => state.StockIndices.sidebarOpen);

  return (
    <>
      <div className="stockIndicesStocks_top">
        <div
          className="stockIndicesStocks_top-left"
          onClick={() => {
            dispatch(setSidebarOpen(true));
          }}
        >
          <span>RELIANCE BROADBAND NETWORK LTD.</span>
          <AiOutlineFolderAdd />
        </div>
        <div className="stockIndicesStocks_top-right">
          <div className={`secondary_tabs ${theme}`}>
            {InnerTabs[ActiveTab].tabs.map((item, i) => (
              <div
                key={i}
                className={`secondary_tabs-item ${
                  ActiveStocksTab == item.id && "focused"
                }`}
                onClick={() => {
                  // _chnageTab(item.slug, item.id);
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <StocksSidebar />
    </>
  );
};

export default StocksHeader;
