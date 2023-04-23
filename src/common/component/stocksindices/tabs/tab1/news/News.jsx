import React from "react";
import _ from "lodash";

// Component
import Filter from "../../../../filter/Filter";
import NewsListing from "./NewsListing";
import NewsSearch from "./NewsSearch";

// redux
import { useSelector } from "react-redux";

const News = () => {
  const { newsSearchText } = useSelector((state) => state.StockIndices);

  return (
    <div className="news">
      <Filter />
      {newsSearchText === "" ? (
        <NewsListing type="news" />
      ) : (
        <NewsSearch type="news" />
      )}
    </div>
  );
};

export default News;
