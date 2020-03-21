import { ExpoConfig } from '../Config.types';
import { getProjectStylesXMLPathAsync, readStylesXMLAsync, writeStylesXMLAsync } from './Styles';
import { getProjectColorsXMLPathAsync, readColorsXMLAsync, writeColorsXMLAsync } from './Colors';

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

  let stylesJSON = await readStylesXMLAsync(stylesPath);
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
    await writeStylesXMLAsync(stylesPath, stylesJSON);
  } catch (e) {
    throw new Error(
      `Error setting Android root view background color. Cannot write new AndroidManifest.xml to ${stylesPath}.`
    );
  }
  return true;
}
