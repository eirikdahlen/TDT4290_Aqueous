import React from 'react';
import Lock from './Lock';
import Title from './Title';
import './css/ManualMode.css';

export default function ManualMode({ title, toROV }) {
  return (
    <div className="ManualMode">
      <Title className="manualTitle">{title}</Title>
      <div className="manualLockFlex">
        <Lock
          title="autoheading"
          active={toROV.autoheading}
          value={toROV.yaw}
          min={0}
          max={360}
          step={0.5}
        ></Lock>
        <Lock
          title="autodepth"
          active={toROV.autodepth}
          value={toROV.heave}
          min={0}
          max={400}
          step={0.2}
        ></Lock>
      </div>
    </div>
  );
}
