import { action, observable, autorun, reaction } from "mobx";
import { StoryBit, StorySmall } from "../types";
import { AsyncStorage, Platform } from "react-native";
import uuid from "uuid/v4";
import ControlService from "../services/ControlService";
import ApiService from "../services/ApiService";
import { Origin } from "../types";

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

  @observable error: any;
  @observable uncriticalError: string;
  @observable infering = false;
  @observable actionType: "ACT_SAY" | "ACT_DO" = "ACT_DO"; // Move to chatbox

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

  @action setError(error: any) {
    this.error = error;
  }

  @action setUncriticalError(error: string) {
    this.uncriticalError = error;
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

  @action addStoryToHistory(uid: string, storyBits: StoryBit[]) {
    const { payload } = storyBits.find(e => e.type === "ORIGIN");
    const { name, class: playerClass } = payload as Origin;
    this.stories[uid] = {
      uid,
      origin: payload as Origin,
      createdAt: new Date().toISOString(),
      title: `${name}, the ${playerClass}`,
      updatedAt: new Date().toISOString()
    };
  }

  @action storyUpdatedAt(storyId: string) {
    this.stories[storyId] = {
      ...this.stories[storyId],
      updatedAt: new Date().toISOString()
    };
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

  constructor() {
    const signup = async () => {
      const userId = uuid();
      const signupError = err => {
        this.setError(JSON.stringify(err));
        reaction(
          () => this.error,
          (data, r) => {
            signup();
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

    if (Platform.OS !== "web") {
      // Load userId from device
      getData("userId").then(async userId => {
        if (userId) {
          this.userId = userId;
        } else {
          await signup(); // only signup in app
          // Generate user id
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
    }

    // Loading story
    // autorun(() => {
    //   if (this.loadingStory && !this.storyId) {
    //     NavigationService.replace("LoadingStory");
    //   }
    // });

    // // Display story
    // autorun(() => {
    //   if (this.navigatorAvailable && !this.loadingStory && this.storyId) {
    //     NavigationService.replace("Story");
    //   }
    // });

    // // Display error
    // autorun(() => {
    //   if (this.navigatorAvailable && this.error !== undefined) {
    //     NavigationService.replace("Error");
    //   }
    // });
  }
}
