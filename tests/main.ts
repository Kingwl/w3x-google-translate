import * as fs from "fs";
import * as path from "path";
import * as ini from "ini";

import translate, {
  log,
  createReporter,
  type Task,
  type TranslateOptions,
} from "../src/index";
import { getEnvs } from "./env";
import { makeProxyOptions, makeTaskOptions } from "./options";

export async function doTranslate(
  name: string,
  iniObject: Record<string, unknown>
) {
  const envs = getEnvs();
  const parallel = envs.TASK_PARALLEL;
  const batchSize = envs.TASK_BATCH_SIZE;

  let count = 0;
  const beforeTasks = (tasks: readonly Task[]) => {
    count = tasks.length;
    log(
      `${name} 共 ${count} 个 Task, 并行 ${parallel} 个，每次 ${batchSize} 个`
    );
  };

  const afterTasks = () => {
    log(`翻译完成: ${name}`);
  };

  const report = (sum: number) => {
    log(`翻译中: ${name} - ${sum} / ${count}`);
  };

  const reporter = createReporter(100, report);

  const options: TranslateOptions = {
    key: envs.GOOGLE_API_KEY,
    proxy: makeProxyOptions(envs),
    taskOptions: makeTaskOptions(envs, beforeTasks, afterTasks),
  };

  await translate(iniObject, options, reporter.incr);
}

async function main() {
  const envs = getEnvs();
  const mapDir = envs.MAP_DIR;

  const unitsDir = path.join(mapDir, "units");
  const unitsTranslatedDir = path.join(mapDir, "units-translated");

  if (!fs.existsSync(unitsTranslatedDir)) {
    fs.mkdirSync(unitsTranslatedDir);
  }

  const iniFiles = fs
    .readdirSync(unitsDir)
    .filter((x) => path.extname(x) === ".txt");

  for (const iniFile of iniFiles) {
    const iniFileReadPath = path.join(unitsDir, iniFile);
    const iniFileWritePath = path.join(unitsTranslatedDir, iniFile);

    const iniContent = fs.readFileSync(iniFileReadPath).toString();
    const iniObject = ini.decode(iniContent);

    await doTranslate(iniFile, iniObject);

    const translatedContent = ini.encode(iniObject);
    fs.writeFileSync(iniFileWritePath, translatedContent);
  }
}

main();
