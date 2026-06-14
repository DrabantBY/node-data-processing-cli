export const mergeJson = (objPrev, objNext) =>
  Object.keys(objNext).reduce((obj, key) => {
    obj[key] =
      typeof objNext[key] === "object"
        ? mergeJson(objPrev[key] ?? Object.create(null), objNext[key])
        : objNext[key] + (objPrev[key] ?? 0);
    return obj;
  }, Object.create(null));
