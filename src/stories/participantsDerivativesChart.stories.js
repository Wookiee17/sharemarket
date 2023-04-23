import ParticipantsDerivativesChart from "../common/component/participants/derivatives/ParticipantsDerivativesChart";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Participants/Participants Derivatives Chart",
  component: ParticipantsDerivativesChart,
};

const Template = (args) => <ParticipantsDerivativesChart {...args} />;

export const Default = {
  args: {},
};
