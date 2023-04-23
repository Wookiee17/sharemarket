import React from "react";
import { useRouter } from "next/router";
import { Calendar, theme } from "antd";
import moment from "moment";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActiveCalendarInnerTab } from "../../../../store/stockIndices/StockIndicesSlice";
import { handleChangeDate } from "../../../../store/calendar/CalendarSlice";

const TopTab4 = ({ setActiveTab, acticeTab }) => {
  const theme = useSelector((state) => state.Common.theme);
  const dispatch = useDispatch();
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const Tabs = useSelector((state) => state.StockIndices.tabs);
  const ActiveTab = useSelector((state) => state.StockIndices.activeTab);
  const InnerTabs = useSelector((state) => state.StockIndices.innerTabs);
  const ActiveCalendarInnerTab = useSelector(
    (state) => state.StockIndices.activeCalendarInnerTab
  );
  const { selectedDate } = useSelector((state) => state.Calendar);

  const router = useRouter();

  const _changeTab = (parentSlug, id, slug) => {
    router.push(`/${globalTabs[6].link}/${parentSlug}/${slug}`);
    dispatch(setActiveCalendarInnerTab(id));
  };

  const onChange = (value) => {
    dispatch(handleChangeDate(value));
  };

  return (
    <div className="top-tab4">
      <p>Select a date or range</p>
      <div className={`ant calendar ${theme}`}>
        <Calendar
          fullscreen={false}
          onPanelChange={onChange}
          onSelect={onChange}
          value={moment(selectedDate)}
        />
      </div>
      <h3>My Calendars</h3>
      {InnerTabs[3].tabs.map((item, i) => (
        <div
          key={i}
          className={`tab-item ${
            ActiveCalendarInnerTab == item.id && `active`
          }`}
          onClick={() => _changeTab(Tabs[3].slug, item.id, item.slug)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default TopTab4;
