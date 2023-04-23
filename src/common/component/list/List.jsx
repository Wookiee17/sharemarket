import React, { useState } from "react";
import { AiOutlineRight, AiOutlineFolderAdd } from "react-icons/ai";
import moment from "moment/moment";

const List = ({newsDate, isOpen}) => {
  const [open, setOpen] = useState(isOpen);
  const [news, setNews] = useState([])
  // const arr = [
  //   {
  //     name: "Shree",
  //     news: "Shree Cement: CRISIL has reaffirmed the rating for Long Term Fund-based Facilities of Rs 1,100 crore at CRISIL AAA/STABLE and Short Term Non-Fund based limit of Rs 1,200 crore at CRISIL A1",
  //     time: "3:00pm",
  //   },
  //   {
  //     name: "Shree",
  //     news: "Shree Cement: CRISIL has reaffirmed the rating for Long Term Fund-based Facilities of Rs 1,100 crore at CRISIL AAA/STABLE and Short Term Non-Fund based limit of Rs 1,200 crore at CRISIL A1",
  //     time: "3:00pm",
  //   },
  //   {
  //     name: "Shree",
  //     news: "Shree Cement: CRISIL has reaffirmed the rating for Long Term Fund-based Facilities of Rs 1,100 crore at CRISIL AAA/STABLE and Short Term Non-Fund based limit of Rs 1,200 crore at CRISIL A1",
  //     time: "3:00pm",
  //   },
  // ];
  return (
    <div className="list-box">
      <header className="header" onClick={() => setOpen((prev) => !prev)}>
        <div className={`icon ${open && "down"}`}>
          <AiOutlineRight />
        </div>
        <p>{newsDate}</p>
      </header>
      {open && (
        <main className={`list ${open && "an-down"}`}>
          <ul>
            {news?.map((item, i) => (
              <li key={i}>
                <div className={`icon`}>
                  <AiOutlineFolderAdd style={{ fontSize: "1.2rem" }} />
                </div>
                <div className="list">
                  {/* {item?.company_code} */}
                  {item?.headlines}
                  <span>{moment(item?.news_date).format("HH:mm A")}</span>
                </div>
              </li>
            ))}
          </ul>
        </main>
      )}
    </div>
  );
};

export default List;
