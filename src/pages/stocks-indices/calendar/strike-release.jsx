import React, { useEffect, useState } from "react";
import Head from "next/head";
import dayjs from "dayjs";

// layout
import Layout from "../../../common/layouts/Layout";
import {
  setActiveTab,
  setActiveCalendarInnerTab,
} from "../../../store/stockIndices/StockIndicesSlice";

// redux
import { useDispatch, useSelector } from "react-redux";
import { handleChangeData } from "../../../store/calendar/CalendarSlice";

// container
import StocksIndicesLayout from "../../../containers/stocksindices/StocksIndicesLayout";

// component
import Search from "../../../common/component/search/Search";
import TopTab4 from "../../../common/component/stocksindices/top-tab4/TopTab4";
import CalendarLayout from "../../../common/component/stocksindices/tabs/tab4/calendarLayout/CalendarLayout";

//graphql
import { useQuery } from "@apollo/client";
import { GET_SYSTEM_UPDATE } from "../../../gql/queries";

const StrikeRelease = () => {
  const dispatch = useDispatch();
  const { daterange } = useSelector((state) => state.Calendar);

  useEffect(() => {
    dispatch(setActiveTab(3));
    dispatch(setActiveCalendarInnerTab(2));
  }, []);

  const [value, setValue] = useState("");

  useQuery(GET_SYSTEM_UPDATE, {
    variables: {
      date: "asc",
      where: {
        _and: [
          {
            date: { _gte: dayjs(daterange[0]).format("YYYY-MM-DD") },
          },
          {
            date: {
              _lte: dayjs(daterange[daterange.length - 2]).format("YYYY-MM-DD"),
            },
          },
          {
            description: { _ilike: `%${value}%` },
          },
        ],
      },
    },
    onCompleted: (data) => {
      if (Array.isArray(data?.data)) {
        dispatch(
          handleChangeData({
            key: "systemUpdates",
            value: data.data.map((d) => {
              return {
                title: d.Desciption,
                subTitle: d.Desciption,
                date: d.Date,
                payload: d,
              };
            }),
          })
        );
      }
    },
    skip: daterange.length === 0,
  });
  return (
    <Layout>
      <StocksIndicesLayout>
        <Head>
          <title>Stock Indices | IC Trading</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="tab4">
          <div className="left">
            <div className="left_headersearch">
              <h1>CALENDAR</h1>
              <div>
                <Search
                  placeholderText={"Enter Keyword"}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="content">
            <TopTab4 />
            <div className="right">
              <CalendarLayout page="systemUpdates" />
            </div>
          </div>
        </div>
      </StocksIndicesLayout>
    </Layout>
  );
};

export default StrikeRelease;
