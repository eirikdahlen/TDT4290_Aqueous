import React from 'react';
import './css/MenuButton.css';
import transparentImg from './images/transparent.png';
import closeImg from './images/close.png';
import PropTypes from 'prop-types';

export default function MenuButton({ clickFunction, image, additionalClass }) {
  const imgMapping = {
    transparent: transparentImg,
    close: closeImg,
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
