import Webcam from 'react-webcam';
import React, { useState, useEffect } from 'react';
import './css/VideoFeed.css';
import PropTypes from 'prop-types';

export default function VideoFeed({ deviceId, hidden }) {
  const [dimensions, updateDimensions] = useState({ width: 0, height: 0 });

  const windowResized = () => {
    updateDimensions({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    windowResized();
    window.addEventListener('resize', e => {
      e.preventDefault();
      windowResized();
    });
    return () => {
      window.removeEventListener('resize', windowResized);
    };
  }, []);

  return (
    <div className={hidden ? 'hideVideoFeed' : 'VideoFeed'}>
      <Webcam
        videoConstraints={{ deviceId }}
        height={dimensions.height}
        width={dimensions.width}
      />
    </div>
  );
}

VideoFeed.propTypes = {
  hidden: PropTypes.bool,
  deviceId: PropTypes.string,
};
