import { mapRange, radiansToDegrees } from './tools.js';

const mapWidth = 200; //px
const rovSize = 15; //px
const boatWidth = 20; //px
const boatLength = 80; //px

var boatHeadingOffset = 0;

function drawBoat(context, boatWidth, boatLength, boatHeading) {
  // Set initial variables
  context.fillStyle = '#FFFFFF';
  context.strokeStyle = '#FFFFFF';
  context.font = '13px Arial';
  context.textAlign = 'center';

  // Convert boat heading to degrees
  const boatDegrees = radiansToDegrees(boatHeading);

  // Draw the boat itself
  context.beginPath();
  context.moveTo(0, -boatLength / 2);
  context.lineTo(0, (-2 * boatLength) / 3);
  context.lineTo(0, -boatLength / 2);
  context.lineTo(boatWidth, -boatWidth);
  context.lineTo(boatWidth, boatLength / 2);
  context.lineTo(-boatWidth, boatLength / 2);
  context.lineTo(-boatWidth, -boatWidth);
  context.closePath();
  context.fill();
  context.stroke();

  // Draw the text
  context.fillText(boatDegrees.toFixed(0) + '\xB0', 0, (-2 * boatLength) / 2.5);
}

function drawROV(context, rovSize) {
  context.beginPath();

  // Draw the main body
  context.moveTo(-rovSize / 2, -rovSize / 2);
  context.lineTo(rovSize / 2, -rovSize / 2);
  context.lineTo(rovSize / 2, rovSize / 2);
  context.lineTo(-rovSize / 2, rovSize / 2);
  context.lineTo(-rovSize / 2, -rovSize / 2);

  // Draw the front-facing triangle
  context.moveTo(0, -rovSize / 2);
  context.lineTo(rovSize / 3, -rovSize / 3 - rovSize / 2);
  context.lineTo(-rovSize / 3, -rovSize / 3 - rovSize / 2);

  context.closePath();
}

function drawNEDframe(context, mapWidth, boatWidth, rovSize) {
  context.beginPath();
  // East arrow
  context.moveTo(0, 0);
  context.lineTo(mapWidth / 2 - boatWidth - rovSize / 2, 0);
  context.lineTo(
    mapWidth / 2 - boatWidth - rovSize / 2 - mapWidth / 40,
    mapWidth / 40,
  );
  context.moveTo(mapWidth / 2 - boatWidth - rovSize / 2, 0);
  context.lineTo(
    mapWidth / 2 - boatWidth - rovSize / 2 - mapWidth / 40,
    -mapWidth / 40,
  );

  // North arrow
  context.moveTo(0, 0);
  context.lineTo(0, -(mapWidth / 2 - boatWidth - rovSize / 2));
  context.lineTo(
    -mapWidth / 40,
    -(mapWidth / 2 - boatWidth - rovSize / 2) + mapWidth / 40,
  );
  context.moveTo(0, -(mapWidth / 2 - boatWidth - rovSize / 2));
  context.lineTo(
    mapWidth / 40,
    -(mapWidth / 2 - boatWidth - rovSize / 2) + mapWidth / 40,
  );
  context.stroke();

  // Use white for the axis labels
  context.fillStyle = '#FFFFFF';

  // East label
  context.fillText(
    'E',
    mapWidth / 2 - boatWidth - rovSize - mapWidth / 40,
    mapWidth / 15,
  );

  // North label
  context.fillText(
    'N',
    mapWidth / 40,
    -(mapWidth / 2 - boatWidth - rovSize / 2) + mapWidth / 40,
  );
}

function drawArrow(context, rovSize, mapWidth) {
  context.beginPath();
  context.moveTo(mapWidth / 2, 0);
  context.lineTo(mapWidth / 2 - rovSize, rovSize);
  context.lineTo(mapWidth / 2 - rovSize, -rovSize);
  context.closePath();
}

function initMinimap(boatHeading) {
  // Only do this when initializing the minimap
  boatHeadingOffset = boatHeading;
}

function drawMinimap(context, north, east, yaw, boatHeading, maxDistance) {
  context.strokeStyle = '#FFFFFF';
  context.fillStyle = '#FFFFFF';

  const ROVangleInNED = Math.atan2(north, east); // Calculates direction of the ROV based on north and east props
  const leftSpace = mapWidth + boatWidth; // Pixels to the left of where ROV when N, E = 0, 0
  const rightSpace = mapWidth - boatWidth - rovSize; // Pixels to the right of where ROV when N, E = 0, 0
  const leftFactor = leftSpace / rightSpace; // Describes how large portion of the map is left of the ROV when N, E = 0, 0
  const rightFactor = rightSpace / leftSpace; // Describes how large portion of the map is right of the ROV when N, E = 0, 0

  var boatRotation = boatHeading - boatHeadingOffset; // Set boatHeading to difference in heading since beginning

  context.clearRect(0, 0, mapWidth, mapWidth); // Clear canvas to avoid drawing on top of previous canvas

  // Draw map boundary
  context.beginPath();
  context.rect(0, 0, mapWidth, mapWidth);
  context.stroke();

  // Draw the boat
  context.save(); // Save context state so we can draw boat and ROV from different origins and rotate independently
  context.translate(mapWidth / 2, mapWidth / 2); // Draw boat from the middle of the circle
  //context.rotate(boatAngle[0]); // Rotate the boat drawing around the middle of the circle
  drawBoat(context, boatWidth, boatLength, boatHeading);
  context.restore(); // Restore context state we saved earlier

  const inBoundsEast =
    east <= maxDistance * rightFactor && east >= -maxDistance * leftFactor; // Multiply by left/rightFactor so the ROV square won't be replaced by arrow too early or late
  const inBoundsNorth = Math.abs(north) <= maxDistance;

  context.save();
  context.translate(mapWidth / 2, mapWidth / 2);
  context.rotate(-boatRotation); //rotates ROV around boat when boat rotates

  // If the ROV is within the bounds of the map, draw it as a square within the map
  if (inBoundsEast && inBoundsNorth) {
    // Map north prop to the pixel range we're working with
    const mapNorth = mapRange(
      north,
      -maxDistance,
      maxDistance,
      -mapWidth / 2,
      mapWidth / 2,
    );

    // Map east prop to the pixel range we're working with
    const mapEast = mapRange(
      east,
      -maxDistance,
      maxDistance,
      -mapWidth / 2,
      mapWidth / 2,
    );

    // Draw the ROV itself
    context.save();
    context.translate(boatWidth + mapEast + rovSize / 2, -mapNorth); // Draw square at correct point in the map
    context.rotate(yaw);
    drawROV(context, rovSize);
    context.restore();
  } else {
    // If the ROV is outside the bounds of the map, draw an arrow in the direction of the ROV
    context.save();
    context.translate(0, 0); // Origin in middle of map so we can rotate arrow about this point
    context.rotate(-ROVangleInNED); // Point/rotate arrow in direction of ROV
    drawArrow(
      context,
      rovSize *
        (maxDistance /
          Math.log(Math.exp(maxDistance) + Math.pow(Math.max(east, north), 3))),
      mapWidth,
    ); // Make size of arrow based on how far out of bounds the ROV is
    context.restore();
  }
  context.fillStyle = '#00FF00';
  context.fill();

  // Draw the north/east axes
  context.translate(boatWidth + rovSize / 2, 0);
  drawNEDframe(context, mapWidth, boatWidth, rovSize);
  context.restore();
}

export default drawMinimap;
export { initMinimap };
