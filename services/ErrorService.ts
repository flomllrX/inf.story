import MainStore from "../mobx/mainStore";

let _mainStore: MainStore;

const setMainStore = store => {
  _mainStore = store;
};

const criticalError = (error: any) => {
  _mainStore.setError(error);
};

const uncriticalError = (message: string, duration?: number) => {
  _mainStore.setUncriticalError(message);
  setTimeout(() => _mainStore.setUncriticalError(undefined), duration || 2000);
};

const storyError = (message: string, duration?: number) => {
  _mainStore.setStoryError(message);
  setTimeout(() => _mainStore.setStoryError(undefined), duration || 2000);
};

const log = obj => {
  const logObj = { log: obj };
  _mainStore.log += JSON.stringify(logObj);
};

export default {
  setMainStore,
  criticalError,
  uncriticalError,
  log,
  storyError
};
