import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

// icons
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setSelectedTable } from "../../../../store/scanners/ScannersSlice";

const ScannersTreeItem = ({ icon, badge, options, btnFunc, title, open }) => {
  const selectedTable = useSelector((state) => state.Scanners?.selectedTable);
  const theme = useSelector((state) => state.Common.theme);
  const [activated, setActivated] = useState(open);

  const dispatch = useDispatch();

  const showDropdown = useCallback(() => {
    const optionCount = options?.length;
    if (optionCount > 1) {
      return true;
    } else if (optionCount === 1) {
      return false;
    }
  }, [options]);

  return (
    <div className={`Scanner_tree-item ${theme}`}>
      {showDropdown() && (
        <div
          className={`Scanner_tree-item_top ${theme}`}
          onClick={() => {
            setActivated(!activated);
          }}
        >
          <div className="Scanner_tree-item_top-left">
            {activated ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
          </div>
          <div className="Scanner_tree-item_top-right">
            <p>{title}</p>
            {badge && <div className="badge">{badge}</div>}
            {icon && (
              <div className="bt" onClick={btnFunc}>
                {icon}
              </div>
            )}
          </div>
        </div>
      )}
      {activated && (
        <div className={`Scanner_tree-item_bottom ${theme}`}>
          {options.map((item, i) => (
            <button
              key={i}
              className={`Scanner_tree-item_bottom-item ${
                selectedTable === item?.id && "active"
              }`}
              onClick={() =>
                dispatch(setSelectedTable({ id: item?.id, title: item?.title }))
              }
            >
              <p>{item.title}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

ScannersTreeItem.propTypes = {
  title: PropTypes.string,
  options: PropTypes.array,
  badge: PropTypes.string,
  icon: PropTypes.node,
  btnFunc: PropTypes.func,
};

export default ScannersTreeItem;
