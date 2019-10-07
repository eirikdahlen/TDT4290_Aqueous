import { clamp, mapRange } from './tools.js';

// Dimensions for the ROV (in pixels)
const rovHeight = 50;
const rovWidth = 50;

// Width of the legs of the measures
const measureWidth = 16;

// Global offset (need this to give space for overflowing labels)
const globalOffsetWidth = 45;

function drawArrowhead(context, locX, locY, angle, sizeX, sizeY) {
  var hx = sizeX / 2;
  var hy = sizeY / 2;

  context.translate(locX, locY);
  context.rotate(angle);
  context.translate(-hx, -hy);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, 1 * sizeY);
  context.lineTo(1 * sizeX, 1 * hy);
  context.closePath();
  context.fill();

  context.translate(hx, hy);
  context.rotate(-angle);
  context.translate(-locX, -locY);
}

// returns radians
function findAngle(startX, startY, endX, endY) {
  // make sx and sy at the zero point
  return Math.atan2(endY - startY, endX - startX);
}

function drawNetFollowing(context, distance, velocity) {
  const canvasWidth = context.canvas.clientWidth;
  const canvasHeight = context.canvas.clientHeight;

  // Drawing options
  context.strokeStyle = '#00FF00';
  context.fillStyle = '#FFFFFF';
  context.lineWidth = 2;
  context.textAlign = 'left';
  context.font = '14px Arial';

  // Redraw canvas
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  const offsetDistance = clamp(
    distance * 10,
    0,
    canvasWidth - rovWidth - globalOffsetWidth,
  );

  context.fillStyle = '#FFFF00';

  // Draw the net
  context.beginPath();
  context.moveTo(globalOffsetWidth + 20, 0);
  context.lineTo(globalOffsetWidth, 40);
  context.lineTo(globalOffsetWidth, canvasHeight - 40);
  context.lineTo(globalOffsetWidth + 20, canvasHeight);
  context.stroke();

  const rovTopLeftX = globalOffsetWidth + offsetDistance;
  const rovTopLeftY = canvasHeight / 2 - rovHeight / 2;
  // Draw the ROV
  context.beginPath();
  context.moveTo(rovTopLeftX, rovTopLeftY);
  context.lineTo(rovTopLeftX + rovWidth, rovTopLeftY);
  context.lineTo(rovTopLeftX + rovWidth, rovTopLeftY + rovHeight);
  context.lineTo(rovTopLeftX, rovTopLeftY + rovHeight);
  context.lineTo(rovTopLeftX, rovTopLeftY);
  context.fill();

  // Measure color
  context.strokeStyle = '#A0A0A0';
  context.textAlign = 'center';

  // Draw the distance measure
  context.beginPath();
  // First leg
  context.moveTo(globalOffsetWidth, canvasHeight / 2 - measureWidth / 2);
  context.lineTo(globalOffsetWidth, canvasHeight / 2 + measureWidth / 2);
  context.stroke();

  // Body
  context.moveTo(globalOffsetWidth, canvasHeight / 2);

  if (distance * 10 > offsetDistance) {
    console.log('HEYYYYY');
    context.lineTo(globalOffsetWidth + offsetDistance / 3, canvasHeight / 2);
    context.stroke();

    //context.moveTo(globalOffsetWidth + offsetDistance / 3, canvasHeight / 2);
    context.beginPath();
    context.setLineDash([4, 4]);
    context.moveTo(globalOffsetWidth + offsetDistance / 3, canvasHeight / 2);
    context.lineTo(
      globalOffsetWidth + offsetDistance * (2 / 3),
      canvasHeight / 2,
    );
    context.stroke();

    context.beginPath();
    context.setLineDash([]);
    context.moveTo(
      globalOffsetWidth + offsetDistance * (2 / 3),
      canvasHeight / 2,
    );
  }

  context.lineTo(globalOffsetWidth + offsetDistance, canvasHeight / 2);
  context.stroke();
  // Second leg
  context.moveTo(
    globalOffsetWidth + offsetDistance,
    canvasHeight / 2 - measureWidth / 2,
  );
  context.lineTo(
    globalOffsetWidth + offsetDistance,
    canvasHeight / 2 + measureWidth / 2,
  );
  context.stroke();

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
    canvasHeight / 2,
  );

  var arrowStartY;
  var arrowCurveY;
  var arrowEndY;
  var speedLabelY;

  // Velocity arrow
  if (velocity > 0) {
    arrowStartY = canvasHeight / 2 - rovHeight / 2 - 5;
    arrowCurveY = arrowStartY - 15;
    arrowEndY = arrowStartY - 35;
    speedLabelY = arrowStartY - 50;
  } else if (velocity < 0) {
    arrowStartY = canvasHeight / 2 + rovHeight / 2 + 5;
    arrowCurveY = arrowStartY + 15;
    arrowEndY = arrowStartY + 35;
    speedLabelY = arrowStartY + 55;
  } else {
    return;
  }

  const arrowEndX = rovTopLeftX + 20;

  context.beginPath();
  context.moveTo(rovTopLeftX, arrowStartY);
  context.quadraticCurveTo(rovTopLeftX, arrowCurveY, arrowEndX, arrowEndY);
  context.stroke();

  const arrowAngle = findAngle(rovTopLeftX, arrowCurveY, arrowEndX, arrowEndY);

  const arrowSize = clamp(mapRange(Math.abs(velocity), 0, 5, 6, 15), 6, 15);

  drawArrowhead(
    context,
    arrowEndX,
    arrowEndY,
    arrowAngle,
    arrowSize,
    arrowSize,
  );

  //context.textAlign = 'left';
  context.textBaseline = 'middle';

  context.fillText(
    Math.abs(velocity).toFixed(1) + ' m/s',
    arrowEndX,
    speedLabelY,
  );
}

export default drawNetFollowing;
