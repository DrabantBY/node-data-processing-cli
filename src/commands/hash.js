import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { ERROR_MESSAGES } from "../const/index.js";

export const hash = async ({ input, algorithm = "sha256", save = false }) => {
  if (!input) throw new Error(ERROR_MESSAGES.INVALID);

  try {
    const hashStream = createHash(algorithm);

    await pipeline(createReadStream(resolve(input)), hashStream);

    const str = `${algorithm}: ${hashStream.digest("hex")}`;

    if (save) {
      await writeFile(resolve(`${basename(input)}.${algorithm}`), str);
    } else {
      console.log(str);
    }
  } catch {
    throw new Error(ERROR_MESSAGES.FAILED);
  }
};
