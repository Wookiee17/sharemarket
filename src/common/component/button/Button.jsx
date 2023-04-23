import React from "react";
import PropTypes from "prop-types";

// redux
import { useSelector } from "react-redux";

const Button = ({
  type,
  size,
  submit,
  children,
  onClick,
  reset,
  disabled,
  rounded,
  outlined,
}) => {
  const theme = useSelector((state) => state.Common.theme);

  return (
    <button
      className={`Button ${type} ${size} ${theme} 
      ${rounded ? "rounded" : "notRounded"}
      ${outlined ? "outlined" : "fill"}`}
      onClick={onClick}
      type={submit ? "submit" : reset ? "reset" : "button"}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["primary", "secondary"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  submit: PropTypes.bool,
  reset: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
  rounded: PropTypes.bool,
  outlined: PropTypes.bool,
};

export default Button;
