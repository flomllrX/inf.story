import { StoryBit, Location, Prompt } from "../types";
import MainStore from "../mobx/mainStore";
import ApiService from "./ApiService";
let _mainStore: MainStore;
import Constants from "expo-constants";
import CodePush from "react-native-code-push";
import ErrorService from "./ErrorService";
import { ReactChild } from "react";

const setMainStore = store => {
  _mainStore = store;
};

const createStory: () => void = () => {
  _mainStore.setCreatingStoryState(true);
};

const abortStoryCreation: () => void = () => {
  _mainStore.setCreatingStoryState(false);
};

const startStory: (
  playerClass?: string,
  name?: string,
  promptId?: string
) => void = async (playerClass, name, promptId) => {
  console.log("Starting story", playerClass, name, promptId);
  try {
    _mainStore.setStoryLoadingState(true);
    _mainStore.setCreatingStoryState(false);
    const userId = _mainStore.userId;
    const { error, uid, storyBits, title } = await ApiService.startStory(
      userId,
      playerClass,
      name,
      promptId
    );
    if (error) {
      const errorObj = typeof error === "string" ? { error } : error;
      ErrorService.criticalError({ ...errorObj, code: 5000 });
    } else {
      _mainStore.setStoryId(uid);
      _mainStore.setStory(storyBits);
      _mainStore.setLastActStory(uid);
      _mainStore.addStoryToHistory(uid, storyBits, title);
    }
    _mainStore.setStoryLoadingState(false);
  } catch (e) {
    ErrorService.log({ error: e });
  }
};

const createPrompt: (title: string, context: string) => Promise<any> = async (
  title,
  context
) => {
  _mainStore.setPromptButtonActivated(false);
  const userId = _mainStore.userId;
  if (
    !(context.includes(".") || context.includes("!") || context.includes("?"))
  ) {
    context += ".";
  }
  const prompt = (await ApiService.createPrompt(
    userId,
    context,
    title
  )) as Prompt;
  if (prompt && prompt.uid) {
    _mainStore.addPrompt(prompt);
    _mainStore.setPromptButtonActivated(true);
    _mainStore.setCurrentPromptUid(prompt.uid);
  }
  return prompt;
};

const updatePrompt: (
  promptId: number,
  title: string,
  context: string,
  publ?: boolean
) => Promise<any> = async (promptId, title, context, publ) => {
  _mainStore.setPromptButtonActivated(false);
  const response = await ApiService.updatePrompt(
    promptId,
    title,
    context,
    publ
  );
  if (response.ok) {
    let { prompts } = _mainStore;
    prompts = prompts.map(p => {
      if (p.uid === promptId) {
        p.title = title;
        p.context = context;
        p.public = publ;
      }
      return p;
    });
    _mainStore.setPrompts(prompts);
  }
  console.log(response);
  _mainStore.setPromptButtonActivated(true);
  return response;
};

const act: (payload: string) => void = async payload => {
  _mainStore.setInfering(true);
  const type = _mainStore.actionType;
  const storyId = _mainStore.storyId;
  _mainStore.setLastActStory(storyId);
  if (type && storyId) {
    const { newStoryBits, error } = await ApiService.act(
      payload,
      type,
      storyId
    );
    _mainStore.addStoryBits(newStoryBits);
    _mainStore.storyUpdatedAt(storyId);

    // Update achievements
    newStoryBits &&
      newStoryBits.forEach(s => {
        if (s.type === "LOCATION") {
          const location = (s.payload as unknown) as Location;
          if (location && location.firstVisit) {
            _mainStore.addAchievement("visited:" + location.location);
          }
        }
      });

    if (error) {
      ErrorService.storyError(
        "The AI is confused by your input. Try something else.",
        5000
      );
    }
  }
  _mainStore.setInfering(false);
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
  _mainStore.setStoryId(lastActStoryId);
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

const setTutorialDone: () => void = async () => {
  _mainStore.setTutorialDone();
};

const openModal: (content: ReactChild) => void = content => {
  _mainStore.setModalVisibility(true);
  _mainStore.setModalContent(content);
};

const closeModal: () => void = async () => {
  _mainStore.setModalVisibility(false);
};

const wipeData: () => void = async () => {
  _mainStore.setError(undefined);
  await _mainStore.clearUncriticalItems();
  restartApp();
};

const loadAchievements: () => void = async () => {
  if (_mainStore.userId) {
    const { achievements, error } = await ApiService.getAchievements(
      _mainStore.userId
    );
    if (error) {
      ErrorService.uncriticalError("Could not load achievements");
    }
    if (achievements) {
      _mainStore.setAchievements(achievements);
    }
  }
};

const rollback: (bitId: number) => void = async bitId => {
  _mainStore.setInfering(true);
  const { storyId, story } = _mainStore;
  const { error, storyBits } = await ApiService.rollback(
    storyId,
    story.length - bitId
  );
  if (error || !storyBits) {
    ErrorService.uncriticalError("Rollback failed");
  } else {
    _mainStore.setStory(storyBits);
  }
  _mainStore.setInfering(false);
};

const useDiscordCode: (code: string) => void = async code => {
  const { userId } = _mainStore;
  if (userId && code) {
    const { ok, error } = await ApiService.useDiscordCode(code, userId);
    if (error || !ok) {
      ErrorService.uncriticalError("Please enter a valid code");
    } else {
      _mainStore.addAchievement("discord");
    }
  } else {
    ErrorService.uncriticalError("UserID not found");
  }
};

const deleteStory: (storyId: string) => void = async storyId => {
  const { ok, error } = await ApiService.deleteStory(storyId);
  if (ok && !error) {
    _mainStore.deleteStory(storyId);
  } else {
    ErrorService.uncriticalError("Could not delete the story");
  }
};

const deletePrompt: (promptId: number) => void = async promptId => {
  _mainStore.setPromptButtonActivated(false);
  const { ok, error } = await ApiService.deletePrompt(promptId);
  if (ok && !error) {
    _mainStore.deletePrompt(promptId);
  } else {
    ErrorService.uncriticalError("Could not delete the story opening");
  }
  _mainStore.setPromptButtonActivated(true);
};

const loadPrompts: () => void = async () => {
  const { userId } = _mainStore;
  const { prompts } = await ApiService.getPrompts(userId);
  _mainStore.setPrompts(prompts);
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
  setTutorialDone,
  openModal,
  closeModal,
  abortStoryCreation,
  loadAchievements,
  rollback,
  useDiscordCode,
  deleteStory,
  createPrompt,
  loadPrompts,
  updatePrompt,
  deletePrompt
};
