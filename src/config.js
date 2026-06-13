import {
  count,
  csvToJson,
  decrypt,
  encrypt,
  hash,
  hashCompare,
  jsonToCsv,
} from "./commands/index.js";
import { cd, ls, up } from "./navigation.js";

export const CONFIG = {
  up,
  cd,
  ls,
  count,
  hash,
  encrypt,
  decrypt,
  "hash-compare": hashCompare,
  "csv-to-json": csvToJson,
  "json-to-csv": jsonToCsv,
};
