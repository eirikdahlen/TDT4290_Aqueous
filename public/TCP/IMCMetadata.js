const messages = {
  customEstimatedState: 'customEstimatedState',
  entityState: 'entityState',
  desiredControl: 'desiredControl',
  desiredHeading: 'desiredHeading',
  desiredZ: 'desiredZ',
  lowLevelControlManeuver: {
    desiredHeading: 'lowLevelControlManeuver.desiredHeading',
    desiredZ: 'lowLevelControlManeuver.desiredZ',
  },
  goTo: 'goTo',
  netFollow: 'netFollow',
  customNetFollowState: 'customNetFollowState',
};

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
    name: 'uint_32t',
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

const customEstimatedStateMetadata = {
  // https://www.lsts.pt/docs/imc/imc-5.4.11/Navigation.html#estimated-state
  name: messages.customEstimatedState,
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

const entityStateMetadata = {
  // https://www.lsts.pt/docs/imc/imc-5.4.11/Core.html#entity-state
  name: messages.entityState,
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

const desiredControlMetadata = {
  // https://www.lsts.pt/docs/imc/imc-5.4.11/Guidance.html#desired-control
  name: messages.desiredControl,
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

const desiredHeadingMetadata = {
  // https://www.lsts.pt/docs/imc/imc-5.4.11/Guidance.html#desired-heading
  name: messages.desiredHeading,
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

const desiredZMetadata = {
  // https://www.lsts.pt/docs/imc/imc-5.4.11/Guidance.html#desired-z
  name: messages.desiredZ,
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

const lowLevelControlManeuverMetadata = {
  // https://www.lsts.pt/docs/imc/imc-5.4.11/Maneuvering.html#low-level-control-maneuver
  name: 'lowLevelControlManeuver', // This must be treated seperablely because it encapsulates other messages
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

const goToMetadata = {
  // https://www.lsts.pt/docs/imc/imc-5.4.11/Maneuvering.html
  name: messages.goTo,
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

const netFollowMetadata = {
  // https://www.lsts.pt/docs/imc/imc-5.4.11/Maneuvering.html#custom-maneuver
  name: messages.netFollow,
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

const customNetFollowStateMetadata = {
  // https://www.lsts.pt/docs/imc/imc-5.4.11/Custom.html
  name: messages.customNetFollowState,
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

module.exports = {
  datatypes,
  messages,
  customEstimatedStateMetadata,
  customNetFollowStateMetadata,
  entityStateMetadata,
  desiredControlMetadata,
  lowLevelControlManeuverMetadata,
  desiredHeadingMetadata,
  desiredZMetadata,
  netFollowMetadata,
  goToMetadata,
};
