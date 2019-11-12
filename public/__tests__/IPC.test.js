const { initGlobals } = require('./../utils/globals');
const { sendMessage, setIPCListeners } = require('./../utils/IPC');

const prefix = 'controls/mapping: ';

const clearData = () => {
  initGlobals();
};

// Reset states after every test
beforeEach(() => {
  return clearData();
});

// Sends message to frontend
test(prefix + 'send message', () => {
  const isMsgSent = sendMessage('test-message');
  expect(isMsgSent).toBe(false);
});

// Test IPC-listener not mocked
test(prefix + 'set IPC', () => {
  try {
    setIPCListeners();
  } catch (error) {
    expect(true);
  }
});
