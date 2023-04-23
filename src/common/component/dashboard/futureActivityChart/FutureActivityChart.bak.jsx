import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
// import { faker } from "@faker-js/faker";

import { useQuery } from "@apollo/client";

// redux
import { useSelector } from "react-redux";
import { GET_FUTURE_ACTIVITY } from "../../../../gql/queries";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "bottom",
    },
    title: {
      display: false,
    },
  },
};

const FutureActivityChart = (props) => {
  const theme = useSelector((state) => state.Common.theme);

  const currentTab = props?.currentTab;

  const { data } = useQuery(GET_FUTURE_ACTIVITY, {
    pollInterval: process.env.NEXT_PUBLIC_REFETCH_INTERVAL, //fetch data in every 3 minutes
    variables: {
      limit: 5,
      order_by: currentTab?.conditions,
    },
  });

  const required = data?.fonseprices;

  const labels = required ? required?.map((p) => p?.scripcode) : [];
  const ds1 = required ? required?.map((p) => parseFloat(p?.openinterest)) : [];
  const ds2 = required ? required?.map((p) => parseFloat(p?.highprice)) : [];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: ds1,
        borderColor: "#4F6FE0",
        backgroundColor: "#4F6FE0",
      },
      {
        label: "Dataset 2",
        data: ds2,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className={`FutureActivityChart_chart ${theme}`}>
      <Bar options={options} data={chartData} height={130} />
    </div>
  );
};

export default FutureActivityChart;
