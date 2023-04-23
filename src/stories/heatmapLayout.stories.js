import HeatmapLayout from "../containers/heatmap/heatmapLayout/HeatmapLayout";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Heatmap/Heatmap Layout",
  component: HeatmapLayout,
};

const Template = (args) => <HeatmapLayout {...args} />;

export const Default = {
  args: {},
};
