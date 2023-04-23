import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

//graphql
import { useQuery } from "@apollo/client";
import { GET_WEBINARS_AGGREGATE } from "../../../gql/queries";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActiveWebinarTab } from "../../../store/webinar/WebinarSlice";

const WebinarTabs = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useSelector((state) => state.Common.theme);
  const Tabs = useSelector((state) => state.Webinar.webinarTabs);
  const activeTab = useSelector((state) => state.Webinar.activeWebinarTab);
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const [webinarCount, setWebinarCount] = useState({
    total: 0,
    ic: 0,
    guest: 0,
  });
  const { tab } = router.query;

  useQuery(GET_WEBINARS_AGGREGATE, {
    onCompleted: (data) => {
      setWebinarCount({
        total: data?.total_webinars?.aggregate?.count || 0,
        ic: data?.ic_webinars?.aggregate?.count || 0,
        guest: data?.guest_webinars?.aggregate?.count || 0,
      });
    },
  });

  const changeTab = (id, slug) => {
    router.push(`/webinar/${slug}`);
    dispatch(setActiveWebinarTab(id));
  };

  const renderCount = useCallback(
    (tabName) => {
      if (tabName === "All") {
        return webinarCount.total;
      } else if (tabName === "Market Mornings") {
        return webinarCount.ic;
      }
      if (tabName === "Technical Talks") {
        return webinarCount.guest;
      }
    },
    [webinarCount]
  );

  useEffect(() => {
    Tabs.forEach((item, i) => {
      if (tab == item.slug) {
        dispatch(setActiveWebinarTab(item.id));
      }
    });
  }, [tab]);

  return (
    <div className="webinar-left_tabs">
      <div className="tabs">
        <div className={`innerTabs ${theme}`}>
          {Tabs.map((item, i) => (
            <div
              className={`innerTabs-item ${activeTab == item.id && "focused"}`}
              key={i}
              onClick={() => changeTab(item.id, item.slug)}
            >
              {item.name} ({renderCount(item.name)})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default WebinarTabs;
