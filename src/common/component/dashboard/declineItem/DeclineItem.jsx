import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import moment from "moment/moment";
import { useQuery } from "@apollo/client";
import MultiProgress, { ProgressComponentProps } from "react-multi-progress";

// Icons
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

//helpers
import { marketCloseUTC } from "../../../utils";

// redux
import { useSelector, useDispatch } from "react-redux";
import { GET_ADV_DECLINE_BY_INDEX_FUN } from "../../../../gql/queries";

const DeclineItem = ({ header, item }) => {
  const theme = useSelector((state) => state.Common.theme);
  const latestNifty = useSelector((state) => state.Common.latestNiftyStock);

  const { data } = useQuery(GET_ADV_DECLINE_BY_INDEX_FUN, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      index_id: item?.id,
      start_date: moment(latestNifty?.created_at).format("YYYY-MM-DD"),
      end_date: moment(latestNifty?.created_at)
        .add(1, "day")
        .format("YYYY-MM-DD"),
      eod_timestamp: `${moment(latestNifty?.created_at).format(
        "YYYY-MM-DD"
      )} ${marketCloseUTC}`,
      time_gap: "5 minutes",
    },
    skip: !item?.id && !latestNifty,
  });
  const total_stocks = data?.total_stocks?.aggregate?.count || 0;
  const advance = data?.advance_declines?.[0]?.advances || 0;
  const decline = data?.advance_declines?.[0]?.declines || 0;
  const unchanged = total_stocks - (advance + decline);

  return (
    <div className={`decline_item ${theme}`}>
      {header && (
        <div className="decline_item-top">
          <div className="name sm">{item?.name}</div>
          <Link
            // href={`/heatmap/nse?index=${item?.id}`}
            href={{
              pathname: "/heatmap/nse",
              query: { index: item?.id },
            }}
          >
            <span>Heatmap</span>
          </Link>
        </div>
      )}
      <div className="decline_item-middle">
        <div className="decline_item-middle-box">
          <div className="decline_item-middle-box-top advances">
            <FiArrowUp />
            <span>{advance}</span>
          </div>
          <div className="decline_item-middle-box-bottom">Advances</div>
        </div>
        <div className="decline_item-middle-box">
          <div className="decline_item-middle-box-top nutral">
            <span>{unchanged}</span>
          </div>
          <div className="decline_item-middle-box-bottom">Unchanged</div>
        </div>
        <div className="decline_item-middle-box">
          <div className="decline_item-middle-box-top declines">
            <FiArrowDown />
            <span>{decline}</span>
          </div>
          <div className="decline_item-middle-box-bottom">Declines</div>
        </div>
      </div>
      <MultiProgress
        transitionTime={1.2}
        elements={[
          {
            value: (advance / total_stocks) * 100,
            color: "#3eac0e",
          },
          {
            value: (unchanged / total_stocks) * 100,
            color: "#d9d9d9",
          },
          {
            value: (decline / total_stocks) * 100,
            color: "#f9000f",
          },
        ]}
        height={1}
        backgroundColor="#0000"
        border="0px solid #0000"
        className="decline_item-bar"
      />
      {data?.advance_declines?.length > 0 && (
        <div className="decline_item-timeStamp">
          {moment(latestNifty?.created_at).format("YYYY-MM-DD hh:mm A")}
        </div>
      )}
    </div>
  );
};

DeclineItem.propTypes = {
  header: PropTypes.bool,
};

export default DeclineItem;
