import ImageRes from "../common/component/imageRes/ImageRes";
// styles
import "antd/dist/antd.css";
import "../common/assets/styles/main.scss";

export default {
  title: "Components/imageRes",
  component: ImageRes,
  parameters: {
    layout: "fullscreen",
  },
};

const Template = (args) => <ImageRes {...args} />;

export const Default = {
  args: {
    alt: "Logo",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png",
    width: 100,
    height: 100,
  },
};
