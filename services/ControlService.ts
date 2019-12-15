import { StoryBit } from "../types";
import MainStore from "../mobx/mainStore";
import ApiService from "./ApiService";
let _mainStore: MainStore;
import Constants from "expo-constants";
import CodePush from "react-native-code-push";
import ErrorService from "./ErrorService";

const setMainStore = store => {
  _mainStore = store;
};

const createStory: () => void = () => {
  _mainStore.setCreatingStoryState(true);
};

const startStory: (playerClass: string, name: string) => void = async (
  playerClass,
  name
) => {
  _mainStore.setStoryLoadingState(true);
  _mainStore.setCreatingStoryState(false);
  const userId = _mainStore.userId;
  const { error, uid, storyBits } = await ApiService.startStory(
    userId,
    playerClass,
    name
  );
  if (error) {
    const errorObj = typeof error === "string" ? { error } : error;
    ErrorService.criticalError({ ...errorObj, code: 5000 });
  } else {
    _mainStore.setStoryId(uid);
    _mainStore.setStory(storyBits);
    _mainStore.setLastActStory(uid);
    _mainStore.addStoryToHistory(uid, storyBits);
  }
  _mainStore.setStoryLoadingState(false);
};

const act: (payload: string) => void = async payload => {
  _mainStore.setInfering(true);
  const type = _mainStore.actionType;
  const storyId = _mainStore.storyId;
  _mainStore.setLastActStory(storyId);
  const { newStoryBits } = await ApiService.act(payload, type, storyId);
  _mainStore.addStoryBits(newStoryBits);
  _mainStore.setInfering(false);
  _mainStore.storyUpdatedAt(storyId);
};

const loadStory: (
  storyId: string
) => Promise<{ error: any }> = async storyId => {
  const { storyBits, error } = await ApiService.getStory(storyId);
  if (error) {
    ErrorService.criticalError({ ...error, code: 5001 });
  } else {
    _mainStore.setStory(storyBits);
  }
  return { error };
};

const setStory: (storyId: string) => void = async storyId => {
  _mainStore.setStoryLoadingState(true);
  const { error } = await loadStory(storyId);
  if (!error) {
    _mainStore.setStoryId(storyId);
  }
  _mainStore.setStoryLoadingState(false);
};

const resumeStory: () => void = async () => {
  _mainStore.setStoryLoadingState(true);
  const { lastActStoryId } = _mainStore;
  await loadStory(lastActStoryId);
  _mainStore.setStoryLoadingState(false);
};

const loadStories: () => void = async () => {
  if (!_mainStore) return;
  const deviceId = _mainStore.userId;
  if (deviceId) {
    const { stories, error } = await ApiService.getStories(deviceId);
    if (error) {
      ErrorService.uncriticalError("Could not load stories");
    } else {
      const storiesDict = {};
      stories.forEach(s => {
        storiesDict[s.uid] = s;
      });
      _mainStore.setStories(storiesDict);
      stories.length > 0 && _mainStore.setLastActStory(stories[0].uid);
    }
  }
};

const restartApp: () => void = async () => {
  if (Constants.appOwnership !== "expo") {
    CodePush.restartApp();
  }
};

const closeTutorial: () => void = async () => {
  _mainStore.setTutorialDone();
};

const wipeData: () => void = async () => {
  _mainStore.setError(undefined);
  await _mainStore.clearUncriticalItems();
  restartApp();
};

export default {
  setMainStore,
  startStory,
  act,
  loadStory,
  createStory,
  loadStories,
  resumeStory,
  setStory,
  wipeData,
  closeTutorial
};
