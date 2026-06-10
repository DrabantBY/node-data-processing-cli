import { readdir } from "node:fs/promises";
import { sep } from "node:path";
import { ERROR_MESSAGES } from "./const/index.js";

export const up = () => {
  process.chdir("..");
};

export const cd = (arr) => {
  if (arr.length !== 1) throw new Error(ERROR_MESSAGES.INVALID);
  const isRoot = /^[a-z]:$/i.test(arr[0]);
  process.chdir(`${arr[0]}${isRoot ? sep : ""}`);
};

export const ls = async () => {
  try {
    const entries = await readdir(process.cwd(), {
      recursive: true,
      withFileTypes: true,
    });

    const table = entries
      .reduce((acc, entry) => {
        if (entry.isDirectory()) {
          acc.push({ name: entry.name, type: "directory" });
        }

        if (entry.isFile()) {
          acc.push({ name: entry.name, type: "file" });
        }

        return acc;
      }, [])
      .sort(
        (a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name),
      );

    console.table(table);
  } catch {
    throw new Error(ERROR_MESSAGES.FAILED);
  }
};
