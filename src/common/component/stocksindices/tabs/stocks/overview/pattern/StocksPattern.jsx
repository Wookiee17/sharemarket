import React from "react";
import { useScreenshot, createFileName } from "use-react-screenshot";

// redux
import { useSelector, useDispatch } from "react-redux";

// component
import TabSection from "../../../../../tabSections/TabSections";
import Button from "../../../../../button/Button";

const StocksPattern = () => {
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
    <div className="pattern">
      <TabSection
        headerLable={`sHAREHOLDING PATTERN`}
        maximizeFun={_maximize}
        minimizeFun={_minimize}
        isMaximized={false}
        downloadFun={_downloadScreenshot}
      >
        <div className="pattern-body">
          <div className="pattern-body_row">
            <div className="pattern-body_row-left"></div>
            <div className="pattern-body_row-right">
              <p>Data in percentages</p>
              <div className="btns">
                <Button type={"primary"} size={"md"}>
                  VIEW MORE
                </Button>
              </div>
            </div>
          </div>
          <div className="pattern-body_row">
            <div className="pattern-body_row-left">
              <p>name</p>
            </div>
            <div className="pattern-body_row-right">
              <div className="dates">
                <div className="item">Mar 2022</div>
                <div className="item">Jun 2022</div>
                <div className="item">Sep 2022</div>
                <div className="item">Dec 2022</div>
              </div>
            </div>
          </div>
          <div className="pattern-body_list">
            <div className="item">Promoters +</div>
            <div className="item">FIIs +</div>
            <div className="item">DIIs +</div>
            <div className="item">Public +</div>
          </div>
        </div>
      </TabSection>
    </div>
  );
};

export default StocksPattern;
