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
};

function decode(buf) {
  let id = buf.readUInt16BE(0);
  return decodeImc(buf, idToMessageMetadata[id]);
}

const datatypes = {
  uint_8t: {
    name: 'uint_8t',
    length: 1,
  },
  uint_16t: {
    name: 'uint_16t',
    length: 2,
  },
  uint_32t: {
    name: 'uint_16t',
    length: 4,
  },
  fp32_t: {
    name: 'fp32_t',
    length: 4,
  },
  fp64_t: {
    name: 'fp64_t',
    length: 8,
  },
  bitfield: {
    name: 'bitfield',
    length: 1,
  },
  recursive: {
    name: 'recursive',
  },
};

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

function decodeImc(buf, imcMessageMetadata) {
  const result = {};
  let offset = 2; // Do not need to decode id

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
          result[imcEntity.name] = decodeImc(
            buf.subarray(
              offset,
              offset + idToMessageMetadata[buf.readUInt16BE(offset)].length,
            ),
            idToMessageMetadata[buf.readUInt16BE(offset)],
          );
          break;
        default:
          break;
      }
    }
    offset +=
      imcEntity.datatype === datatypes.recursive
        ? idToMessageMetadata[buf.readUInt16BE(offset)].length
        : imcEntity.datatype.length;
  });
  return result;
}

function bitfieldToUIntBE(values, metadataFieldsArray) {
  /**
   * `values` is a object with booleans. I.e. {NF: true, DP: false}
   * `metadataFieldsArray` is an array with name of field. I.e. ['NF', 'DP, '', ...]
   */
  let bitfield = 0x00000000;
  let keys = Object.keys(values);
  keys.map(key => {
    if (values[key]) {
      let idx =
        metadataFieldsArray.length - (metadataFieldsArray.indexOf(key) + 1);
      bitfield = (1 << idx) ^ bitfield;
    }
  });
  return bitfield;
}

function UIntBEToBitfield(uint, metadataFields) {
  let result = {};
  // console.log(`Recieved bitfield: ${uint}`);

  metadataFields.map((feild, i) => {
    if (feild) {
      result[feild] = ((1 << (metadataFields.length - (i + 1))) & uint) !== 0;
      // console.log(dec2bin(1 << (metadataFields.length - (i + 1))));
    }
  });
  return result;
}

function lenImcMessage(message) {
  return message.reduce((acc, field) => {
    return acc + field.datatype.length;
  }, 0);
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

const entityStateMetadata = {
  length: 8,
  id: {
    value: 1,
    datatype: datatypes.uint_16t,
  },
  message: [
    { name: 'state', datatype: datatypes.uint_8t },
    {
      name: 'flags',
      datatype: datatypes.bitfield,
      fields: ['NF', 'DP', '', '', '', '', '', ''],
    },
    {
      name: 'description',
      datatype: datatypes.uint_32t,
      value: 131072,
    },
  ],
};

function encodeEntityState(entityState) {
  return encodeIMC(entityState, entityStateMetadata);
}

const desiredControlMetadata = {
  length: 51,
  id: {
    value: 407,
    datatype: datatypes.uint_16t,
  },
  message: [
    {
      name: 'x',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'y',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'z',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'k',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'm',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'n',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'flags',
      datatype: datatypes.bitfield,
      fields: ['x', 'y', 'z', 'k', 'm', 'n', '', ''],
    },
  ],
};

function encodeDesiredControl(desiredControl) {
  return encodeIMC(desiredControl, desiredControlMetadata);
}

const lowLevelControlManeuverMetadata = {
  id: {
    value: 455,
    datatype: datatypes.uint_16t,
  },
  message: [
    {
      name: 'control',
      datatype: datatypes.recursive,
    },
    {
      name: 'duration',
      datatype: datatypes.uint_16t,
    },
  ],
};

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

  return Buffer.concat(
    [idBuffer, desiredHeadingBuf, durationBuffer],
    idBuffer.length + desiredHeadingBuf.length + durationBuffer.length,
  );
}

const desiredHeadingMetadata = {
  length: 10,
  id: {
    value: 400,
    datatype: datatypes.uint_16t,
  },
  message: [
    {
      name: 'value',
      datatype: datatypes.fp64_t,
    },
  ],
};

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

const desiredZMetadata = {
  length: 7,
  id: {
    value: 401,
    datatype: datatypes.uint_16t,
  },
  message: [
    {
      name: 'value',
      datatype: datatypes.fp32_t,
    },
    {
      name: 'z_units',
      datatype: datatypes.uint_8t,
    },
  ],
};

function encodeDesiredZ(desiredZ) {
  return encodeIMC(desiredZ, desiredZMetadata);
}

function encodeLowLevelControlManeuverDesiredZ(desiredZ, duration) {
  return encodeLowLevelControlManeuver(encodeDesiredZ, desiredZ, duration);
}

const goToMetadata = {
  length: 54,
  id: {
    value: 450,
    datatype: datatypes.uint_16t,
  },
  message: [
    {
      name: 'timeout',
      datatype: datatypes.uint_16t,
    },
    {
      name: 'lat',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'lon',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'z',
      datatype: datatypes.fp32_t,
    },
    {
      name: 'z_units',
      datatype: datatypes.uint_8t,
    },
    {
      name: 'speed',
      datatype: datatypes.fp32_t,
    },
    {
      name: 'speed_units',
      datatype: datatypes.uint_8t,
    },
    {
      name: 'roll',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'pitch',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'yaw',
      datatype: datatypes.fp64_t,
    },
  ],
};

function encodeGoTo(goTo) {
  return encodeIMC(goTo, goToMetadata);
}

const netFollowMetadata = {
  length: 33,
  id: {
    value: 465,
    datatype: datatypes.uint_16t,
  },
  message: [
    {
      name: 'timeout',
      datatype: datatypes.uint_16t,
    },
    {
      name: 'name',
      datatype: datatypes.uint_32t,
      value: 151110,
    },
    {
      name: 'd',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'v',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'z',
      datatype: datatypes.fp64_t,
    },
    {
      name: 'z_units',
      datatype: datatypes.uint_8t,
    },
  ],
};

function encodeNetFollow(netFollow) {
  return encodeIMC(netFollow, netFollowMetadata);
}

const customNetFollowStateMetadata = {
  length: 18,
  id: {
    value: 1002,
    datatype: datatypes.uint_16t,
  },
  message: [
    {
      name: 'd',
      datatype: datatypes.fp32_t,
    },
    {
      name: 'v',
      datatype: datatypes.fp32_t,
    },
    {
      name: 'angle',
      datatype: datatypes.fp64_t,
    },
  ],
};

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

module.exports = { encode, decode };
