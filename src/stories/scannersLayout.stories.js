import ScannersLayout from "../containers/scanners/scannersLayout/ScannersLayout";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Scanners/Scanners Layout",
  component: ScannersLayout,
};

const Template = (args) => <ScannersLayout {...args} />;

export const Default = {
  args: {},
};
