import React from "react";
import { Switch } from "antd";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../../../../../store/common/CommonSlice";

const HeaderThemeToggler = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Common.theme);

  return (
    <div className={`HeaderThemeToggler ${theme}`}>
      <p className="HeaderThemeToggler-text">Light Theme</p>
      <Switch
        onChange={() => {
          dispatch(setTheme(theme == "light" ? "dark" : "light"));
        }}
      />
    </div>
  );
};

export default HeaderThemeToggler;
