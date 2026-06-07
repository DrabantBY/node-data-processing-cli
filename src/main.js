import { homedir } from "node:os";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import { count, csvToJson, jsonToCsv } from "./commands/index.js";
import { navigateBack, navigateTo, showFileList } from "./navigation.js";
import { showCurrentDir } from "./repl.js";

const rl = createInterface({
  input: stdin,
  output: stdout,
});

rl.on("close", () => {
  console.log("\nThank you for using Data Processing CLI!");
  process.exit(0);
});

rl.on("SIGINT", rl.close);

process.chdir(homedir());

console.log("Welcome to Data Processing CLI!");

showCurrentDir();

while (true) {
  const line = await rl.question("> ");
  const { positionals, values } = parseArgs({
    args: line.trim().split(/\s+/),
    allowPositionals: true,
    options: {
      input: { type: "string" },
      output: { type: "string" },
    },
  });

  if (
    positionals?.length === 1 &&
    positionals[0] === "up" &&
    Object.keys(values).length === 0
  ) {
    navigateBack();
  }

  if (
    positionals?.length === 1 &&
    positionals[0] === "ls" &&
    Object.keys(values).length === 0
  ) {
    await showFileList();
  }

  if (
    positionals?.length === 1 &&
    positionals[0] === ".exit" &&
    Object.keys(values).length === 0
  ) {
    rl.close();
  }

  if (
    positionals?.length === 2 &&
    positionals[0] === "cd" &&
    Object.keys(values).length === 0
  ) {
    navigateTo(positionals[1]);
  }

  if (
    positionals?.length === 1 &&
    positionals[0] === "csv-to-json" &&
    Object.keys(values).length === 2 &&
    values.input &&
    values.output
  ) {
    await csvToJson(values.input, values.output);
  }

  if (
    positionals?.length === 1 &&
    positionals[0] === "json-to-csv" &&
    Object.keys(values).length === 2 &&
    values.input &&
    values.output
  ) {
    await jsonToCsv(values.input, values.output);
  }

  if (
    positionals?.length === 1 &&
    positionals[0] === "count" &&
    Object.keys(values).length === 1 &&
    values.input
  ) {
    await count(values.input);
  }

  showCurrentDir();
}
