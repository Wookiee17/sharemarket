import TopTabsItem from "../common/component/topTabs/TopTabsItem";
import TopTabsModal from "../common/component/topTabs/TopTabsModal";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Components/Top Tabs Items",
  component: TopTabsItem,
};

const Template = (args) => <TopTabsItem {...args} />;

//
export const Default = {
  args: {
    item: {
      name: "Dashboard",
      userDefined: false,
    },
    active: false,
    indexId: 1,
  },
};

export const Active = {
  args: {
    item: {
      name: "Dashboard",
      userDefined: false,
    },
    active: true,
    indexId: 1,
  },
};

export const UserDefined = {
  args: {
    item: {
      name: "User Defined",
      userDefined: true,
    },
    active: false,
    indexId: 1,
  },
};
