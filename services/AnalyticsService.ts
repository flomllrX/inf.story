import MainStore from "../mobx/mainStore";
let _mainStore: MainStore;

const setMainStore = store => {
  _mainStore = store;
};

const openApp = () => {
  _mainStore.logEvent("open app");
};

const logAct = () => {
  _mainStore.logEvent("act");
};

export default {
  setMainStore,
  openApp,
  logAct
};
