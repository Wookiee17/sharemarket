import HeatmapNSE from "../common/component/heatmap/heatmapNSE/HeatmapNSE";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Heatmap/Heatmap NSE",
  component: HeatmapNSE,
};

const Template = (args) => <HeatmapNSE {...args} />;

export const Default = {
  args: {},
};
