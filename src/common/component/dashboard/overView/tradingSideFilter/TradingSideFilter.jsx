import React from "react";
// redux
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveSidebarLevel1,
  setActiveSidebarLevel2,
} from "../../../../../store/dashboard/MarketOverviewSlice";
// apollo
import { useQuery } from "@apollo/client";
import { GET_INDICES, GET_OVERVIEW_QUERIES } from "../../../../../gql/queries";

const TradingSideFilter = () => {
  const theme = useSelector((state) => state.Common.theme);
  const dispatch = useDispatch();
  const { data: queryData } = useQuery(GET_OVERVIEW_QUERIES, {
    onCompleted: (d) => {
      dispatch(setActiveSidebarLevel1(d?.queries?.[0]?.name));
    },
  });
  const { data: idxData } = useQuery(GET_INDICES, {
    onCompleted: (d) => {
      dispatch(setActiveSidebarLevel2(d?.indices?.[0]?.id));
    },
  });
  const queries = queryData?.queries;
  const indices = idxData?.indices;
  const activeLevel1 = useSelector(
    (state) => state.MarketOverview.activeSidebarLevel1
  );
  const activeLevel2 = useSelector(
    (state) => state.MarketOverview.activeSidebarLevel2
  );

  return (
    <div className={`SideFilter_list ${theme}`}>
      <div className={`SideFilter_list-left ${theme}`}>
        <div>
          {queries?.map((item, i) => (
            <div
              className={`SideFilter_list-left_item ${
                activeLevel1 == item?.name ? "active" : "null"
              } ${theme}`}
              key={item?.id}
              onClick={() => {
                dispatch(setActiveSidebarLevel1(item?.name));
                dispatch(setActiveSidebarLevel2(indices?.[0]?.id));
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
      <div className={`SideFilter_list-right ${theme}`}>
        {indices?.map((item, i) => (
          <div
            className={`SideFilter_list-right_item ${
              activeLevel2 == item?.id ? "active" : "null"
            } ${theme}`}
            key={item?.id}
            onClick={() => {
              dispatch(setActiveSidebarLevel2(item?.id));
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradingSideFilter;
