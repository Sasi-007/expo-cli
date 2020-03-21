import { getProjectStylesXMLPathAsync } from './Styles';
import { ExpoConfig } from '../Config.types';
import {
  readAndroidManifestAsync as readXMLFileAsync,
  writeAndroidManifestAsync as writeXMLFileAsync,
} from './Manifest';

type StyleItem = {
  _: string;
  $: { name: string };
};

export function getStatusBarColor(config: ExpoConfig) {
  return config.androidStatusBar?.backgroundColor || 'translucent';
}

export async function setStatusBarColor(config: ExpoConfig, projectDirectory: string) {
  let hexString = getStatusBarColor(config);

  const stylesPath = await getProjectStylesXMLPathAsync(projectDirectory);
  if (!stylesPath) {
    return false;
  }

  let stylesJSON = await readXMLFileAsync(stylesPath);
  let appTheme = stylesJSON.resources.style.filter((e: any) => e['$']['name'] === 'AppTheme')[0];
  let existingItem;
  let itemToAdd: StyleItem[] = [{ _: '', $: { name: '' } }];
  if (hexString === 'translucent') {
    // translucent status bar set in theme
    itemToAdd[0]._ = 'true';
    itemToAdd[0].$.name = 'android:windowTranslucentStatus';
  } else {
    itemToAdd[0]._ = hexString;
    itemToAdd[0].$.name = 'colorPrimaryDark';
  }
  if (appTheme.item) {
    existingItem = appTheme.item.filter(
      (item: StyleItem) => item['$'].name === itemToAdd[0].$.name
    )[0];

    // Don't want to 2 colorPrimaryDark items, so if one exists, we overwrite it
    if (existingItem) {
      existingItem['_'] = itemToAdd[0]['_'];
    } else {
      appTheme.item = appTheme.item.concat(itemToAdd);
    }
  } else {
    appTheme.item = itemToAdd;
  }

  try {
    await writeXMLFileAsync(stylesPath, stylesJSON);
  } catch (e) {
    throw new Error(
      `Error setting Android primary dark color. Cannot write new AndroidManifest.xml to ${stylesPath}.`
    );
  }
  return true;
}
