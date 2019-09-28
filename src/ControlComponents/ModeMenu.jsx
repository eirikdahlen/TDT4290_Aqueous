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

  return (
    <div className="modeMenu">
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
          <li className="modeItem" onClick={() => updateMode('Net Following')}>
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
