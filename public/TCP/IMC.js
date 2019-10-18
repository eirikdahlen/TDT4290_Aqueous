const encode = {
  estimatedState: encodeEstimatedState,
};

const decode = {
  estimatedState: decodeEstimatedState,
};

const datatypes = {
  uint_16t: {
    name: 'uint_16t',
    length: 2,
  },
  fp32_t: {
    name: 'fp32_t',
    length: 4,
  },
  fp64_t: {
    name: 'fp64_t',
    length: 8,
  },
};

function encodeIMC(imcMessage, imcMessageMetadata) {
  // Check if assumed length is corret
  console.log(
    imcMessageMetadata.length,
    lenImcMessage(imcMessageMetadata.message),
  );

  let buf = Buffer.alloc(imcMessageMetadata.length);

  // Encode ID
  buf.writeUInt16BE(imcMessageMetadata.id.value);

  console.log(
    imcMessageMetadata.id.datatype.length,
    imcMessageMetadata.message[0].datatype.length,
  );

  let offset =
    imcMessageMetadata.id.datatype.length -
    imcMessageMetadata.message[0].datatype.length;

  imcMessageMetadata.message.map(value => {
    offset += value.datatype.length;
    console.log(offset);

    switch (value.datatype) {
      case datatypes.uint_16t:
        buf.writeUInt16BE(imcMessage[value['name']], offset);
        break;
      case datatypes.fp32_t:
        buf.writeFloatBE(imcMessage[value['name']], offset);
        break;
      case datatypes.fp64_t:
        buf.writeDoubleBE(imcMessage[value['name']], offset);
        break;
      default:
        break;
    }
  });
  return buf;
}

function decodeImc(buf, imcMessageMetadata) {
  const result = {};
  let offset =
    imcMessageMetadata.id.datatype.length -
    imcMessageMetadata.message[0].datatype.length;

  imcMessageMetadata.message.map(value => {
    offset += value.datatype.length;
    switch (value.datatype) {
      case datatypes.uint_16t:
        result[value.name] = buf.readUInt16BE(offset);
        break;
      case datatypes.fp32_t:
        result[value.name] = buf.readFloatBE(offset);
        break;
      case datatypes.fp64_t:
        result[value.name] = buf.readDoubleBE(offset);
        break;
      default:
        break;
    }
  });
  return result;
}

function lenImcMessage(message) {
  let len = 0;
  message.map(a => {
    len += a.datatype.length;
    console.log(a);
  });
  return len;
}

const estimatedStateMetadata = {
  length: 90,
  id: {
    value: 350,
    datatype: datatypes.uint_16t,
  },
  message: [
    { name: 'lat', datatype: datatypes.fp64_t },
    { name: 'lon', datatype: datatypes.fp64_t },
    { name: 'height', datatype: datatypes.fp32_t },
    { name: 'x', datatype: datatypes.fp32_t },
    { name: 'y', datatype: datatypes.fp32_t },
    { name: 'z', datatype: datatypes.fp32_t },
    { name: 'phi', datatype: datatypes.fp32_t },
    { name: 'theta', datatype: datatypes.fp32_t },
    { name: 'psi', datatype: datatypes.fp32_t },
    { name: 'u', datatype: datatypes.fp32_t },
    { name: 'v', datatype: datatypes.fp32_t },
    { name: 'w', datatype: datatypes.fp32_t },
    { name: 'vx', datatype: datatypes.fp32_t },
    { name: 'vy', datatype: datatypes.fp32_t },
    { name: 'vz', datatype: datatypes.fp32_t },
    { name: 'p', datatype: datatypes.fp32_t },
    { name: 'q', datatype: datatypes.fp32_t },
    { name: 'r', datatype: datatypes.fp32_t },
    { name: 'depth', datatype: datatypes.fp32_t },
    { name: 'alt', datatype: datatypes.fp32_t },
  ],
};

function encodeEstimatedState(estimatedState) {
  return encodeIMC(estimatedState, estimatedStateMetadata);
}

function decodeEstimatedState(buf) {
  return decodeImc(buf, estimatedStateMetadata);
}

module.exports = { encode, decode };
