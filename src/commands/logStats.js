import { open, stat, writeFile } from "node:fs/promises";
import { availableParallelism } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ERROR_MESSAGES } from "../const/index.js";
import { addWorker, getOffset, mergeJson } from "../utils/index.js";
// log-stats --input d:/node/node-data-processing-cli/workspace/logs.txt

export const logStats = async ({ input, output }) => {
  if (!input || !output) throw new Error(ERROR_MESSAGES.INVALID);

  try {
    const targetFile = resolve(input);
    const length = availableParallelism();
    const { size } = await stat(targetFile);
    const chunkSize = Math.ceil(size / length);
    const fileHandle = await open(targetFile);

    const offsetList = await Promise.all(
      Array.from({ length }, (_, i) =>
        getOffset(fileHandle, i * chunkSize, size),
      ),
    );

    fileHandle.close();

    const workerFile = fileURLToPath(
      import.meta.resolve("../workers/worker.js"),
    );

    const jsonChunks = await Promise.all(
      offsetList.reduce((acc, start, index, list) => {
        acc.push(
          addWorker(workerFile, {
            targetFile,
            start,
            end: index === list.length - 1 ? size : list[index + 1] - 1,
          }),
        );
        return acc;
      }, []),
    );

    const json = jsonChunks.reduce(mergeJson, Object.create(null));

    json.avgResponseTimeMs = Number(
      (json.avgResponseTimeMs / json.total).toFixed(2),
    );

    json.topPaths = Object.entries(json.topPaths).map(
      ({ 0: path, 1: count }) => ({ path, count }),
    );

    await writeFile(resolve(output), JSON.stringify(json, null, 2));
  } catch {
    throw new Error(ERROR_MESSAGES.FAILED);
  }
};
