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

export const customEstimatedStateMetadata = {
  length: 62,
  id: {
    value: 1003,
    datatype: datatypes.uint_16t,
  },
  message: [
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
  ],
};

export const entityStateMetadata = {
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
      fields: ['DP', 'NF', '', '', '', '', '', ''],
    },
    {
      name: 'description',
      datatype: datatypes.uint_32t,
      value: 131072,
    },
  ],
};

export const desiredControlMetadata = {
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

export const lowLevelControlManeuverMetadata = {
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

export const desiredHeadingMetadata = {
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

export const desiredZMetadata = {
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

export const customGoToMetadata = {
  // Based on https://www.lsts.pt/docs/imc/imc-5.4.11/Maneuvering.html, but relative
  length: 28,
  id: {
    value: 1004,
    datatype: datatypes.uint_16t,
  },
  message: [
    {
      name: 'timeout',
      datatype: datatypes.uint_16t,
    },
    {
      name: 'x',
      datatype: datatypes.fp32_t,
    },
    {
      name: 'y',
      datatype: datatypes.fp32_t,
    },
    {
      name: 'z',
      datatype: datatypes.fp32_t,
    },
    {
      name: 'yaw',
      datatype: datatypes.fp64_t,
    },
  ],
};

export const netFollowMetadata = {
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

export const customNetFollowStateMetadata = {
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
