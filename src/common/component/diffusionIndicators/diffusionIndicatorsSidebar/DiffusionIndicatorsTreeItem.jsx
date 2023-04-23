import React, { useCallback } from "react";
import PropTypes from "prop-types";

// icons
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedIndicator,
  toggleExpand,
} from "../../../../store/diffusionIndicator/DiffusionIndicatorSlice";

const DiffusionIndicatorsTreeItem = ({ icon, badge, btnFunc, index, item }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Common.theme);
  const { selectedIndicator } = useSelector(
    (state) => state.DiffusionIndicator
  );

  const handleClickIndicator = (_item) => {
    dispatch(setSelectedIndicator(_item));
  };
  const showDropdown = useCallback(() => {
    const indicatorsCount = item.options?.length
    if (indicatorsCount > 1) {
      return true
    } else if (indicatorsCount === 1) {
      if (item.options[0]?.is_parent) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }, [item])
  const handleClickTopLevelItem = () => {
    if (showDropdown()) {
      dispatch(toggleExpand({
        expanded: !item.expanded,
        index: item.index,
      }));
    }else if(item.options?.length === 1){
      handleClickIndicator(item.options[0])
    }
  }
  return (
    <div className={`DiffusionIndicatorsTree-item ${theme} ${item.options[0]?.is_parent && 'parent'}`}>
      <div
        className={`DiffusionIndicatorsTree-item_top ${theme}`}
        onClick={handleClickTopLevelItem}
      >
        {showDropdown() && (
          <div className={`DiffusionIndicatorsTree-item_top-left ${theme}`}>
            {item.expanded ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
          </div>
        )}
        <div className={`DiffusionIndicatorsTree-item_top-righ ${theme}`}>
          <p className="DiffusionIndicatorsTree-item_top-title" >{item.title}</p>
          {badge && <div className="badge">{badge}</div>}
          {icon && (
            <div className="bt" onClick={btnFunc}>
              {icon}
            </div>
          )}
        </div>
      </div>
      {item.expanded && (
        <div className={`DiffusionIndicatorsTree-item_bottom ${theme}`}>
          {item.options.map((_item, i) => (
            <React.Fragment key={i}>
              {_item.options ? (
                <DiffusionIndicatorsTreeItem item={_item} index={i} />
              ) : (
                <button
                  key={i}
                  className={`DiffusionIndicatorsTree-item_bottom-item ${theme} ${selectedIndicator === _item.index ? "active" : ""
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

DiffusionIndicatorsTreeItem.propTypes = {
  icon: PropTypes.node,
  badge: PropTypes.string,
  btnFunc: PropTypes.func,
  title: PropTypes.string,
  options: PropTypes.array,
};

export default DiffusionIndicatorsTreeItem;
