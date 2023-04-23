import React from "react";

// redux
import { useSelector } from "react-redux";

// component
import TabSection from "../../../common/component/tabSections/TabSections";
import DiffusionIndicatorsSidebar from "../../../common/component/diffusionIndicators/diffusionIndicatorsSidebar/DiffusionIndicatorsSidebar";
import DiffusionIndicatorsBody from "../../../common/component/diffusionIndicators/diffusionIndicatorsBody/DiffusionIndicatorsBody";

const DiffusionIndicatorsLayout = () => {
  const theme = useSelector((state) => state.Common.theme);
  return (
    <TabSection headerLable={`Diffusion Indicators`}>
      <div className={`${theme} DiffusionIndicators`}>
        <DiffusionIndicatorsSidebar />
        <DiffusionIndicatorsBody />
      </div>
    </TabSection>
  );
};

export default DiffusionIndicatorsLayout;
