function heading_init(context_heading) {
  // Basic formatting
  context_heading.textAlign = 'center';
  context_heading.lineWidth = 1.5;
}

var color_base;

function wraparound(value, max_value) {
  // Wraparound
  if (value >= max_value) {
    value -= max_value;
  } else if (value <= -100) {
    value += max_value;
  }

  return value;
}

function drawHeading(context_heading, degrees, isLocked, lockedValue) {
  if (isLocked) {
    color_base = '#B0B0B0';
  } else {
    color_base = '#FFFFFF';
  }

  context_heading.strokeStyle = color_base;
  context_heading.fillStyle = color_base;

  const width = context_heading.canvas.clientWidth;
  const width_half = width / 2;

  const degree_step = 15; // Number of degrees between each displayed number
  const degree_space = 50; // Spacing between each displayed number

  // Handle negative degrees and degrees larger than 360
  degrees = ((degrees % 360) + 360) % 360;
  lockedValue = ((lockedValue % 360) + 360) % 360;

  // Convert degrees to pixel offset
  const heading = (degree_space * (120 - degrees)) / degree_step;

  // Clear the screen (except the bottom triangle, which does not move!)
  context_heading.clearRect(0, 0, width, context_heading.canvas.clientHeight);

  // Optional separator line
  /* context_heading.beginPath();
	context_heading.moveTo(0, 56);
	context_heading.lineTo(800, 56);
	context_heading.stroke(); */

  // Create a label for every degree number to be displayed
  for (var i = 0; i < 360 / degree_step; i++) {
    var text; // Number of degrees, or compass direction
    var x_position; // X position of the current displayed number

    var angle = i * degree_step; // Calculate the actual degree value
    var max_x_position = (360 / degree_step) * degree_space; // Calculate the maximum x-position a label can have

    // Replace numbers with N, E, S, W labels
    switch (angle) {
      case 0:
        text = 'N';
        context_heading.font = '15px Arial';
        break;
      case 90:
        text = 'E';
        context_heading.font = '15px Arial';
        break;
      case 180:
        text = 'S';
        context_heading.font = '15px Arial';
        break;
      case 270:
        text = 'W';
        context_heading.font = '15px Arial';
        break;
      default:
        text = angle.toString();
        context_heading.font = '11px Arial';
        break;
    }

    // Calculate the x position that the label must have
    x_position = i * degree_space + (heading % max_x_position);
    x_position = wraparound(x_position, max_x_position);

    // Draw the actual label
    context_heading.fillText(text, x_position, 35);

    // Draw the indicator line below each label
    context_heading.beginPath();
    context_heading.moveTo(x_position, 43);
    context_heading.lineTo(x_position, 53);
    context_heading.stroke();
  }

  // Draw autoheading indicator line
  if (isLocked) {
    context_heading.strokeStyle = '#FF0000';
    let x_position_locked =
      (lockedValue * degree_space) / degree_step + (heading % max_x_position);
    x_position_locked = wraparound(x_position_locked, max_x_position);
    context_heading.beginPath();
    context_heading.moveTo(x_position_locked, 10);
    context_heading.lineTo(x_position_locked, 20);
    context_heading.stroke();
    context_heading.strokeStyle = color_base;
  }

  // Draw number showing the numerical value of the heading
  context_heading.font = '18px Arial';
  context_heading.fillText(degrees.toFixed(0) + '\xB0', width_half, 100);

  // Draw a triangle indicating the heading
  context_heading.beginPath();
  context_heading.moveTo(width_half, 58);
  context_heading.lineTo(width_half + 3, 68);
  context_heading.lineTo(width_half - 3, 68);
  context_heading.lineTo(width_half, 58);
  context_heading.stroke();
  context_heading.fill();
}

export { heading_init, drawHeading };
