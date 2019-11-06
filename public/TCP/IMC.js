const { crc16 } = require('crc');

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
  combine: encodeCombine,
};

// Length of header and footer in number of bytes
const headerLength = 20;
const footerLength = 2;

// Hard coded and inveted with Sintef
const rovImcAddress = 0x03c0;
const rovImcEntity = 0x07;
const ourImcAddress = 0x0007;
const ourImcEntity = 0x0a;

function encodeCombine(bufArr, length = null) {
  /**
   * Combines array of buffer to a new buffer of given length
   * Example of use: encode.combine([encode.entityState({...}), encode.estimatedState({...})], 256)
   * This creates a new buffer of length 256 with the buffer from entistyState combined with estimatedState and padded with zeros
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

function decodeHeader(buf, offset) {
  const header = {
    sync: null,
    mgid: null,
    size: null,
    timestamp: null,
    src: null,
    src_ent: null,
    dst: null,
    dst_ent: null,
  };
  // Synchronization Number uint16_t
  header.sync = buf.readUInt16BE(offset);
  offset += 2;
  // Message Identification Number uint16_t
  header.mgid = buf.readUInt16BE(offset);
  offset += 2;
  // Message size uint16_t
  header.size = buf.readUInt16BE(offset);
  offset += 2;
  // Time stamp fp64_t
  header.timestamp = buf.readDoubleBE(offset);
  offset += 8;
  // Source Address uint16_t
  header.src = buf.readUInt16BE(offset);
  offset += 2;
  // Source Entity uint8_t
  header.src_ent = buf.readUIntBE(offset, 1);
  offset += 1;
  // Destination Address uint16_t
  header.dst = buf.readUInt16BE(offset);
  offset += 2;
  // Destination Entity uint8_t
  header.dst_ent = buf.readUIntBE(offset, 1);
  return header;
}

function createHeader(imcMessageMetadata, messageLength) {
  /**
   * Creates the header for the IMC package. Followed specification here: https://www.lsts.pt/docs/imc/imc-5.4.11/Message%20Format.html#header
   * `messageLength` does not include length of header and footer
   */

  const headerBuf = Buffer.alloc(headerLength);
  let offset = 0;
  // Synchronization Number uint16_t
  headerBuf.writeUInt16BE(0xfe54, offset);
  offset += 2;
  // Message Identification Number uint16_t
  headerBuf.writeUInt16BE(imcMessageMetadata.id.value, offset);
  offset += 2;
  // Message size uint16_t
  headerBuf.writeUInt16BE(headerLength + messageLength + footerLength, offset);
  offset += 2;
  // Time stamp fp64_t
  headerBuf.writeDoubleBE(new Date() / 1000, offset);
  offset += 8;
  // Source Address uint16_t
  headerBuf.writeUInt16BE(ourImcAddress, offset);
  offset += 2;
  // Source Entity uint8_t
  headerBuf.writeUIntBE(ourImcEntity, offset, 1);
  offset += 1;
  // Destination Address uint16_t
  headerBuf.writeUInt16BE(rovImcAddress, offset);
  offset += 2;
  // Destination Entity uint8_t
  headerBuf.writeUIntBE(rovImcEntity, offset, 1);
  offset += 1;
  return headerBuf;
}

function encodeIMC(imcMessage, imcMessageMetadata, addFooterAndHeader = true) {
  /**
   * Main function for encoding IMC messages. If `addFooterAndHeader` header and footer will be added.
   * It if is false, just the id of the message is added.
   */
  let dataBuf = encodeIMCData(imcMessage, imcMessageMetadata);
  if (addFooterAndHeader) {
    let headerBuf = createHeader(imcMessageMetadata, dataBuf.length);
    let resultBuf = Buffer.concat([headerBuf, dataBuf]);
    return addFooter(resultBuf);
  } else {
    let idBuf = Buffer.alloc(2);
    idBuf.writeUInt16BE(imcMessageMetadata.id.value);
    return Buffer.concat([idBuf, dataBuf]);
  }
}

function addFooter(buf) {
  let crcValue = crc16(buf);

  let footerBuf = Buffer.alloc(2);
  footerBuf.writeUInt16BE(crcValue);
  // console.log(`crcValue: ${crcValue}`);
  return Buffer.concat([buf, footerBuf]);
}

function encodeIMCData(imcMessage, imcMessageMetadata) {
  /**
   * Encodes the data of an IMC message. This does not include id, footer and header
   */

  // Check if assumed length is corret
  // if (
  //   imcMessageMetadata.length !==
  //   imcMessageMetadata.id.datatype.length +
  //     lenImcMessage(imcMessageMetadata.message)
  // ) {
  //   console.log(
  //     `WARNING: Length not equal to calculated length. Assumed length: ${
  //       imcMessageMetadata.length
  //     } calculated length: ${imcMessageMetadata.id.datatype.length +
  //       lenImcMessage(imcMessageMetadata.message)}`,
  //   );
  // }

  let buf = Buffer.alloc(
    imcMessageMetadata.length - imcMessageMetadata.id.datatype.length,
  );
  let offset = 0;
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

function decodeImc(buf, offset = 0, name = '', hasHeader = true) {
  let result = {};
  let id;

  // Get information from id
  if (hasHeader) {
    const header = decodeHeader(buf, offset);
    id = header.mgid;
    offset += headerLength;
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
          result[imcEntity.name] = UIntBEToBitfield(
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

function encodeEstimatedState(estimatedState) {
  return encodeIMC(estimatedState, estimatedStateMetadata);
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
  controlManeuver,
  controlManeuverMetadata,
  duration,
) {
  let controlBuf = encodeControlManeuver(controlManeuver);

  // Add duration
  let durationBuf = Buffer.alloc(2);
  durationBuf.writeInt16BE(duration);

  let resultBuf = Buffer.concat([controlBuf, durationBuf]);

  // Add header
  let headerBuf = createHeader(
    lowLevelControlManeuverMetadata,
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
    desiredHeadingMetadata,
    duration,
  );
}

function encodeDesiredZ(desiredZ, addFooterAndHeader = false) {
  return encodeIMC(desiredZ, desiredZMetadata, addFooterAndHeader);
}

function encodeLowLevelControlManeuverDesiredZ(desiredZ, duration) {
  return encodeLowLevelControlManeuver(
    encodeDesiredZ,
    desiredZ,
    desiredZMetadata,
    duration,
  );
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
