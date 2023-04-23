import React, { useState, useEffect } from "react";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";

// containers
import OverView from "../../../../containers/dashboard/overview/OverView";
import Decline from "../../../../containers/dashboard/decline/Decline";
import Options from "../../../../containers/dashboard/options/Options";
import Activity from "../../../../containers/dashboard/activity/Activity";

const originalItems = ["a", "b", "c", "d"];

const initialLayouts = {
  lg: [
    { w: 12, h: 7, x: 0, y: 0, i: "a" },
    { w: 2, h: 5, x: 0, y: 0, i: "b" },
    { w: 6, h: 5, x: 2, y: 0, i: "c" },
    { w: 4, h: 5, x: 10, y: 0, i: "d" },
  ],
};

const GridLayout = ({ parent }) => {
  const [load, setLoad] = useState(false);
  const [items, setItems] = useState(originalItems);
  const [layouts, setLayouts] = useState(initialLayouts);
  const [windowDimensions, setWindowDimensions] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 100);

    setWindowDimensions({
      width: parent.current.clientWidth,
      height: parent.current.clientHeight,
    });

    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 118,
      });
    }
    window.addEventListener("resize", handleResize);

    // console.log(windowDimensions.height);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
  };

  return (
    <>
      {load !== false && (
        <ResponsiveGridLayout
          className="Gridlayout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
          rowHeight={(windowDimensions.height) / 12}
          margin={[0, 0]}
          onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
          isDraggable
          isRearrangeable
          isResizable={false}
          isBounded
          draggableHandle=".tabs_header"
          width={windowDimensions.width}
          useCSSTransforms={false}
        >
          {items.map((key) => (
            <div key={key}>
              <>
                {key == "a" && <OverView />}
                {key == "b" && <Decline />}
                {key == "c" && <Options />}
                {key == "d" && <Activity />}
              </>
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </>
  );
};

export default GridLayout;

// function getFromLS(key) {
//   let ls = {};
//   if (global.localStorage) {
//     try {
//       ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
//     } catch (e) {}
//   }
//   return ls[key];
// }

// function saveToLS(key, value) {
//   if (global.localStorage) {
//     global.localStorage.setItem(
//       "rgl-8",
//       JSON.stringify({
//         [key]: value,
//       })
//     );
//   }
// }
