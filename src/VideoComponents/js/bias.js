import { clamp, mapRange, scaleWidget } from './tools.js';

// Color values
const color_base_bias = '#A0A0A0';
const color_u = '#FF0000';
const color_v = '#FFFF00';
const color_w = '#00FF00';

// Center of the widget
const center_x = 180;
const center_y = 180;

// Start and end positions of the u axis
const start_u_x = 30;
const start_u_y = 130;
const end_u_x = 330;
const end_u_y = 230;

// Start and end positions of the v axis
const start_v_x = 30;
const start_v_y = 230;
const end_v_x = 330;
const end_v_y = 130;

// Start and end positions of the w axis
const start_w_x = 180;
const start_w_y = 30;
const end_w_x = 180;
const end_w_y = 330;

// Function for drawing an arrow on the canvas
function canvasArrow(context, fromx, fromy, tox, toy, bias) {
  // Do not draw anything if there is no bias
  if (bias === 0.0) {
    return;
  }

  const headlen = 10; // Length of head in pixels
  const dx = tox - fromx;
  const dy = toy - fromy;
  const angle = Math.atan2(dy, dx);

  // Draw the line itself
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.stroke();

  // Define a triangle shape to represent the arrow head
  context.beginPath();
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6),
  );
  context.lineTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6),
  );
  context.closePath();

  // Draw the triangle
  context.fill();
  context.stroke();
}

function resetColor(context) {
  // This function is needed to avoid drawing the wrong color to shapes for some reason
  context.beginPath();
  context.closePath();
  context.fill();
}

function drawBias(context, u, v, w, initialWidth, initialHeight) {
  // Clamp the bias values between -1.0 and 1.0
  u = clamp(u, -1.0, 1.0);
  v = clamp(v, -1.0, 1.0);
  w = clamp(w, -1.0, 1.0);

  // Clear the canvas before redrawing
  context.clearRect(0, 0, initialWidth, initialHeight);

  // Set the initial color and stroke thickness
  context.strokeStyle = color_base_bias;
  context.fillStyle = color_base_bias;
  context.lineWidth = 3;

  // U- to U+
  canvasArrow(context, center_x, center_y, end_u_x, end_u_y);
  canvasArrow(context, center_x, center_y, start_u_x, start_u_y);

  // V- to V+
  canvasArrow(context, center_x, center_y, end_v_x, end_v_y);
  canvasArrow(context, center_x, center_y, start_v_x, start_v_y);

  // W- to W+
  canvasArrow(context, center_x, center_y, end_w_x, end_w_y);
  canvasArrow(context, center_x, center_y, start_w_x, start_w_y);

  // U bias (red)
  resetColor(context);
  context.strokeStyle = color_u;
  context.fillStyle = color_u;
  canvasArrow(
    context,
    center_x,
    center_y,
    mapRange(u, 1.0, -1.0, start_u_x, end_u_x),
    mapRange(u, 1.0, -1.0, start_u_y, end_u_y),
    u,
  );

  // V bias (yellow)
  resetColor(context);
  context.strokeStyle = color_v;
  context.fillStyle = color_v;
  canvasArrow(
    context,
    center_x,
    center_y,
    mapRange(v, -1.0, 1.0, start_v_x, end_v_x),
    mapRange(v, -1.0, 1.0, start_v_y, end_v_y),
    v,
  );

  // W bias (green)
  resetColor(context);
  context.strokeStyle = color_w;
  context.fillStyle = color_w;
  canvasArrow(
    context,
    center_x,
    center_y,
    mapRange(w, -1.0, 1.0, start_w_x, end_w_x),
    mapRange(w, -1.0, 1.0, start_w_y, end_w_y),
    w,
  );

  // Set formatting for the axis labels
  context.strokeStyle = color_base_bias;
  context.fillStyle = color_base_bias;
  context.lineWidth = 1;
  context.font = '18px Arial';

  // Draw axis labels
  context.fillText('U-', end_u_x + 10, end_u_y + 10);
  context.fillText('U+', start_u_x - 25, start_u_y);
  context.fillText('V-', start_v_x - 23, start_v_y + 8);
  context.fillText('V+', end_v_x + 8, end_v_y + 3);
  context.fillText('W-', start_w_x - 8, start_w_y - 8);
  context.fillText('W+', end_w_x - 8, end_w_y + 20);
}

function scaleBias(context, initialWidth, initialHeight) {
  // Scale widget according to window width
  scaleWidget(
    context,
    initialWidth,
    initialHeight,
    window.innerWidth,
    1000,
    1500,
    0.45,
    0.65,
  );
}

export default drawBias;
export { scaleBias };
