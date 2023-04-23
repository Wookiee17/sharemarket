import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Slider from "rc-slider";

// layout
import Layout from "../../../common/layouts/Layout";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../../../store/heatmap/HeatmapSlice";

// containers
import TabSection from "../../../common/component/tabSections/TabSections";
import HeatmapAdvanceDecline from "../../../common/component/heatmap/heatmapAdvanceDecline/HeatmapAdvanceDecline";
import HeatmapFnO from "../../../common/component/heatmap/heatmapFnO/HeatmapFnO";
import HeatmapNSE from "../../../common/component/heatmap/heatmapNSE/HeatmapNSE";

import dayjs from "dayjs";

const Heatmap = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderCurrent, setSliderCurrent] = useState(null);

  const theme = useSelector((state) => state.Common.theme);
  const router = useRouter();
  const { tab } = router.query;
  const dispatch = useDispatch();
  const globalTabs = useSelector((state) => state.Common.GlobalTabs);
  const Tabs = useSelector((state) => state.Heatmap.tabs);
  const activeTab = useSelector((state) => state.Heatmap.activeTab);

  useEffect(() => {
    Tabs.forEach((item, i) => {
      if (tab == item.slug) {
        dispatch(setActiveTab(item.id));
      }
    });
  }, [tab]);

  const _chnageTab = (slug, id) => {
    dispatch(setActiveTab(id));
    router.push(`/${globalTabs[2].link}/${slug}`);
  };

  const dateFormat = (count, format) => {
    return setSliderCurrent(
      dayjs().subtract(count, format).format("YYYY-MM-DD")
    );
  };

  useEffect(() => {
    if (sliderValue === 32) {
      dateFormat(1, "week");
    }
    if (sliderValue === 48) {
      dateFormat(1, "month");
    }
    if (sliderValue === 64) {
      dateFormat(3, "months");
    }
    if (sliderValue === 80) {
      dateFormat(6, "months");
    }
    if (sliderValue === 100) {
      dateFormat(1, "year");
    }
  }, [sliderValue]);

  return (
    <Layout>
      <div className={`tabs-body ${theme}`}>
        <Head>
          <title>Heatmap | IC Trading</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={`${theme} Heatmap`}>
          <div className="Heatmap_top">
            <div className="left">
              <div className={`secondary_tabs ${theme}`}>
                {Tabs.map((item, i) => (
                  <div
                    key={i}
                    className={`secondary_tabs-item ${
                      activeTab == item.id && "focused"
                    }`}
                    onClick={() => {
                      _chnageTab(item.slug, item.id);
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
            {activeTab != 2 && (
              <div className="viewBy">
                <p>View By</p>
                <div className="viewBy-slider">
                  <Slider
                    min={0}
                    defaultValue={0}
                    marks={{
                      0: `Today`,
                      16: `1 Hour`,
                      32: `1 Week`,
                      48: `1 Month`,
                      64: `3 Months`,
                      80: `6 Months`,
                      100: `1 Year`,
                    }}
                    step={null}
                    onChange={(v) => {
                      setSliderValue(v);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="Heatmap_bottom">
            <TabSection headerLable={`Heatmap`}>
              {activeTab == 0 && (
                <HeatmapNSE
                  sliderCurrent={sliderCurrent}
                  sliderValue={sliderValue}
                />
              )}
              {activeTab == 1 && (
                <HeatmapFnO
                  sliderCurrent={sliderCurrent}
                  sliderValue={sliderValue}
                  activeTab={activeTab}
                />
              )}
              {activeTab == 2 && <HeatmapAdvanceDecline />}
            </TabSection>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Heatmap;
