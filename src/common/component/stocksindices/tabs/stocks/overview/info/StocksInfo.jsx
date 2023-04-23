import React from "react";
import { useRouter } from "next/router";

// icons
import { AiOutlineFolderAdd } from "react-icons/ai";

// redux
import { useSelector, useDispatch } from "react-redux";

const StocksInfo = () => {
  const theme = useSelector((state) => state.Common.theme);

  return (
    <div className="info">
      <div className="section ">
        <div className="header">
          <span>RELIANCE BROADBAND NETWORK LTD.</span>
          <AiOutlineFolderAdd />
        </div>
        <div className="body">
          <p>
            Reliance Broadcast Network, earlier known as Reliance Media World is
            an India-based company. The company operates a radio station Big
            92.7 frequency modulation (FM). It runs 45 radio stations. In
            Auguest 2009, the company was demerged from Reliance MediaWorks.
            Reliance Media World was originally incorporated as Reliance Unicom
            on December 27, 2005 under the Companies Act, 1956 with CIN
            U64200MH200PLC158355.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StocksInfo;
