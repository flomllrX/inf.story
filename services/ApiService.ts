import { StoryBit, StorySmall } from "../types";
import { Platform } from "react-native";

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
    if (response.status >= 300) {
      return { error: "Error" + response.status };
    } else {
      return await response.json();
    }
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

const getStories: (
  deviceId: string
) => Promise<{ stories: StorySmall[]; error: any }> = async deviceId => {
  const response = (await get("/stories/" + deviceId)) as any;
  return response;
};

const signup: (deviceId: string) => Promise<boolean> = async deviceId => {
  const { error } = await post("/signup", { deviceId, platform: Platform.OS });
  return !error;
};

export default {
  startStory,
  act,
  getStory,
  getStories,
  signup
};
