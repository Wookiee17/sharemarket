import React, { useState, useEffect } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { FiShare2 } from "react-icons/fi";
import img from "../../../../../../assets/images/logo.png";
import Image from "next/image";
import moment from "moment/moment";
// import ReactMarkdown from "react-markdown";
import { Markup } from "react-render-markup";

//redux
import { useSelector } from "react-redux";

const Sider = () => {
  const [active, setActive] = useState(false);

  const { selectedNews, selectedAnnouncement, activeInfoTab } = useSelector(
    (state) => state.StockIndices
  );

  useEffect(() => {
    if (selectedNews !== null || selectedAnnouncement !== null) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [selectedNews, selectedAnnouncement]);

  return (
    <div className={`sider ${active && "active"}`}>
      <div className="content">
        <div className="heading">
          <div className="left">
            <Image src={img} alt="Company Logo" width={100} height={50} />
          </div>
          <div className="right">
            {activeInfoTab === 0
              ? selectedNews?.company?.name
              : selectedAnnouncement?.company?.name}
          </div>
          <div className="icon">
            <FiShare2 />
          </div>
        </div>
        <div className={`main ${"active"}`}>
          <div className="time-stamp">
            {" "}
            {activeInfoTab === 0
              ? moment(selectedNews?.news_date).format(
                "ddd DD MMM YYYY HH:mm A"
              )
              : moment(selectedAnnouncement?.news_date).format(
                "ddd DD MMM YYYY HH:mm A"
              )}
          </div>
          <p>
            {/* <Markup
              markup={
                activeInfoTab === 0
                  ? selectedNews?.content
                  : selectedAnnouncement?.content
              }
            /> */}
            {/* {activeInfoTab === 0 ? selectedNews?.content : selectedAnnouncement?.content?.split(/\\r\\n/).map(line => <React.Fragment key={line}>{line}<br/></React.Fragment>)} */}
            {`${activeInfoTab === 0 ? selectedNews?.content : selectedAnnouncement?.content}`.split(/\\r\\n/).map((line) => (
              <React.Fragment key={line}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
      <div
        className={`arrow ${active && "active"}`}
        onClick={() => setActive((prev) => !prev)}
      >
        <AiOutlineRight />
      </div>
    </div>
  );
};

export default Sider;
