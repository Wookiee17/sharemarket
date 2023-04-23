import DeclineItem from "../common/component/dashboard/declineItem/DeclineItem";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "DashBoard/Decline Item",
  component: DeclineItem,
};

const Template = (args) => <DeclineItem />;

export const Default = {
  args: {},
};

export const WithHeader = {
  args: {
    header: true,
  },
};
