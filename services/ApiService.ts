const address = "http://infinite.glibert.io:3000";
let _mainStore;

const post: (
  endpoint: string,
  body: { [key: string]: string | number }
) => Promise<{ [key: string]: string }> = async (endpoint, body) => {
  try {
    const response = await fetch(address + endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    return response.json();
  } catch (e) {
    return { error: e };
  }
};

const get: (
  endpoint: string
) => Promise<{ [key: string]: string }> = async endpoint => {
  try {
    const response = await fetch(address + endpoint);
    return response.json();
  } catch (e) {
    return { error: e };
  }
};

export interface StoryBit {
  type: "TEXT" | "ACT_SAY" | "ACT_DO" | "IMAGE";
  payload: string;
}

const setMainStore = store => {
  _mainStore = store;
};

const startStory: (
  playerClass: number,
  name: string
) => Promise<{ uid: string; storyBits: StoryBit[] }> = async (
  playerClass,
  name
) => {
  _mainStore.activateLoadingStory();
  const response = (await post("/start_story", { playerClass, name })) as any;
  console.log(response);
  const { uid, storyBits, error } = response;
  if (error) {
    console.log("Error", error);
    _mainStore.setError(error);
  } else {
    _mainStore.setStoryId(uid);
    _mainStore.createNewStory(storyBits);
  }
  return response;
};

const act: (
  type: "ACT_SAY" | "ACT_DO",
  payload: string
) => Promise<{ newStoryBits: StoryBit[] }> = async (type, payload) => {
  _mainStore.setInfering(true);
  const response = (await post("/act", {
    uid: _mainStore.storyId,
    type,
    payload
  })) as any;
  const { newStoryBits } = response;
  console.log("Acting response", newStoryBits);
  _mainStore.addStoryBits(newStoryBits);
  _mainStore.setInfering(false);
  return response;
};

const getStory: (uid: string) => Promise<{ story: StoryBit[] }> = async uid => {
  const response = (await get("/story/" + uid)) as any;
  return response;
};

export default {
  setMainStore,
  startStory,
  act,
  getStory
};
