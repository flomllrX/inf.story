import MainStore from "../mobx/mainStore";

let _mainStore: MainStore;

const setMainStore = store => {
  _mainStore = store;
};

const criticalError = (error: any) => {
  _mainStore.setError(error);
};

const uncriticalError = (message: string) => {
  _mainStore.setUncriticalError(message);
  setTimeout(() => _mainStore.setUncriticalError(undefined), 2000);
};

const log = obj => {
  // const logObj = { log: obj };
  // _mainStore.log += JSON.stringify(logObj);
};

export default {
  setMainStore,
  criticalError,
  uncriticalError,
  log
};
