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
    setCurrentMode(mode);
    showMenu();
  }

  // update mode globally & with setCurrentMode for this file
  function setMode_onClick(mode) {
    updateMode(mode)
    global.mode = {
      name: mode,
    }
  }


  return (
    <div className="ModeMenu">
      <div className="dropdownButton" onClick={showMenu}>
        Mode: {currentMode}
      </div>
      {displayMenu ? ( //If menu should be visible, show list of options
        <ul className="modeList">
          <li className="modeItem" onClick={() => setMode_onClick('Manual')}>
            Manual
          </li>
          <li
            className="modeItem"
            onClick={() => setMode_onClick('Dynamic Positioning')}
          >
            Dynamic Positioning
          </li>
          <li className="modeItem" onClick={() => setMode_onClick('Net Following')}>
            Net Following
          </li>
        </ul>
      ) : null}
    </div>
  );
}

ModeMenu.propTypes = {
  mode: PropTypes.string,
};
