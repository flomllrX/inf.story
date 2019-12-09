import { action, observable, autorun, reaction } from "mobx";
import NavigationService from "../services/NavigationService";
import { StoryBit } from "../types";
import { AsyncStorage } from "react-native";
import uuid from "uuid/v4";
import ControlService from "../services/ControlService";
import ApiService from "../services/ApiService";

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
  @observable userId: string;

  @observable storyId: string;
  @observable storyActive = false;
  @observable creatingStory = true;
  @observable story: StoryBit[];
  @observable loadingStory = false;

  @observable error;
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

  @action setStoryState(state: boolean) {
    this.storyActive = state;
  }

  @action setCreatingStoryState(state: boolean) {
    this.creatingStory = state;
  }

  @action setStoryLoadingState(state: boolean) {
    this.loadingStory = state;
  }

  @action setError(error: any) {
    this.error = error;
  }

  @action clearError() {
    this.error = undefined;
  }

  @action setStory(story: StoryBit[]) {
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
    const signup = async () => {
      const userId = uuid();
      const signupError = () => {
        this.setError("Please make sure you're connected to the internet.");
        reaction(
          () => this.error,
          (data, r) => {
            signup();
            r.dispose();
          }
        );
      };
      try {
        const success = await ApiService.signup(userId);
        if (success) {
          this.userId = userId;
          storeData("userId", this.userId);
        } else {
          signupError();
        }
      } catch (e) {
        signupError();
      }
    };

    // Load userId from device
    getData("userId").then(async userId => {
      if (userId) {
        this.userId = userId;
      } else {
        await signup();
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
