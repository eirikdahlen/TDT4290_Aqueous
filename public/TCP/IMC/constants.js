// Length of header and footer in number of bytes
const HEADER_LENGTH = 20;
const FOOTER_LENGTH = 2;

const SYNC = 0xfe54;

// Hard coded and inveted with Sintef
const ROV_IMC_ADDRESS = 0x03c0;
const ROV_IMC_ENTITY = 0x07;
const OUR_IMC_ADDRESS = 0x0007;
const OUR_IMC_ENTITY = 0x0a;

module.exports = {
  HEADER_LENGTH,
  FOOTER_LENGTH,
  SYNC,
  ROV_IMC_ADDRESS,
  ROV_IMC_ENTITY,
  OUR_IMC_ADDRESS,
  OUR_IMC_ENTITY,
};
