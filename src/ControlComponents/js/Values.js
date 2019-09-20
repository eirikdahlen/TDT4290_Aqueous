import React from "react";
import ValueBox from "./ValueBox"

export default function Values(props){

    const titles = ["North","East","Down","Roll","Pitch","Yaw"];

    return(
        <div className="valuesFlex">
            <div className="values">
                {titles.map((t,i) => ( //For each title and its index
                    <ValueBox title={t} value={props.values[i]}/> //Pass title and corresponding value (coming from Control.js) to ValueBox
                ))}
            </div>
        </div>
    )
}