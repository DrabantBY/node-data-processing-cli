import { createReadStream, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

export const csvToJson = async (source, target) => {
  const rs = createReadStream(resolve(cwd(), source));
  const ws = createWriteStream(resolve(cwd(), target));

  const transform = new Transform({
    transform(chunk, _, callback) {
      let keys = null;

      this.push(
        JSON.stringify(
          `${chunk}`
            .split(/\r?\n+/)
            .filter(Boolean)
            .reduce((acc, line, index) => {
              if (!index) {
                keys = line.split(",");
                return acc;
              }
              acc.push(
                line.split(",").reduce((obj, value, index) => {
                  obj[keys[index]] = value;

                  return obj;
                }, Object.create(null)),
              );

              return acc;
            }, []),
          null,
          2,
        ),
      );
      callback();
    },
  });

  await pipeline(rs, transform, ws);
};
