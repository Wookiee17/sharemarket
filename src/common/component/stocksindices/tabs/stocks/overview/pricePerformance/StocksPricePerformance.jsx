import React from "react";
import { useRouter } from "next/router";
import { useScreenshot, createFileName } from "use-react-screenshot";
import MultiProgress from "react-multi-progress";

// redux
import { useSelector, useDispatch } from "react-redux";

// component
import TabSection from "../../../../../tabSections/TabSections";

//
import Highcharts from "highcharts/highstock";
import {
  HighchartsChart,
  Chart,
  HighchartsProvider,
  XAxis,
  YAxis,
  Subtitle,
  ColumnSeries,
  Tooltip,
  Loading,
  Scrollbar,
} from "react-jsx-highstock";

const StocksPricePerformance = () => {
  const theme = useSelector((state) => state.Common.theme);

  // screenshot
  const [image, takeScreenShot] = useScreenshot({
    type: "image/png",
    quality: 1.0,
  });
  const download = (
    image,
    { name = "future activity", extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  const _downloadScreenshot = () => takeScreenShot(ref.current).then(download);

  // maximize screen
  const _maximize = () => {};

  const _minimize = () => {};

  return (
    <div className="pricePerformance">
      <TabSection
        headerLable={`PRICE PERFORMANCE`}
        maximizeFun={_maximize}
        minimizeFun={_minimize}
        isMaximized={false}
        downloadFun={_downloadScreenshot}
      >
        <div className="pricePerformance-body">
          <div className="pricePerformance-body_row">
            <div className="left">
              <div className="pricePerformance-numbers">
                <div className="pricePerformance-body_row">
                  <div className="pricePerformance-body_row-col">
                    <p>Open</p>
                  </div>
                  <div className="pricePerformance-body_row-col">
                    <p>Open</p>
                  </div>
                </div>
                <div className="pricePerformance-body_row">
                  <div className="pricePerformance-body_row-col">
                    <p>Previous Close</p>
                  </div>
                  <div className="pricePerformance-body_row-col">
                    <p>Previous Close</p>
                  </div>
                </div>
                <div className="pricePerformance-body_row">
                  <div className="pricePerformance-body_row-col">
                    <p>VWAP</p>
                  </div>
                  <div className="pricePerformance-body_row-col">
                    <p>VWAP</p>
                  </div>
                </div>
                <div className="pricePerformance-body_row">
                  <div className="pricePerformance-body_row-col">
                    <p>Volume</p>
                  </div>
                  <div className="pricePerformance-body_row-col">
                    <p>Volume</p>
                  </div>
                </div>
                <div className="pricePerformance-body_row">
                  <div className="pricePerformance-body_row-col">
                    <p>Free Float</p>
                  </div>
                  <div className="pricePerformance-body_row-col">
                    <p>Free Float</p>
                  </div>
                </div>
                <div className="pricePerformance-body_row">
                  <div className="pricePerformance-body_row-col">
                    <p>Total Outstanding</p>
                  </div>
                  <div className="pricePerformance-body_row-col">
                    <p>Total Outstanding</p>
                  </div>
                </div>
                <div className="pricePerformance-body_row">
                  <div className="pricePerformance-body_row-col">
                    <p>Free Float</p>
                  </div>
                  <div className="pricePerformance-body_row-col">
                    <p>Free Float</p>
                  </div>
                </div>
              </div>
              <div className="pricePerformance-overview">
                <h5>
                  TODAY <span>1528.65</span>
                </h5>
                <div className="item">
                  <div className="item-top">
                    <span>1492.35</span>
                    <span>1538.90</span>
                  </div>
                  <div className="item-middle">
                    <MultiProgress
                      transitionTime={1.2}
                      elements={[
                        {
                          value: 60,
                          color: "#E49F36",
                        },
                      ]}
                      height={2}
                      backgroundColor="#FFB74A42"
                      border="0px solid #0000"
                      className=""
                    />
                  </div>
                  <div className="item-bottom">
                    <span>DAY’S RANGE</span>
                  </div>
                </div>
                <div className="item">
                  <div className="item-top">
                    <span>1492.35</span>
                    <span>1538.90</span>
                  </div>
                  <div className="item-middle">
                    <MultiProgress
                      transitionTime={1.2}
                      elements={[
                        {
                          value: 60,
                          color: "#E49F36",
                        },
                      ]}
                      height={2}
                      backgroundColor="#FFB74A42"
                      border="0px solid #0000"
                      className=""
                    />
                  </div>
                  <div className="item-bottom">
                    <span>DAY’S RANGE</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="right">
              <div className={`pricePerformance_chart ${theme}`}>
                <HighchartsProvider Highcharts={Highcharts}>
                  <HighchartsChart className={`highChartStyles ${theme}`}>
                    <Chart height={360} />

                    <XAxis
                      categories={[
                        "Apples",
                        "Oranges",
                        "Pears",
                        "Bananas",
                        "Plums",
                      ]}
                    />

                    <YAxis>
                      <ColumnSeries
                        name="Jane"
                        color={"#FE8F0C"}
                        data={[
                          0, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2,
                        ]}
                      />
                      <ColumnSeries
                        name="Jane"
                        color={"#06B3BE"}
                        data={[
                          0, -1, -2, -3, -2, -1, -2, -3, -2, -1, -2, -3, -2, -1,
                          -2, -3, -2,
                        ]}
                      />
                      <ColumnSeries
                        color={"#8609C1"}
                        name="John"
                        data={[
                          1, 2, 4, 3, 2, 2, 4, 3, 2, 2, 4, 3, 2, 2, 4, 3, 2,
                        ]}
                      />
                    </YAxis>
                  </HighchartsChart>
                </HighchartsProvider>
              </div>
            </div>
          </div>
        </div>
      </TabSection>
    </div>
  );
};

export default StocksPricePerformance;
