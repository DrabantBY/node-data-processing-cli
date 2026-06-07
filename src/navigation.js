import { readdir } from "node:fs/promises";
import { sep } from "node:path";

export const navigateBack = () => {
  process.chdir("..");
};

export const navigateTo = (target) => {
  const isRoot = /^[a-z]:$/i.test(target);
  process.chdir(`${target}${isRoot ? sep : ""}`);
};

export const showFileList = async () => {
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
};
