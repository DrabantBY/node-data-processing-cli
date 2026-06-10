import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { ERROR_MESSAGES } from "../const/index.js";

export const hashCompare = async ({ input, hash, algorithm = "sha256" }) => {
  if (!input || !hash) throw new Error(ERROR_MESSAGES.INVALID);

  try {
    const hashStream = createHash(algorithm);

    await pipeline(createReadStream(resolve(input)), hashStream);

    const hashSource = `${hashStream.digest("hex")}`;

    const hashTarget = await readFile(resolve(hash), "utf8");

    console.log(
      hashSource === hashTarget.trim().replace(/^.+\:\s+/, "")
        ? "OK"
        : "MISMATCH",
    );
  } catch {
    throw new Error(ERROR_MESSAGES.FAILED);
  }
};
