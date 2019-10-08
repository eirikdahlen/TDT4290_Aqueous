import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './css/MiniMapWidget.css';
import { mapRange } from './js/tools.js';

function drawBoat(ctx, boatWidth, boatLength) {
  ctx.beginPath();
  ctx.moveTo(0, -boatLength / 2);
  ctx.lineTo(boatWidth, -boatWidth);
  ctx.lineTo(boatWidth, boatLength / 2);
  ctx.lineTo(-boatWidth, boatLength / 2);
  ctx.lineTo(-boatWidth, -boatWidth);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
}

function drawROV(ctx, rovSize) {
  ctx.beginPath();
  ctx.moveTo(-rovSize / 2, -rovSize / 2);
  ctx.lineTo(rovSize / 2, -rovSize / 2);
  ctx.lineTo(rovSize / 2, rovSize / 2);
  ctx.lineTo(-rovSize / 2, rovSize / 2);
  ctx.lineTo(-rovSize / 2, -rovSize / 2);
  ctx.moveTo(0, -rovSize / 2);
  ctx.lineTo(rovSize / 3, -rovSize / 3 - rovSize / 2);
  ctx.lineTo(-rovSize / 3, -rovSize / 3 - rovSize / 2);
  ctx.closePath();
}

function drawNEDframe(ctx, mapWidth, boatWidth, rovSize) {
  ctx.beginPath();
  //east arrow
  ctx.moveTo(0, 0);
  ctx.lineTo(mapWidth / 2 - boatWidth - rovSize / 2, 0);
  ctx.lineTo(
    mapWidth / 2 - boatWidth - rovSize / 2 - mapWidth / 40,
    mapWidth / 40,
  );
  ctx.moveTo(mapWidth / 2 - boatWidth - rovSize / 2, 0);
  ctx.lineTo(
    mapWidth / 2 - boatWidth - rovSize / 2 - mapWidth / 40,
    -mapWidth / 40,
  );
  //nort arrow
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -(mapWidth / 2 - boatWidth - rovSize / 2));
  ctx.lineTo(
    -mapWidth / 40,
    -(mapWidth / 2 - boatWidth - rovSize / 2) + mapWidth / 40,
  );
  ctx.moveTo(0, -(mapWidth / 2 - boatWidth - rovSize / 2));
  ctx.lineTo(
    mapWidth / 40,
    -(mapWidth / 2 - boatWidth - rovSize / 2) + mapWidth / 40,
  );
  ctx.stroke();

  ctx.strokeText(
    'N',
    mapWidth / 40,
    -(mapWidth / 2 - boatWidth - rovSize / 2) + mapWidth / 40,
  );
  ctx.strokeText(
    'E',
    mapWidth / 2 - boatWidth - rovSize - mapWidth / 40,
    mapWidth / 15,
  );
}

function drawArrow(ctx, rovSize, mapWidth) {
  ctx.beginPath();
  ctx.moveTo(mapWidth / 2, 0);
  ctx.lineTo(mapWidth / 2 - rovSize, rovSize);
  ctx.lineTo(mapWidth / 2 - rovSize, -rovSize);
  ctx.closePath();
}

export default function MiniMapWidget(props) {
  const [boatHeading, setBoatHeading] = useState(0); //radians
  const [maxDist, setMaxDist] = useState(props.maxDist); //metres, largest value of north or east that will draw the ROV as a square within the map's boundary
  const boatHeadingOffset = useRef(0); //will store the initial boat heading

  const canvasRef = useRef();
  const mapWidth = 200; //px
  const rovSize = 15; //px
  const boatWidth = 20; //px
  const boatLength = 80; //px

  const firstUpdate = useRef(true);

  useEffect(() => {
    const ROVangleInNED = Math.atan2(props.north, props.east); //calculates direction of the ROV based on north and east props
    const leftSpace = mapWidth + boatWidth; //pixels to the left of where ROV when N, E = 0, 0
    const rightSpace = mapWidth - boatWidth - rovSize; //pixels to the right of where ROV when N, E = 0, 0
    const leftFactor = leftSpace / rightSpace; //describes how large portion of the map is left of the ROV when N, E = 0, 0
    const rightFactor = rightSpace / leftSpace; //describes how large portion of the map is right of the ROV when N, E = 0, 0

    if (firstUpdate.current) {
      //happens on first render of component
      firstUpdate.current = false;
      boatHeadingOffset.current = props.boatHeading;
    }
    setBoatHeading(props.boatHeading - boatHeadingOffset.current); //set boatHeading to difference in heading since beginning

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
    drawBoat(ctx, boatWidth, boatLength);
    ctx.restore(); //restore context state we saved earlier

    const inBoundsEast =
      props.east <= maxDist * rightFactor &&
      props.east >= -maxDist * leftFactor; //multiply by left/rightFactor so the ROV square won't be replaced by arrow too early or late
    const inBoundsNorth = Math.abs(props.north) <= maxDist;
    //draw ROV
    ctx.save();
    ctx.translate(mapWidth / 2, mapWidth / 2);
    ctx.rotate(-boatHeading); //rotates ROV around boat when boat rotates

    if (inBoundsEast && inBoundsNorth) {
      //draw ROV as a square within the map
      const mapNorth = mapRange(
        props.north,
        -maxDist,
        maxDist,
        -mapWidth / 2,
        mapWidth / 2,
      ); //map north prop to the pixel range we're working with
      const mapEast = mapRange(
        props.east,
        -maxDist,
        maxDist,
        -mapWidth / 2,
        mapWidth / 2,
      ); //map east prop to the pixel range we're working with
      ctx.save();
      ctx.translate(boatWidth + mapEast + rovSize / 2, -mapNorth); //draw square at correct point in the map
      ctx.rotate(props.yaw);
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
            Math.log(
              Math.exp(maxDist) +
                Math.pow(Math.max(props.east, props.north), 3),
            )),
        mapWidth,
      ); //make size of arrow based on how far out of bounds the ROV is
      ctx.restore();
    }
    ctx.fillStyle = '#00FF00';
    ctx.fill();

    ctx.translate(boatWidth + rovSize / 2, 0);
    drawNEDframe(ctx, mapWidth, boatWidth, rovSize);
    ctx.restore();
  }, [props.boatHeading, props.east, props.north, props.yaw]);

  /*
  function zoomOut() {
    if (maxDist < 1000) {
      setMaxDist(maxDist + 1);
    }
  }

  function zoomIn() {
    if (maxDist > 1) {
      setMaxDist(maxDist - 1);
    }
  }
  */

  return (
    <div className="MiniMapWidget">
      <div className="MiniMap">
        <canvas ref={canvasRef} width={mapWidth} height={mapWidth} />
      </div>
      {/* these buttons let us increase or decrease the max distance that draws the ROV as a square on the map
      <div className="zoom">
        <button onClick={zoomOut}>-</button>  
        <button onClick={zoomIn}>+</button>
      </div>
      */}
    </div>
  );
}

MiniMapWidget.propTypes = {
  north: PropTypes.number,
  east: PropTypes.number,
  yaw: PropTypes.number,
  boatHeading: PropTypes.number,
  maxDist: PropTypes.number,
};
