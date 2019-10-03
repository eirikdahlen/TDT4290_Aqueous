import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './css/MiniMapWidget.css';
import { mapRange } from './js/tools.js';

export default function MiniMapWidget(props) {
  const angle = Math.atan2(props.north, props.east); //calculates direction of the ROV based on north and east props

  const boatAngle = useState(0); //radians
  const ROVdirection = useState(angle); //radians

  const canvasRef = useRef();
  const mapRadius = 100; //px
  const rovSize = 15; //px
  const maxDist = 5; //metres, largest value of north or east that will draw the ROV as a square within the map's boundary

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    //draw map boundary
    ctx.beginPath();
    ctx.arc(mapRadius + 1, mapRadius + 1, mapRadius, 0, 2 * Math.PI); //+1 so the circle's sides don't get cut by the canvas
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    //draw boat
    ctx.save(); //save context state so we can draw boat and ROV from different origins and rotate independently
    ctx.translate(mapRadius, mapRadius); //draw boat from the middle of the circle
    ctx.rotate(boatAngle[0]); //rotates the boat drawing about the middle of the circle
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(20, -20);
    ctx.lineTo(20, 40);
    ctx.lineTo(-20, 40);
    ctx.lineTo(-20, -20);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore(); //restore context state we saved earlier

    //draw ROV
    if (Math.abs(props.east) <= maxDist && Math.abs(props.north) <= maxDist) {
      //draw ROV as a square within the map

      const mapNorth = mapRange(
        props.north,
        -maxDist,
        maxDist,
        -mapRadius,
        mapRadius,
      ); //map north prop to the pixel range we're working with
      const mapEast = mapRange(
        props.east,
        -maxDist,
        maxDist,
        -mapRadius,
        mapRadius,
      ); //map east prop to the pixel range we're working with

      ctx.translate(
        mapRadius + mapEast * Math.abs(Math.cos(angle)),
        mapRadius - mapNorth * Math.abs(Math.sin(angle)),
      ); //draw square at correct point in the map
      ctx.beginPath();
      ctx.moveTo(-rovSize / 2, -rovSize / 2);
      ctx.lineTo(rovSize / 2, -rovSize / 2);
      ctx.lineTo(rovSize / 2, rovSize / 2);
      ctx.lineTo(-rovSize / 2, rovSize / 2);
      ctx.closePath();
    } else {
      //draw arrow pointing to where the ROV is outside the map
      ctx.translate(mapRadius, mapRadius); //origin in middle of map so we can rotate arrow about this point
      ctx.rotate(-ROVdirection[0]); //point/rotate arrow in direction of ROV
      ctx.beginPath();
      ctx.moveTo(mapRadius, 0);
      ctx.lineTo(mapRadius - rovSize, rovSize);
      ctx.lineTo(mapRadius - rovSize, -rovSize);
      ctx.closePath();
    }
    ctx.fillStyle = '#00FF00';
    ctx.fill();
  });

  return (
    <div className="MiniMap">
      <canvas
        ref={canvasRef}
        width={2 * mapRadius + 2}
        height={2 * mapRadius + 2}
      />
      {/*+2 to allow for map boundary to fit in canvas without clipping*/}
    </div>
  );
}

MiniMapWidget.propTypes = {
  north: PropTypes.number,
  east: PropTypes.number,
};
