import ScannersTreeItem from "../common/component/scanners/scannersTree/ScannersTreeItem";
// styles
import "../common/assets/styles/main.scss";
// icons
import { FiPlus } from "react-icons/fi";

export default {
  title: "Scanners/Scanners Tree Item",
  component: ScannersTreeItem,
};

const Template = (args) => <ScannersTreeItem {...args} />;

export const Default = {
  args: {
    title: "Level 1",
    options: [
      {
        title: "Level 2.1",
      },
      {
        title: "Level 2.2",
      },
    ],
  },
};

export const WithButton = {
  args: {
    title: "Level 1",
    options: [
      {
        title: "Level 2.1",
      },
      {
        title: "Level 2.2",
      },
    ],
    btnFunc: () => {
      // console.log("Clicked Scanner");
    },
    icon: <FiPlus />,
  },
};

export const WithBadge = {
  args: {
    title: "Level 1",
    options: [
      {
        title: "Level 2.1",
      },
      {
        title: "Level 2.2",
      },
    ],
    badge: "Pro",
  },
};
