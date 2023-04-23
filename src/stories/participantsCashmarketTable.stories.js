import ParticipantsCashMarketTable from "../common/component/participants/cashmarket/ParticipantsCashMarketTable";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Participants/Participants Cash Market Table",
  component: ParticipantsCashMarketTable,
};

const Template = (args) => <ParticipantsCashMarketTable {...args} />;

export const Default = {
  args: {},
};
