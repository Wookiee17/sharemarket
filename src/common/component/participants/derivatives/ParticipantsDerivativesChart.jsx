import React from "react";
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
import dayjs from "dayjs";

// redux
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { GET_FII_DERIVATIVES } from "../../../../gql/queries";

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
      borderWidth: 10,
    },
  },
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: "bottom",
    },
    title: {
      display: false,
      text: "Chart.js Horizontal Bar Chart",
    },
  },
};

const ParticipantsDerivativesChart = ({
  selectedOption,
  date,
  selectedDate,
}) => {
  const [client_type, instrument_type] = selectedOption?.split("_");

  const dateFrom = dayjs(date).subtract(30, "days").format("YYYY-MM-DD");

  const { data } = useQuery(GET_FII_DERIVATIVES, {
    variables: {
      where: {
        _and: [
          { priced_date: { _lte: date } },
          { priced_date: { _gte: dateFrom } },
          { client_type: { _eq: client_type } },
          { instrument_type: { _eq: instrument_type } },
        ],
      },
      order_by: { priced_date: "desc" },
    },
    skip: !client_type || !instrument_type,
  });

  const labels = data?.derivatives?.map((d) => d?.priced_date);
  const colors = data?.derivatives?.map((record) => {
    if (record?.instrument_type?.includes("Put")) {
      if (record?.change_in_total > 0) {
        return "#FF4A4A";
      } else {
        return "#52C41A";
      }
    } else {
      if (record?.change_in_total < 0) {
        return "#FF4A4A";
      } else {
        return "#52C41A";
      }
    }
  });

  const borderColor = data?.derivatives?.map((record) => {
    if (record?.instrument_type?.includes("Put")) {
      if (record?.change_in_total > 0) {
        if (selectedDate === record?.priced_date) {
          return "#fff";
        } else {
          return "#FF4A4A";
        }
      } else {
        if (selectedDate === record?.priced_date) {
          return "#fff";
        } else {
          return "#52C41A";
        }
      }
    } else {
      if (record?.change_in_total < 0) {
        if (selectedDate === record?.priced_date) {
          return "#fff";
        } else {
          return "#FF4A4A";
        }
      } else {
        if (selectedDate === record?.priced_date) {
          return "#fff";
        } else {
          return "#52C41A";
        }
      }
    }
  });

  const borderWidth = data?.derivatives?.map((record) => {
    if (record?.instrument_type?.includes("Put")) {
      if (record?.change_in_total > 0) {
        if (selectedDate === record?.priced_date) {
          return 3;
        } else {
          return 0;
        }
      } else {
        if (selectedDate === record?.priced_date) {
          return 3;
        } else {
          return 0;
        }
      }
    } else {
      if (record?.change_in_total < 0) {
        if (selectedDate === record?.priced_date) {
          return 3;
        } else {
          return 0;
        }
      } else {
        if (selectedDate === record?.priced_date) {
          return 3;
        } else {
          return 0;
        }
      }
    }
  });

  const data2 = {
    labels,
    datasets: [
      // {
      //   data: data?.derivatives?.map((d) => d?.change_in_long),
      //   borderColor: "rgb(255, 99, 132)",
      //   backgroundColor: "rgba(255, 99, 132, 0.5)",
      // },
      {
        data: data?.derivatives?.map((d) => d?.amount),
        backgroundColor: colors,
        borderColor: borderColor,
        borderWidth: borderWidth,
      },
    ],
  };

  const theme = useSelector((state) => state.Common.theme);
  return <Bar options={options} data={data2} />;
};

export default ParticipantsDerivativesChart;
