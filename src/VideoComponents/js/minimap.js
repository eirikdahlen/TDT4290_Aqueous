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
  context.lineTo(boatWidth, -boatWidth);
  context.lineTo(boatWidth, boatLength / 2);
  context.lineTo(-boatWidth, boatLength / 2);
  context.lineTo(-boatWidth, -boatWidth);
  context.closePath();
  context.stroke();

  // Draw the text
  context.fillText(boatDegrees.toFixed(0) + '\xB0', 0, (2 * boatLength) / 2.5);
}

function drawROV(context) {
  context.fillStyle = '#00FF00';

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
  context.fill();
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

function drawTarget(context) {
  context.beginPath();

  context.fillStyle = '#FF0000';
  context.arc(0, 0, 8, 0, 2 * Math.PI);
  context.closePath();
  context.fill();

  context.beginPath();
  context.fillStyle = '#FFFFFF';
  context.arc(0, 0, 5, 0, 2 * Math.PI);
  context.closePath();
  context.fill();

  context.beginPath();
  context.fillStyle = '#FF0000';
  context.arc(0, 0, 2, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
}

function drawArrow(context, rovSize, initialWidth) {
  context.beginPath();
  context.moveTo(initialWidth / 2, 0);
  context.lineTo(initialWidth / 2 - rovSize, rovSize);
  context.lineTo(initialWidth / 2 - rovSize, -rovSize);
  context.fill();
  context.closePath();
}

function drawContent(
  // Function for drawing either the ROV or the target (or other future components) at the correct place in the minimap
  context,
  maxDistance,
  yaw,
  north,
  east,
  drawFunction,
  arrowColor,
) {
  const angleInNED = Math.atan2(north, east);
  const inBoundsEast =
    east <= maxDistance * rightFactor && east >= -maxDistance * leftFactor; // Multiply by left/rightFactor so the ROV square won't be replaced by arrow too early or late
  const inBoundsNorth = Math.abs(north) <= maxDistance;

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

    // Draw the component itself
    context.save();
    context.translate(mapEast, -mapNorth); // Draw square at correct point in the map
    context.rotate(yaw);
    drawFunction(context);
    context.restore();
  } else {
    // If the component is outside the bounds of the map, draw an arrow in the direction of the component
    context.save();
    context.translate(0, 0); // Origin in middle of map so we can rotate arrow about this point
    context.rotate(-angleInNED); // Point/rotate arrow in direction of component

    context.fillStyle = arrowColor;
    drawArrow(
      context,
      rovSize *
        (maxDistance /
          Math.log(
            Math.exp(maxDistance) +
              Math.pow(Math.max(Math.abs(east), Math.abs(north)), 3),
          )),
      initialWidth,
    ); // Make size of arrow based on how far out of bounds the component is
    context.restore();
  }
}

function drawMinimap(
  context,
  north,
  east,
  down,
  yaw,
  boatHeading,
  maxDistance,
  DP,
  DPnorth,
  DPeast,
  DPdown,
  initialWidth,
  initialHeight,
  mapRotation,
) {
  context.strokeStyle = '#FFFFFF';
  context.fillStyle = '#FFFFFF';
  context.lineWidth = 1.5;

  // Keep degrees between 0 and 360
  boatHeading = wrapDegrees(boatHeading);

  context.clearRect(0, 0, initialWidth, initialWidth); // Clear canvas to avoid drawing on top of previous canvas

  // Draw map boundary
  context.beginPath();
  context.rect(0, 0, initialWidth, initialHeight);
  context.stroke();

  // Draw the boat
  context.save(); // Save context state so we can draw boat and ROV from different origins and rotate independently
  context.translate(initialWidth / 2, initialWidth / 2); // Draw boat from the middle of the circle
  if (mapRotation) {
    context.rotate(degreesToRadians(boatHeading)); //rotate the boat
  }
  drawBoat(context, boatWidth, boatLength, boatHeading);
  context.restore(); // Restore context state we saved earlier

  context.save();
  context.translate(initialWidth / 2, initialWidth / 2);
  if (!mapRotation) {
    context.rotate(-degreesToRadians(boatHeading)); //rotates ROV around boat when boat rotates
  }
  // If the ROV is below the target: draw the ROV first, then the target on top
  if (down > DPdown) {
    drawContent(context, maxDistance, yaw, north, east, drawROV, '#00FF00');
  }

  if (DP) {
    drawContent(
      context,
      maxDistance,
      yaw,
      DPnorth,
      DPeast,
      drawTarget,
      '#FF0000',
    );
  }

  // If the ROV is above the target: draw the target first, then the ROV on top
  if (down <= DPdown) {
    drawContent(context, maxDistance, yaw, north, east, drawROV, '#00FF00');
  }

  // Draw the north/east axes
  drawNEDframe(context, initialWidth, boatWidth, rovSize);
  context.restore();
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
    0.85,
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

export default drawMinimap;
export { scaleMinimap };
