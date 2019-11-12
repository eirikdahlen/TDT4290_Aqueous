export const resetAllBias = () => {
  window.ipcRenderer.send('reset-all-bias');
};

export default {
  resetAllBias,
};
