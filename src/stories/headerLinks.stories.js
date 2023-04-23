import HeaderLinks from "../common/layouts/header/parts/headerLinks/HeaderLinks";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Layouts/Header Links",
  component: HeaderLinks,
};

const Template = (args) => <HeaderLinks {...args} />;

export const Default = {
  args: {
    lable: "Nav Link",
    link: "/",
  },
};

export const Bages = {
  args: {
    lable: "Nav Link",
    link: "/",
    isBage: true,
    bageNo: "10",
  },
};
