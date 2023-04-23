import Button from "../common/component/button/Button";
// styles
import "../common/assets/styles/main.scss";

// icon
import { FiArrowDown } from "react-icons/fi";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: { onClick: { action: "Clicked" } },
};

const template = (args) => <Button {...args} />;

export const Default = {
  args: {
    children: <>Default Button</>,
  },
};

// disabled
export const Disabled = {
  args: {
    children: <>Disabled Button</>,
    disabled: true,
  },
};

// rounded
export const Rounded = {
  args: {
    children: <>Rounded Button</>,
    rounded: true,
  },
};

// outlined
export const Outlined = {
  args: {
    children: <>Outlined Button</>,
    outlined: true,
  },
};

// sizes
// --sm --md --lg
export const Small = {
  args: {
    children: <>Small Button</>,
    size: "sm",
  },
};
export const Medium = {
  args: {
    children: <>Medium Button</>,
    size: "md",
  },
};
export const Large = {
  args: {
    children: <>Large Button</>,
    size: "lg",
  },
};

// types
// --primary --secondary
export const Primary = {
  args: {
    children: <>Primary Button</>,
    type: "primary",
  },
};
export const PrimaryOutlined = {
  args: {
    children: <>Primary Button</>,
    type: "primary",
    outlined: true,
  },
};
export const PrimaryOutlinedRounded = {
  args: {
    children: <>Primary Button</>,
    type: "primary",
    rounded: true,
    outlined: true,
  },
};

export const Secondary = {
  args: {
    children: <>Secondary Button</>,
    type: "secondary",
  },
};
export const SecondaryOutlined = {
  args: {
    children: <>Secondary Button</>,
    type: "secondary",
    outlined: true,
  },
};
export const SecondaryOutlinedRounded = {
  args: {
    children: <>Secondary Button</>,
    type: "secondary",
    rounded: true,
    outlined: true,
  },
};

// with Icon and Text
export const WithIcon = {
  args: {
    children: (
      <>
        <FiArrowDown style={{ marginRight: 5, marginTop: -2 }} /> Primary Button
      </>
    ),
    type: "primary",
  },
};
export const WithIconOutlined = {
  args: {
    children: (
      <>
        <FiArrowDown style={{ marginRight: 5, marginTop: -2 }} /> Primary Button
      </>
    ),
    type: "primary",
    outlined: true,
  },
};
export const WithIconOutlinedRounded = {
  args: {
    children: (
      <>
        <FiArrowDown style={{ marginRight: 5, marginTop: -2 }} /> Primary Button
      </>
    ),
    type: "primary",
    rounded: true,
    outlined: true,
  },
};

// Only Icon and Text
export const OnlyIcon = {
  args: {
    children: (
      <>
        <FiArrowDown />
      </>
    ),
    type: "primary",
  },
};
export const OnlyIconOutlined = {
  args: {
    children: (
      <>
        <FiArrowDown />
      </>
    ),
    type: "primary",
    outlined: true,
  },
};
export const OnlyIconOutlinedRounded = {
  args: {
    children: (
      <>
        <FiArrowDown />
      </>
    ),
    type: "primary",
    rounded: true,
    outlined: true,
  },
};
