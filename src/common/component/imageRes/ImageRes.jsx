import React, { Fragment } from "react";
import Image, { StaticImageData } from "next/image";
import PropTypes from "prop-types";

const ImageRes = ({ imgSrc, alt, width, height }) => {
  return (
    <div className="ImageRes-container">
      <img
        src={imgSrc}
        alt={`${alt}`}
        className="ImageRes-container-img"
        width={width <= 0 ? "100%" : width}
        height={height <= 0 ? "100%" : height}
      />
    </div>
  );
};

ImageRes.propTypes = {
  imgSrc: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default ImageRes;
