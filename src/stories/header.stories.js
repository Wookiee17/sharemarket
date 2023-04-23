import Header from "../common/layouts/header/Header";
// styles
import "antd/dist/antd.css";
import "../common/assets/styles/main.scss";

export default {
  title: "Layouts/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = () => <Header />;
