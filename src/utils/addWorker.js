import { Worker } from "node:worker_threads";

export const addWorker = (path, workerData) => {
  const { promise, resolve, reject } = Promise.withResolvers();
  const worker = new Worker(path, { workerData });
  worker.once("message", resolve);
  worker.once("error", reject);
  return promise;
};
