import { create } from "zustand";

export const STORAGE_CONFIG = {
  build: { key: "build.storage", defaultValue: "[]" },
} as const;

interface Storage {
  key: string;
  defaultValue: string;
}

const storage = {
  get: ({ key, defaultValue }: Storage): string => {
    if (typeof window === "undefined") return defaultValue;
    return localStorage.getItem(key) || defaultValue;
  },
  parse: <T>(config: Storage): T => {
    try {
      return JSON.parse(storage.get(config)) as T;
    } catch {
      return JSON.parse(config.defaultValue) as T;
    }
  },
  set: (key: string, value: unknown): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};

export interface Build {
  splash: string;
  path: string;
  version: string;
  real: string;
  verified: boolean;
  open: boolean;
  loading: boolean;
}

interface BuildData {
  builds: Map<string, Build>;
}

interface BuildActions {
  add: (path: string, build: Build) => void;
  update: (path: string, updatedBuild: Partial<Build>) => void;
  clear: () => void;
  verify: () => Promise<boolean>;
}

type BuildState = BuildData & BuildActions;

const serializeMap = (map: Map<string, Build>) => Array.from(map.entries());
const deserializeMap = (arr: [string, Build][]) => new Map(arr);

const getInitState = (): BuildData => {
  const parsed = storage.parse<[string, Build][]>(STORAGE_CONFIG.build);
  return { builds: deserializeMap(parsed) };
};

const BuildStore = create<BuildState>((set, get) => ({
  ...getInitState(),

  add: (path, build) => {
    const builds = new Map(get().builds);
    builds.set(path, build);
    storage.set(STORAGE_CONFIG.build.key, serializeMap(builds));
    set({ builds });
  },

  update: (path, updatedBuild) => {
    const builds = new Map(get().builds);
    const existing = builds.get(path);
    if (existing) {
      builds.set(path, { ...existing, ...updatedBuild });
      storage.set(STORAGE_CONFIG.build.key, serializeMap(builds));
      set({ builds });
    }
  },

  clear: () => {
    storage.remove(STORAGE_CONFIG.build.key);
    set({ builds: new Map() });
  },

  verify: async () => {
    return get().builds.size > 0;
  },
}));

export default BuildStore;
