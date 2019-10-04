import React from 'react';
import PropTypes from 'prop-types';
import './css/ModeMenu.css';

export default function ModeMenu(props) {
  const [displayMenu, setDisplayMenu] = React.useState(false); //Dropdownmenu starts hidden
  const [currentMode, setCurrentMode] = React.useState(props.mode);

  function showMenu() {
    displayMenu ? setDisplayMenu(false) : setDisplayMenu(true); //Show menu if it's hidden, hide menu if it's visible
  }

  function updateMode(mode) {
    switch (mode) {
      case 'Net Following':
        break;
      case 'Dynamic Positioning':
        break;
      case 'Manual':
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
              color: props.netfollowingAvailable ? 'black' : '#9e9e9e',
              cursor: props.netfollowingAvailable ? 'pointer' : 'not-allowed',
            }}
            onClick={
              props.netfollowingAvailable
                ? () => updateMode('Net Following')
                : () => console.log('Cannot activate NF at this point')
            }
          >
            Net Following
          </li>
        </ul>
      ) : null}
    </div>
  );
}

ModeMenu.propTypes = {
  mode: PropTypes.string,
  netfollowingAvailable: PropTypes.bool,
};
