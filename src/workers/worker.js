import { createReadStream } from "node:fs";
import { createInterface } from "node:readline/promises";
import { parentPort, workerData } from "node:worker_threads";

const { targetFile, ...offset } = workerData;

const json = {
  total: 0,
  levels: Object.create(null),
  status: Object.create(null),
  topPaths: Object.create(null),
  avgResponseTimeMs: 0,
};

const readLines = createInterface({
  input: createReadStream(targetFile, offset),
  crlfDelay: Infinity,
});

for await (const line of readLines) {
  const trimLine = line.trim();
  if (trimLine) {
    const { 1: level, 3: code, 4: time, 6: path } = trimLine.split(/\s+/);
    const codeKey = `${code[0]}xx`;
    json.total += 1;
    json.levels[level] = (json.levels[level] ?? 0) + 1;
    json.status[codeKey] = (json.status[codeKey] ?? 0) + 1;
    json.topPaths[path] = (json.topPaths[path] ?? 0) + 1;
    json.avgResponseTimeMs += Number(time);
  }
}

parentPort.postMessage(json);
