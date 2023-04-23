import DropDownMenu from "../common/component/dropDownMenu/DropDownMenu";
// styles
import "../common/assets/styles/main.scss";

// icon
import { FiUser } from "react-icons/fi";

export default {
  title: "Components/Drop Down Menu",
  component: DropDownMenu,
};

const Template = (args) => <DropDownMenu {...args} />;

export const Default = {
  args: {
    lable: "John Doe",
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png",
    options: ["My Account", "Log Out"],
  },
};

export const icon = {
  args: {
    lable: "John Doe",
    isIcon: true,
    icon: <FiUser />,
    options: ["My Account", "Log Out"],
  },
};