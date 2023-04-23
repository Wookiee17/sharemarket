import TabSections from "../common/component/tabSections/TabSections";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Components/Tab Sections",
  component: TabSections,
  argTypes: {
    shareFun: { action: "Share Function" },
    downloadFun: { action: "Download Function" },
    minimizeFun: { action: "Minimize Function" },
  },
};

const Template = (args) => <TabSections {...args} />;

export const Default = {
  args: {
    headerLable: "Section Name",
    children: (
      <>
        <h2>Tab Body Goes Here</h2>
      </>
    ),
  },
};
