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
  const { uid, storyBits, error } = response;
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

export default {
  startStory,
  act,
  getStory
};
