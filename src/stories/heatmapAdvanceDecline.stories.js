import HeatmapAdvanceDecline from "../common/component/heatmap/heatmapAdvanceDecline/HeatmapAdvanceDecline";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Heatmap/Heatmap Advance Decline",
  component: HeatmapAdvanceDecline,
};

const Template = (args) => <HeatmapAdvanceDecline {...args} />;

export const Default = {
  args: {},
};
