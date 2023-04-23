import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Modal from "react-modal";

// icons
import { FiCornerUpLeft } from "react-icons/fi";

// layout
import Layout from "../../common/layouts/Layout";

// component
import Button from "../../common/component/button/Button";

// containers
import OverView from "../../containers/dashboard/overview/OverView";
import Decline from "../../containers/dashboard/decline/Decline";
import Options from "../../containers/dashboard/options/Options";
import Activity from "../../containers/dashboard/activity/Activity";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActiveDashboardScreen } from "../../store/dashboard/DashboardSlice";

const DashboardView = () => {
  const theme = useSelector((state) => state.Common.theme);
  const router = useRouter();
  const { view } = router.query;
  const dispatch = useDispatch();
  const [modalIsOpen, setIsOpen] = useState(true);
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const dashboardScreens = useSelector(
    (state) => state.Dashboard.dashboardScreens
  );
  const activeDashboardScreen = useSelector(
    (state) => state.Dashboard.activeDashboardScreen
  );

  useEffect(() => {
    dashboardScreens.forEach((item, i) => {
      if (view == item.slug) {
        dispatch(setActiveDashboardScreen(item.id));
      }
    });
  }, [view]);

  const _changeTab = (slug, id) => {
    router.push(`/${globalTabs[0].link}/${slug}`);
    dispatch(setActiveDashboardScreen(id));
  };

  const _resotreView = () => {
    router.push(`/${globalTabs[0].link}`);
    dispatch(setActiveDashboardScreen(null));
  };

  useEffect(() => {
    return () => {
      dispatch(setActiveDashboardScreen(null));
    };
  }, []);
  return (
    <Layout>
      <div className={`tabs-body ${theme}`}>
        <Head>
          <title>Dashboard | IC Trading</title>
        </Head>
        <Modal
          isOpen={modalIsOpen}
          contentLabel="Dashboard_Fullscreen_Modal"
          className={`FullView_Modal ${theme}`}
          overlayClassName="FullView_Modal_Overlay"
          ariaHideApp={false}
        >
          <div className="layout-tabs">
            <div className="layout-tabs-menu">
              {dashboardScreens.map((item, i) => (
                <div
                  className={`layout-tabs-menu-item ${
                    activeDashboardScreen == item.id && "active"
                  }`}
                  key={i}
                  onClick={() => {
                    _changeTab(item.slug, item.id);
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
            {/* <Button
              type={"primary"}
              onClick={() => {
                _resotreView();
              }}
            >
              <FiCornerUpLeft style={{ marginRight: 7 }} />
              <span>Restore View</span>
            </Button> */}
          </div>
          {activeDashboardScreen == 1 && <OverView />}
          {activeDashboardScreen == 2 && <Decline />}
          {activeDashboardScreen == 3 && <Options />}
          {activeDashboardScreen == 4 && <Activity />}
        </Modal>
      </div>
    </Layout>
  );
};

export default DashboardView;
