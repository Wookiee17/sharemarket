import React, { useRef, useEffect } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/router";

// icon
import { FiArrowRight, FiBell, FiShare2, FiX } from "react-icons/fi";

// redux
import { useSelector } from "react-redux";

const VirtualCalendarModal = ({ close }) => {
  const router = useRouter();
  const theme = useSelector((state) => state.Common.theme);
  const { selectedCellData } = useSelector((state) => state.Calendar);

  const wrapperRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  return (
    <div className={`VirtualCalendarModal ${theme}`} ref={wrapperRef}>
      <div className="d-flex-end close">
        <FiX onClick={close} />
      </div>
      <div className="header">
        <h6>By {selectedCellData.subTitle}</h6>
        <h5>{selectedCellData.title}</h5>
      </div>
      <div className="body">
        <p>{selectedCellData.payload?.analyst?.biography}</p>
      </div>
      <div className="date">
        <p>
          {dayjs(selectedCellData?.payload?.created_at).format(
            "DD MMM YYYY hh:mm A"
          )}
        </p>
      </div>
      <div className="footer">
        <div className="left">
          <FiBell />
          <FiShare2 />
        </div>
        <div
          className="right"
          onClick={() =>
            router.push({
              pathname: "/webinar/all",
            })
          }
        >
          <span>SEE ALL WEBINARS</span>
          <FiArrowRight />
        </div>
      </div>
    </div>
  );
};

export default VirtualCalendarModal;
