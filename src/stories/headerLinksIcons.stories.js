import HeaderLinksIcons from "../common/layouts/header/parts/headerLinksIcons/HeaderLinksIcons";
// styles
import "../common/assets/styles/main.scss";

// icon
import { FiBell } from "react-icons/fi";

export default {
  title: "Layouts/Header Icon Links",
  component: HeaderLinksIcons,
};

const Template = (args) => <HeaderLinksIcons {...args} />;

export const Default = {
  args: {
    icon: <FiBell />,
    link: "/",
  },
};

export const Bages = {
  args: {
    icon: <FiBell />,
    link: "/",
    isBage: true,
    bageNo: "10",
  },
};
