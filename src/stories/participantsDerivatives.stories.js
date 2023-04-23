import ParticipantsDerivatives from "../common/component/participants/derivatives/ParticipantsDerivatives";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Participants/Participants Derivatives",
  component: ParticipantsDerivatives,
};

const Template = (args) => <ParticipantsDerivatives {...args} />;

export const Default = {
  args: {},
};
