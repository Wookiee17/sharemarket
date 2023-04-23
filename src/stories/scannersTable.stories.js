import ScannersTable from "../common/component/scanners/scannersTable/ScannersTable";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Scanners/Scanners Table",
  component: ScannersTable,
};

const Template = (args) => <ScannersTable {...args} />;

export const Default = {
  args: {},
};
