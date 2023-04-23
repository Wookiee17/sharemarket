import React from "react";
import { useRouter } from "next/router";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActiveIPOTab } from "../../../../store/stockIndices/StockIndicesSlice";

const TopTab3 = ({ setActiveTab, acticeTab }) => {
  const theme = useSelector((state) => state.Common.theme);
  const dispatch = useDispatch();
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const Tabs = useSelector((state) => state.StockIndices.tabs);
  const ActiveTab = useSelector((state) => state.StockIndices.activeTab);
  const InnerTabs = useSelector((state) => state.StockIndices.innerTabs);
  const ActiveIPOTab = useSelector((state) => state.StockIndices.activeIPOTab);
  const router = useRouter();

  const _changeTab = (parentSlug, id, slug) => {
    router.push(`/${globalTabs[6].link}/${parentSlug}/${slug}`);
    dispatch(setActiveIPOTab(id));
  };

  return (
    <div className="top-tab3">
      {InnerTabs[2].tabs.map((item, i) => (
        <div
          key={i}
          className={`tab-item ${ActiveIPOTab == item.id && `active`}`}
          onClick={() => _changeTab(Tabs[2].slug, item.id, item.slug)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default TopTab3;
