const {
  datatypes,
  customNetFollowStateMetadata,
  customEstimatedStateMetadata,
  entityStateMetadata,
  desiredControlMetadata,
  lowLevelControlManeuverMetadata,
  desiredHeadingMetadata,
  desiredZMetadata,
  goToMetadata,
  netFollowMetadata,
  messages,
} = require('./IMCMetadata');

const encode = {
  customEstimatedState: encodeCustomEstimatedState,
  entityState: encodeEntityState,
  desiredControl: encodeDesiredControl,
  lowLevelControlManeuver: {
    desiredHeading: encodeLowLevelControlManeuverDesiredHeading,
    desiredZ: encodeLowLevelControlManeuverDesiredZ,
  },
  goTo: encodeGoTo,
  netFollow: encodeNetFollow,
  customNetFollow: encodeCustomNetFollowState,
  combine: encodeCombine,
};

function encodeCombine(bufArr, length = null) {
  /**
   * Combines array of buffer to a new buffer of given length
   * Example of use: encode.combine([encode.entityState({...}), encode.customEstimatedState({...})], 256)
   * This creates a new buffer of length 256 with the buffer from entistyState combined with customEstimatedState and padded with zeros
   * If length is ommitted the length will be the combined length of the buffers
   */
  if (length === null) {
    return Buffer.concat(bufArr);
  } else {
    return Buffer.concat(bufArr, length);
  }
}

function decode(buf) {
  /**
   * Decodes a Buffer with possibly multiple IMC messages
   *
   * Return an object of this type: {'entityState': {...}, 'customEstimatedState': ...}
   */
  let result = {};
  let offset = 0;
  let msg, name;
  do {
    [msg, offset, name] = decodeImc(buf, offset);
    if (offset === -1) break;
    result[name] = msg;
  } while (offset < buf.length);
  return result;
}

function encodeIMC(imcMessage, imcMessageMetadata) {
  // Check if assumed length is corret
  if (
    imcMessageMetadata.length !==
    imcMessageMetadata.id.datatype.length +
      lenImcMessage(imcMessageMetadata.message)
  ) {
    console.log(
      `WARNING: Length not equal to calculated length. Assumed length: ${
        imcMessageMetadata.length
      } calculated length: ${imcMessageMetadata.id.datatype.length +
        lenImcMessage(imcMessageMetadata.message)}`,
    );
  }

  let buf = Buffer.alloc(imcMessageMetadata.length);

  // Encode ID
  buf.writeUInt16BE(imcMessageMetadata.id.value);
  let offset = imcMessageMetadata.id.datatype.length;

  imcMessageMetadata.message.map(imcEntity => {
    let imcValue = Object.prototype.hasOwnProperty.call(imcEntity, 'value')
      ? imcEntity.value
      : imcMessage[imcEntity['name']];
    switch (imcEntity.datatype) {
      case datatypes.uint_8t:
        buf.writeUIntBE(imcValue, offset, imcEntity.datatype.length);
        break;
      case datatypes.uint_16t:
        buf.writeUInt16BE(imcValue, offset);
        break;
      case datatypes.uint_32t:
        buf.writeUInt32BE(imcValue, offset);
        break;
      case datatypes.fp32_t:
        buf.writeFloatBE(imcValue, offset);
        break;
      case datatypes.fp64_t:
        buf.writeDoubleBE(imcValue, offset);
        break;
      case datatypes.bitfield:
        buf.writeUIntBE(
          bitfieldToUIntBE(imcValue, imcEntity.fields),
          offset,
          datatypes.bitfield.length,
        );
        break;
      default:
        break;
    }
    offset += imcEntity.datatype.length;
  });
  return buf;
}

function decodeImc(buf, offset = 0, name = '') {
  let result = {};

  // Get information from id
  const id = buf.readUInt16BE(offset);

  // Return offset -1 if buffer has id 0
  if (id === 0) return [{}, -1, ''];

  const imcMessageMetadata = idToMessageMetadata[id];
  if (name) name += '.';
  name += imcMessageMetadata.name;
  offset += 2;

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
          result[imcEntity.name] = UIntBEToBitfield(
            buf.readUIntBE(offset, datatypes.bitfield.length),
            imcEntity.fields,
          );
          break;
        case datatypes.recursive:
          [result[imcEntity.name], offset, name] = decodeImc(buf, offset, name);
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

function bitfieldToUIntBE(values, metadataFieldsArray) {
  /**
   * `values` is a object with booleans. I.e. {NF: true, DP: false}
   * `metadataFieldsArray` is an array with name of field. I.e. ['NF', 'DP, '', ...]
   */
  let bitfield = 0x00000000;
  Object.keys(values).map(key => {
    if (values[key]) {
      let idx =
        metadataFieldsArray.length - (metadataFieldsArray.indexOf(key) + 1);
      bitfield = (1 << idx) ^ bitfield;
    }
  });
  return bitfield;
}

function UIntBEToBitfield(uint, metadataFieldsArray) {
  /**
   * `uint` should be an integer between 0 and 255 (8 bits)
   * `metadataFieldsArray` is an array with name of field. I.e. ['NF', 'DP, '', ...]
   *
   * Returns an object of this type: {'NF': true, 'DP': false}
   */
  let result = {};
  metadataFieldsArray.map((feild, i) => {
    if (feild) {
      result[feild] =
        ((1 << (metadataFieldsArray.length - (i + 1))) & uint) !== 0;
    }
  });
  return result;
}

function lenImcMessage(message) {
  return message.reduce((acc, field) => {
    return acc + field.datatype.length;
  }, 0);
}

function encodeCustomEstimatedState(customEstimatedState) {
  return encodeIMC(customEstimatedState, customEstimatedStateMetadata);
}

function encodeEntityState(entityState) {
  return encodeIMC(entityState, entityStateMetadata);
}

function encodeDesiredControl(desiredControl) {
  /*
  const desiredControl = {
    x: 1.1,
    y: 2.2,
    z: 3.3,
    k: 4.4,
    m: 5.5,
    n: 6.6,
    flags: {
      x: true,
      y: true,
      z: true,
      k: true,
      m: true,
      n: false,
    },
  };
*/
  return encodeIMC(desiredControl, desiredControlMetadata);
}

function encodeLowLevelControlManeuver(
  encodeControlManeuver,
  ControlManeuver,
  duration,
) {
  let idBuffer = Buffer.alloc(2);
  idBuffer.writeInt16BE(lowLevelControlManeuverMetadata.id.value);

  let desiredHeadingBuf = encodeControlManeuver(ControlManeuver);

  let durationBuffer = Buffer.alloc(2);
  durationBuffer.writeInt16BE(duration);

  return encode.combine([idBuffer, desiredHeadingBuf, durationBuffer]);
}

function encodeDesiredHeading(desiredHeading) {
  return encodeIMC(desiredHeading, desiredHeadingMetadata);
}

function encodeLowLevelControlManeuverDesiredHeading(desiredHeading, duration) {
  return encodeLowLevelControlManeuver(
    encodeDesiredHeading,
    desiredHeading,
    duration,
  );
}

function encodeDesiredZ(desiredZ) {
  return encodeIMC(desiredZ, desiredZMetadata);
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
  1003: customEstimatedStateMetadata,
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
