import { action, observable, autorun } from "mobx";
import NavigationService from "../services/NavigationService";
import { StoryBit } from "../services/ApiService";
//import AsyncStorage from "@react-native-community/async-storage";

// const storeData = async (key: string, value: any) => {
//   try {
//     await AsyncStorage.setItem(key, value);
//   } catch (e) {
//     // saving error
//   }
// };

// const getData = async (key: string) => {
//   try {
//     return await AsyncStorage.getItem("@storage_Key");
//   } catch (e) {
//     // error reading value
//   }
// };

export default class MainStore {
  @observable storyId = "";
  @observable loadingStory = false;
  @observable error = undefined;
  @observable story: StoryBit[];
  @observable infering = false;
  @observable actionType: "ACT_SAY" | "ACT_DO" = "ACT_DO";

  @action setStoryId(storyId: string) {
    this.storyId = storyId;
    this.loadingStory = false;
    //storeData("storyId", storyId);
  }

  @action activateLoadingStory() {
    this.loadingStory = true;
  }

  @action setError(error: any) {
    this.error = error;
  }

  @action createNewStory(story: StoryBit[]) {
    this.story = story;
  }

  @action addStoryBits(storyBits: StoryBit[]) {
    if (!storyBits) {
      return;
    }
    console.log("Adding story bits", storyBits);
    const newStoryBits = storyBits.reverse();
    this.story = newStoryBits.concat(this.story);
    console.log("New story", this.story);
  }

  @action setInfering(status: boolean) {
    this.infering = status;
  }

  @action toggleActionType() {
    this.actionType = this.actionType === "ACT_DO" ? "ACT_SAY" : "ACT_DO";
  }

  constructor() {
    // Load story ID from local storage
    // getData("storyId").then(storyId => {
    //   if (storyId) {
    //     this.storyId = storyId;
    //   }
    // });

    // Loading story
    autorun(() => {
      if (this.loadingStory && !this.storyId) {
        NavigationService.replace("LoadingStory");
      }
    });

    // Display story
    autorun(() => {
      if (!this.loadingStory && this.storyId) {
        NavigationService.replace("Story");
      }
    });

    // Display error
    autorun(() => {
      if (this.error !== undefined) {
        NavigationService.replace("Error");
      }
    });
  }
}
