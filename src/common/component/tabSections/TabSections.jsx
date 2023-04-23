import React, { createRef } from "react";
import PropTypes from "prop-types";

// Icons
import { FiShare2, FiDownload, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { CgMaximizeAlt, CgMinimize } from "react-icons/cg";

// redux
import { useSelector } from "react-redux";

const TabSection = ({
  headerLable,
  isMaximized,
  shareFun,
  downloadFun,
  maximizeFun,
  minimizeFun,
  children,
  headerNull,
  tabArr,
  activeTab,
  tabFunc,
}) => {
  const theme = useSelector((state) => state.Common.theme);

  return (
    <div className={`TabSection ${theme}`}>
      <div className="tabs_header">
        {!headerNull ? (
          <div className="name">{headerLable}</div>
        ) : (
          <>
            <div className="layout-tabs">
              <div className="layout-tabs-menu">
                {tabArr.map((item, i) => (
                  <div
                    className={`layout-tabs-menu-item ${
                      activeTab == item.id && "active"
                    }`}
                    key={i}
                    onClick={() => {
                      tabFunc(item.tabSlug, item.slug, item.id);
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <div className="right">
          <div className="btn" onClick={shareFun}>
            <FiShare2 />
          </div>
          <div className="btn" onClick={downloadFun}>
            <FiDownload />
          </div>
          {maximizeFun && !isMaximized && (
            <div className="btn" onClick={maximizeFun}>
              <CgMaximizeAlt />
            </div>
          )}
          {minimizeFun && isMaximized && (
            <div className="btn" onClick={minimizeFun}>
              <CgMinimize />
            </div>
          )}
        </div>
      </div>
      <div className="tabs_body">{children}</div>
    </div>
  );
};

TabSection.propTypes = {
  headerLable: PropTypes.string,
  isMaximized: PropTypes.bool,
  maximizeFun: PropTypes.func,
  minimizeFun: PropTypes.func,
  shareFun: PropTypes.func,
  downloadFun: PropTypes.func,
  children: PropTypes.node,
};

export default TabSection;
