import { ExpoConfig } from '../Config.types';
import {
  getProjectAndroidManifestPathAsync,
  readAndroidManifestAsync,
  writeAndroidManifestAsync,
} from './Manifest';

export const SCREEN_ORIENTATION_ATTRIBUTE = 'android:screenOrientation';

export function getOrientation(config: ExpoConfig) {
  return typeof config.orientation === 'string' ? config.orientation : null;
}

export async function setAndroidOrientation(config: ExpoConfig, projectDirectory: string) {
  const orientation = getOrientation(config);
  if (!orientation) {
    return false;
  }

  const manifestPath = await getProjectAndroidManifestPathAsync(projectDirectory);
  if (!manifestPath) {
    return false;
  }

  let androidManifestJson = await readAndroidManifestAsync(manifestPath);

  androidManifestJson.manifest.application[0].activity[0]['$'][
    SCREEN_ORIENTATION_ATTRIBUTE
  ] = orientation;

  try {
    await writeAndroidManifestAsync(manifestPath, androidManifestJson);
  } catch (e) {
    throw new Error(`Cannot write new AndroidManifest.xml to ${manifestPath}.`);
  }
  return true;
}
