// The App for the ControlWindow. This is where every control-components should go.

import React from "react";
import Values from "./ControlComponents/js/Values"
import Map from "./ControlComponents/js/Map"
import RollPitch from "./ControlComponents/js/RollPitch"
import ModeMenu from "./ControlComponents/js/ModeMenu"
import ControlBox from "./ControlComponents/js/ControlBox"
import Status from "./ControlComponents/js/Status"

import "./ControlComponents/css/control.css"

function ControlApp(props) {

  const dummyValues = [2.11, 1.12, 20.89, 0.01, 0.00, 234.59]

  return (
    <div className="ControlApp">
      <div className="topWindows">
        <Map/>
        <RollPitch/>
        <Status/>
      </div>
      <div className="controlFlex">
        <ModeMenu mode="Manual"/>   {/*Start in mode Manual*/}
        <div className="autoFlex">
          <ControlBox name="AD"/>
          <ControlBox name="AH"/>
        </div>
      </div>
      <Values values={dummyValues}/> {/*Should be values={props.values} where props.values is passed from ViewManager?*/}
    </div>
  );
}

export default ControlApp;
