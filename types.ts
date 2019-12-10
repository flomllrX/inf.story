export interface StoryBit {
  type: "TEXT" | "ACT_SAY" | "ACT_DO" | "IMAGE" | "ORIGIN" | "LOCATION";
  payload: string | Origin | Location;
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

export interface Location {
  location:
    | "forest"
    | "jail"
    | "castle"
    | "keep"
    | "lake"
    | "mountain"
    | "town"
    | "village";
  firstVisit: boolean;
  seed: number;
}

export interface PlayerClass {
  name: string;
  portrait: any;
  description: string;
  value: string;
  locked?: boolean;
}

export interface StorySmall {
  title: string;
  createdAt: string;
  origin: Origin;
  uid: string;
}
