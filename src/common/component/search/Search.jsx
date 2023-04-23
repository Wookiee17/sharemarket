import React from "react";
import PropTypes from "prop-types";

// Icons
import { FiSearch } from "react-icons/fi";

// redux
import { useSelector } from "react-redux";

const Search = ({ onClick, onChange, placeholderText }) => {
  const theme = useSelector((state) => state.Common.theme);
  return (
    <div className={`search ${theme}`}>
      <input placeholder={placeholderText} onChange={onChange} />
      <div className="search_btn" onClick={onClick}>
        <FiSearch />
      </div>
    </div>
  );
};

Search.propTypes = {
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  placeholderText: PropTypes.string,
};

export default Search;
