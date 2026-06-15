import { createReadStream, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { ERROR_MESSAGES } from "../const/index.js";

export const jsonToCsv = async ({ input, output }) => {
  if (!input || !output) throw new Error(ERROR_MESSAGES.INVALID);

  try {
    const chunks = [];

    const transform = new Transform({
      transform(chunk, _, callback) {
        chunks.push(chunk);
        callback();
      },
      flush(callback) {
        const str = Buffer.concat(chunks).toString("utf8");
        this.push(
          JSON.parse(str).reduce(
            (acc, item, index) =>
              `${index ? acc : Object.keys(item).join(",")}\n${Object.values(item).join(",")}`,
            "",
          ),
        );
        callback();
      },
    });

    await pipeline(
      createReadStream(resolve(input)),
      transform,
      createWriteStream(resolve(output)),
    );
  } catch {
    throw new Error(ERROR_MESSAGES.FAILED);
  }
};
