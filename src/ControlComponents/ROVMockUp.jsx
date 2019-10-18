import React /*, { useState } */ from 'react';

export default function ROVMockUp() {
  //const [mode, setMode] = useState([]);

  function changeView(mode) {
    return;
  }

  /**
   * Liste med alle felter som skal settes
   * Vise både hva man får og hva man sender
   * Starte en funksjon som starter hele serveren
   * Slå av og på flagg med NF-avail osv
   * Tvinge GUI til å være i manual mode
   * I Manual:
   *    Tar inn input fra UI og setter alle variabler i estimatedStates
   * I NF:
   *    Forandre degree, distance og velocity
   *
   *
   */

  return (
    <div className="mockupBox" style={{ backgroundColor: 'white' }}>
      <div className="modeInput">
        <input placeholder="Mode"></input>
      </div>
    </div>
  );
}
