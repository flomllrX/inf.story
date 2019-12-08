import { StoryBit } from "../types";
import MainStore from "../mobx/mainStore";
import ApiService from "./ApiService";
let _mainStore: MainStore;

const setMainStore = store => {
  _mainStore = store;
};

const startStory: (playerClass: string, name: string) => void = async (
  playerClass,
  name
) => {
  const userId = _mainStore.userId;
  const { error, uid, storyBits } = await ApiService.startStory(
    userId,
    playerClass,
    name
  );
  if (error) {
    console.log("Error", error);
    _mainStore.setError(error);
  } else {
    _mainStore.setStoryId(uid);
    _mainStore.setStory(storyBits);
    _mainStore.setStoryState(true);
  }
};

const act: (payload: string) => void = async payload => {
  _mainStore.setInfering(true);
  const type = _mainStore.actionType;
  const storyId = _mainStore.storyId;
  const { newStoryBits } = await ApiService.act(payload, type, storyId);
  _mainStore.addStoryBits(newStoryBits);
  _mainStore.setInfering(false);
};

const hideStory: () => void = async () => {
  _mainStore.setStoryState(false);
};

const loadStory: (storyId: string) => void = async storyId => {
  const { storyBits, error } = await ApiService.getStory(storyId);
  if (error) {
    _mainStore.setError(error);
  } else {
    _mainStore.setStory(storyBits);
  }
};

export default {
  setMainStore,
  startStory,
  act,
  hideStory,
  loadStory
};
