import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";

// redux
import { useSelector } from "react-redux";
import { GET_OPTIONS } from "../../../../gql/queries";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  interaction: {
    mode: 'index'
  },
  plugins: {
    legend: {
      display: false,
      position: "top",
    },
    title: {
      display: false,
    },
    elements: {
      line: {
        fill: false
      }
    }
  },
  scales: {
    x: {
      type: 'linear',
      display: true,
      position: 'bottom',
      stacked: true
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
    },
    // y1: {
    //   type: 'linear',
    //   display: true,
    //   position: 'right',
    // },
  }
};

// let labels = [700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700];

const OptionsChart = ({ filters }) => {
  const theme = useSelector((state) => state.Common.theme);
  let labels = [];
  let call_data = [];
  let put_data = [];
  let pcr_data = [];

  const { loading, data } = useQuery(GET_OPTIONS, {
    variables: {
      symbol: filters?.symbol,
      expiry_date: filters?.expiry_date,
      end_date: dayjs().format('YYYY-MM-DD'),
      start_date: dayjs().subtract(3, 'days').format('YYYY-MM-DD'),
      oi_lower: 16000,
      oi_upper: 20500
    },
    skip: !filters?.expiry_date,
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true
  });

  if (!loading) {
    for (let opt of data?.indiacharts_last_options_oi) {
      let pcr = Number((Math.abs(opt.put_oi / opt.call_oi) || 0).toFixed(1));
      if (pcr > 10) pcr = 10;
      // if (opt.strike_price > 16000 && opt.strike_price < 20400) {
        pcr_data.push(pcr);
        labels.push(opt.strike_price);
        put_data.push(opt.put_oi)
        call_data.push(opt.call_oi)
      // }
    }
  }


  const datas = {
    labels: labels,
    datasets: [
      {
        type: 'bar',
        label: "Put OI",
        data: put_data,
        borderColor: "#FF4A4A",
        backgroundColor: "#FF4A4A",
        barThickness: 3,
        yAxisID: 'y',
        order: 0,
      },
      {
        type: 'bar',
        label: "Call OI",
        data: call_data,
        borderColor: "#52C41A",
        backgroundColor: "#52C41A",
        yAxisID: 'y',
        order: 1
      },
      // {
      //   type: 'line',
      //   label: "PCR",
      //   data: pcr_data,
      //   borderColor: "#800000",
      //   backgroundColor: "#800000",
      //   yAxisID: 'y1',
      //   order: 2
      // },
    ],
  };

  return (
    <div className={`optionsChart_chart ${theme}`}>
      <Bar options={options} data={datas} height={80} />
    </div>
  );
};

export default OptionsChart;
