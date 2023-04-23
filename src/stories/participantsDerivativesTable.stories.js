import ParticipantsDerivativesTableTable from "../common/component/participants/derivatives/ParticipantsDerivativesTable";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Participants/Participants Derivatives Table",
  component: ParticipantsDerivativesTableTable,
};

const Template = (args) => <ParticipantsDerivativesTableTable {...args} />;

export const Default = {
  args: {},
};
