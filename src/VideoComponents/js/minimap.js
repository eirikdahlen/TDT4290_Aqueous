import { radiansToDegrees } from './tools.js';

function drawBoat(ctx, boatWidth, boatLength, boatHeading) {
  const boatDegrees = radiansToDegrees(boatHeading);
  ctx.beginPath();
  ctx.moveTo(0, -boatLength / 2);
  ctx.lineTo(0, (-2 * boatLength) / 3);
  ctx.font = '13px Arial';
  ctx.textAlign = 'center';
  ctx.strokeText(boatDegrees.toFixed(0) + '\xB0', 0, (-2 * boatLength) / 2.5);
  ctx.lineTo(0, -boatLength / 2);
  ctx.lineTo(boatWidth, -boatWidth);
  ctx.lineTo(boatWidth, boatLength / 2);
  ctx.lineTo(-boatWidth, boatLength / 2);
  ctx.lineTo(-boatWidth, -boatWidth);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();
}

function drawROV(ctx, rovSize) {
  ctx.beginPath();
  ctx.moveTo(-rovSize / 2, -rovSize / 2);
  ctx.lineTo(rovSize / 2, -rovSize / 2);
  ctx.lineTo(rovSize / 2, rovSize / 2);
  ctx.lineTo(-rovSize / 2, rovSize / 2);
  ctx.lineTo(-rovSize / 2, -rovSize / 2);
  ctx.moveTo(0, -rovSize / 2);
  ctx.lineTo(rovSize / 3, -rovSize / 3 - rovSize / 2);
  ctx.lineTo(-rovSize / 3, -rovSize / 3 - rovSize / 2);
  ctx.closePath();
}

function drawNEDframe(ctx, mapWidth, boatWidth, rovSize) {
  ctx.beginPath();
  //east arrow
  ctx.moveTo(0, 0);
  ctx.lineTo(mapWidth / 2 - boatWidth - rovSize / 2, 0);
  ctx.lineTo(
    mapWidth / 2 - boatWidth - rovSize / 2 - mapWidth / 40,
    mapWidth / 40,
  );
  ctx.moveTo(mapWidth / 2 - boatWidth - rovSize / 2, 0);
  ctx.lineTo(
    mapWidth / 2 - boatWidth - rovSize / 2 - mapWidth / 40,
    -mapWidth / 40,
  );
  //nort arrow
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -(mapWidth / 2 - boatWidth - rovSize / 2));
  ctx.lineTo(
    -mapWidth / 40,
    -(mapWidth / 2 - boatWidth - rovSize / 2) + mapWidth / 40,
  );
  ctx.moveTo(0, -(mapWidth / 2 - boatWidth - rovSize / 2));
  ctx.lineTo(
    mapWidth / 40,
    -(mapWidth / 2 - boatWidth - rovSize / 2) + mapWidth / 40,
  );
  ctx.stroke();

  ctx.strokeText(
    'N',
    mapWidth / 40,
    -(mapWidth / 2 - boatWidth - rovSize / 2) + mapWidth / 40,
  );
  ctx.strokeText(
    'E',
    mapWidth / 2 - boatWidth - rovSize - mapWidth / 40,
    mapWidth / 15,
  );
}

function drawArrow(ctx, rovSize, mapWidth) {
  ctx.beginPath();
  ctx.moveTo(mapWidth / 2, 0);
  ctx.lineTo(mapWidth / 2 - rovSize, rovSize);
  ctx.lineTo(mapWidth / 2 - rovSize, -rovSize);
  ctx.closePath();
}

export { drawBoat, drawROV, drawNEDframe, drawArrow };
