function depth_init(context_depth) {
  // Basic formatting
  const color_base = '#FFFFFF';
  context_depth.strokeStyle = color_base;
  context_depth.fillStyle = color_base;
  context_depth.textAlign = 'right';
  context_depth.textBaseline = 'middle';

  draw_indicator_depth(context_depth);
}

// Dummy animation
/*var offset_depth = 0;
var offset_depth_mult = -1;*/

function drawDepth(context_depth, depth) {
  const num_space = 50; // Spacing between the numerical labels

  var offset_depth = depth;

  // Clear the canvas every frame (except the rightmost triangle, which is static)
  context_depth.clearRect(0, 0, 47, 500);

  // Add 200 labels (the ROV never descends more than 200 meters)
  for (var i = 0; i < 201; i++) {
    var y_position = (i - offset_depth) * num_space + 250; // Calculate y position of each label

    // Enlarge every 5th label
    if (i % 5 === 0) {
      context_depth.font = '15px Arial';
    } else {
      context_depth.font = '11px Arial';
    }

    // Draw the actual label
    context_depth.fillText(i.toString(), 30, y_position);

    // Draw indicator lines next to every label
    context_depth.beginPath();
    context_depth.moveTo(37, y_position);
    context_depth.lineTo(47, y_position);
    context_depth.stroke();
  }

  // Dummy animation
  /*if (y_position <= 250) {
    offset_depth_mult = 1;
  } else if (y_position >= 201 * num_space + 250) {
    offset_depth_mult = -1;
  }

  // Dummy animation
  offset_depth += 5 * offset_depth_mult;*/
}

function draw_indicator_depth(context_depth) {
  // Draw the static indicator triangle
  context_depth.beginPath();
  context_depth.moveTo(50, 250);
  context_depth.lineTo(60, 253);
  context_depth.lineTo(60, 247);
  context_depth.lineTo(50, 250);
  context_depth.stroke();
  context_depth.fill();
}

export { depth_init, drawDepth };
