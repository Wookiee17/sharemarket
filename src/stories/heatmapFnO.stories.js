import HeatmapFnO from "../common/component/heatmap/heatmapFnO/HeatmapFnO";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Heatmap/Heatmap FnO",
  component: HeatmapFnO,
};

const Template = (args) => <HeatmapFnO {...args} />;

export const Default = {
  args: {},
};
