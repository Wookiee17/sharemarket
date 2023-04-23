import HeatmapSidebar from "../common/component/heatmap/heatmapSidebar/HeatmapSidebar";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Heatmap/Heatmap Sidebar",
  component: HeatmapSidebar,
};

const Template = (args) => <HeatmapSidebar {...args} />;

export const Default = {
  args: {},
};
