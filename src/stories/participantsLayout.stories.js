import ParticipatnsLayout from "../containers/participatns/participatnsLayout/ParticipatnsLayout";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Participants/Participatns Layout",
  component: ParticipatnsLayout,
};

const Template = (args) => <ParticipatnsLayout {...args} />;

export const Default = {
  args: {},
};
