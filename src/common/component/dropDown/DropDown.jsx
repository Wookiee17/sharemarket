import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Icons
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

// redux
import { useSelector } from "react-redux";

const DropDown = ({
  ticketsData,
  lable,
  options,
  setActive,
  setLabel,
  border,
  // defaultActive,
}) => {
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
  // useEffect(() => {
  //   // console.log(defaultActive, "defaultActive", options[0]);
  //   // console.log(lable);
  //   if (!defaultActive) {
  //     if (!ticketsData) {
  //       if (Array.isArray(options)) {
  //         if (typeof options[0] === "object") {
  //           setActive(options[0].value);
  //           // console.log(options[0]?.value);
  //         } else {
  //           setActive(options[0]);
  //           // console.log(options[0]);
  //         }
  //       }
  //     }
  //   }
  // }, [defaultActive, wrapperRef]);
  // console.log(wrapperRef, "wrapperRef");
  return (
    <div className={`DropDown ${theme} `} ref={wrapperRef}>
      <div
        className={`DropDown_top ${theme} ${border ? "border" : ""} `}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <p>{lable}</p>
        {open == true ? <FiChevronUp /> : <FiChevronDown />}
      </div>
      {open == true && (
        <>
          <div className={`DropDown_menu ${theme}`}>
            {options?.map((item, i) => (
              <div
                className={`DropDown_menu-item ${theme}`}
                key={i}
                onClick={() => {
                  setOpen(false);
                  if (typeof item === "object") {
                    setActive(item?.value);
                    setLabel(item?.label);
                  } else {
                    setActive(item);
                    setLabel(item);
                  }
                }}
              >
                {typeof item === "object" ? item?.label : item}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

DropDown.propTypes = {
  lable: PropTypes.string,
  options: PropTypes.array,
  setActive: PropTypes.func,
};

export default DropDown;
