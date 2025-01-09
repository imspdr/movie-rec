export const unselectable = `-webkit-touch-callout: none;
-webkit-user-select: none;
-khtml-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;`;

export const sleep = async (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};
