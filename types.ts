export interface StoryBit {
  type: "TEXT" | "ACT_SAY" | "ACT_DO" | "IMAGE" | "ORIGIN";
  payload: string | Origin;
}

export interface Origin {
  name: string;
  class:
    | "noble"
    | "knight"
    | "squire"
    | "wizard"
    | "ranger"
    | "peasant"
    | "rogue";
  location: string;
}

export interface StorySmall {
  title: string;
  createdAt: string;
  origin: Origin;
  uid: string;
}
