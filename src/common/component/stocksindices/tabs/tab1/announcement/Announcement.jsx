import React, { useState, useCallback } from "react";
import _ from "lodash";
import moment from "moment/moment";

// Component
import Filter from "../../../../filter/Filter";
import NewsListing from "../news/NewsListing";
import NewsSearch from "../news/NewsSearch";

// redux
import { useSelector } from "react-redux";

//graphql
import { useQuery } from "@apollo/client";
import { GET_STOCK_NEWS } from "../../../../../../gql/queries";

const Announcement = () => {
  const {newsSearchText, newsSorting} = useSelector((state) => state.StockIndices)

  
  

  return (
    <div className="news">
      <Filter />
      {newsSearchText === "" ? (
        <NewsListing type="announcement" />
      ) : (
        <NewsSearch type="announcement" />
      )}
    </div>
  );
};

export default Announcement;
