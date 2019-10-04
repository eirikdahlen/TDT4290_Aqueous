import { clamp } from './tools.js';

// Dimensions for the ROV (in pixels)
const rovHeight = 50;
const rovWidth = 50;

// Width of the legs of the measures
const measureWidth = 16;

// Global offset (need this to give space for overflowing labels)
const globalOffsetHeight = 45;
const globalOffsetWidth = 45;

function drawNetFollowing(context, distance, depth, velocity) {
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

  // Draw the speed label
  context.fillText(Math.abs(velocity).toFixed(1) + ' m/s', 70, 15);

  // Prevent the ROV widget from moving any further once it's outside of the canvas
  // Prevention of distance
  const offsetDistance = clamp(
    distance * 10,
    0,
    canvasWidth - globalOffsetWidth + 1,
  );
  // Prevention of depth
  const offsetDepth = clamp(
    depth * 10,
    0,
    canvasHeight - globalOffsetHeight + 1,
  );

  // Prevent the measuring widgets from moving one they reach the edges of the canvas
  // Prevention of distance
  const offsetDistanceMeasure = clamp(
    offsetDistance,
    0,
    offsetDistance - measureWidth / 2,
  );
  // Prevetion of depth
  const offsetDepthMeasure = clamp(
    offsetDepth,
    0,
    offsetDepth - measureWidth / 2,
  );

  context.fillStyle = '#FFFF00';

  // Draw the net
  context.beginPath();
  context.moveTo(globalOffsetWidth, globalOffsetHeight);
  context.lineTo(globalOffsetWidth, globalOffsetHeight + 150);
  context.stroke();

  // Draw the ROV
  context.beginPath();
  context.moveTo(
    globalOffsetWidth + offsetDistance,
    globalOffsetHeight + offsetDepth,
  );
  context.lineTo(
    globalOffsetWidth + offsetDistance + rovWidth,
    globalOffsetHeight + offsetDepth,
  );
  context.lineTo(
    globalOffsetWidth + offsetDistance + rovWidth,
    globalOffsetHeight + offsetDepth + rovHeight,
  );
  context.lineTo(
    globalOffsetWidth + offsetDistance,
    globalOffsetHeight + offsetDepth + rovHeight,
  );
  context.lineTo(
    globalOffsetWidth + offsetDistance,
    globalOffsetHeight + offsetDepth,
  );
  context.fill();

  // Measure color
  context.strokeStyle = '#A0A0A0';
  context.textAlign = 'center';

  // Draw the distance measure
  context.beginPath();
  // First leg
  context.moveTo(
    globalOffsetWidth,
    globalOffsetHeight + offsetDepthMeasure + measureWidth,
  );
  context.lineTo(globalOffsetWidth, globalOffsetHeight + offsetDepthMeasure);
  context.stroke();
  // Body
  context.moveTo(
    globalOffsetWidth,
    globalOffsetHeight + offsetDepthMeasure + measureWidth / 2,
  );
  context.lineTo(
    globalOffsetWidth + offsetDistance,
    globalOffsetHeight + offsetDepthMeasure + measureWidth / 2,
  );
  context.stroke();
  // Second leg
  context.moveTo(
    globalOffsetWidth + offsetDistance,
    globalOffsetHeight + offsetDepthMeasure + measureWidth,
  );
  context.lineTo(
    globalOffsetWidth + offsetDistance,
    globalOffsetHeight + offsetDepthMeasure,
  );
  context.stroke();

  // Draw the depth measure
  context.beginPath();
  // First leg
  context.moveTo(globalOffsetWidth + offsetDistanceMeasure, globalOffsetHeight);
  context.lineTo(
    globalOffsetWidth + offsetDistanceMeasure + measureWidth,
    globalOffsetHeight,
  );
  context.stroke();
  // Body
  context.moveTo(
    globalOffsetWidth + offsetDistanceMeasure + measureWidth / 2,
    globalOffsetHeight,
  );
  context.lineTo(
    globalOffsetWidth + offsetDistanceMeasure + measureWidth / 2,
    globalOffsetHeight + offsetDepth,
  );
  context.stroke();
  // Second leg
  context.moveTo(
    globalOffsetWidth + offsetDistanceMeasure + measureWidth,
    globalOffsetHeight + offsetDepth,
  );
  context.lineTo(
    globalOffsetWidth + offsetDistanceMeasure,
    globalOffsetHeight + offsetDepth,
  );
  context.stroke();

  // Settings for measuring labels
  context.textBaseline = 'middle';
  context.fillStyle = '#FFFFFF';

  let offsetDistanceLabelWidth = 0;
  let offsetDepthLabelHeight = 0;
  let offsetDepthLabelWidth = 0;

  // Move the distance label if the ROV is close to the top of the net
  let offsetDistanceLabelHeight = offsetDepth < 10 ? 28 : 0;

  // Move the distance label if the ROV is close to the net
  if (offsetDistance < 45) {
    offsetDistanceLabelWidth = -offsetDistance / 2 - 7;
    offsetDistanceLabelHeight = measureWidth / 2;
    context.textAlign = 'right';
  }

  // Distance label
  context.fillText(
    distance.toFixed(1) + ' m',
    globalOffsetWidth + offsetDistance / 2 + offsetDistanceLabelWidth,
    clamp(
      globalOffsetHeight + offsetDepthMeasure + offsetDistanceLabelHeight,
      0,
      165,
    ),
  );

  // Move the depth label when the ROV is far away from the net
  if (offsetDistance > 90) {
    context.textAlign = 'right';
    offsetDepthLabelWidth = 0;
  } else {
    context.textAlign = 'left';
    offsetDepthLabelWidth = measureWidth;
  }

  // Move the depth label when the ROV is close to the top of the net
  if (offsetDepth < 25) {
    context.textAlign = 'center';
    offsetDepthLabelWidth = measureWidth / 2;
    offsetDepthLabelHeight = -offsetDepth / 2 - 10;
  }

  // Depth label
  context.fillText(
    depth.toFixed(1) + ' m',
    clamp(
      globalOffsetWidth + offsetDistanceMeasure + offsetDepthLabelWidth,
      0,
      178,
    ),
    globalOffsetHeight + offsetDepth / 2 + offsetDepthLabelHeight,
  );
}

export default drawNetFollowing;
