import DropDown from "../common/component/dropDown/DropDown";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Components/Simple Drop Down",
  component: DropDown,
};

const Template = (args) => <DropDown {...args} />;

export const Default = {
  args: {
    lable: "John Doe",
    options: ["My Account", "Log Out"],
  },
};
