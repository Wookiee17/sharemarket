import React, { useState } from "react";

// icons
import { BsPinAngle } from "react-icons/bs";

// component
import ParticipantsDerivativesChart from "./ParticipantsDerivativesChart";
import ParticipantsDerivativesTable from "./ParticipantsDerivativesTable";
import TabSection from "../../tabSections/TabSections";

// redux
import { useSelector } from "react-redux";

const ParticipantsDerivatives = ({ date }) => {
  const theme = useSelector((state) => state.Common.theme);

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDate, setSelectedDate] = useState();
  return (
    <TabSection headerLable={"DERIVATIVES"}>
      <div className="Participatns_section2">
        <div className="Participatns_section2_left">
          <ParticipantsDerivativesTable
            date={date}
            setSelectedOption={setSelectedOption}
            selectedOption={selectedOption}
            setSelectedDate={setSelectedDate}
          />
        </div>
        <div className="Participatns_section2_right">
          <div className="Participatns_section2_right-head">
            <p>{selectedOption?.replace("_", " ")?.toUpperCase()}</p>
            <div className="bt">
              <BsPinAngle />
            </div>
          </div>
          <ParticipantsDerivativesChart
            selectedOption={selectedOption}
            date={date}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </TabSection>
  );
};

export default ParticipantsDerivatives;
