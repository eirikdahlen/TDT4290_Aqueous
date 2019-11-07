const {
  datatypes,
  customNetFollowStateMetadata,
  estimatedStateMetadata,
  entityStateMetadata,
  desiredControlMetadata,
  lowLevelControlManeuverMetadata,
  desiredHeadingMetadata,
  desiredZMetadata,
  goToMetadata,
  netFollowMetadata,
  messages,
} = require('./IMCMetadata');

const { HEADER_LENGTH } = require('./constants');
const {
  uIntBEToBitfield,
  addFooter,
  encodeAqeousHeader,
  decodeHeader,
  encodeImcMessage,
} = require('./utils');

const encode = {
  estimatedState: encodeEstimatedState,
  entityState: encodeEntityState,
  desiredControl: encodeDesiredControl,
  lowLevelControlManeuver: {
    desiredHeading: encodeLowLevelControlManeuverDesiredHeading,
    desiredZ: encodeLowLevelControlManeuverDesiredZ,
  },
  goTo: encodeGoTo,
  netFollow: encodeNetFollow,
  customNetFollow: encodeCustomNetFollowState,
  combine: Buffer.concat,
};

function encodeIMC(imcMessage, imcMessageMetadata, addFooterAndHeader = true) {
  /**
   * Main function for encoding IMC messages. If `addFooterAndHeader` header and footer will be added.
   * It if is false, just the id of the message is added.
   */
  let dataBuf = encodeImcMessage(imcMessage, imcMessageMetadata);
  if (addFooterAndHeader) {
    let headerBuf = encodeAqeousHeader(
      imcMessageMetadata.id.value,
      dataBuf.length,
    );
    let resultBuf = Buffer.concat([headerBuf, dataBuf]);
    return addFooter(resultBuf);
  } else {
    let idBuf = Buffer.alloc(2);
    idBuf.writeUInt16BE(imcMessageMetadata.id.value);
    return Buffer.concat([idBuf, dataBuf]);
  }
}

function decode(buf) {
  /**
   * Decodes a Buffer with possibly multiple IMC messages
   *
   * Return an object of this type: {'entityState': {...}, 'estimatedState': ...}
   */
  let result = {};
  let offset = 0;
  let msg, name;
  do {
    // No more messages
    if (buf.readUInt16BE(offset) === 0) break;
    [msg, offset, name] = decodeImc(buf, offset);
    // Add two bytes for footer
    offset += 2;
    result[name] = msg;
  } while (offset < buf.length);
  return result;
}

function decodeImc(buf, offset = 0, name = '', hasHeader = true) {
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

  // // Return offset -1 if buffer has id 0
  // if (id === 0) return [{}, -1, ''];

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
          [result[imcEntity.name], offset, name] = decodeImc(
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

function encodeEstimatedState(estimatedState) {
  return encodeIMC(estimatedState, estimatedStateMetadata);
}

function encodeEntityState(entityState) {
  return encodeIMC(entityState, entityStateMetadata);
}

function encodeDesiredControl(desiredControl) {
  return encodeIMC(desiredControl, desiredControlMetadata);
}

function encodeLowLevelControlManeuver(
  encodeControlManeuver,
  controlManeuver,
  duration,
) {
  let controlBuf = encodeControlManeuver(controlManeuver);

  // Add duration
  let durationBuf = Buffer.alloc(2);
  durationBuf.writeInt16BE(duration, 0);

  let resultBuf = Buffer.concat([controlBuf, durationBuf]);

  // Add header
  let headerBuf = encodeAqeousHeader(
    lowLevelControlManeuverMetadata.id.value,
    resultBuf.length,
  );
  resultBuf = Buffer.concat([headerBuf, resultBuf]);

  return addFooter(resultBuf);
}

function encodeDesiredHeading(desiredHeading, addFooterAndHeader = false) {
  return encodeIMC(desiredHeading, desiredHeadingMetadata, addFooterAndHeader);
}

function encodeLowLevelControlManeuverDesiredHeading(desiredHeading, duration) {
  return encodeLowLevelControlManeuver(
    encodeDesiredHeading,
    desiredHeading,
    duration,
  );
}

function encodeDesiredZ(desiredZ, addFooterAndHeader = false) {
  return encodeIMC(desiredZ, desiredZMetadata, addFooterAndHeader);
}

function encodeLowLevelControlManeuverDesiredZ(desiredZ, duration) {
  return encodeLowLevelControlManeuver(encodeDesiredZ, desiredZ, duration);
}

function encodeGoTo(goTo) {
  return encodeIMC(goTo, goToMetadata);
}

function encodeNetFollow(netFollow) {
  return encodeIMC(netFollow, netFollowMetadata);
}

function encodeCustomNetFollowState(customNetFollowState) {
  return encodeIMC(customNetFollowState, customNetFollowStateMetadata);
}

const idToMessageMetadata = {
  350: estimatedStateMetadata,
  1: entityStateMetadata,
  407: desiredControlMetadata,
  400: desiredHeadingMetadata,
  401: desiredZMetadata,
  455: lowLevelControlManeuverMetadata,
  450: goToMetadata,
  465: netFollowMetadata,
  1002: customNetFollowStateMetadata,
};

module.exports = { encode, decode, messages };
