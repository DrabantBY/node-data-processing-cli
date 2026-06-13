import { createDecipheriv, scrypt } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { promisify } from "node:util";
import { CRYPTO_SIZES, ERROR_MESSAGES } from "../const/index.js";

const asyncScript = promisify(scrypt);

export const decrypt = async ({ input, output, password }) => {
  if (!input || !output || !password) throw new Error(ERROR_MESSAGES.INVALID);

  const FIRST_BYTE_SIZE = CRYPTO_SIZES.IV + CRYPTO_SIZES.SALT;
  try {
    await pipeline(
      createReadStream(resolve(input)),
      async function* (source) {
        let buffer = Buffer.alloc(0);
        let decipher = null;

        for await (const chunk of source) {
          buffer = Buffer.concat([buffer, chunk]);

          if (!decipher && buffer.length >= FIRST_BYTE_SIZE) {
            const salt = buffer.subarray(0, CRYPTO_SIZES.SALT);
            const iv = buffer.subarray(CRYPTO_SIZES.SALT, FIRST_BYTE_SIZE);
            const key = await asyncScript(password, salt, CRYPTO_SIZES.KEY);
            decipher = createDecipheriv("aes-256-gcm", key, iv);
            buffer = buffer.subarray(FIRST_BYTE_SIZE);
          }

          if (decipher && buffer.length > CRYPTO_SIZES.AUTH) {
            yield decipher.update(
              buffer.subarray(0, buffer.length - CRYPTO_SIZES.AUTH),
            );
            buffer = buffer.subarray(buffer.length - CRYPTO_SIZES.AUTH);
          }
        }

        if (!decipher) throw new Error(ERROR_MESSAGES.FAILED);
        decipher.setAuthTag(buffer);
        yield decipher.final();
      },
      createWriteStream(resolve(output)),
    );
  } catch {
    throw new Error(ERROR_MESSAGES.FAILED);
  }
};
