import React from 'react';
import PropTypes from 'prop-types';
import MenuButton from './MenuButton';
import VideoPicker from './VideoPicker';
import './css/VideoMenu.css';

const { remote } = window.require('electron');

export default function VideoMenu({
  toggleTransparent,
  transparent,
  deviceId,
  setDeviceId,
}) {
  const closeVideoWindow = () => {
    let w = remote.getCurrentWindow();
    w.close();
  };

  const maximizeVideoWindow = () => {
    let w = remote.getCurrentWindow();
    w.maximize();
  };

  const minimizeVideoWindow = () => {
    let w = remote.getCurrentWindow();
    w.minimize();
  };

  return (
    <div className="videoMenu">
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
          minimizeVideoWindow();
        }}
        image="minimize"
        additionalClass="minimizeBtn"
      ></MenuButton>
      <MenuButton
        clickFunction={() => {
          maximizeVideoWindow();
        }}
        image="maximize"
        additionalClass="maximizeBtn"
      ></MenuButton>
      <MenuButton
        clickFunction={() => {
          closeVideoWindow();
        }}
        image="close"
        additionalClass="closeBtn"
      ></MenuButton>
    </div>
  );
}

MenuButton.propTypes = {
  transparent: PropTypes.bool,
  toggleTransparent: PropTypes.func,
  deviceId: PropTypes.string,
  setDeviceId: PropTypes.func,
};
