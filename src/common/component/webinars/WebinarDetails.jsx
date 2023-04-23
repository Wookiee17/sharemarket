import React, { useState } from "react";
import moment from "moment/moment";
import { Player } from "video-react";

// assets
import Tag from "../../../common/assets/images/tag.png";

// icons
import { AiFillCrown } from "react-icons/ai";
import { BsFillPlayBtnFill } from "react-icons/bs";

// component
import ImageRes from "../imageRes/ImageRes";
import { useEffect } from "react";

const TagComponent = ({ title }) => {
  return (
    <div className="tag">
      <div className="tag-img">
        <ImageRes imgSrc={Tag.src} />
      </div>
      <p>{title}</p>
    </div>
  );
};
const WebinarDetails = ({ webinar }) => {
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  useEffect(() => {
    setShowVideoPlayer(false);
  }, [webinar]);
  return (
    <div className="webinar-right">
      {!showVideoPlayer ? (
        <div className="videoPlayer">
          <div className="videoPlayer-bg">
            <ImageRes imgSrc={webinar.thumbnail} />
          </div>
          <div className="videoPlayer-overlay">
            <div className="playbtn" onClick={() => setShowVideoPlayer(true)}>
              <BsFillPlayBtnFill />
            </div>
            <div className="detailDescription">
              <div className="pp">
                <ImageRes imgSrc={webinar.analyst?.image_url} />
              </div>
              <div className="details">
                <div className="subText">
                  SUBSCRIBE <span>PRO</span> NOW TO LISTEN TO THE KEY FACTS OF
                  STOCK MARKETS TODAY!!!
                </div>
                <div className="joinText">join {webinar.presenter} on</div>
                <div className="header">
                  <div className="headerText">{webinar.title}</div>
                  {webinar.analyst?.external && (
                    <TagComponent title={"Guest"} />
                  )}
                  {moment(webinar.host_at).isAfter() && (
                    <TagComponent title={"Upcoming"} />
                  )}
                </div>
                <div className="detailsBottom">
                  <div className="date">
                    {moment(webinar.host_at).format("DD MMM YYYY")}
                  </div>
                  <div className="duration">
                    Duration: {(webinar.duration / 60).toFixed(2)} min
                  </div>
                </div>
              </div>
            </div>
            <div className="subscription">
              <div className="left">NEED A HELPING HAND?</div>
              <div className="right">
                <span> SUBSCRIBE mENTORSHIP PROGRAM </span>
                <AiFillCrown />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {webinar.link_source === "Youtube" ? (
            <iframe
              width="100%"
              height="80%"
              src={webinar.link}
              title={webinar?.title}
              allow="autoplay"
            ></iframe>
          ) : (
            <video
              controls
              autoPlay
              style={{
                width: "100%",
                height: "80%",
              }}
            >
              <source src={webinar.link} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </>
      )}
      <div className="description">
        <h4>{webinar.presenter}</h4>
        <p>
          {webinar.analyst?.position} - {webinar.analyst?.organisation}
        </p>
        <p>{webinar.analyst?.biography}</p>
        {/* <div className="social">
						<div className="social-item">
							<AiFillLinkedin />
						</div>
						<div className="social-item">
							<AiFillMail />
						</div>
						<div className="social-item">
							<AiFillFacebook />
						</div>
						<div className="social-item">
							<AiFillTwitterCircle />
						</div>
					</div> */}
      </div>
    </div>
  );
};
export default WebinarDetails;
