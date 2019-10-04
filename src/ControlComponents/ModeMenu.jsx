import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './css/ModeMenu.css';

const { remote } = window.require('electron');

export default function ModeMenu({
  mode,
  netfollowingActive,
  netfollowingAvailable,
}) {
  const [displayMenu, setDisplayMenu] = useState(false); //Dropdownmenu starts hidden
  const [currentMode, setCurrentMode] = useState(mode);

  function showMenu() {
    displayMenu ? setDisplayMenu(false) : setDisplayMenu(true); //Show menu if it's hidden, hide menu if it's visible
  }

  function updateMode(mode) {
    console.log({ netfollowingAvailable });
    switch (mode) {
      case 'Net Following':
        remote.getGlobal('netfollowing')['netfollowingActive'] = true;
        break;
      case 'Dynamic Positioning':
        /**
         * TODO: Implement activation of DP here
         */
        break;
      default:
        break;
    }
    setCurrentMode(mode);
    showMenu();
  }

  return (
    <div className="ModeMenu">
      <div className="dropdownButton" onClick={showMenu}>
        Mode: {currentMode}
      </div>
      {displayMenu ? ( //If menu should be visible, show list of options
        <ul className="modeList">
          <li className="modeItem" onClick={() => updateMode('Manual')}>
            Manual
          </li>
          <li
            className="modeItem"
            onClick={() => updateMode('Dynamic Positioning')}
          >
            Dynamic Positioning
          </li>
          <li
            className="modeItem"
            style={{
              color: netfollowingAvailable ? 'black' : '#9e9e9e',
              cursor: netfollowingAvailable ? 'pointer' : 'not-allowed',
            }}
            onClick={
              netfollowingAvailable
                ? () => updateMode('Net Following')
                : () => console.log('Cannot activate NF at this point')
            }
          >
            Net Following
            {netfollowingActive}
          </li>
        </ul>
      ) : null}
    </div>
  );
}

ModeMenu.propTypes = {
  mode: PropTypes.string,
  netfollowingAvailable: PropTypes.bool,
  netfollowingActive: PropTypes.bool,
};
