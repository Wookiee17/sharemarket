import Footer from "../common/layouts/footer/Footer";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Layouts/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = () => <Footer />;
