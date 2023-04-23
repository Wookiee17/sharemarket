import FutureActivityChart from "../common/component/dashboard/futureActivityChart/FutureActivityChart";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "DashBoard/Future Activity Chart",
  component: FutureActivityChart,
};

const Template = (args) => <FutureActivityChart />;

export const Default = {
  args: {},
};
