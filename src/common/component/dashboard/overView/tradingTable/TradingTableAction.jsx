import React, { useContext, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

// icons
import { BsThreeDotsVertical, BsStar } from "react-icons/bs";

// redux
import { useSelector } from "react-redux";

const TradingTableAction = () => {
  const theme = useSelector((state) => state.Common.theme);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className={`OverView_table-action ${theme}`} ref={wrapperRef}>
      <div
        className={`OverView_table-action-icon ${theme}`}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <BsThreeDotsVertical />
      </div>
      {open && (
        <div className={`OverView_table-action-menu ${theme}`}>
          <div className="OverView_table-action-menu_item">
            <div className="OverView_table-action-menu_item-icon">
              <BsStar />
            </div>
            <div className="OverView_table-action-menu_item-text">
              Add to Watchlist
            </div>
          </div>
          <div className={`divider ${theme}`}></div>
          <div className="OverView_table-action-menu_item">
            <div className="OverView_table-action-menu_item-icon">
              {/* <BsStar /> */}
            </div>
            <div className="OverView_table-action-menu_item-text">Overview</div>
          </div>
          <div className="OverView_table-action-menu_item">
            <div className="OverView_table-action-menu_item-icon">
              {/* <BsStar /> */}
            </div>
            <div className="OverView_table-action-menu_item-text">Charts</div>
          </div>
          <div className="OverView_table-action-menu_item">
            <div className="OverView_table-action-menu_item-icon">
              {/* <BsStar /> */}
            </div>
            <div className="OverView_table-action-menu_item-text">
              IC Report
            </div>
          </div>
          <div className="OverView_table-action-menu_item">
            <div className="OverView_table-action-menu_item-icon">
              {/* <BsStar /> */}
            </div>
            <div className="OverView_table-action-menu_item-text">
              Fundamental
            </div>
          </div>
          <div className="OverView_table-action-menu_item">
            <div className="OverView_table-action-menu_item-icon">
              {/* <BsStar /> */}
            </div>
            <div className="OverView_table-action-menu_item-text">
              Technical
            </div>
          </div>
          <div className="OverView_table-action-menu_item">
            <div className="OverView_table-action-menu_item-icon">
              {/* <BsStar /> */}
            </div>
            <div className="OverView_table-action-menu_item-text">
              Volume & Delivery
            </div>
          </div>
          <div className="OverView_table-action-menu_item">
            <div className="OverView_table-action-menu_item-icon">
              {/* <BsStar /> */}
            </div>
            <div className="OverView_table-action-menu_item-text">Futures</div>
          </div>
          <div className="OverView_table-action-menu_item">
            <div className="OverView_table-action-menu_item-icon">
              {/* <BsStar /> */}
            </div>
            <div className="OverView_table-action-menu_item-text">Options</div>
          </div>
          <div className="OverView_table-action-menu_item">
            <div className="OverView_table-action-menu_item-icon">
              {/* <BsStar /> */}
            </div>
            <div className="OverView_table-action-menu_item-text">
              Peer Comparison
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingTableAction;
