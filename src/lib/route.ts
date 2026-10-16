/** Expo Router typed routes lag behind new files until the dev server regenerates them. */
export function route(path: string) {
  return path as never;
}
