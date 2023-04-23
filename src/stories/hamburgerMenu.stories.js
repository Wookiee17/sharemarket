import HamburgerMenu from "../common/layouts/header/parts/hamburgerMenu/HamburgerMenu";
// styles
import "antd/dist/antd.css";
import "../common/assets/styles/main.scss";

export default {
  title: "Layouts/Hamburger Menu",
  component: HamburgerMenu,
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = () => (
  <div style={{ marginLeft: 100 }}>
    <HamburgerMenu />
  </div>
);
