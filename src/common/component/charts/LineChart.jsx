import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import annotationPlugin from 'chartjs-plugin-annotation';

const _data = [
    {
      "date": "2022-01-03",
      "value": 95
    },
    {
      "date": "2022-01-04",
      "value": 80
    },
    {
      "date": "2022-01-05",
      "value": 67
    },
    {
      "date": "2022-01-06",
      "value": 58
    },
    {
      "date": "2022-01-07",
      "value": 67
    },
    {
      "date": "2022-01-10",
      "value": 76
    },
    {
      "date": "2022-01-11",
      "value": 55
    },
    {
      "date": "2022-01-12",
      "value": 60
    },
    {
      "date": "2022-01-13",
      "value": 66
    },
    {
      "date": "2022-01-14",
      "value": 62
    },
    {
      "date": "2022-01-17",
      "value": 52
    },
    {
      "date": "2022-01-18",
      "value": 12
    },
    {
      "date": "2022-01-19",
      "value": 13
    },
    {
      "date": "2022-01-20",
      "value": 6
    },
    {
      "date": "2022-01-21",
      "value": 4
    },
    {
      "date": "2022-01-24",
      "value": 3
    },
    {
      "date": "2022-01-25",
      "value": 15
    },
    {
      "date": "2022-01-27",
      "value": 11
    },
    {
      "date": "2022-01-28",
      "value": 30
    },
    {
      "date": "2022-01-31",
      "value": 65
    },
    {
      "date": "2022-02-01",
      "value": 89
    },
    {
      "date": "2022-02-02",
      "value": 88
    },
    {
      "date": "2022-02-03",
      "value": 75
    },
    {
      "date": "2022-02-04",
      "value": 50
    },
    {
      "date": "2022-02-07",
      "value": 26
    },
    {
      "date": "2022-02-08",
      "value": 31
    },
    {
      "date": "2022-02-09",
      "value": 61
    },
    {
      "date": "2022-02-10",
      "value": 74
    },
    {
      "date": "2022-02-11",
      "value": 32
    },
    {
      "date": "2022-02-14",
      "value": 5
    },
    {
      "date": "2022-02-15",
      "value": 64
    },
    {
      "date": "2022-02-16",
      "value": 40
    },
    {
      "date": "2022-02-17",
      "value": 44
    },
    {
      "date": "2022-02-18",
      "value": 32
    },
    {
      "date": "2022-02-21",
      "value": 64
    },
    {
      "date": "2022-02-22",
      "value": 26
    },
    {
      "date": "2022-02-23",
      "value": 27
    },
    {
      "date": "2022-02-24",
      "value": 4
    },
    {
      "date": "2022-02-25",
      "value": 55
    },
    {
      "date": "2022-02-28",
      "value": 86
    },
    {
      "date": "2022-03-02",
      "value": 59
    },
    {
      "date": "2022-03-03",
      "value": 42
    },
    {
      "date": "2022-03-04",
      "value": 52
    },
    {
      "date": "2022-03-07",
      "value": 24
    },
    {
      "date": "2022-03-08",
      "value": 51
    },
    {
      "date": "2022-03-09",
      "value": 76
    },
    {
      "date": "2022-03-10",
      "value": 87
    },
    {
      "date": "2022-03-11",
      "value": 96
    },
    {
      "date": "2022-03-14",
      "value": 91
    },
    {
      "date": "2022-03-15",
      "value": 67
    },
    {
      "date": "2022-03-16",
      "value": 79
    },
    {
      "date": "2022-03-17",
      "value": 77
    },
    {
      "date": "2022-03-21",
      "value": 83
    },
    {
      "date": "2022-03-22",
      "value": 81
    },
    {
      "date": "2022-03-23",
      "value": 71
    },
    {
      "date": "2022-03-24",
      "value": 40
    },
    {
      "date": "2022-03-25",
      "value": 24
    },
    {
      "date": "2022-03-28",
      "value": 51
    },
    {
      "date": "2022-03-29",
      "value": 59
    },
    {
      "date": "2022-03-30",
      "value": 62
    },
    {
      "date": "2022-03-31",
      "value": 42
    },
    {
      "date": "2022-04-01",
      "value": 66
    },
    {
      "date": "2022-04-04",
      "value": 81
    },
    {
      "date": "2022-04-05",
      "value": 80
    },
    {
      "date": "2022-04-06",
      "value": 68
    },
    {
      "date": "2022-04-07",
      "value": 44
    },
    {
      "date": "2022-04-08",
      "value": 49
    },
    {
      "date": "2022-04-11",
      "value": 37
    },
    {
      "date": "2022-04-12",
      "value": 13
    },
    {
      "date": "2022-04-13",
      "value": 16
    },
    {
      "date": "2022-04-18",
      "value": 16
    },
    {
      "date": "2022-04-19",
      "value": 6
    },
    {
      "date": "2022-04-20",
      "value": 17
    },
    {
      "date": "2022-04-21",
      "value": 45
    },
    {
      "date": "2022-04-22",
      "value": 27
    },
    {
      "date": "2022-04-25",
      "value": 18
    },
    {
      "date": "2022-04-26",
      "value": 59
    },
    {
      "date": "2022-04-27",
      "value": 28
    },
    {
      "date": "2022-04-28",
      "value": 40
    },
    {
      "date": "2022-04-29",
      "value": 34
    },
    {
      "date": "2022-05-02",
      "value": 55
    },
    {
      "date": "2022-05-04",
      "value": 13
    },
    {
      "date": "2022-05-05",
      "value": 17
    },
    {
      "date": "2022-05-06",
      "value": 8
    },
    {
      "date": "2022-05-09",
      "value": 11
    },
    {
      "date": "2022-05-10",
      "value": 21
    },
    {
      "date": "2022-05-11",
      "value": 26
    },
    {
      "date": "2022-05-12",
      "value": 11
    },
    {
      "date": "2022-05-13",
      "value": 32
    },
    {
      "date": "2022-05-16",
      "value": 40
    },
    {
      "date": "2022-05-17",
      "value": 95
    },
    {
      "date": "2022-05-18",
      "value": 92
    },
    {
      "date": "2022-05-19",
      "value": 62
    },
    {
      "date": "2022-05-20",
      "value": 87
    },
    {
      "date": "2022-05-23",
      "value": 77
    },
    {
      "date": "2022-05-24",
      "value": 49
    },
    {
      "date": "2022-05-25",
      "value": 32
    },
    {
      "date": "2022-05-26",
      "value": 81
    },
    {
      "date": "2022-05-27",
      "value": 75
    },
    {
      "date": "2022-05-30",
      "value": 90
    },
    {
      "date": "2022-05-31",
      "value": 83
    },
    {
      "date": "2022-06-01",
      "value": 84
    },
    {
      "date": "2022-06-02",
      "value": 87
    },
    {
      "date": "2022-06-03",
      "value": 44
    },
    {
      "date": "2022-06-06",
      "value": 24
    },
    {
      "date": "2022-06-07",
      "value": 20
    },
    {
      "date": "2022-06-08",
      "value": 37
    },
    {
      "date": "2022-06-09",
      "value": 55
    },
    {
      "date": "2022-06-10",
      "value": 31
    },
    {
      "date": "2022-06-13",
      "value": 5
    },
    {
      "date": "2022-06-14",
      "value": 16
    },
    {
      "date": "2022-06-15",
      "value": 38
    },
    {
      "date": "2022-06-16",
      "value": 8
    },
    {
      "date": "2022-06-17",
      "value": 12
    },
    {
      "date": "2022-06-20",
      "value": 23
    },
    {
      "date": "2022-06-21",
      "value": 79
    },
    {
      "date": "2022-06-22",
      "value": 43
    },
    {
      "date": "2022-06-23",
      "value": 84
    },
    {
      "date": "2022-06-24",
      "value": 95
    },
    {
      "date": "2022-06-27",
      "value": 97
    },
    {
      "date": "2022-06-28",
      "value": 85
    },
    {
      "date": "2022-06-29",
      "value": 71
    },
    {
      "date": "2022-06-30",
      "value": 56
    },
    {
      "date": "2022-07-01",
      "value": 75
    },
    {
      "date": "2022-07-04",
      "value": 84
    },
    {
      "date": "2022-07-05",
      "value": 57
    },
    {
      "date": "2022-07-06",
      "value": 91
    },
    {
      "date": "2022-07-07",
      "value": 92
    },
    {
      "date": "2022-07-08",
      "value": 85
    },
    {
      "date": "2022-07-11",
      "value": 79
    },
    {
      "date": "2022-07-12",
      "value": 52
    },
    {
      "date": "2022-07-13",
      "value": 53
    },
    {
      "date": "2022-07-14",
      "value": 40
    },
    {
      "date": "2022-07-15",
      "value": 42
    },
    {
      "date": "2022-07-18",
      "value": 57
    },
    {
      "date": "2022-07-19",
      "value": 70
    },
    {
      "date": "2022-07-20",
      "value": 59
    },
    {
      "date": "2022-07-21",
      "value": 74
    },
    {
      "date": "2022-07-22",
      "value": 56
    },
    {
      "date": "2022-07-25",
      "value": 31
    },
    {
      "date": "2022-07-26",
      "value": 21
    },
    {
      "date": "2022-07-27",
      "value": 39
    },
    {
      "date": "2022-07-28",
      "value": 52
    },
    {
      "date": "2022-07-29",
      "value": 67
    },
    {
      "date": "2022-08-01",
      "value": 74
    },
    {
      "date": "2022-08-02",
      "value": 78
    },
    {
      "date": "2022-08-03",
      "value": 48
    },
    {
      "date": "2022-08-04",
      "value": 38
    },
    {
      "date": "2022-08-05",
      "value": 35
    },
    {
      "date": "2022-08-08",
      "value": 24
    },
    {
      "date": "2022-08-10",
      "value": 41
    },
    {
      "date": "2022-08-11",
      "value": 53
    },
    {
      "date": "2022-08-12",
      "value": 45
    },
    {
      "date": "2022-08-16",
      "value": 49
    },
    {
      "date": "2022-08-17",
      "value": 53
    },
    {
      "date": "2022-08-18",
      "value": 61
    },
    {
      "date": "2022-08-19",
      "value": 23
    },
    {
      "date": "2022-08-22",
      "value": 7
    },
    {
      "date": "2022-08-23",
      "value": 19
    },
    {
      "date": "2022-08-24",
      "value": 21
    },
    {
      "date": "2022-08-25",
      "value": 32
    },
    {
      "date": "2022-08-26",
      "value": 51
    },
    {
      "date": "2022-08-29",
      "value": 43
    },
    {
      "date": "2022-08-30",
      "value": 66
    },
    {
      "date": "2022-09-01",
      "value": 40
    },
    {
      "date": "2022-09-02",
      "value": 33
    },
    {
      "date": "2022-09-05",
      "value": 53
    },
    {
      "date": "2022-09-06",
      "value": 73
    },
    {
      "date": "2022-09-07",
      "value": 46
    },
    {
      "date": "2022-09-08",
      "value": 51
    },
    {
      "date": "2022-09-09",
      "value": 58
    },
    {
      "date": "2022-09-12",
      "value": 72
    },
    {
      "date": "2022-09-13",
      "value": 82
    },
    {
      "date": "2022-09-14",
      "value": 44
    },
    {
      "date": "2022-09-15",
      "value": 33
    },
    {
      "date": "2022-09-16",
      "value": 7
    },
    {
      "date": "2022-09-19",
      "value": 10
    },
    {
      "date": "2022-09-20",
      "value": 44
    },
    {
      "date": "2022-09-21",
      "value": 22
    },
    {
      "date": "2022-09-22",
      "value": 34
    },
    {
      "date": "2022-09-23",
      "value": 26
    },
    {
      "date": "2022-09-26",
      "value": 12
    },
    {
      "date": "2022-09-27",
      "value": 17
    },
    {
      "date": "2022-09-28",
      "value": 20
    },
    {
      "date": "2022-09-29",
      "value": 27
    },
    {
      "date": "2022-09-30",
      "value": 87
    },
    {
      "date": "2022-10-03",
      "value": 64
    },
    {
      "date": "2022-10-04",
      "value": 89
    },
    {
      "date": "2022-10-06",
      "value": 85
    },
    {
      "date": "2022-10-07",
      "value": 76
    },
    {
      "date": "2022-10-10",
      "value": 69
    },
    {
      "date": "2022-10-11",
      "value": 55
    },
    {
      "date": "2022-10-12",
      "value": 43
    },
    {
      "date": "2022-10-13",
      "value": 26
    },
    {
      "date": "2022-10-14",
      "value": 36
    },
    {
      "date": "2022-10-17",
      "value": 67
    },
    {
      "date": "2022-10-18",
      "value": 94
    },
    {
      "date": "2022-10-19",
      "value": 64
    },
    {
      "date": "2022-10-20",
      "value": 76
    },
    {
      "date": "2022-10-21",
      "value": 54
    },
    {
      "date": "2022-10-24",
      "value": 77
    },
    {
      "date": "2022-10-25",
      "value": 79
    },
    {
      "date": "2022-10-27",
      "value": 66
    },
    {
      "date": "2022-10-28",
      "value": 55
    },
    {
      "date": "2022-10-31",
      "value": 74
    },
    {
      "date": "2022-11-01",
      "value": 77
    },
    {
      "date": "2022-11-02",
      "value": 71
    },
    {
      "date": "2022-11-03",
      "value": 44
    },
    {
      "date": "2022-11-04",
      "value": 50
    },
    {
      "date": "2022-11-07",
      "value": 55
    },
    {
      "date": "2022-11-09",
      "value": 37
    },
    {
      "date": "2022-11-10",
      "value": 23
    },
    {
      "date": "2022-11-11",
      "value": 38
    },
    {
      "date": "2022-11-14",
      "value": 46
    },
    {
      "date": "2022-11-15",
      "value": 46
    },
    {
      "date": "2022-11-16",
      "value": 30
    },
    {
      "date": "2022-11-17",
      "value": 33
    },
    {
      "date": "2022-11-18",
      "value": 18
    },
    {
      "date": "2022-11-21",
      "value": 23
    },
    {
      "date": "2022-11-22",
      "value": 25
    },
    {
      "date": "2022-11-23",
      "value": 26
    },
    {
      "date": "2022-11-24",
      "value": 73
    },
    {
      "date": "2022-11-25",
      "value": 78
    },
    {
      "date": "2022-11-28",
      "value": 76
    },
    {
      "date": "2022-11-29",
      "value": 58
    },
    {
      "date": "2022-11-30",
      "value": 78
    },
    {
      "date": "2022-12-01",
      "value": 81
    },
    {
      "date": "2022-12-02",
      "value": 66
    }
  ]

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

export const options = {
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: false,
      text: "Chart.js Line Chart - Multi Axis",
    },
    annotation: {
        annotations: {
         overboughtLine: {
            type: 'line',
            yMin: 80,
            yMax: 80,
            borderColor: '#fcbf49',
            borderWidth: 2,
            borderDash: [10]
          },
          undersoldLine: {
            type: 'line',
            yMin: 20,
            yMax: 20,
            borderColor: '#fcbf49',
            borderWidth: 2,
            borderDash: [10]
          }
        }
      }
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "right",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels: _data.map(d => d.date),
  datasets: [
    {
      label: "Daily Swing",
      data: _data.map(d => d.value),
      borderColor: "#1890ff",
      backgroundColor: "#1890ff",
      yAxisID: "y",
      pointRadius: 1
    }
  ],
};

const LineChart = () => {
  return (
    <Line options={options} data={data} height={130} />
  );
};

export default LineChart;
