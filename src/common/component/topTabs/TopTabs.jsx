import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

// Icons
import { FiPlus } from "react-icons/fi";

// components
import Button from "../button/Button";

// parts
import TopTabsItem from "./TopTabsItem";
import TopTabsModal from "./TopTabsModal";

// redux
import { useSelector } from "react-redux";

const TopTabs = () => {
  const theme = useSelector((state) => state.Common.theme);
  const tabs = useSelector((state) => state.Common.GlobalTabs);
  const router = useRouter();
  const { tabname } = router.query;
  const [modal, setModal] = useState(false);

  // Modal Toggle
  const _toggleModal = () => {
    setModal(!modal);
  };

  return (
    <div className="TopTabs">
      <div className={`tabs ${theme}`}>
        {tabs.map((item, i) => (
          <React.Fragment key={i}>
            <TopTabsItem
              key={i}
              item={item}
              // link={_checkLink(item.link, tabs.length)}
              active={
                router.pathname.includes(item.link) || tabname == item.link
              }
              indexId={i}
            />
          </React.Fragment>
        ))}
        <Button type={"primary"} onClick={_toggleModal}>
          <FiPlus />
        </Button>
      </div>
      {modal && (
        <TopTabsModal
          close={() => {
            setModal(false);
          }}
        />
      )}
    </div>
  );
};

TopTabs.prototype = {
  tabs: PropTypes.array,
  activeTab: PropTypes.number,
  modal: PropTypes.bool,
};

export default TopTabs;
