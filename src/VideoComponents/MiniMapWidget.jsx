import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './css/MiniMapWidget.css';
import { mapRange } from './js/tools.js';
import { drawBoat, drawROV, drawNEDframe, drawArrow } from './js/minimap.js';

export default function MiniMapWidget({
  north,
  east,
  yaw,
  boatHeading,
  maxDistance,
}) {
  const [boatRotation, setBoatRotation] = useState(0); //radians
  const [maxDist, setMaxDist] = useState(maxDistance); //metres, largest value of north or east that will draw the ROV as a square within the map's boundary
  const boatHeadingOffset = useRef(0); //will store the initial boat heading

  const canvasRef = useRef();
  const mapWidth = 200; //px
  const rovSize = 15; //px
  const boatWidth = 20; //px
  const boatLength = 80; //px

  const firstUpdate = useRef(true);

  useEffect(() => {
    const ROVangleInNED = Math.atan2(north, east); //calculates direction of the ROV based on north and east props
    const leftSpace = mapWidth + boatWidth; //pixels to the left of where ROV when N, E = 0, 0
    const rightSpace = mapWidth - boatWidth - rovSize; //pixels to the right of where ROV when N, E = 0, 0
    const leftFactor = leftSpace / rightSpace; //describes how large portion of the map is left of the ROV when N, E = 0, 0
    const rightFactor = rightSpace / leftSpace; //describes how large portion of the map is right of the ROV when N, E = 0, 0

    if (firstUpdate.current) {
      //happens on first render of component
      firstUpdate.current = false;
      boatHeadingOffset.current = boatHeading;
    }
    setBoatRotation(boatHeading - boatHeadingOffset.current); //set boatHeading to difference in heading since beginning

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, mapWidth, mapWidth); //clear canvas to avoid drawing on top of previous canvas

    //draw map boundary
    ctx.beginPath();
    ctx.rect(0, 0, mapWidth, mapWidth);
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    //draw boat
    ctx.save(); //save context state so we can draw boat and ROV from different origins and rotate independently
    ctx.translate(mapWidth / 2, mapWidth / 2); //draw boat from the middle of the circle
    //ctx.rotate(boatAngle[0]); //rotates the boat drawing about the middle of the circle
    drawBoat(ctx, boatWidth, boatLength, boatHeading);
    ctx.restore(); //restore context state we saved earlier

    const inBoundsEast =
      east <= maxDist * rightFactor && east >= -maxDist * leftFactor; //multiply by left/rightFactor so the ROV square won't be replaced by arrow too early or late
    const inBoundsNorth = Math.abs(north) <= maxDist;
    //draw ROV
    ctx.save();
    ctx.translate(mapWidth / 2, mapWidth / 2);
    ctx.rotate(-boatRotation); //rotates ROV around boat when boat rotates

    if (inBoundsEast && inBoundsNorth) {
      //draw ROV as a square within the map
      const mapNorth = mapRange(
        north,
        -maxDist,
        maxDist,
        -mapWidth / 2,
        mapWidth / 2,
      ); //map north prop to the pixel range we're working with
      const mapEast = mapRange(
        east,
        -maxDist,
        maxDist,
        -mapWidth / 2,
        mapWidth / 2,
      ); //map east prop to the pixel range we're working with
      ctx.save();
      ctx.translate(boatWidth + mapEast + rovSize / 2, -mapNorth); //draw square at correct point in the map
      ctx.rotate(yaw);
      drawROV(ctx, rovSize);
      ctx.restore();
    } else {
      //draw arrow pointing to where the ROV is outside the map
      ctx.save();
      ctx.translate(0, 0); //origin in middle of map so we can rotate arrow about this point
      ctx.rotate(-ROVangleInNED); //point/rotate arrow in direction of ROV
      drawArrow(
        ctx,
        rovSize *
          (maxDist /
            Math.log(Math.exp(maxDist) + Math.pow(Math.max(east, north), 3))),
        mapWidth,
      ); //make size of arrow based on how far out of bounds the ROV is
      ctx.restore();
    }
    ctx.fillStyle = '#00FF00';
    ctx.fill();

    ctx.translate(boatWidth + rovSize / 2, 0);
    drawNEDframe(ctx, mapWidth, boatWidth, rovSize);
    ctx.restore();
  }, [boatHeading, east, north, yaw, maxDist, boatRotation]);

  function zoomOut() {
    if (maxDist < 1000) {
      //maximum 1000 metres
      setMaxDist(maxDist + 1);
    }
  }

  function zoomIn() {
    if (maxDist > 1) {
      //minimum 1 metre
      setMaxDist(maxDist - 1);
    }
  }

  return (
    <div className="MiniMapWidget">
      <div className="MiniMap">
        <canvas ref={canvasRef} width={mapWidth} height={mapWidth} />
      </div>
      {/* these buttons let us increase or decrease the max distance 
      that draws the ROV as a square on the map*/}
      <div className="zoom">
        <button className="zoomButton" onClick={zoomIn}>
          +
        </button>
        <button className="zoomButton" onClick={zoomOut}>
          -
        </button>
      </div>
    </div>
  );
}

MiniMapWidget.propTypes = {
  north: PropTypes.number,
  east: PropTypes.number,
  yaw: PropTypes.number,
  boatHeading: PropTypes.number,
  maxDistance: PropTypes.number,
};
