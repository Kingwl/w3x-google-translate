import type { getEnvs } from "./env";
import type { ClientProxyOptions, Task, TaskOptions } from "../src/types";

export function makeProxyOptions(
  envs: ReturnType<typeof getEnvs>
): ClientProxyOptions | undefined {
  if (!envs.PROXY_HOST || !envs.PROXY_PORT) {
    return undefined;
  }

  return {
    host: envs.PROXY_HOST,
    port: envs.PROXY_PORT,
  };
}

export function makeTaskOptions(
  envs: ReturnType<typeof getEnvs>,
  beforeTasks: (tasks: readonly Task[]) => void,
  afterTasks: () => void
): TaskOptions {
  return {
    parallel: envs.TASK_PARALLEL,
    batchSize: envs.TASK_BATCH_SIZE,
    beforeTasks,
    afterTasks,
  };
}
