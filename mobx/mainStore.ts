import { action, observable, autorun } from "mobx";
import NavigationService from "../services/NavigationService";
import { StoryBit } from "../services/ApiService";

export default class MainStore {
  @observable storyId = "";
  @observable loadingStory = false;
  @observable error = undefined;
  @observable story: StoryBit[];
  @observable infering = false;

  @action setStoryId(storyId: string) {
    this.storyId = storyId;
    this.loadingStory = false;
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
    console.log("Adding story bits", storyBits);
    const newStoryBits = storyBits.reverse();
    this.story = newStoryBits.concat(this.story);
    console.log("New story", this.story);
  }

  @action setInfering(status: boolean) {
    this.infering = status;
  }

  constructor() {
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
