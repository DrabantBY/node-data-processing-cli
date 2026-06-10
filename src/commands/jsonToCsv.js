import { createReadStream, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { ERROR_MESSAGES } from "../const/index.js";

export const jsonToCsv = async ({ input, output }) => {
  if (!input || !output) throw new Error(ERROR_MESSAGES.INVALID);

  try {
    let str = "";

    const transform = new Transform({
      transform(chunk, _, callback) {
        str += `${chunk}`;
        callback();
      },
      flush(callback) {
        this.push(
          JSON.parse(str).reduce((acc, item, index) => {
            if (!index) {
              acc = Object.keys(item).join(",");
            }
            return `${acc}\n${Object.values(item).join(",")}`;
          }, ""),
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
