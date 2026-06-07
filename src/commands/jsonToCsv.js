import { createReadStream, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

export const jsonToCsv = async (source, target) => {
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
    createReadStream(resolve(source)),
    transform,
    createWriteStream(resolve(target)),
  );
};
