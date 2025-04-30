// https://github.com/zertosh/invariant
// https://github.com/alexreardon/tiny-invariant
// https://github.com/epicweb-dev/invariant

export function assert(condition: boolean, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}
