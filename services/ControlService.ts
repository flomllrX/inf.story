import { StoryBit } from "../types";
import MainStore from "../mobx/mainStore";
import ApiService from "./ApiService";
let _mainStore: MainStore;
import Constants from "expo-constants";

let CodePush;
if (Constants.appOwnership !== "expo") {
  CodePush = require("react-native-code-push");
}

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
    _mainStore.setError(
      "Creating your adventure failed. Please make sure you're connected to the internet"
    );
  } else {
    _mainStore.setStoryId(uid);
    _mainStore.setStory(storyBits);
    _mainStore.setLastActStory(uid);
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
};

const loadStory: (
  storyId: string
) => Promise<{ error: any }> = async storyId => {
  const { storyBits, error } = await ApiService.getStory(storyId);
  if (error) {
    _mainStore.setError("ControlService.loadStory: " + JSON.stringify(error));
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
  const storyId = _mainStore.storyId;
  await loadStory(storyId);
  _mainStore.setStoryLoadingState(false);
};

const loadStories: () => void = async () => {
  if (!_mainStore) return;
  const deviceId = _mainStore.userId;
  if (deviceId) {
    const { stories, error } = await ApiService.getStories(deviceId);
    console.log("Error", error);
    if (error) {
      _mainStore.setError("Could not load stories.");
    } else {
      const storiesDict = {};
      stories.forEach(s => {
        storiesDict[s.uid] = s;
      });
      _mainStore.setStories(storiesDict);
    }
  }
};

const wipeData: () => void = async () => {
  await _mainStore.clearAsyncStorage();
  if (Constants.appOwnership !== "expo") {
    CodePush.restartApp();
  }
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
  wipeData
};
