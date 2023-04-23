import React from "react";
import moment from "moment/moment";
// component
import ImageRes from "../imageRes/ImageRes";
// icons
import {
  AiOutlineHistory
} from "react-icons/ai";

const WebinarListingCard = ({ 
  webinar, 
  onClick 
}) => {
  return (
    <div 
      className="item" 
      onClick={onClick}
    >
      <div className="item-bg">
        <ImageRes imgSrc={webinar.thumbnail} />
      </div>
      <div className="item-overlay">
        {/* <div className="item-overlay-revision">
          <AiOutlineHistory />
          <span>19</span>
        </div> */}
        <div className="item-overlay-pp">
          <ImageRes imgSrc={webinar.analyst?.image_url} />
        </div>
        <div className="item-overlay-title">{webinar.title}</div>
        <div className="item-overlay-sub">by {webinar.analyst?.name}, {webinar.analyst?.position}</div>
        <div className="item-overlay-date">{moment(webinar.host_at).format("DD MMM YYYY")}</div>
        <div className="item-overlay-bottom">
          <div className="item-overlay-bottom_left">
            <ImageRes imgSrc={"/images/playbtn.png"} />
          </div>
          <div className="item-overlay-bottom_right">
            <div className="item-overlay-bottom_right-duration">
              Duration: {(webinar.duration / 60).toFixed(2)} min
            </div>
            {webinar.analyst?.external && (
              <div className="item-overlay-bottom_right-tag">
                <div className="item-overlay-bottom_right-tag-img">
                  <ImageRes imgSrc={"/images/tag.png"} />
                </div>
                <p>Guest</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default WebinarListingCard