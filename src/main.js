import { homedir } from "node:os";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { CONFIG } from "./config.js";

import { argsParser } from "./utils/index.js";

const rl = createInterface({
  input: stdin,
  output: stdout,
});

rl.on("close", () => {
  console.log("\n\x1b[34mThank you for using Data Processing CLI!\x1b[0m");
  process.exit(0);
});

rl.on("SIGINT", rl.close);

process.chdir(homedir());

console.log("\x1b[34mWelcome to Data Processing CLI!\x1b[0m");
console.log(`\x1b[35mYou are currently in ${process.cwd()}\x1b[0m`);

while (true) {
  const line = await rl.question("> ");

  if (line.trim() === ".exit") {
    rl.close();
    break;
  }

  try {
    const { command, values } = argsParser(line);
    await CONFIG[command](values);
  } catch ({ message }) {
    console.log(message);
  }

  console.log(`\x1b[35mYou are currently in ${process.cwd()}\x1b[0m`);
}
