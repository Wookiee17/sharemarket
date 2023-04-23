import ParticipantsCashMarket from "../common/component/participants/cashmarket/ParticipantsCashMarket";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Participants/Participants Cash Market",
  component: ParticipantsCashMarket,
};

const Template = (args) => <ParticipantsCashMarket {...args} />;

export const Default = {
  args: {
    name: 'FII'
  },
};
