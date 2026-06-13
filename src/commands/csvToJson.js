import { createReadStream, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { ERROR_MESSAGES } from "../const/index.js";

export const csvToJson = async ({ input, output }) => {
  if (!input || !output) throw new Error(ERROR_MESSAGES.INVALID);

  try {
    let keys = null;
    let tail = "";
    let isFirst = true;

    const createObj = (str) =>
      str.split(",").reduce((obj, value, index) => {
        obj[keys[index]] = value;

        return obj;
      }, Object.create(null));

    const createJson = (stream, str) => {
      stream.push(
        `${isFirst ? "[\n" : ",\n"}  ${JSON.stringify(createObj(str))}`,
      );
      isFirst = false;
    };

    const transform = new Transform({
      transform(chunk, _, callback) {
        const lines = `${tail}${chunk}`.split(/\r?\n+/);

        tail = lines.pop();

        for (const line of lines) {
          if (keys && line) {
            createJson(this, line);
          }

          if (!keys && line) {
            keys = line.split(",");
          }
        }
        callback();
      },

      flush(callback) {
        if (tail && keys) {
          createJson(this, tail);
        }

        this.push(isFirst ? "[]\n" : "\n]\n");
        callback();
      },
    });

    await pipeline(
      createReadStream(resolve(input), { encoding: "utf8" }),
      transform,
      createWriteStream(resolve(output)),
    );
  } catch {
    throw new Error(ERROR_MESSAGES.FAILED);
  }
};
