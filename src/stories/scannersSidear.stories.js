import ScannersTree from "../common/component/scanners/ScannersTree.jsx";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Scanners/Scanners Tree Sidebar",
  component: ScannersTree,
};

const Template = (args) => <ScannersTree {...args} />;

export const Default = {
  args: {},
};
