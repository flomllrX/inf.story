import { StoryBit, StorySmall } from "../types";
import { Platform } from "react-native";
import fetch from "isomorphic-unfetch";
import MainStore from "../mobx/mainStore";
import ErrorService from "./ErrorService";

const address = "https://api.infinitestory.app";

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
      ErrorService.log({ error: response.status });
      return { error: "Error" + response.status };
    } else {
      const responseJson = await response.json();
      return await responseJson;
    }
  } catch (e) {
    ErrorService.log({ error: e });
    return { error: e, location: "ApiService.post exception" };
  }
};

const get: (
  endpoint: string
) => Promise<{ [key: string]: string }> = async endpoint => {
  try {
    const response = await fetch(address + endpoint);
    const responseJson = await response.json();
    return await responseJson;
  } catch (e) {
    ErrorService.log({ error: e });
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
) => Promise<{ newStoryBits: StoryBit[]; error?: any }> = async (
  payload,
  type,
  storyId
) => {
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

const signup: (deviceId: string) => Promise<any> = async deviceId => {
  const result = await post("/signup", { deviceId, platform: Platform.OS });
  return result.error;
};

const getAchievements: (deviceId: string) => Promise<any> = async deviceId => {
  return await get("/user/" + deviceId);
};

export default {
  startStory,
  act,
  getStory,
  getStories,
  signup,
  getAchievements
};
