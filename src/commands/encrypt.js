import { createCipheriv, randomBytes, scrypt } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { promisify } from "node:util";
import { CRYPTO_SIZES, ERROR_MESSAGES } from "../const/index.js";

const asyncScript = promisify(scrypt);

export const encrypt = async ({ input, output, password }) => {
  if (!input || !output || !password) throw new Error(ERROR_MESSAGES.INVALID);

  try {
    const salt = randomBytes(CRYPTO_SIZES.SALT);
    const iv = randomBytes(CRYPTO_SIZES.IV);
    const key = await asyncScript(password, salt, CRYPTO_SIZES.KEY);
    const cipher = createCipheriv("aes-256-gcm", key, iv);

    await pipeline(
      createReadStream(resolve(input)),
      cipher,
      async function* (encrypted) {
        yield Buffer.concat([salt, iv]);
        yield* encrypted;
        yield cipher.getAuthTag();
      },
      createWriteStream(resolve(output)),
    );
  } catch {
    throw new Error(ERROR_MESSAGES.FAILED);
  }
};
