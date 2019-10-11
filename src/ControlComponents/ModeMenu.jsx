import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './css/ModeMenu.css';
import NetfollowingLock from './NetfollowingLock';
import DynamicpositioningLock from './DynamicpositioningLock';
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
  const [dynamicpositioningMenu, setDynamicpositioningMenu] = useState(false);

  function showMenu() {
    displayMenu ? setDisplayMenu(false) : setDisplayMenu(true); //Show menu if it's hidden, hide menu if it's visible
  }

  function updateMenu(mode) {
    if (mode === ModeEnum.NETFOLLOWING) {
      setNetfollowingMenu(true);
      setDynamicpositioningMenu(false);
    } else if (
      currentMode === ModeEnum.NETFOLLOWING &&
      mode === ModeEnum.NETFOLLOWING
    ) {
      setNetfollowingMenu(true);
      setDynamicpositioningMenu(false);
    } else if (mode === ModeEnum.DYNAMICPOSITIONING) {
      setDynamicpositioningMenu(true);
      setNetfollowingMenu(false);
    } else if (
      currentMode === ModeEnum.DYNAMICPOSITIONING &&
      mode === ModeEnum.DYNAMICPOSITIONING
    ) {
      setDynamicpositioningMenu(true);
      setNetfollowingMenu(false);
    } else {
      setNetfollowingMenu(false);
      setDynamicpositioningMenu(false);
    }
    updateMode(mode);
  }

  function updateMode(mode) {
    switch (mode) {
      case ModeEnum.NETFOLLOWING:
        // Changing from eg. DP to NF will result in mode=Manual until the switch is changed
        remote.getGlobal('mode')['globalMode'] = ModeEnum.MANUAL;
        break;
      case ModeEnum.DYNAMICPOSITIONING:
        // Changing from eg. NF to DP will result in mode=Manual until the switch is changed
        remote.getGlobal('mode')['globalMode'] = ModeEnum.MANUAL;
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
      {dynamicpositioningMenu ? (
        // uses the same .css as netfollowing for now, change later if supposed to be different
        <div className="netfollowingMenu">
          <DynamicpositioningLock
            title="Dynamic Positioning Settings"
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
