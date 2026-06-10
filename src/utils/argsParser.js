import { parseArgs } from "node:util";
import { COMMAND_OPTIONS, ERROR_MESSAGES } from "../const/index.js";

export const argsParser = (line) => {
  try {
    const [command, ...args] = line.trim().split(/\s+/);

    if (!(command in COMMAND_OPTIONS)) {
      console.log(ERROR_MESSAGES.INVALID);
      return;
    }

    const { positionals, values } = parseArgs({
      args,
      options: COMMAND_OPTIONS[command],
      allowPositionals: true,
    });

    if (command !== "cd" && positionals.length > 0) {
      console.log(ERROR_MESSAGES.INVALID);
      return;
    }

    return { command, values: command === "cd" ? positionals : values };
  } catch {
    console.log(ERROR_MESSAGES.INVALID);
  }
};
