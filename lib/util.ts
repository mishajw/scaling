export function assertNever(_: never): never {
  throw new Error('Unexpected source');
}
