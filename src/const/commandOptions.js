export const COMMAND_OPTIONS = {
  up: null,

  ls: null,

  cd: null,

  count: {
    input: {
      type: "string",
    },
  },

  hash: {
    input: {
      type: "string",
    },
    algorithm: {
      type: "string",
    },
    save: {
      type: "boolean",
    },
  },

  "hash-compare": {
    input: {
      type: "string",
    },
    hash: {
      type: "string",
    },
    algorithm: {
      type: "string",
    },
  },

  "csv-to-json": {
    input: {
      type: "string",
    },
    output: {
      type: "string",
    },
  },

  "json-to-csv": {
    input: {
      type: "string",
    },
    output: {
      type: "string",
    },
  },

  "log-stats": {
    input: {
      type: "string",
    },
    output: {
      type: "string",
    },
  },

  encrypt: {
    input: {
      type: "string",
    },
    output: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },

  decrypt: {
    input: {
      type: "string",
    },
    output: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },
};
