export function isArray(prop) {
  return prop instanceof Array;
}

export function delay(ms) {
  let timeOutId;
  const promise = new Promise((resolve) => {
    timeOutId = setTimeout(resolve, ms);
  });

  return { promise, timeOutId };
}

export function* gen(arr) {
  yield* arr;
}
