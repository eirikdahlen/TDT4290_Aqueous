import React from 'react';
import ValueBox from './ValueBox';
import PropTypes from 'prop-types';
import './css/Values.css';
import Title from './Title';
import ROVSettings from './ROVSettings';
import MessageGroup from './MessageGroup';
import { fixValue, copyObjectExcept } from '../utils/utils';

// A container for ValueBox-components.
export default function Values({
  title,
  values,
  changeEffect,
  IMCActive,
  settings,
}) {
  const extractData = (msgData, msgName) => {
    if (msgName === 'netFollow' || msgName === 'customGoTo') {
      return { flags: false, data: msgData };
    }
    if (msgName.includes('lowLevelControlManeuver')) {
      return { flags: false, data: { value: msgData.control.value } };
    }
    if (msgName === 'desiredControl') {
      const { flags } = msgData;
      const data = copyObjectExcept(msgData, ['flags']);
      return { flags, data };
    }
    if (msgName === 'customEstimatedState') {
      return { flags: false, data: msgData };
    }
    if (msgName === 'entityState') {
      const data = {
        state: msgData.state.toFixed(0),
        DP: msgData.flags.DP,
        NF: msgData.flags.NF,
      };
      return { flags: false, data };
    }
    return { flags: false, data: msgData };
  };

  const renderIMC = () => {
    return (
      <>
        {Object.keys(values).map(msgName => {
          let msgData = values[msgName];
          const { flags, data } = extractData(msgData, msgName);
          return (
            <MessageGroup
              key={msgName}
              msgName={msgName}
              data={data}
              flags={flags}
              changeEffect={changeEffect}
            ></MessageGroup>
          );
        })}
      </>
    );
  };

  const renderOld = () => {
    return Object.keys(values).map(key => (
      <ValueBox
        key={key}
        title={key}
        value={fixValue(values[key])}
        changeEffect={changeEffect}
      />
    ));
  };

  return (
    <div className="Values">
      <Title>{title}</Title>
      <div className="valuesPosition">
        <div className="valuesFlex">
          {IMCActive ? renderIMC() : renderOld()}
        </div>
        {settings ? (
          <ROVSettings title="ROV Settings" settings={settings} />
        ) : null}
      </div>
    </div>
  );
}

Values.propTypes = {
  values: PropTypes.object,
  title: PropTypes.string,
  changeEffect: PropTypes.bool,
  IMCActive: PropTypes.bool,
  settings: PropTypes.object,
};
