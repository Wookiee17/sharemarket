import DropDownCheckBox from "../common/component/dropDownCheckBox/dropDownCheckBox";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Components/Check Drop Down",
  component: DropDownCheckBox,
};

const Template = (args) => <DropDownCheckBox {...args} />;

export const Default = {
  args: {
    lable: "Basket",
    options: [
      "All",
      "0 -500cr",
      "500-2500cr",
      "2500-10K cr",
      "10K -25K cr",
      "25K cr. & Above",
    ],
  },
};
