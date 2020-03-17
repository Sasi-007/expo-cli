import { ExpoConfig } from '../Config.types';

export const ON_CONFIGURATION_CHANGED = `
public class MainActivity extends ReactActivity {

    // Added automatically by Expo Config
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        sendBroadcast(intent);
    }
`;

export function getUserInterfaceStyle(config: ExpoConfig): string {
  let result = config.android?.userInterfaceStyle ?? config.userInterfaceStyle;
  return result ?? null;
}

export function setUiModeAndroidManifest(config: ExpoConfig, androidManifest: string): string {
  let userInterfaceStyle = getUserInterfaceStyle(config);
  if (!userInterfaceStyle) {
    return androidManifest;
  }

  let pattern = new RegExp(`android:configChanges=".*"`);
  return androidManifest.replace(
    pattern,
    `android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"`
  );
}

export function addOnConfigurationChangedMainActivity(
  config: ExpoConfig,
  MainActivity: string
): string {
  let userInterfaceStyle = getUserInterfaceStyle(config);
  if (!userInterfaceStyle) {
    return MainActivity;
  }

  let pattern = new RegExp(`public class MainActivity extends ReactActivity {`);
  return MainActivity.replace(pattern, ON_CONFIGURATION_CHANGED);
}
