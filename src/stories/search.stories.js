import Search from "../common/component/search/Search";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Components/Search",
  component: Search,
  argTypes: { onClick: { action: "Clicked" }, onChange: { action: "Changed" } },
};

const Template = (args) => <Search {...args} />;

export const Default = {
  args: {
    placeholderText: "Global Search",
  },
};
