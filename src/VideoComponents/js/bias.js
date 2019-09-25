import { clamp } from './tools.js';

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
function canvas_arrow(context_bias, fromx, fromy, tox, toy, bias) {
  // Do not draw anything if there is no bias
  if (bias === 0.0) {
    return;
  }

  const headlen = 10; // Length of head in pixels
  const dx = tox - fromx;
  const dy = toy - fromy;
  const angle = Math.atan2(dy, dx);

  // Draw the line itself
  context_bias.moveTo(fromx, fromy);
  context_bias.lineTo(tox, toy);
  context_bias.stroke();

  // Define a triangle shape to represent the arrow head
  context_bias.beginPath();
  context_bias.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6),
  );
  context_bias.lineTo(tox, toy);
  context_bias.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6),
  );
  context_bias.closePath();

  // Draw the triangle
  context_bias.fill();
  context_bias.stroke();
}

function reset_color(context_bias) {
  // This function is needed to avoid drawing the wrong color to shapes for some reason
  context_bias.beginPath();
  context_bias.closePath();
  context_bias.fill();
}

function map_range(old_value, old_min, old_max, new_min, new_max) {
  // Function for mapping a value from one range of numbers to another.
  // This is used to change the length of the colored arrows with a simple decimal value
  return (
    ((old_value - old_min) * (new_max - new_min)) / (old_max - old_min) +
    new_min
  );
}

function drawBias(context_bias, u, v, w) {
  // Clamp the bias values between -1.0 and 1.0
  u = clamp(u, -1.0, 1.0);
  v = clamp(v, -1.0, 1.0);
  w = clamp(w, -1.0, 1.0);

  // Clear the canvas before redrawing
  context_bias.clearRect(
    0,
    0,
    context_bias.canvas.clientWidth,
    context_bias.canvas.clientHeight,
  );

  // Set the initial color and stroke thickness
  context_bias.strokeStyle = color_base_bias;
  context_bias.fillStyle = color_base_bias;
  context_bias.lineWidth = 3;

  // U- to U+
  canvas_arrow(context_bias, center_x, center_y, end_u_x, end_u_y);
  canvas_arrow(context_bias, center_x, center_y, start_u_x, start_u_y);

  // V- to V+
  canvas_arrow(context_bias, center_x, center_y, end_v_x, end_v_y);
  canvas_arrow(context_bias, center_x, center_y, start_v_x, start_v_y);

  // W- to W+
  canvas_arrow(context_bias, center_x, center_y, end_w_x, end_w_y);
  canvas_arrow(context_bias, center_x, center_y, start_w_x, start_w_y);

  // U bias (red)
  reset_color(context_bias);
  context_bias.strokeStyle = color_u;
  context_bias.fillStyle = color_u;
  canvas_arrow(
    context_bias,
    center_x,
    center_y,
    map_range(u, 1.0, -1.0, start_u_x, end_u_x),
    map_range(u, 1.0, -1.0, start_u_y, end_u_y),
    u,
  );

  // V bias (yellow)
  reset_color(context_bias);
  context_bias.strokeStyle = color_v;
  context_bias.fillStyle = color_v;
  canvas_arrow(
    context_bias,
    center_x,
    center_y,
    map_range(v, -1.0, 1.0, start_v_x, end_v_x),
    map_range(v, -1.0, 1.0, start_v_y, end_v_y),
    v,
  );

  // W bias (green)
  reset_color(context_bias);
  context_bias.strokeStyle = color_w;
  context_bias.fillStyle = color_w;
  canvas_arrow(
    context_bias,
    center_x,
    center_y,
    map_range(w, -1.0, 1.0, start_w_x, end_w_x),
    map_range(w, -1.0, 1.0, start_w_y, end_w_y),
    w,
  );

  // Set formatting for the axis labels
  context_bias.strokeStyle = color_base_bias;
  context_bias.fillStyle = color_base_bias;
  context_bias.lineWidth = 1;
  context_bias.font = '15px Arial';

  // Draw axis labels
  context_bias.fillText('U-', end_u_x + 10, end_u_y + 10);
  context_bias.fillText('U+', start_u_x - 25, start_u_y);
  context_bias.fillText('V-', start_v_x - 23, start_v_y + 8);
  context_bias.fillText('V+', end_v_x + 8, end_v_y + 3);
  context_bias.fillText('W-', start_w_x - 8, start_w_y - 8);
  context_bias.fillText('W+', end_w_x - 8, end_w_y + 20);
}

export default drawBias;
