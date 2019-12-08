import { StoryBit } from "../types";

const address = "http://infinite.glibert.io:3000";

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
    if (response.status === 500) {
      return { error: "500" };
    } else {
      const res = await response.json();
      console.log(res);
      return res;
    }
  } catch (e) {
    console.log("Error catched", e);
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

const startStory: (
  userId: string,
  playerClass: string,
  name: string
) => Promise<{ uid?: string; storyBits?: StoryBit[]; error?: any }> = async (
  userId,
  playerClass,
  name
) => {
  const response = (await post("/start_story", {
    playerClass,
    name,
    deviceId: userId
  })) as any;
  return response;
};

const act: (
  payload: string,
  type: string,
  storyId: string
) => Promise<{ newStoryBits: StoryBit[] }> = async (payload, type, storyId) => {
  const response = (await post("/act", {
    uid: storyId,
    type,
    payload
  })) as any;
  return response;
};

const getStory: (
  uid: string
) => Promise<{ storyBits: StoryBit[]; error: any }> = async uid => {
  const response = (await get("/story/" + uid)) as any;
  return response;
};

const signup: (deviceId: string) => Promise<boolean> = async deviceId => {
  const { error } = await post("/signup", { deviceId });
  console.log("RESULT", error);
  return !error;
};

export default {
  startStory,
  act,
  getStory,
  signup
};
