import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MenuButton from './MenuButton';
import VideoPicker from './VideoPicker';
import './css/VideoMenu.css';

const { remote } = window.require('electron');
const w = remote.getCurrentWindow();

export default function VideoMenu({
  toggleTransparent,
  transparent,
  deviceId,
  setDeviceId,
}) {
  const [maximized, toggleMaximized] = useState(w.isMaximized());

  useEffect(() => {
    w.on('maximize', () => {
      toggleMaximized(true);
    });
    w.on('unmaximize', () => {
      toggleMaximized(false);
    });
  }, []);

  const closeWindow = () => {
    w.close();
  };

  const resizeWindow = () => {
    maximized ? w.unmaximize() : w.maximize();
    toggleMaximized(!maximized);
  };

  const minimizeWindow = () => {
    w.minimize();
  };

  return (
    <div className={'VideoMenu ' + (maximized ? 'maximizedVideoMenu' : '')}>
      <MenuButton
        clickFunction={() => toggleTransparent(!transparent)}
        image="transparent"
        additionalClass="transparentBtn"
      />
      <VideoPicker
        deviceId={deviceId}
        handleClick={id => setDeviceId(id)}
        hidden={transparent}
      />
      <MenuButton
        clickFunction={() => {
          minimizeWindow();
        }}
        image="minimize"
        additionalClass="minimizeBtn"
      ></MenuButton>
      <MenuButton
        clickFunction={() => {
          resizeWindow();
        }}
        image={maximized ? 'unMaximize' : 'maximize'}
        additionalClass="maximizeBtn"
      ></MenuButton>
      <MenuButton
        clickFunction={() => {
          closeWindow();
        }}
        image="close"
        additionalClass="closeBtn"
      ></MenuButton>
    </div>
  );
}

VideoMenu.propTypes = {
  transparent: PropTypes.bool,
  toggleTransparent: PropTypes.func,
  deviceId: PropTypes.string,
  setDeviceId: PropTypes.func,
};
