import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { ERROR_MESSAGES } from "../const/index.js";

export const count = async ({ input }) => {
  if (!input) throw new Error(ERROR_MESSAGES.INVALID);

  try {
    let lines = 0;
    let words = 0;
    let characters = 0;
    let endsNonSpace = false;
    let lastChar = "";

    const transform = new Transform({
      transform(chunk, _, callback) {
        const str = `${chunk}`;
        characters += str.length;
        lines += str.split("\n").length - 1;
        words += str.match(/\S+/g)?.length ?? 0;
        if (endsNonSpace && /^\S/.test(str)) {
          words--;
        }
        endsNonSpace = /\S$/.test(str);
        lastChar = str.at(-1);
        callback();
      },
      flush(callback) {
        if (characters && lastChar !== "\n") {
          lines++;
        }
        process.stdout.write(
          `Lines: ${lines}\nWords: ${words}\nCharacters: ${characters}\n`,
        );
        callback();
      },
    });

    await pipeline(
      createReadStream(resolve(input), { encoding: "utf8" }),
      transform,
    );
  } catch {
    throw new Error(ERROR_MESSAGES.FAILED);
  }
};
