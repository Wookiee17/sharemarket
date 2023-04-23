import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// icons
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedIndicator,
  toggleExpand,
} from "../../../../store/sentimentIndicator/SentimentIndicatorSlice";

const SentimentIndicatorsTreeItem = ({ icon, badge, btnFunc, index, item }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Common.theme);
  const { selectedIndicator } = useSelector(
    (state) => state.SentimentIndicator
  );

  const handleClickIndicator = (_item) => {
    dispatch(setSelectedIndicator(_item));
  };
  return (
    <div className={`SentimentIndicatorsTree-item ${theme}`}>
      <div
        className={`SentimentIndicatorsTree-item_top ${theme}`}
        onClick={() => {
          dispatch(
            toggleExpand({
              expanded: !item.expanded,
              index: item.index,
            })
          );
        }}
      >
        <div className={`SentimentIndicatorsTree-item_top-left ${theme}`}>
          {item.expanded ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
        </div>
        <div className={`SentimentIndicatorsTree-item_top-righ ${theme}`}>
          <p>{item.title}</p>
          {badge && <div className="badge">{badge}</div>}
          {icon && (
            <div className="bt" onClick={btnFunc}>
              {icon}
            </div>
          )}
        </div>
      </div>
      {item.expanded && (
        <div className={`SentimentIndicatorsTree-item_bottom ${theme}`}>
          {item.options.map((_item, i) => (
            <React.Fragment key={i}>
              {_item.options ? (
                <SentimentIndicatorsTreeItem item={_item} index={i} />
              ) : (
                <button
                  key={i}
                  className={`SentimentIndicatorsTree-item_bottom-item ${theme} ${
                    selectedIndicator === _item.index ? "active" : ""
                  }`}
                  onClick={() => handleClickIndicator(_item)}
                >
                  <p>{_item.title}</p>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

SentimentIndicatorsTreeItem.propTypes = {
  icon: PropTypes.node,
  badge: PropTypes.string,
  btnFunc: PropTypes.func,
  title: PropTypes.string,
  options: PropTypes.array,
};

export default SentimentIndicatorsTreeItem;
