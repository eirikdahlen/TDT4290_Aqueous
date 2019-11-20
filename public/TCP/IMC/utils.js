const { crc16 } = require('crc');
const {
  HEADER_LENGTH,
  ROV_IMC_ADDRESS,
  ROV_IMC_ENTITY,
  OUR_IMC_ADDRESS,
  OUR_IMC_ENTITY,
} = require('./constants');
const { datatypes } = require('./IMCMetadata');

/**
 * A datatype object with a name and length.
 * @typedef {Object<string, any>} Datatype
 * @property {string} name The name of the datatype.
 * @property {number} length The length in bytes of the datatype.
 */

/**
 * This function converts an object to and bitfield representated as an uint8.
 * True is represented as one and false as zero.
 *
 * Example:
 * ```javascript
 * let bit_number = bitfieldToUIntBE({A: true, B: false, C: true}, ['A', 'B', 'C', '', '', '', '', ''])
 * >>> bit_number = 0x10100000
 * ```
 *
 * @param { {[key: string]: boolean; } } values Object with values to parse
 * @param { String[] } fields Array with keys to parse
 *
 * @returns { number }  bitfield  An uint8 number from bitfield
 */
function bitfieldToUIntBE(values, fields) {
  let bitfield = 0x00000000;
  Object.keys(values).map(key => {
    if (values[key]) {
      let idx = fields.length - (fields.indexOf(key) + 1);
      bitfield = (1 << idx) ^ bitfield;
    }
  });
  return bitfield;
}

/**
 * Decodes a number to bit field
 * @param {number} uint Number to decode
 * @param {String[]} fields Array of fields to store result
 *
 * @returns {{[key: string]: boolean;}} Object with result of decoding
 */
function uIntBEToBitfield(uint, fields) {
  let result = {};
  fields.map((feild, i) => {
    if (feild) {
      result[feild] = ((1 << (fields.length - (i + 1))) & uint) !== 0;
    }
  });
  return result;
}

/**
 * Writes value to buffer.
 *
 * @param { Buffer } buf Buffer to write to
 * @param { number } offset Offset in number of bytes to start writing `value`
 * @param { number | object } value Value to write
 * @param { Datatype } datatype The datatype to write
 * @param { String[] } fields Fields used for writing bit fields
 *
 * @returns { number } New offset to start writing to `buf`
 */
function writeToBuf(buf, offset, value, datatype, fields = []) {
  switch (datatype) {
    case datatypes.uint_8t:
      buf.writeUIntBE(value, offset, datatype.length);
      break;
    case datatypes.uint_16t:
      buf.writeUInt16BE(value, offset);
      break;
    case datatypes.uint_32t:
      buf.writeUInt32BE(value, offset);
      break;
    case datatypes.fp32_t:
      buf.writeFloatBE(value, offset);
      break;
    case datatypes.fp64_t:
      buf.writeDoubleBE(value, offset);
      break;
    case datatypes.bitfield:
      buf.writeUIntBE(
        bitfieldToUIntBE(value, fields),
        offset,
        datatypes.bitfield.length,
      );
      break;
    default:
      break;
  }
  return offset + datatype.length;
}

/**
 * A IMC header object.
 * @typedef {Object<string, number>} ImcHeader
 * @property {number} sync The synchronization number marks the beginning of a packet
 * @property {number} mgid The identification number of the message contained in the packet
 * @property {number} size The size of the message data in the packet (excluding header and footer)
 * @property {number} timestamp The time when the packet was sent, as seen by the packet dispatcher
 * @property {number} src The Source IMC system ID
 * @property {number} src_ent The entity generating this message at the source address
 * @property {number} dst The Destination IMC system ID
 * @property {number} dst_ent The entity that should process this message at the destination address
 */

/**
 * Creates header for the IMC package. Followed specification [here](https://www.lsts.pt/docs/imc/imc-5.4.11/Message%20Format.html#header).
 *
 * @param {ImcHeader} imcHeader IMC header object
 *
 * @returns {Buffer} Buffer with header values
 */
