/* eslint-disable @typescript-eslint/camelcase */
import { StoryBit, StorySmall } from "../types";
import { Platform } from "react-native";
import fetch from "isomorphic-unfetch";
import MainStore from "../mobx/mainStore";
import ErrorService from "./ErrorService";
import Constants from "expo-constants";
import { Prompt } from "../types";

let _mainStore: MainStore;

const address =
  Constants.appOwnership === "expo" && Platform.OS !== "web"
    ? "https://api-dev.infinitestory.app"
    : "https://api.infinitestory.app";

const setMainStore = (mainStore: MainStore) => {
  _mainStore = mainStore;
};

const post: (
  endpoint: string,
  body: { [key: string]: string | number }
) => Promise<{ [key: string]: string }> = async (endpoint, body) => {
  try {
    const response = await fetch(address + endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: _mainStore && _mainStore.userId
      },
      body: JSON.stringify(body)
    });
    if (response.status >= 300) {
      ErrorService.log({ error: response.status });
      console.log(JSON.stringify(response));
      return { error: "Error " + response.status };
    } else {
      const responseJson = await response.json();
      return await responseJson;
    }
  } catch (e) {
    ErrorService.log({ error: e });
    return { error: e, location: "ApiService.post exception" };
  }
};

const put: (
  endpoint: string,
  body: { [key: string]: string | number | boolean }
) => Promise<{ [key: string]: string }> = async (endpoint, body) => {
  try {
    const response = await fetch(address + endpoint, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: _mainStore && _mainStore.userId
      },
      body: JSON.stringify(body)
    });
    if (response.status >= 300) {
      ErrorService.log({ error: response.status });
      console.log(JSON.stringify(response));
      return { error: "Error " + response.status };
    } else {
      const responseJson = await response.json();
      return await responseJson;
    }
  } catch (e) {
    ErrorService.log({ error: e });
    return { error: e, location: "ApiService.put exception" };
  }
};

const del: (
  endpoint: string
) => Promise<{ [key: string]: string }> = async endpoint => {
  try {
    const response = await fetch(address + endpoint, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: _mainStore && _mainStore.userId
      }
    });
    if (response.status >= 300) {
      ErrorService.log({ error: response.status });
      console.log(JSON.stringify(response));
      return { error: "Error " + response.status };
    } else {
      const responseJson = await response.json();
      return await responseJson;
    }
  } catch (e) {
    ErrorService.log({ error: e });
    return { error: e, location: "ApiService.delete exception" };
  }
};

const get: (
  endpoint: string,
  raw?: boolean
) => Promise<{ [key: string]: string | number }> = async (endpoint, raw) => {
  try {
    const response = await fetch(address + endpoint, {
      method: "GET",
      headers: {
        Authorization: _mainStore && _mainStore.userId
      }
    });
    if (raw) return response;
    const responseJson = await response.json();
    return await responseJson;
  } catch (e) {
    ErrorService.log({ error: e });
    return { error: e };
  }
};

const startStory: (
  userId: string,
  playerClass?: string,
  name?: string,
  promptId?: string
) => Promise<{
  uid?: string;
  storyBits?: StoryBit[];
  error?: any;
  title?: string;
}> = async (userId, playerClass, name, promptId) => {
  const response = (await post("/start_story", {
    playerClass,
    name,
    deviceId: userId,
    promptId
  })) as any;
  console.log("new story", response);
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

const updateStory: (
  storyId: string,
  makePublic: boolean
) => Promise<any> = async (storyId, makePublic) => {
  return await put("/story/" + storyId, { public: makePublic });
};

const checkAvailability: () => Promise<boolean> = async () => {
  const response = await get("", true);
  if (!response || response.status !== 200) {
    return false;
  } else {
    return true;
  }
};

const rollback: (
  storyId: string,
  bitId: number
) => Promise<{ storyBits?: StoryBit[]; error?: any }> = async (
  storyId,
  bitId
) => {
  const response = await post("/rollback", { uid: storyId, index: bitId });
  return response;
};

const useDiscordCode: (
  code: string,
  userId: string
) => Promise<{ ok?: "ok"; error?: any }> = async (code, userId) => {
  const response = await post("/use_discord_code", { code, device_id: userId });
  return response;
};

const deleteStory: (
  storyId: string
) => Promise<{ ok?: "ok"; error?: any }> = async storyId => {
  const response = await del("/story/" + storyId);
  return response;
};

const createPrompt: (
  deviceId: string,
  context: string,
  title: string
) => Promise<{ ok?: "ok"; error?: any }> = async (deviceId, context, title) => {
  const response = await post("/prompt", {
    deviceId,
    context,
    title
  });
  console.log("Creating prompt", response);
  return response;
};

const updatePrompt: (
  promptId: number,
  title: string,
  context: string,
  publ?: boolean
) => Promise<any> = async (promptId, title, context, publ) => {
  const response = await put("/prompt/" + promptId, {
    title,
    context,
    public: publ
  });
  return response;
};

const getPrompts: (
  deviceId: string
) => Promise<{ prompts: Prompt[] }> = async deviceId => {
  const response = ((await get("/prompts/" + deviceId)) as unknown) as Promise<{
    prompts: Prompt[];
  }>;
  return response;
};

const deletePrompt: (
  promptId: number
) => Promise<{ ok?: "ok"; error?: any }> = async promptId => {
  const response = await del("/prompt/" + promptId);
  return response;
};

export default {
  startStory,
  act,
  getStory,
  getStories,
  signup,
  getAchievements,
  setMainStore,
  updateStory,
  checkAvailability,
  rollback,
  useDiscordCode,
  deleteStory,
  createPrompt,
  getPrompts,
  updatePrompt,
  deletePrompt
};
