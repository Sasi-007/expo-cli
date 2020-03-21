import {
  XMLItem,
  getProjectStylesXMLPathAsync,
  readStylesXMLAsync,
  setStylesItem,
  writeStylesXMLAsync,
} from './Styles';
import {
  getProjectColorsXMLPathAsync,
  readColorsXMLAsync,
  setColorItem,
  writeColorsXMLAsync,
} from './Colors';
import { ExpoConfig } from '../Config.types';

const COLOR_PRIMARY_DARK_KEY = 'colorPrimaryDark';

export function getStatusBarColor(config: ExpoConfig) {
  return config.androidStatusBar?.backgroundColor || 'translucent';
}

export async function setStatusBarColor(config: ExpoConfig, projectDirectory: string) {
  let hexString = getStatusBarColor(config);

  const stylesPath = await getProjectStylesXMLPathAsync(projectDirectory);
  if (!stylesPath) {
    return false;
  }

  const colorsPath = await getProjectColorsXMLPathAsync(projectDirectory);
  if (!colorsPath) {
    return false;
  }

  let stylesJSON = await readStylesXMLAsync(stylesPath);
  let colorsJSON = await readColorsXMLAsync(colorsPath);

  let styleItemToAdd: XMLItem[] = [{ _: '', $: { name: '' } }];
  if (hexString === 'translucent') {
    // translucent status bar set in theme
    styleItemToAdd[0]._ = 'true';
    styleItemToAdd[0].$.name = 'android:windowTranslucentStatus';
  } else {
    // Need to add a color key to colors.xml to use in styles.xml
    let colorItemToAdd: XMLItem[] = [{ _: '', $: { name: '' } }];
    colorItemToAdd[0]._ = hexString;
    colorItemToAdd[0].$.name = COLOR_PRIMARY_DARK_KEY;
    colorsJSON = setColorItem(colorItemToAdd, colorsJSON);

    styleItemToAdd[0]._ = `@color/${COLOR_PRIMARY_DARK_KEY}`;
    styleItemToAdd[0].$.name = 'colorPrimaryDark';
  }

  stylesJSON = setStylesItem(styleItemToAdd, stylesJSON);

  try {
    await writeColorsXMLAsync(colorsPath, colorsJSON);
    await writeStylesXMLAsync(stylesPath, stylesJSON);
  } catch (e) {
    throw new Error(
      `Error setting Android primary dark color. Cannot write new AndroidManifest.xml to ${stylesPath}.`
    );
  }
  return true;
}
