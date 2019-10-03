import { clamp } from './tools.js';

const rovHeight = 50;
const rovWidth = 50;

const measureWidth = 16;

function drawNetFollowing(context, distance, depth, velocity) {
  const canvasWidth = context.canvas.clientWidth;
  const canvasHeight = context.canvas.clientHeight;
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  const offsetDistance = clamp(distance * 10, 0, canvasWidth);
  const offsetDepth = clamp(depth * 10, 0, canvasHeight);

  const offsetDistanceMeasure = clamp(
    offsetDistance,
    0,
    canvasWidth - measureWidth,
  );

  const offsetDepthMeasure = clamp(offsetDepth, 0, canvasHeight - measureWidth);

  context.strokeStyle = '#00FF00';
  context.fillStyle = '#FFFF00';
  context.lineWidth = 2;
  context.textAlign = 'center';
  context.font = '14px Arial';

  // Net
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, 150);
  context.stroke();

  // ROV
  context.beginPath();
  context.moveTo(offsetDistance, offsetDepth);
  context.lineTo(offsetDistance + rovWidth, offsetDepth);
  context.lineTo(offsetDistance + rovWidth, offsetDepth + rovHeight);
  context.lineTo(offsetDistance, offsetDepth + rovHeight);
  context.lineTo(offsetDistance, offsetDepth);
  context.fill();

  context.strokeStyle = '#A0A0A0';

  // Distance measure
  context.beginPath();
  context.moveTo(1, offsetDepthMeasure + measureWidth);
  context.lineTo(1, offsetDepthMeasure);
  context.stroke();
  context.moveTo(1, offsetDepthMeasure + measureWidth / 2);
  context.lineTo(offsetDistance, offsetDepthMeasure + measureWidth / 2);
  context.stroke();
  context.moveTo(offsetDistance, offsetDepthMeasure + measureWidth);
  context.lineTo(offsetDistance, offsetDepthMeasure);
  context.stroke();

  context.fillStyle = '#FFFFFF';

  const offsetDistanceLabel = offsetDepth < 10 ? 28 : 0;

  // Distance label
  context.fillText(
    distance.toString() + ' m',
    offsetDistance / 2,
    offsetDepth + offsetDistanceLabel,
  );

  // Depth measure
  context.beginPath();
  context.moveTo(offsetDistanceMeasure, 1);
  context.lineTo(offsetDistanceMeasure + measureWidth, 1);
  context.stroke();
  context.moveTo(offsetDistanceMeasure + measureWidth / 2, 1);
  context.lineTo(offsetDistanceMeasure + measureWidth / 2, offsetDepth);
  context.stroke();
  context.moveTo(offsetDistanceMeasure + measureWidth, offsetDepth);
  context.lineTo(offsetDistanceMeasure, offsetDepth);
  context.stroke();

  context.textBaseline = 'middle';

  let offsetDepthLabel = 0;

  if (offsetDistance > 100) {
    context.textAlign = 'right';
    offsetDepthLabel = 0;
  } else {
    context.textAlign = 'left';
    offsetDepthLabel = measureWidth;
  }

  // Depth label
  context.fillText(
    depth.toString() + ' m',
    offsetDistanceMeasure + offsetDepthLabel,
    offsetDepth / 2,
  );
}

export default drawNetFollowing;
