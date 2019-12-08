import { action, observable, autorun } from "mobx";
import NavigationService from "../services/NavigationService";
import { StoryBit } from "../types";
import { AsyncStorage } from "react-native";
import uuid from "uuid/v4";

const storeData = async (key: string, value: any) => {
  console.log(key, value);
  try {
    await AsyncStorage.setItem("@" + key, "" + value);
  } catch (e) {
    // saving error
  }
};

const getData = async (key: string) => {
  try {
    return await AsyncStorage.getItem("@" + key);
  } catch (e) {
    // error reading value
  }
};

export default class MainStore {
  @observable storyId: string;
  @observable userId: string;
  @observable error;

  @observable navigatorAvailable = false;
  @observable loadingStory = false;
  @observable story: StoryBit[];
  @observable infering = false;
  @observable actionType: "ACT_SAY" | "ACT_DO" = "ACT_DO";

  @action setStoryId(storyId: string) {
    this.storyId = storyId;
    this.loadingStory = false;
    storeData("storyId", storyId);
  }

  @action setNavigatorAvailable() {
    this.navigatorAvailable = true;
  }

  @action setUserId(userId: string) {
    this.userId = userId;
    storeData("userId", userId);
  }

  @action activateLoadingStory() {
    this.loadingStory = true;
  }

  @action setError(error: any) {
    this.error = error;
  }

  @action createNewStory(story: StoryBit[]) {
    this.story = story.reverse();
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

  constructor() {
    // Load userId from device
    getData("userId").then(userId => {
      if (userId) {
        this.userId = userId;
      } else {
        // Generate user id
        this.userId = uuid();
        storeData("userId", this.userId);
      }
    });

    // Load storyId from device
    // getData("storyId").then(storyId => {
    //   if (storyId) {
    //     this.storyId = storyId;
    //   }
    // });

    // Loading story
    autorun(() => {
      if (this.navigatorAvailable && this.loadingStory && !this.storyId) {
        NavigationService.replace("LoadingStory");
      }
    });

    // Display story
    autorun(() => {
      if (this.navigatorAvailable && !this.loadingStory && this.storyId) {
        NavigationService.replace("Story");
      }
    });

    // Display error
    autorun(() => {
      if (this.navigatorAvailable && this.error !== undefined) {
        NavigationService.replace("Error");
      }
    });
  }
}
