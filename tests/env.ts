import { toNumberOrBeUndefined } from "../src/utils";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_API_KEY?: string;

      PROXY_HOST?: string;
      PROXY_PORT?: string;

      TASK_PARALLEL?: string;
      TASK_BATCH_SIZE?: string;

      MAP_DIR?: string;
    }
  }
}

export function getEnvs() {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const MAP_DIR = process.env.MAP_DIR;

  const PROXY_HOST = process.env.PROXY_HOST;
  const PROXY_PORT = toNumberOrBeUndefined(process.env.PROXY_PORT);

  const TASK_PARALLEL = toNumberOrBeUndefined(process.env.TASK_PARALLEL) ?? 3;
  const TASK_BATCH_SIZE =
    toNumberOrBeUndefined(process.env.TASK_BATCH_SIZE) ?? 10;

  if (!GOOGLE_API_KEY) {
    throw new Error("Env 'GOOGLE_API_KEY' is not set");
  }
  if (!MAP_DIR) {
    throw new Error("Env 'MAP_DIR' is not set");
  }

  return {
    GOOGLE_API_KEY,
    MAP_DIR,

    PROXY_HOST,
    PROXY_PORT,

    TASK_PARALLEL,
    TASK_BATCH_SIZE,
  };
}
