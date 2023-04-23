import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";

// Icons
import { FiX } from "react-icons/fi";

// redux
import { useSelector, useDispatch } from "react-redux";
import { removeUserDefineTabs } from "../../../store/common/CommonSlice";

const TopTabsItem = ({ item, active, indexId }) => {
  const { theme, GlobalTabs } = useSelector((state) => state.Common);
  const dispatch = useDispatch();
  const router = useRouter();
  const ParticipantsTabs = useSelector(
    (state) => state.ParticipantsData.ParticipantsDataTabs
  );
  const ParicipantsActiveTab = useSelector(
    (state) => state.ParticipantsData.activeParticipantsDataTab
  );
  const ParticipantsScreens = useSelector(
    (state) => state.ParticipantsData.ParticipantsDataScreens
  );
  const ParicipantsActiveScreen = useSelector(
    (state) => state.ParticipantsData.activeParticipantsDataScreen
  );
  const HeatMapTabs = useSelector((state) => state.Heatmap.tabs);
  const HeatMapActiveTab = useSelector((state) => state.Heatmap.activeTab);
  const HelpTabs = useSelector((state) => state.Help.HelpTabs);
  const HelpActiveTab = useSelector((state) => state.Help.activeHelpTab);
  const WebinarTabs = useSelector((state) => state.Webinar.webinarTabs);
  const WebinarActiveTab = useSelector(
    (state) => state.Webinar.activeWebinarTab
  );
  const StockTabs = useSelector((state) => state.StockIndices.tabs);
  const StockInnerTabs = useSelector((state) => state.StockIndices.innerTabs);
  const StockActiveTab = useSelector((state) => state.StockIndices.activeTab);
  const StockActiveInnerTab = 0;

  const _checkLink = (link) => {
    if (link == GlobalTabs[5]?.link) {
      return `${link}/${ParticipantsTabs[0].slug}/${ParticipantsScreens[ParicipantsActiveScreen].slug}`;
    } else if (link == GlobalTabs[2]?.link) {
      return `${link}/${HeatMapTabs[HeatMapActiveTab].slug}${`?index=`}`;
    } else if (link == GlobalTabs[6]?.link) {
      return `${link}/${StockTabs[StockActiveTab].slug}/${StockInnerTabs[StockActiveTab].tabs[StockActiveInnerTab].slug}`;
    } else if (link == "webinar") {
      return `${link}/${WebinarTabs[WebinarActiveTab].slug}`;
    } else if (link == "help") {
      return `${link}/${HelpTabs[HelpActiveTab].slug}`;
    } else {
      return link;
    }
  };

  return (
    <div className={`TopTabs_item ${active == true && "focused"} ${theme}`}>
      <Link href={`/${_checkLink(item.link)}`} className="TopTabs_item-link">
        <span>{item.name}</span>
        {item.name == "Heatmap" && <div className="badge">PRO</div>}
      </Link>

      {item.userDefined && (
        <div
          className="TopTabs_item-close"
          onClick={() => {
            dispatch(removeUserDefineTabs(indexId));
            if (active) {
              router.push(`/${_checkLink(GlobalTabs[indexId - 1].link)}`);
            }
          }}
        >
          <FiX />
        </div>
      )}
    </div>
  );
};

TopTabsItem.prototype = {
  item: PropTypes.object,
  active: PropTypes.bool,
  indexId: PropTypes.number,
};

export default TopTabsItem;
