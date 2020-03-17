import { ExpoConfig } from '../Config.types';

export function getScheme(config: ExpoConfig) {
  return typeof config.scheme === 'string' ? config.scheme : null;
}

export function setScheme(config: ExpoConfig, androidManifest: string): string {
  let scheme = getScheme(config);
  if (!scheme) {
    return androidManifest;
  }

  let pattern = new RegExp(`android:scheme=".*"`);
  return androidManifest.replace(pattern, `android:scheme="${scheme}"`);
}
