import React from 'react';
import PropTypes from 'prop-types';
import Title from './Title.js';

export default function Lock(props) {
  const [ref, setRef] = React.useState(props.ref || 0.0);
  const [min, setMin] = React.useState(props.loop ? props.min-props.step : props.min);

  function updateReference(event){
    
    if(props.loop && Number(event.target.value) >= props.max){
        setRef(Number(event.target.value)%props.max);
    }
    else if(props.loop && Number(event.target.value) === min){
        setRef((props.max*10-props.step*10)/10);
    }
    else if(event.target.value == false){
        setRef(props.min);
    }
    else{
        setRef(event.target.value);
    }
  }

  function applyReference(){
      if(ref>props.max){
          console.log("applied "+props.max)
          setRef(props.max);
      }
      else if(ref<props.min){
        console.log("applied "+props.min)
        setRef(props.min);
      }
      else{
        console.log("applied "+ref);
      }
  }

  return (
    <div className="lock">
      <Title>{props.title}</Title>
      <div className="inputFlex">
        <input type="number" value={ref} onChange={updateReference} step={props.step} min={min} max={props.max}/>
        <button className="applyButton" onClick={()=>applyReference()}>Apply</button>
      </div>
    </div>
  );
}

Lock.propTypes = {
  title: PropTypes.string,
  min: PropTypes.number, 
  max: PropTypes.number,
  loop: PropTypes.bool,
  step: PropTypes.number,
};
