import React from "react";
import { useRouter } from "next/router";

//
import { useDispatch, useSelector } from "react-redux";
import { setActiveInfoTab } from "../../../../store/stockIndices/StockIndicesSlice";

const TopTab = ({ setActiveTab, acticeTab }) => {
  const theme = useSelector((state) => state.Common.theme);
  const dispatch = useDispatch();
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const Tabs = useSelector((state) => state.StockIndices.tabs);
  const ActiveTab = useSelector((state) => state.StockIndices.activeTab);
  const InnerTabs = useSelector((state) => state.StockIndices.innerTabs);
  const ActiveInfoTab = useSelector(
    (state) => state.StockIndices.activeInfoTab
  );
  const router = useRouter();

  const _changeTab = (parentSlug, id, slug) => {
    router.push(`/${globalTabs[6].link}/${parentSlug}/${slug}`);
    dispatch(setActiveInfoTab(id));
  };

  return (
    <div className="top-tab">
      {InnerTabs[0].tabs.map((item, i) => (
        <div
          key={i}
          className={`tab-item ${ActiveInfoTab == item.id && `active`}`}
          onClick={() => _changeTab(Tabs[0].slug, item.id, item.slug)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default TopTab;