function encodeHeader(imcHeader) {
  const headerBuf = Buffer.alloc(HEADER_LENGTH);
  let offset = 0; // eslint-disable-line no-unused-vars
  offset = writeToBuf(headerBuf, offset, imcHeader.sync, datatypes.uint_16t);
  offset = writeToBuf(headerBuf, offset, imcHeader.mgid, datatypes.uint_16t);
  offset = writeToBuf(headerBuf, offset, imcHeader.size, datatypes.uint_16t);
  offset = writeToBuf(headerBuf, offset, imcHeader.timestamp, datatypes.fp64_t);
  offset = writeToBuf(headerBuf, offset, imcHeader.src, datatypes.uint_16t);
  offset = writeToBuf(headerBuf, offset, imcHeader.src_ent, datatypes.uint_8t);
  offset = writeToBuf(headerBuf, offset, imcHeader.dst, datatypes.uint_16t);
  offset = writeToBuf(headerBuf, offset, imcHeader.dst_ent, datatypes.uint_8t);
  return headerBuf;
}

/**
 * Encodes a header with some value hard coded for our system.
 * @param {number} mgid Message Id
 * @param {number} size Size of message (excluding header and footer)
 *
 * @returns {Buffer} Buffer with header values
 */
function encodeAqueousHeader(mgid, size) {
  /** @type {ImcHeader} */
  const header = {
    sync: 0xfe54,
    mgid: mgid,
    size: size,
    timestamp: new Date() / 1000,
    src: OUR_IMC_ADDRESS,
    src_ent: OUR_IMC_ENTITY,
    dst: ROV_IMC_ADDRESS,
    dst_ent: ROV_IMC_ENTITY,
  };
  return encodeHeader(header);
}

/**
 * Decodes IMC header.
 * @param {Buffer} buf Buffer to decode
 * @param {number} offset Offet in bytes to start parsing heading
 *
 * @returns {ImcHeader} Object containing IMC header values
 */
function decodeHeader(buf, offset) {
  /** @type {ImcHeader} */
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

/**
 * Encodes an IMC message to a buffer by using an IMC message matadata object and the corresponding values form the `imcMessage`.
 * This function only encodes the data part of the message (i.e. it does not include header and footer)
 *
 * @param {{[key: string]: number | {[key: string]: boolean}}} imcMessage The message to encode
 * @param {Object} imcMessageMetadata Metadata object of IMC message to encode
 *
 * @returns {Buffer} Buffer with the encoded IMC message
 */
function encodeImcMessage(imcMessage, imcMessageMetadata) {
  let buf = Buffer.alloc(
    imcMessageMetadata.length - imcMessageMetadata.id.datatype.length,
  );
  let offset = 0;
  imcMessageMetadata.message.map(imcEntity => {
    let imcValue = Object.prototype.hasOwnProperty.call(imcEntity, 'value')
      ? imcEntity.value
      : imcMessage[imcEntity['name']];
    offset = writeToBuf(
      buf,
      offset,
      imcValue,
      imcEntity.datatype,
      imcEntity.datatype.name === 'bitfield' ? imcEntity.fields : [],
    );
  });
  return buf;
}

/**
 * Returns a new buffer with footer appended.
 * The footer contains a crc16 checksum (uint_16t) calculated on the incomming buffer.
 *
 * @param {Buffer} buf Buffer with IMC package
 * @returns {Buffer} New buffer with footer appended at the end
 */
function getBufferWithFooterAppended(buf) {
  let crcValue = crc16(buf);

  let footerBuf = Buffer.alloc(2);
  footerBuf.writeUInt16BE(crcValue);
  return Buffer.concat([buf, footerBuf]);
}

/**
 * Get a buffer containing id of IMC message
 * @param {number} mgid Id of IMC message
 *
 * @returns {Buffer} Buffer with message id
 */
function getIdBuffer(mgid) {
  let buf = Buffer.alloc(2);
  buf.writeUInt16BE(mgid);
  return buf;
}

module.exports = {
  bitfieldToUIntBE,
  uIntBEToBitfield,
  getBufferWithFooterAppended,
  encodeHeader,
  encodeAqueousHeader,
  decodeHeader,
  datatypes,
  writeToBuf,
  encodeImcMessage,
  getIdBuffer,
};
