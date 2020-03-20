import path from 'path';
import fs from 'fs-extra';

import { ExpoConfig } from '../Config.types';
import {
  readAndroidManifestAsync as readXMLFileAsync,
  writeAndroidManifestAsync as writeXMLFileAsync,
} from './Manifest';

const STYLES_XML_PATH = 'app/src/main/res/values/styles.xml';

type StyleItem = {
  _: string;
  $: { name: string };
};
export function getRootViewBackgroundColor(config: ExpoConfig) {
  if (config.android && config.android.backgroundColor) {
    return config.android.backgroundColor;
  }
  if (config.backgroundColor) {
    return config.backgroundColor;
  }

  return null;
}

export async function setRootViewBackgroundColor(config: ExpoConfig, projectDirectory: string) {
  let hexString = getRootViewBackgroundColor(config);
  if (!hexString) {
    return false;
  }

  const stylesPath = await getProjectStylesXMLPathAsync(projectDirectory);
  if (!stylesPath) {
    return false;
  }

  const windowBackgroundItem = [
    {
      _: hexString,
      $: {
        name: 'android:windowBackground',
      },
    },
  ];

  let stylesJSON = await readXMLFileAsync(stylesPath);
  let appTheme = stylesJSON.resources.style.filter((e: any) => e['$']['name'] === 'AppTheme')[0];
  if (appTheme.item) {
    let existingWindowBackgroundItem = appTheme.item.filter(
      (item: StyleItem) => item['$'].name === 'android:windowBackground'
    )[0];

    // Don't want to 2 windowBackgrounds, so if one exists, we overwrite it
    if (existingWindowBackgroundItem) {
      existingWindowBackgroundItem['_'] = windowBackgroundItem[0]['_'];
    } else {
      appTheme.item = appTheme.item.concat(windowBackgroundItem);
    }
  } else {
    appTheme.item = windowBackgroundItem;
  }

  try {
    await writeXMLFileAsync(stylesPath, stylesJSON);
  } catch (e) {
    throw new Error(
      `Error setting Android user interface style. Cannot write new AndroidManifest.xml to ${stylesPath}.`
    );
  }
  return true;
}

export async function getProjectStylesXMLPathAsync(projectDir: string): Promise<string | null> {
  try {
    const shellPath = path.join(projectDir, 'android');
    if ((await fs.stat(shellPath)).isDirectory()) {
      const stylesPath = path.join(shellPath, STYLES_XML_PATH);
      if ((await fs.stat(stylesPath)).isFile()) {
        return stylesPath;
      }
    }
  } catch (error) {}

  return null;
}
