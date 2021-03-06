import { action, observable, autorun, reaction } from "mobx";
import { StoryBit, StorySmall, Prompt } from "../types";
import { AsyncStorage, Platform } from "react-native";
import uuid from "uuid/v4";
import ControlService from "../services/ControlService";
import ApiService from "../services/ApiService";
import { Origin } from "../types";
import { ReactChild } from "react";
import Constants from "expo-constants";
let amp;
const ampEnabled = Constants.appOwnership !== "expo" 
if (ampEnabled) {
  amp = require("amplitude-js");
}
const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem("@" + key, "" + value);
  } catch (e) {
    // saving error
  }
};

const storeObjectData = async (key: string, value: any) => {
  return storeData(key, JSON.stringify(value));
};

const getData = async (key: string) => {
  try {
    return await AsyncStorage.getItem("@" + key);
  } catch (e) {
    // error reading value
  }
};

const getObjectData = async (key: string) => {
  try {
    const obj = await getData(key);
    return JSON.parse(obj);
  } catch (e) {}
};

export default class MainStore {
  @observable userId: string;

  @observable storyId: string;
  @observable creatingStory = false;
  @observable story: StoryBit[];
  @observable loadingStory = false;
  @observable stories: { [uid: string]: StorySmall };
  @observable lastActStoryId: string;
  @observable storyError: string;
  @observable achievements: string[];

  @observable error: any;
  @observable uncriticalError: string;
  @observable infering = false;
  @observable actionType: "ACT_SAY" | "ACT_DO" = "ACT_DO"; // Move to chatbox
  @observable tutorialDone: boolean;

  @observable log = "";
  @observable apiAvailable = true;

  @observable modalVisible: boolean;
  @observable.shallow modalContent: ReactChild;

  @observable prompts: Prompt[];

  @observable currentPromptTitle: string;
  @observable currentPromptContext: string;
  @observable currentPromptUid: number;
  @observable promptButtonActivated = true;

  @observable amplitude: any;

  @action setPrompts(prompts: Prompt[]) {
    this.prompts = prompts;
  }

  @action addPrompt(prompt: Prompt) {
    this.prompts.unshift(prompt);
  }

  @action setCurrentPromptTitle(title: string) {
    this.currentPromptTitle = title;
  }

  @action setCurrentPromptContext(context: string) {
    this.currentPromptContext = context;
  }

  @action setCurrentPromptUid(uid: number) {
    this.currentPromptUid = uid;
  }

  @action setPromptButtonActivated(activated: boolean) {
    this.promptButtonActivated = activated;
  }

  @action deletePrompt(promptId: number) {
    this.prompts = this.prompts.filter(p => p.uid !== promptId);
    this.currentPromptContext = "";
    this.currentPromptContext = "";
    this.currentPromptUid = undefined;
    this.promptButtonActivated = true;
  }

  @action setStoryId(storyId: string) {
    this.storyId = storyId;
    storeData("storyId", storyId);
  }

  @action setUserId(userId: string) {
    this.userId = userId;
    storeData("userId", userId);
  }

  @action setCreatingStoryState(state: boolean) {
    this.creatingStory = state;
  }

  @action setStoryLoadingState(state: boolean) {
    this.loadingStory = state;
  }

  @action setLastActStory(storyId: string) {
    this.lastActStoryId = storyId;
  }

  @action setApiAvailability(available: boolean) {
    this.apiAvailable = available;
  }

  @action setError(error: any) {
    this.error = error;
  }

  @action setUncriticalError(error: string) {
    this.uncriticalError = error;
  }

  @action setStoryError(error: string) {
    this.storyError = error;
  }

  @action clearError() {
    this.error = undefined;
  }

  @action setStory(story: StoryBit[]) {
    this.story = story.reverse();
    storeObjectData("story", story);
  }

  @action setStories(stories: { [uid: string]: StorySmall }) {
    this.stories = stories;
  }

  @action addStoryBits(storyBits: StoryBit[]) {
    if (!storyBits) {
      return;
    }
    const newStoryBits = storyBits.reverse();
    this.story = newStoryBits.concat(this.story);
  }

  @action setInfering(status: boolean) {
    this.infering = status;
  }

  @action toggleActionType() {
    this.actionType = this.actionType === "ACT_DO" ? "ACT_SAY" : "ACT_DO";
  }

