import React, { useState } from "react";
import PropTypes from "prop-types";

// redux
import { useSelector } from "react-redux";

// component
import Search from "../../search/Search";

// apollo
import { useQuery } from "@apollo/client";
import { GET_VIDEO } from "../../../../gql/queries";

const DemoVideo = () => {
  const theme = useSelector((state) => state.Common.theme);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filterSearch, setFilterSearch] = useState("");

  const { data: video, loading: videoLoading } = useQuery(GET_VIDEO, {
    variables: {
      where: { title: { _ilike: `%${filterSearch}%` } },
    },
    onCompleted: (data) => {
      // table?.map((datas) =>{
      // })
      setSelectedVideo(data.indiacharts_video_resources[0]);
    },
  });

  const renderList = (dat) => (
    <div
      className="demoVideo-left_inner-item"
      onClick={() => {
        setSelectedVideo(dat);
      }}
    >
      <iframe
        width="100%"
        height="100%"
        src={dat?.link}
        title={dat?.title}
        frameBorder="0"
      ></iframe>
      <div className="demoVideo-left_inner-item-overlay">
        <div className="demoVideo-left_inner-item-overlay-title">
          <h5>{dat?.title}</h5>
          <h6>last Upload: 26 SEP 2022 3:13 PM</h6>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`demoVideo ${theme}`}>
      <div className="demoVideo-left">
        <div className="demoVideo-left_search">
          <Search
            placeholderText="Enter keyword"
            onChange={(v) => setFilterSearch(v.target.value)}
            onClick={() => null}
          />
        </div>
        <div className="demoVideo-left_inner">
          {video?.indiacharts_video_resources?.map((dat, i) => (
            <React.Fragment key={i}>{renderList(dat)}</React.Fragment>
          ))}
        </div>
      </div>
      <div className="demoVideo-right">
        <div className="videoPlayer">
          <iframe
            src={selectedVideo?.link}
            title={selectedVideo?.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write;encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            width="100%"
            height="100%"
          />
        </div>
        <div className="description">
          <p>description:</p>
          <p>{selectedVideo?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default DemoVideo;
