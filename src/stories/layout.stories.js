import Layout from "../common/layouts/Layout.jsx";
// styles
import "antd/dist/antd.css";
import "../common/assets/styles/main.scss";

export default {
  title: "Layouts/Layout",
  component: Layout,
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = () => (
  <Layout>
    <div>This is where the body goes</div>
  </Layout>
);