  @action addStoryToHistory(
    uid: string,
    storyBits: StoryBit[],
    title?: string
  ) {
    try {
      const { payload } = storyBits.find(e => e.type === "ORIGIN");
      const { name, class: playerClass } = payload as Origin;
      if (!this.stories) this.stories = {};
      this.stories[uid] = {
        uid,
        origin: payload as Origin,
        createdAt: new Date().toISOString(),
        title: title || `${name}, the ${playerClass}`,
        updatedAt: new Date().toISOString()
      };
    } catch (e) {
      this.log += JSON.stringify({ error: e, location: "addStoryToHistory" });
    }
  }

  @action deleteStory(storyId: string) {
    this.stories && delete this.stories[storyId];
  }

  @action storyUpdatedAt(storyId: string) {
    if (this.stories) {
      this.stories[storyId] = {
        ...this.stories[storyId],
        updatedAt: new Date().toISOString()
      };
    }
  }

  @action setTutorialDone() {
    this.tutorialDone = true;
    storeData("tutorialDone", "true");
  }

  @action setAchievements(achievements: string[]) {
    this.achievements = achievements;
    console.log(achievements);
  }

  @action addAchievement(achievement: string) {
    if (this.achievements) {
      this.achievements.push(achievement);
    } else {
      this.achievements = [achievement];
    }
  }

  @action setModalVisibility(visible: boolean) {
    this.modalVisible = visible;
  }

  @action setModalContent(content: ReactChild) {
    this.modalContent = content;
  }

  @action logEvent(event) {
    if(ampEnabled){
      this.amplitude.logEvent(event)
    }
  }

  clearAsyncStorage = async () => {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
      AsyncStorage.clear();
    }
  };

  clearUncriticalItems = async () => {
    Promise.all([
      new Promise(resolve =>
        AsyncStorage.removeItem("@storyId", () => resolve())
      ),
      new Promise(resolve => AsyncStorage.removeItem("@story", () => resolve()))
    ]);
  };

  signup = async () => {
    const userId = uuid();
    const signupError = err => {
      this.setError(JSON.stringify(err));
      reaction(
        () => this.error,
        (data, r) => {
          this.signup();
          r.dispose();
        }
      );
    };
    try {
      const err = await ApiService.signup(userId);
      if (!err) {
        this.userId = userId;
        storeData("userId", this.userId);
      } else {
        signupError({
          ...err,
          location: "mainStore.constructor signup api error" + err.location
        });
      }
    } catch (e) {
      signupError({
        ...e,
        location: "mainStore.constructor signup api exception" + e.location
      });
    }
  };

  manualSignup = () => {
    getData("userId").then(async userId => {
      if (userId) {
        this.userId = userId;
      } else {
        await this.signup();
      }
    });

    // Load storyId from device
    getData("storyId").then(storyId => {
      if (storyId) {
        this.storyId = storyId;
        ControlService.loadStory(storyId);
      }
    });

    // Load past story from device
    getObjectData("story").then(story => {
      if (story) {
        this.story = story;
      }
    });

    // Check if tutorial is done
    getData("tutorialDone").then(tutorialDone => {
      if (tutorialDone) {
        this.tutorialDone = true;
      }
    });
  };

  checkAvailability = () => {
    console.log("Checking availability");
    ApiService.checkAvailability().then(available => {
      this.setApiAvailability(available);
      if (!available) {
        setTimeout(this.checkAvailability, 10000);
      }
    });
  };

  constructor() {
    if (Platform.OS !== "web") {
      // Load userId from device
      getData("userId").then(async userId => {
        if (userId) {
          this.userId = userId;
        } else {
          await this.signup(); // only signup in app
          // Generate user id
        }

        // setup analytics
	if(ampEnabled){
          this.amplitude = amp.getInstance();
          this.amplitude.init("4bccfe413c519c04549cbed588017a81");
          this.amplitude.setUserId(this.userId);
	}
      });

      // Load storyId from device
      getData("storyId").then(storyId => {
        if (storyId) {
          this.storyId = storyId;
          ControlService.loadStory(storyId);
        }
      });

      // Load past story from device
      getObjectData("story").then(story => {
        if (story) {
          this.story = story;
        }
      });

      // Check if tutorial is done
      getData("tutorialDone").then(tutorialDone => {
        if (tutorialDone) {
          this.tutorialDone = true;
        }
      });
    }
  }
}
