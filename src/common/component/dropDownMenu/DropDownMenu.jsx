import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

// Icons
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

// redux
import { useSelector, useDispatch } from "react-redux";

import { useSignOut } from "@nhost/react";

import { setIsAuth, setMyAccount } from "../../../store/shield/ShieldSlice";

const DropDownMenu = ({ lable, isIcon, icon, imgUrl, options }) => {
  const theme = useSelector((state) => state.Common.theme);
  const {activeAccountTab, AccountTabs} = useSelector((state) => state.Account)
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { signOut } = useSignOut();

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className={`DropDownMenu ${theme}`} ref={wrapperRef}>
      <div
        className={`DropDownMenu_top ${theme}`}
        onClick={() => {
          setOpen(!open);
        }}
      >
        {isIcon == true ? (
          <div className="DropDownMenu_top_icon">{icon}</div>
        ) : (
          <img src={imgUrl} alt="" className="DropDownMenu_top_img" />
        )}
        <p>{lable}</p>
        {open == true ? <FiChevronUp /> : <FiChevronDown />}
      </div>
      {open == true && (
        <>
          <div className={`DropDownMenu_menu ${theme}`}>
            {options.map((item, i) => (
              <div
                className={`DropDownMenu_menu-item ${theme}`}
                key={i}
                onClick={() => {
                  if (item === "My Account") {
                    dispatch(setMyAccount(true));
                    router.push(`/myaccount/${AccountTabs[activeAccountTab].slug}`);
                  }
                  if (item == "Log Out") {
                    signOut();
                    dispatch(setIsAuth(false));
                    router.push("/authentication");
                  }
                  if (item == "Log In") {
                    router.push("/authentication");
                  } else {
                    setOpen(false);
                  }
                }}
              >
                {console.log(item, "item")}
                {item}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

DropDownMenu.propTypes = {
  lable: PropTypes.string,
  isIcon: PropTypes.bool,
  icon: PropTypes.node,
  imgUrl: PropTypes.string,
  options: PropTypes.array,
};

export default DropDownMenu;
