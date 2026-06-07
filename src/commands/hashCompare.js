import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pipeline } from "node:stream/promises";

export const hashCompare = async (source, target, algorithm = "sha256") => {
  const hash = createHash(algorithm);

  await pipeline(createReadStream(resolve(source)), hash);

  const hashSource = `${hash.digest("hex")}`;

  const hashTarget = await readFile(resolve(target), "utf8");

  console.log(
    hashSource === hashTarget.trim().replace(/^.+\:\s+/, "")
      ? "OK"
      : "MISMATCH",
  );
};
