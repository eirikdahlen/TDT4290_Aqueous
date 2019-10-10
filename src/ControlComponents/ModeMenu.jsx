import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './css/ModeMenu.css';
import NetfollowingLock from './NetfollowingLock';

const { remote } = window.require('electron');

export default function ModeMenu({
  mode,
  netfollowingActive,
  netfollowingAvailable,
}) {
  const [displayMenu, setDisplayMenu] = useState(false); //Dropdownmenu starts hidden
  const [currentMode, setCurrentMode] = useState(mode);
  const [netfollowingMenu, setNetfollowingMenu] = useState(false);

  function showMenu() {
    displayMenu ? setDisplayMenu(false) : setDisplayMenu(true); //Show menu if it's hidden, hide menu if it's visible
  }

  function updateMenu(mode) {
    if (mode === 'Net Following') {
      setNetfollowingMenu(true);
    } else if (currentMode === 'Net Following' && mode === 'Net Following') {
      setNetfollowingMenu(true);
    } else {
      setNetfollowingMenu(false);
    }
    updateMode(mode);
  }

  function updateMode(mode) {
    console.log(currentMode);
    switch (mode) {
      case 'Net Following':
        // The global state is set in NetfollowingLock.jsx file
        break;
      case 'Dynamic Positioning':
        /**
         * TODO: Implement activation of DP here and the related logic
         */
        if (currentMode === 'Net Following') {
          remote.getGlobal('netfollowing')['active'] = false;
        }
        break;
      default:
        if (currentMode === 'Net Following') {
          remote.getGlobal('netfollowing')['active'] = false;
        }
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
          <li className="modeItem" onClick={() => updateMenu('Manual')}>
            Manual
          </li>
          <li
            className="modeItem"
            onClick={() => updateMenu('Dynamic Positioning')}
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
              netfollowingAvailable ? () => updateMenu('Net Following') : null
            }
          >
            Net Following
            {netfollowingActive}
          </li>
        </ul>
      ) : null}
      {netfollowingMenu ? (
        <div className="netfollowingMenu">
          <NetfollowingLock
            title="Netfollowing Settings"
            active={netfollowingActive}
            step={0.1}
          />
        </div>
      ) : null}
    </div>
  );
}

ModeMenu.propTypes = {
  mode: PropTypes.string,
  netfollowingAvailable: PropTypes.bool,
  netfollowingActive: PropTypes.bool,
};
