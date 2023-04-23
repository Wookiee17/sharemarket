import React, { useState } from "react";
import PropTypes from "prop-types";

// components
import Button from "../button/Button";

// redux
import { useSelector, useDispatch } from "react-redux";
import { addUserDefineTab } from "../../../store/common/CommonSlice";

// unique number generator
const uniqueNumber = (count) => {
  let defaultNumber = 4413277523420;
  let convertToArray = defaultNumber.toString().split("");
  let sliceNumber = convertToArray.slice(0, count);
  let randomNumber = Math.floor(Math.random() * +sliceNumber.join(""));

  if (randomNumber.toString().split("").length < count) {
    randomNumber = Math.abs(randomNumber - +sliceNumber.join(""));
  }

  return randomNumber;
};

const TopTabsModal = ({ close }) => {
  const theme = useSelector((state) => state.Common.theme);
  const dispatch = useDispatch();

  const [tabName, setTabName] = useState("User Defined");

  //
  const _addTab = () => {
    dispatch(
      addUserDefineTab({
        name: tabName,
        link: `${uniqueNumber(5)}`,
        userDefined: true,
      })
    );
    close();
  };

  return (
    <div className={`tab_add_modal ${theme}`}>
      <div className={`tab_add_modal-body ${theme}`}>
        <h5>Add New Tab Name</h5>
        <input
          placeholder="Add Tab Name"
          value={tabName}
          name="tab_name_input"
          onChange={(e) => {
            setTabName(e.target.value);
          }}
        />
        <div className="tab_add_modal-body_btnGrp">
          <Button type={"primary"} onClick={_addTab}>
            Add
          </Button>
          <Button onClick={close}>Close</Button>
        </div>
      </div>
    </div>
  );
};

TopTabsModal.prototype = {
  close: PropTypes.func,
};

export default TopTabsModal;
