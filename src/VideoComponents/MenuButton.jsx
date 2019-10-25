import React from 'react';
import './css/MenuButton.css';
import transparentImg from './images/transparent.png';
import closeImg from './images/close.png';
import maximizeImg from './images/maximize.png';
import unMaximizeImg from './images/unMaximize.png';
import minimizeImg from './images/minimize.png';
import PropTypes from 'prop-types';

export default function MenuButton({ clickFunction, image, additionalClass }) {
  const imgMapping = {
    transparent: transparentImg,
    close: closeImg,
    maximize: maximizeImg,
    minimize: minimizeImg,
    unMaximize: unMaximizeImg,
  };
  const icon = {
    backgroundImage: `url(${imgMapping[image]})`,
  };
  return (
    <button
      style={icon}
      onClick={clickFunction}
      className={
        additionalClass ? `MenuButton ${additionalClass}` : 'MenuButton'
      }
    ></button>
  );
}

MenuButton.propTypes = {
  clickFunction: PropTypes.func,
  image: PropTypes.string,
  additionalClass: PropTypes.string,
};
