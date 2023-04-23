import React, { useState, useRef, useEffect } from "react";
import { Checkbox } from "antd";
import PropTypes from "prop-types";

// Icons
import { FiChevronDown, FiChevronUp, FiCheck } from "react-icons/fi";
import { AiOutlineClear } from "react-icons/ai";

// theme
import { useSelector } from "react-redux";

const DropDownCheckBox = ({ lable, options, active, onChange }) => {
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
    <div className={`dropDownCheckBox ${theme}`} ref={wrapperRef}>
      <div
        className={`dropDownCheckBox_top ${theme}`}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <p>{lable}</p>
        {open == true ? <FiChevronUp /> : <FiChevronDown />}
      </div>
      {open == true && (
        <>
          <div className={`dropDownCheckBox_menu ${theme}`}>
            <div className="dropDownCheckBox_menu-options">
              <div>
                <AiOutlineClear />
              </div>
              <div
                onClick={() => {
                  setOpen(false);
                }}
              >
                <FiCheck />
              </div>
            </div>
            <div className="dropDownCheckBox_menu-body">
              <Checkbox.Group
                options={options?.map((i) => {
                  return i?.label.includes("All")
                    ? { label: "All", value: 0 }
                    : i;
                })}
                onChange={onChange}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
                className="check"
                value={active}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

DropDownCheckBox.propTypes = {
  lable: PropTypes.string,
  options: PropTypes.array,
  setActive: PropTypes.func,
};

export default DropDownCheckBox;
