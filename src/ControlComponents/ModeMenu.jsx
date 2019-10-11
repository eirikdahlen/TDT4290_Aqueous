import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './css/ModeMenu.css';
import NetfollowingLock from './NetfollowingLock';
import ModeEnum from '../constants/modeEnum';

const { remote } = window.require('electron');

const modeToString = {
  0: 'Manual',
  1: 'Dynamic Positioning',
  2: 'Net Following',
};

export default function ModeMenu({ globalMode, netfollowingAvailable }) {
  const [displayMenu, setDisplayMenu] = useState(false); //Dropdownmenu starts hidden
  const [currentMode, setCurrentMode] = useState(globalMode);
  const [netfollowingMenu, setNetfollowingMenu] = useState(false);

  function showMenu() {
    displayMenu ? setDisplayMenu(false) : setDisplayMenu(true); //Show menu if it's hidden, hide menu if it's visible
  }

  function updateMenu(mode) {
    if (mode === ModeEnum.NETFOLLOWING) {
      setNetfollowingMenu(true);
    } else if (
      currentMode === ModeEnum.NETFOLLOWING &&
      mode === ModeEnum.NETFOLLOWING
    ) {
      setNetfollowingMenu(true);
    } else {
      setNetfollowingMenu(false);
    }
    updateMode(mode);
  }

  function updateMode(mode) {
    switch (mode) {
      case ModeEnum.NETFOLLOWING:
        // The global state is set in NetfollowingLock.jsx file
        // Will turn off DP mode here
        break;
      case ModeEnum.DYNAMICPOSITIONING:
        /**
         * TODO: Implement activation of DP here and the related logic
         */
        remote.getGlobal('mode')['globalMode'] = ModeEnum.DYNAMICPOSITIONING;
        break;
      default:
        remote.getGlobal('mode')['globalMode'] = ModeEnum.MANUAL;
        break;
    }
    setCurrentMode(mode);
    showMenu();
  }

  return (
    <div className="ModeMenu">
      <div className="dropdownButton" onClick={showMenu}>
        Mode: {modeToString[currentMode]}
      </div>
      {displayMenu ? ( //If menu should be visible, show list of options
        <div className="dropdownList">
          <ul className="modeList">
            <li
              className="modeItem"
              onClick={() => updateMenu(ModeEnum.MANUAL)}
            >
              Manual
            </li>
            <li
              className="modeItem"
              onClick={() => updateMenu(ModeEnum.DYNAMICPOSITIONING)}
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
                  ? () => updateMenu(ModeEnum.NETFOLLOWING)
                  : null
              }
            >
              Net Following
            </li>
          </ul>
        </div>
      ) : null}
      {netfollowingMenu ? (
        <div className="netfollowingMenu">
          <NetfollowingLock
            title="Netfollowing Settings"
            globalMode={globalMode}
            step={0.1}
          />
        </div>
      ) : null}
    </div>
  );
}

ModeMenu.propTypes = {
  globalMode: PropTypes.number,
  netfollowingAvailable: PropTypes.bool,
};
