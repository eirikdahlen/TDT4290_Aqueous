import {
  mapRange,
  wrapDegrees,
  scaleWidget,
  degreesToRadians,
} from './tools.js';

const initialWidth = 200; //px
const rovSize = 15; //px
const boatWidth = 20; //px
const boatLength = 80; //px

const leftSpace = initialWidth + boatWidth; // Pixels to the left of where ROV when N, E = 0, 0
const rightSpace = initialWidth - boatWidth - rovSize; // Pixels to the right of where ROV when N, E = 0, 0
const leftFactor = leftSpace / rightSpace; // Describes how large portion of the map is left of the ROV when N, E = 0, 0
const rightFactor = rightSpace / leftSpace; // Describes how large portion of the map is right of the ROV when N, E = 0, 0

var boatHeadingOffset = 0;

function drawBoat(context, boatWidth, boatLength, boatHeading) {
  // Set initial variables
  context.fillStyle = '#FFFFFF';
  context.strokeStyle = '#FFFFFF';
  context.font = '13px Arial';
  context.textAlign = 'center';

  // Convert boat heading to degrees
  const boatDegrees = boatHeading;

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

function drawNEDframe(context, initialWidth, boatWidth, rovSize) {
  context.beginPath();
  // East arrow
  context.moveTo(0, 0);
  context.lineTo(initialWidth / 2 - boatWidth - rovSize / 2, 0);
  context.lineTo(
    initialWidth / 2 - boatWidth - rovSize / 2 - initialWidth / 40,
    initialWidth / 40,
  );
  context.moveTo(initialWidth / 2 - boatWidth - rovSize / 2, 0);
  context.lineTo(
    initialWidth / 2 - boatWidth - rovSize / 2 - initialWidth / 40,
    -initialWidth / 40,
  );

  // North arrow
  context.moveTo(0, 0);
  context.lineTo(0, -(initialWidth / 2 - boatWidth - rovSize / 2));
  context.lineTo(
    -initialWidth / 40,
    -(initialWidth / 2 - boatWidth - rovSize / 2) + initialWidth / 40,
  );
  context.moveTo(0, -(initialWidth / 2 - boatWidth - rovSize / 2));
  context.lineTo(
    initialWidth / 40,
    -(initialWidth / 2 - boatWidth - rovSize / 2) + initialWidth / 40,
  );
  context.stroke();

  // Use white for the axis labels
  context.fillStyle = '#FFFFFF';

  // East label
  context.fillText(
    'E',
    initialWidth / 2 - boatWidth - rovSize - initialWidth / 40,
    initialWidth / 15,
  );

  // North label
  context.fillText(
    'N',
    initialWidth / 40,
    -(initialWidth / 2 - boatWidth - rovSize / 2) + initialWidth / 40,
  );
}

function drawArrow(context, rovSize, initialWidth) {
  context.beginPath();
  context.moveTo(initialWidth / 2, 0);
  context.lineTo(initialWidth / 2 - rovSize, rovSize);
  context.lineTo(initialWidth / 2 - rovSize, -rovSize);
  context.closePath();
}

function scaleMinimap(context, initialWidth, initialHeight) {
  // Scale widget according to window width
  const factor = scaleWidget(
    context,
    initialWidth,
    initialHeight,
    window.innerWidth,
    1000,
    1500,
    0.7,
    1,
  );

  // Scale the parent div, to be able to use CSS positioning properly
  document.getElementsByClassName('MiniMapWidget')[0].style.width =
    initialWidth * factor + 'px';

  const zoomButtons = document.getElementsByClassName('zoomButton');

  // Scale the zoom buttons
  for (var i = 0; i < zoomButtons.length; i++) {
    zoomButtons[i].style.fontSize = 22 * factor + 'px';
  }
}

function initMinimap(boatHeading) {
  // Only do this when initializing the minimap
  boatHeadingOffset = boatHeading;
}

function drawMinimap(
  context,
  north,
  east,
  yaw,
  boatHeading,
  maxDistance,
  initialWidth,
  initialHeight,
) {
  context.strokeStyle = '#FFFFFF';
  context.fillStyle = '#FFFFFF';
  context.lineWidth = 1.5;

  // Keep degrees between 0 and 360
  boatHeading = wrapDegrees(boatHeading);
  boatHeadingOffset = wrapDegrees(boatHeadingOffset);

  const ROVangleInNED = Math.atan2(north, east); // Calculates direction of the ROV based on north and east props
  var boatRotation = boatHeading - boatHeadingOffset; // Set boatHeading to difference in heading since beginning

  context.clearRect(0, 0, initialWidth, initialWidth); // Clear canvas to avoid drawing on top of previous canvas

  // Draw map boundary
  context.beginPath();
  context.rect(0, 0, initialWidth, initialHeight);
  context.stroke();

  // Draw the boat
  context.save(); // Save context state so we can draw boat and ROV from different origins and rotate independently
  context.translate(initialWidth / 2, initialWidth / 2); // Draw boat from the middle of the circle
  //context.rotate(boatAngle[0]); // Rotate the boat drawing around the middle of the circle
  drawBoat(context, boatWidth, boatLength, boatHeading);
  context.restore(); // Restore context state we saved earlier

  const inBoundsEast =
    east <= maxDistance * rightFactor && east >= -maxDistance * leftFactor; // Multiply by left/rightFactor so the ROV square won't be replaced by arrow too early or late
  const inBoundsNorth = Math.abs(north) <= maxDistance;

  context.save();
  context.translate(initialWidth / 2, initialWidth / 2);
  context.rotate(-degreesToRadians(boatRotation)); //rotates ROV around boat when boat rotates

  // If the ROV is within the bounds of the map, draw it as a square within the map
  if (inBoundsEast && inBoundsNorth) {
    // Map north prop to the pixel range we're working with
    const mapNorth = mapRange(
      north,
      -maxDistance,
      maxDistance,
      -initialWidth / 2,
      initialWidth / 2,
    );

    // Map east prop to the pixel range we're working with
    const mapEast = mapRange(
      east,
      -maxDistance,
      maxDistance,
      -initialWidth / 2,
      initialWidth / 2,
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
      initialWidth,
    ); // Make size of arrow based on how far out of bounds the ROV is
    context.restore();
  }
  context.fillStyle = '#00FF00';
  context.fill();

  // Draw the north/east axes
  context.translate(boatWidth + rovSize / 2, 0);
  drawNEDframe(context, initialWidth, boatWidth, rovSize);
  context.restore();
}

export default drawMinimap;
export { initMinimap, scaleMinimap };
