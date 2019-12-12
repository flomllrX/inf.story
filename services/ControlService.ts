import { StoryBit } from "../types";
import MainStore from "../mobx/mainStore";
import ApiService from "./ApiService";
let _mainStore: MainStore;

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

const loadStory: (storyId: string) => void = async storyId => {
  const { storyBits, error } = await ApiService.getStory(storyId);
  if (error) {
    _mainStore.setError(
      "Loading your adventure failed. Please make sure you're connected to the internet"
    );
  } else {
    _mainStore.setStory(storyBits);
  }
};

const setStory: (storyId: string) => void = async storyId => {
  _mainStore.setStoryLoadingState(true);
  await loadStory(storyId);
  _mainStore.setStoryId(storyId);
  _mainStore.setStoryLoadingState(false);
};

const resumeStory: () => void = async () => {
  _mainStore.setStoryLoadingState(true);
  const storyId = _mainStore.storyId;
  await loadStory(storyId);
  _mainStore.setStoryLoadingState(false);
};

const loadStories: () => void = async () => {
  const deviceId = _mainStore.userId;
  if (deviceId) {
    const { stories, error } = await ApiService.getStories(deviceId);
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

export default {
  setMainStore,
  startStory,
  act,
  loadStory,
  createStory,
  loadStories,
  resumeStory,
  setStory
};
