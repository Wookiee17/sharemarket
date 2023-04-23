import TopTabsModal from "../common/component/topTabs/TopTabsModal";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Components/Top Tabs Add Modal",
  component: TopTabsModal,
  argTypes: { close: { action: "Modal Closed" } },
};

const Template = (args) => <TopTabsModal {...args} />;

//
export const Default = {
  args: {
  },
};
