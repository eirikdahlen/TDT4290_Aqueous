import { clamp, mapRange, scaleWidget } from './tools.js';

const netCurveX = 20;
const netCurveY = 40;

// Dimensions for the ROV (in pixels)
const rovHeight = 40;
const rovWidth = 42;
const rovTipWidth = 8;
const rovTipHeight = 20;

// Width of the legs of the measures
const measureWidth = 16;

// Global offset (need this to give space for overflowing distance label)
const globalOffsetWidth = 45;

// Multiply the distance by this factor to get the distance in pixels
const distanceMultiplier = 10;

// Function for drawing arrows on curves
function drawArrowhead(context, locX, locY, angle, sizeX, sizeY) {
  const hx = sizeX / 2;
  const hy = sizeY / 2;

  // First, move and rotate the canvas to draw a non-rotated arrow on a rotated canvas
  context.translate(locX, locY);
  context.rotate(angle);
  context.translate(-hx, -hy);

  // Draw the arrow
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, 1 * sizeY);
  context.lineTo(1 * sizeX, 1 * hy);
  context.closePath();
  context.fill();

  // Move and rotate the canvas back. The result is a non-rotated canvas with a rotated arrow
  context.translate(hx, hy);
  context.rotate(-angle);
  context.translate(-locX, -locY);
}

// Function for finding the angle which an arrow on a curve must be drawn with.
// (startX, startY) are the coordinates of the control point, and
// (endX, endY) are the coordinates of the end point where the arrow should be drawn.
// NB! Only for quadratic curves, not bezier curves
function findAngle(startX, startY, endX, endY) {
  return Math.atan2(endY - startY, endX - startX);
}

