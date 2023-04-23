import React, { Fragment, useMemo, createRef, useState } from "react";
import { useRouter } from "next/router";
import { useScreenshot, createFileName } from "use-react-screenshot";
import { Carousel } from "antd";

// apollo
import { useQuery } from "@apollo/client";
import { GET_INDICES_FOR_AD } from "../../../gql/queries";
import { ADV_DECLINE_SECTIONS } from "../../../common/constants";

// component
import TabSection from "../../../common/component/tabSections/TabSections";
import DeclineItem from "../../../common/component/dashboard/declineItem/DeclineItem";

// redux
import { useDispatch, useSelector } from "react-redux";
import { setActiveDashboardScreen } from "../../../store/dashboard/DashboardSlice";

const Decline = () => {
  const theme = useSelector((state) => state.Common.theme);
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const ref = createRef(null);
  const router = useRouter();
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const dashboardScreens = useSelector(
    (state) => state.Dashboard.dashboardScreens
  );
  const activeDashboardScreen = useSelector(
    (state) => state.Dashboard.activeDashboardScreen
  );
  const [sections, setSections] = useState([])
  // fullscreen
  const _maximize = () => {
    router.push(`/${globalTabs[0].link}/${dashboardScreens[1].slug}`);
  };

  const _minimize = () => {
    router.push(`/${globalTabs[0].link}`);
    dispatch(setActiveDashboardScreen(null));
  };

  // screenshot
  const [image, takeScreenShot] = useScreenshot({
    type: "image/png",
    quality: 1.0,
  });
  const download = (image, { name = "decline", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  const _downloadScreenshot = () => takeScreenShot(ref.current).then(download);

  // gql call
  const { data } = useQuery(GET_INDICES_FOR_AD, {
    variables: {
      where: {
        ic_active: { _eq: true },
      },
    },
  });


  const sectionGroups = useMemo(() => {
    if (data?.sections?.length) {
      const _sections = [...data?.sections]
      const indexNifty50 = _sections.findIndex((i) => i.name === "Nifty 50");
      const indexNifty500 = _sections.findIndex((i) => i.name === "Nifty 500");
      const tmpData = [..._sections];
      const nifty50Data = tmpData.splice(indexNifty50, 1); //remove Nifty 50 from the list
      const nifty500Data = tmpData.splice(indexNifty500, 1); //remove Nifty 500 from the list

      const groupedData = [];
      while (tmpData.length) {
        groupedData.push(tmpData.splice(0, 2));
      }
      groupedData.unshift([nifty50Data[0], nifty500Data[0]]); //make Nifty 50 and Nifty 500 as first entry

      _sections.splice(indexNifty50, 1);
      _sections.splice(indexNifty500, 1);
      _sections.unshift(nifty500Data[0]);
      _sections.unshift(nifty50Data[0]);
      setSections(_sections);
      return groupedData;
    } else {
      return [];
    }
  }, [data?.sections]);

  const Tabs = [
    {
      id: 0,
      title: "All(20)",
    },
    {
      id: 1,
      title: "Nifty 50(11)",
    },
    {
      id: 2,
      title: "FNO(9)",
    },
  ];

  return (
    <TabSection
      headerLable={"ADVANCE DECLINE"}
      maximizeFun={_maximize}
      minimizeFun={_minimize}
      isMaximized={activeDashboardScreen == dashboardScreens[1].id}
      downloadFun={_downloadScreenshot}
    >
      <div className={`${theme} decline`} ref={ref}>
        {activeDashboardScreen == null ? (
          <Carousel
            className="decline-slider"
            dots={{ className: "decline-slider_dots" }}
          >
            {sectionGroups?.map((g, i) => (
              <div className="decline-slider_item" key={i}>
                {g?.map((item) => (
                  <Fragment key={item?.id}>
                    <DeclineItem header item={item} />
                  </Fragment>
                ))}
              </div>
            ))}
          </Carousel>
        ) : (
          <>
            {/* <div className="decline-tabs">
              <div className={`secondary_tabs ${theme}`}>
                {Tabs.map((item, i) => (
                  <div
                    key={i}
                    className={`secondary_tabs-item ${
                      activeTab == item?.id && "focused"
                    }`}
                    onClick={() => {
                      setActiveTab(item);
                    }}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </div> */}
            <div className="decline-list">
              {sections?.map((item, i) => (
                <div className="decline-list_item" key={item?.id}>
                  <DeclineItem header item={item} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </TabSection>
  );
};

export default Decline;
