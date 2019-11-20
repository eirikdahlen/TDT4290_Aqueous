const {
  datatypes,
  customNetFollowStateMetadata,
  customEstimatedStateMetadata,
  entityStateMetadata,
  desiredControlMetadata,
  lowLevelControlManeuverMetadata,
  desiredHeadingMetadata,
  desiredZMetadata,
  customGoToMetadata,
  netFollowMetadata,
  messages,
} = require('./IMCMetadata');

const { HEADER_LENGTH, FOOTER_LENGTH } = require('./constants');
const {
  uIntBEToBitfield,
  encodeAqueousHeader,
  decodeHeader,
  encodeImcMessage,
  getBufferWithFooterAppended,
  getIdBuffer,
} = require('./utils');

const encode = {
  customEstimatedState: encodeCustomEstimatedState,
  entityState: encodeEntityState,
  desiredControl: encodeDesiredControl,
  lowLevelControlManeuver: {
    desiredHeading: encodeLowLevelControlManeuverDesiredHeading,
    desiredZ: encodeLowLevelControlManeuverDesiredZ,
  },
  customGoTo: encodeCustomGoTo,
  netFollow: encodeNetFollow,
  customNetFollow: encodeCustomNetFollowState,
  combine: Buffer.concat,
};

/**
 * Encodes and IMC message with header and footer to a `Buffer`.
 * The buffer will be of length of the encoded message (i.e. no values will be padded).
 *
 * Combining several messages and padding must be made with the `encode.combine` function.
 *
 * @param {{[key: string]: number | {[key: string]: boolean}}} imcMessage IMC message to encode
 * @param {Object} imcMessageMetadata Metadata of message to encode
 *
 * @returns {Buffer} Buffer
 */
function encodeImcPackage(imcMessage, imcMessageMetadata) {
  let dataBuf = encodeImcMessage(imcMessage, imcMessageMetadata);
  let headerBuf = encodeAqueousHeader(
    imcMessageMetadata.id.value,
    dataBuf.length,
  );
  let resultBuf = Buffer.concat([headerBuf, dataBuf]);
  return getBufferWithFooterAppended(resultBuf);
}

/**
 * Since a Low LevelControl Maneuver message encapsulates other messages it has to be handeled differently.
 *
 * @param {{[key: string]: number | {[key: string]: boolean}}} controlManeuver Values of message
 * @param {Object} controlManeuverMetadata Metadata of message to encode
 * @param {number} duration Duration of control maneuver
 *
 * @returns {Buffer} Buffer of encoded IMC message
 */
function encodeLowLevelControlManeuver(
  controlManeuver,
  controlManeuverMetadata,
  duration,
) {
  let controlManeuverId = getIdBuffer(controlManeuverMetadata.id.value);
  let controlBuf = encodeImcMessage(controlManeuver, controlManeuverMetadata);

  // Add duration
  let durationBuf = Buffer.alloc(2);
  durationBuf.writeInt16BE(duration, 0);

  let resultBuf = Buffer.concat([controlManeuverId, controlBuf, durationBuf]);

  // Add header
  let headerBuf = encodeAqueousHeader(
    lowLevelControlManeuverMetadata.id.value,
    resultBuf.length,
  );
  resultBuf = Buffer.concat([headerBuf, resultBuf]);

  return getBufferWithFooterAppended(resultBuf);
}

/**
 * Main entry point for decoding buffer containing and IMC message package (including header and buffer).
 *
 * This function will decode possiblely multiple messages as long as they are concatinated without spacing.
 * It will handle padding of the buffer as long as the padding consist of zeros.
 * @param {Buffer} buf Buffer to decode
 *
 * @returns {{[key: string]: Object}} Object with IMC message as key (use `messages` to recieve the messages)
 */
function decode(buf) {
  let result = {};
  let offset = 0;
  let msg, name;
  do {
    // No more messages
    if (buf.readUInt16BE(offset) === 0) break;
    [msg, offset, name] = decodeImcMessage(buf, offset);
    // Add two bytes for footer
    offset += 2;
    result[name] = msg;
  } while (offset + HEADER_LENGTH + FOOTER_LENGTH < buf.length);
  return result;
}

function decodeImcMessage(buf, offset = 0, name = '', hasHeader = true) {
  let result = {};
  let id;

  // Get information from id
  if (hasHeader) {
    const header = decodeHeader(buf, offset);
    id = header.mgid;
    offset += HEADER_LENGTH;
  } else {
    id = buf.readUInt16BE(offset);
    offset += 2;
  }

  const imcMessageMetadata = idToMessageMetadata[id];
  if (name) name += '.';
  name += imcMessageMetadata.name;

  imcMessageMetadata.message.map(imcEntity => {
    if (!Object.prototype.hasOwnProperty.call(imcEntity, 'value')) {
      switch (imcEntity.datatype) {
        case datatypes.uint_8t:
          result[imcEntity.name] = buf.readUIntBE(
            offset,
            datatypes.uint_8t.length,
          );
          break;
        case datatypes.uint_16t:
          result[imcEntity.name] = buf.readUInt16BE(offset);
          break;
        case datatypes.uint_32t:
          result[imcEntity.name] = buf.readUInt32BE(offset);
          break;
        case datatypes.fp32_t:
          result[imcEntity.name] = buf.readFloatBE(offset);
          break;
        case datatypes.fp64_t:
          result[imcEntity.name] = buf.readDoubleBE(offset);
          break;
        case datatypes.bitfield:
          result[imcEntity.name] = uIntBEToBitfield(
            buf.readUIntBE(offset, datatypes.bitfield.length),
            imcEntity.fields,
          );
          break;
        case datatypes.recursive:
          [result[imcEntity.name], offset, name] = decodeImcMessage(
            buf,
            offset,
            name,
            false,
          );
          break;
        default:
          break;
      }
    }
    if (imcEntity.datatype !== datatypes.recursive) {
      offset += imcEntity.datatype.length;
    }
  });
  return [result, offset, name];
}

function encodeCustomEstimatedState(estimatedState) {
  return encodeImcPackage(estimatedState, customEstimatedStateMetadata);
}

function encodeEntityState(entityState) {
  return encodeImcPackage(entityState, entityStateMetadata);
}

function encodeDesiredControl(desiredControl) {
  return encodeImcPackage(desiredControl, desiredControlMetadata);
}

function encodeLowLevelControlManeuverDesiredHeading(desiredHeading, duration) {
  return encodeLowLevelControlManeuver(
    desiredHeading,
    desiredHeadingMetadata,
    duration,
  );
}

function encodeLowLevelControlManeuverDesiredZ(desiredZ, duration) {
  return encodeLowLevelControlManeuver(desiredZ, desiredZMetadata, duration);
}

function encodeCustomGoTo(goTo) {
  return encodeImcPackage(goTo, customGoToMetadata);
}

function encodeNetFollow(netFollow) {
  return encodeImcPackage(netFollow, netFollowMetadata);
}

function encodeCustomNetFollowState(customNetFollowState) {
  return encodeImcPackage(customNetFollowState, customNetFollowStateMetadata);
}

const idToMessageMetadata = {
  1003: customEstimatedStateMetadata,
  1: entityStateMetadata,
  407: desiredControlMetadata,
  400: desiredHeadingMetadata,
  401: desiredZMetadata,
  455: lowLevelControlManeuverMetadata,
  1004: customGoToMetadata,
  465: netFollowMetadata,
  1002: customNetFollowStateMetadata,
};

module.exports = { encode, decode, messages };