function drawNetFollowing(
  context,
  distance,
  velocity,
  initialWidth,
  initialHeight,
) {
  // Set drawing flags
  context.strokeStyle = '#00FF00';
  context.fillStyle = '#FFFF00';
  context.lineWidth = 2;
  context.textAlign = 'center';
  context.font = '14px Arial';

  // Redraw canvas
  context.clearRect(0, 0, initialWidth, initialHeight);

  ////////////////////////////////////////////////////////
  // Draw the net
  context.beginPath();
  context.moveTo(globalOffsetWidth + netCurveX, 0);
  context.lineTo(globalOffsetWidth, netCurveY);
  context.lineTo(globalOffsetWidth, initialHeight - netCurveY);
  context.lineTo(globalOffsetWidth + netCurveX, initialHeight);
  context.stroke();
  ////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////
  // Find the distance at which the ROV should be drawn, and also limit this
  // to ensure it stays on screen even when the distance becomes large
  const offsetDistance = clamp(
    distance * distanceMultiplier,
    0,
    initialWidth - rovWidth - rovTipWidth - globalOffsetWidth,
  );

  // Draw the ROV
  const rovTopLeftX = globalOffsetWidth + offsetDistance + rovTipWidth;
  const rovTopLeftY = initialHeight / 2 - rovHeight / 2;
  context.beginPath();
  context.moveTo(rovTopLeftX, rovTopLeftY);
  context.lineTo(rovTopLeftX + rovWidth, rovTopLeftY);
  context.lineTo(rovTopLeftX + rovWidth, rovTopLeftY + rovHeight);
  context.lineTo(rovTopLeftX, rovTopLeftY + rovHeight);
  context.lineTo(rovTopLeftX, rovTopLeftY);
  context.fill();

  // Draw the front-facing tip of the ROV
  context.beginPath();
  context.moveTo(
    globalOffsetWidth + offsetDistance,
    initialHeight / 2 - rovTipHeight / 2,
  );
  context.lineTo(
    globalOffsetWidth + offsetDistance,
    initialHeight / 2 + rovTipHeight / 2,
  );
  context.lineTo(
    globalOffsetWidth + offsetDistance + rovTipHeight,
    initialHeight / 2,
  );
  context.fill();
  ////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////
  // Draw the distance measure
  context.strokeStyle = '#A0A0A0';
  context.beginPath();

  // First leg
  context.moveTo(globalOffsetWidth, initialHeight / 2 - measureWidth / 2);
  context.lineTo(globalOffsetWidth, initialHeight / 2 + measureWidth / 2);
  context.stroke();

  // Body
  context.moveTo(globalOffsetWidth, initialHeight / 2);

  if (distance * distanceMultiplier > offsetDistance) {
    // If the distance is too large to be displayed on the canvas: Draw a dashed line.
    // First third of the line is solid.
    context.lineTo(globalOffsetWidth + offsetDistance / 3, initialHeight / 2);
    context.stroke();

    // Middle third of the line is dashed.
    context.beginPath();
    context.setLineDash([4, 4]);
    context.moveTo(globalOffsetWidth + offsetDistance / 3, initialHeight / 2);
    context.lineTo(
      globalOffsetWidth + offsetDistance * (2 / 3),
      initialHeight / 2,
    );
    context.stroke();

    // Last third of the line is solid.
    context.beginPath();
    context.setLineDash([]);
    context.moveTo(
      globalOffsetWidth + offsetDistance * (2 / 3),
      initialHeight / 2,
    );
  }

  context.lineTo(globalOffsetWidth + offsetDistance, initialHeight / 2);
  context.stroke();

  // Second leg
  context.moveTo(
    globalOffsetWidth + offsetDistance,
    initialHeight / 2 - measureWidth / 2,
  );
  context.lineTo(
    globalOffsetWidth + offsetDistance,
    initialHeight / 2 + measureWidth / 2,
  );
  context.stroke();
  ////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////
  // Settings for measuring labels
  context.fillStyle = '#FFFFFF';

  let offsetDistanceLabelWidth = 0;

  // Move the distance label if the ROV is close to the net
  if (offsetDistance < 45) {
    offsetDistanceLabelWidth = -offsetDistance / 2 - 7;
    context.textAlign = 'right';
    context.textBaseline = 'middle';
  } else {
    context.textBaseline = 'bottom';
  }

  // Distance label
  context.fillText(
    distance.toFixed(1) + ' m',
    globalOffsetWidth + offsetDistance / 2 + offsetDistanceLabelWidth,
    initialHeight / 2,
  );
  ////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////
  // Coordinates for the velocity arrow and its label
  const arrowEndX = rovTopLeftX + 20;
  var arrowStartY;
  var arrowCurveY;
  var arrowEndY;
  var speedLabelY;

  // If velocity is a positive number, the ROV moves in a clockwise direction.
  if (velocity > 0) {
    arrowStartY = initialHeight / 2 - rovHeight / 2 - 5;
    arrowCurveY = arrowStartY - 15;
    arrowEndY = arrowStartY - 35;
    speedLabelY = arrowStartY - 50;
  }
  // If velocity is a negative number, the ROV moves in a counter-clockwise direction.
  else if (velocity < 0) {
    arrowStartY = initialHeight / 2 + rovHeight / 2 + 5;
    arrowCurveY = arrowStartY + 15;
    arrowEndY = arrowStartY + 35;
    speedLabelY = arrowStartY + 55;
  }
  // If velocity is zero, don't draw any arrow at all!
  else {
    return;
  }

  // Draw the velocity curve
  context.beginPath();
  context.moveTo(rovTopLeftX, arrowStartY);
  context.quadraticCurveTo(rovTopLeftX, arrowCurveY, arrowEndX, arrowEndY);
  context.stroke();

  // Set the angle and size of the arrow
  const arrowAngle = findAngle(rovTopLeftX, arrowCurveY, arrowEndX, arrowEndY);
  const arrowSize = clamp(mapRange(Math.abs(velocity), 0, 5, 6, 15), 6, 15);

  // Draw the velocity arrow itself, at the end of the velocity curve
  drawArrowhead(
    context,
    arrowEndX,
    arrowEndY,
    arrowAngle,
    arrowSize,
    arrowSize,
  );

  // Draw the velocity label
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillText(
    Math.abs(velocity).toFixed(1) + ' m/s',
    arrowEndX,
    speedLabelY,
  );
  ////////////////////////////////////////////////////////
}

function scaleNetFollowing(context, initialWidth, initialHeight) {
  // Scale widget according to window width
  scaleWidget(
    context,
    initialWidth,
    initialHeight,
    window.innerWidth,
    1000,
    1500,
    0.7,
    0.85,
  );
}

export default drawNetFollowing;
export { scaleNetFollowing };
