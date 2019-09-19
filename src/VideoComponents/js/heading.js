function heading_init(context_heading) {
  // Basic formatting
  const color_base_heading = '#FFFFFF';
  context_heading.strokeStyle = color_base_heading;
  context_heading.fillStyle = color_base_heading;
  context_heading.textAlign = 'center';

  // Draw the indicator triangle
  draw_indicator_heading(context_heading);
}

var offset_heading = 0; // Number holding the current offset_heading of the widget

function drawHeading(context_heading) {
  var degree_step = 15; // Number of degrees between each displayed number
  var degree_space = 50; // Spacing between each displayed number

  // Clear the screen (except the bottom triangle, which does not move!)
  context_heading.clearRect(0, 0, 800, 53);

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
    x_position = i * degree_space + (offset_heading % max_x_position);

    // Wraparound
    if (x_position >= max_x_position) {
      x_position -= max_x_position;
    } else if (x_position <= -100) {
      x_position += max_x_position;
    }

    // Draw the actual label
    context_heading.fillText(text, x_position, 35);

    // Draw the indicator line below each label
    context_heading.beginPath();
    context_heading.moveTo(x_position, 43);
    context_heading.lineTo(x_position, 53);
    context_heading.stroke();
  }

  // Dummy animation
  offset_heading -= 3;
}

function draw_indicator_heading(context_heading) {
  // Draw a triangle indicating the heading
  context_heading.beginPath();
  context_heading.moveTo(400, 58);
  context_heading.lineTo(403, 68);
  context_heading.lineTo(397, 68);
  context_heading.lineTo(400, 58);
  context_heading.stroke();
  context_heading.fill();
}

export { heading_init, drawHeading };
