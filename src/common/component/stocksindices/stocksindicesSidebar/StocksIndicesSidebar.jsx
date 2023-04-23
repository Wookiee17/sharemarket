import React from "react";
import { useRouter } from "next/router";

// icons
import { AiOutlineFolder, AiOutlineCalendar } from "react-icons/ai";
import { IoFileTrayFullOutline } from "react-icons/io5";
import { VscProject } from "react-icons/vsc";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../../../../store/stockIndices/StockIndicesSlice";

const StocksIndicesSidebar = () => {
  const theme = useSelector((state) => state.Common.theme);
  const dispatch = useDispatch();
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const Tabs = useSelector((state) => state.StockIndices.tabs);
  const activeTab = useSelector((state) => state.StockIndices.activeTab);
  const InnerTabs = useSelector((state) => state.StockIndices.innerTabs);
  const ActiveInnerTab = 0;
  const router = useRouter();

  const _changeTab = (id, slug, innerSlug) => {
    router.push(`/${globalTabs[6].link}/${slug}/${innerSlug}`);
    dispatch(setActiveTab(id));
  };

  return (
    <div className="sidebar">
      {Tabs.map((item, i) => (
        <div
          key={i}
          className={`icon ${activeTab === item.id && "active"}`}
          onClick={() =>
            _changeTab(item.id, item.slug, InnerTabs[item.id].tabs[0].slug)
          }
        >
          {item.id == 0 ? (
            <IoFileTrayFullOutline />
          ) : item.id == 1 ? (
            <AiOutlineFolder />
          ) : item.id == 2 ? (
            <VscProject />
          ) : item.id == 3 ? (
            <AiOutlineCalendar />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default StocksIndicesSidebar;
