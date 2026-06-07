import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { pipeline } from "node:stream/promises";

export const hash = async (source, algorithm = "sha256", save = false) => {
  const hashStream = createHash(algorithm);

  await pipeline(createReadStream(resolve(source)), hashStream);

  const str = `${algorithm}: ${hashStream.digest("hex")}`;

  if (save) {
    await writeFile(resolve(`${basename(source)}.${algorithm}`), str);
  } else {
    console.log(str);
  }
};
