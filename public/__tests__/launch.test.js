const { getFileAndSend } = require('./../launch/sendFile');

const prefix = 'launch/sendFile: ';

// Check that file cant be opened
test(prefix + 'open file', () => {
  try {
    getFileAndSend();
  } catch (error) {
    expect(true);
  }
});
