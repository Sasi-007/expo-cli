import { getProjectStylesXMLPathAsync } from './RootViewBackgroundColor';
import { ExpoConfig } from '../Config.types';
import {
  readAndroidManifestAsync as readXMLFileAsync,
  writeAndroidManifestAsync as writeXMLFileAsync,
} from './Manifest';

const DEFAULT_PRIMARY_COLOR = '#023c69';
type StyleItem = {
  _: string;
  $: { name: string };
};

export function getPrimaryColor(config: ExpoConfig) {
  return config.primaryColor ?? DEFAULT_PRIMARY_COLOR;
}

export async function setPrimaryColor(config: ExpoConfig, projectDirectory: string) {
  let hexString = getPrimaryColor(config);

  const stylesPath = await getProjectStylesXMLPathAsync(projectDirectory);
  if (!stylesPath) {
    return false;
  }

  const colorPrimaryItem = [
    {
      _: hexString,
      $: {
        name: 'colorPrimary',
      },
    },
  ];

  let stylesJSON = await readXMLFileAsync(stylesPath);
  let appTheme = stylesJSON.resources.style.filter((e: any) => e['$']['name'] === 'AppTheme')[0];
  if (appTheme.item) {
    let existingColorPrimaryItem = appTheme.item.filter(
      (item: StyleItem) => item['$'].name === 'colorPrimary'
    )[0];

    // Don't want to 2 colorPrimaries, so if one exists, we overwrite it
    if (existingColorPrimaryItem) {
      existingColorPrimaryItem['_'] = colorPrimaryItem[0]['_'];
    } else {
      appTheme.item = appTheme.item.concat(colorPrimaryItem);
    }
  } else {
    appTheme.item = colorPrimaryItem;
  }

  try {
    await writeXMLFileAsync(stylesPath, stylesJSON);
  } catch (e) {
    throw new Error(
      `Error setting Android primary color. Cannot write new AndroidManifest.xml to ${stylesPath}.`
    );
  }
  return true;
}
