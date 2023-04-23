import React, { useEffect, useState } from "react";
import Search from "../search/Search";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

//redux
import { useDispatch } from "react-redux";
import {
  onChangeNewsSearch,
  onChangeNewsSorting,
} from "../../../store/stockIndices/StockIndicesSlice";

const Filter = () => {
  const dispatch = useDispatch();
  const [sort, setSort] = useState(true);
  const [value, setValue] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(onChangeNewsSearch(value));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [value]);
  useEffect(() => {
    if (sort) {
      dispatch(onChangeNewsSorting("asc"));
    } else {
      dispatch(onChangeNewsSorting("desc"));
    }
  }, [sort]);
  return (
    <div className="filter-tab">
      <div
        className="item"
        onClick={() => setSort((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        {sort == true ? (
          <>
            <FiArrowDown style={{ marginRight: 5 }} />
            <span>Latest</span>
          </>
        ) : (
          <>
            <FiArrowUp style={{ marginRight: 5 }} />
            <span>Oldest</span>
          </>
        )}
      </div>
      <div>
        <Search
          placeholderText={"Enter Keyword"}
          onChange={(e) => setValue(e.target.value)}
          // onChange={(e)=> dispatch(onChangeNewsSearch(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Filter;
