import { dirname, resolve } from 'path';
import fs from 'fs-extra';
import {
  allPermissions,
  getAndroidPermissions,
  requiredPermissions,
  setAndroidPermissions,
} from '../Permissions';
import { readAndroidManifestAsync } from '../Manifest';

const fixturesPath = resolve(__dirname, 'fixtures');
const sampleManifestPath = resolve(fixturesPath, 'react-native-AndroidManifest.xml');

// TODO: use fixtures for manifest/mainactivity instead of inline strings

const EXAMPLE_ANDROID_MANIFEST = `
  <manifest xmlns:android="http://schemas.android.com/apk/res/android"
      package="com.helloworld">
      <application
      android:name=".MainApplication"
      android:theme="@style/AppTheme">

      <uses-permission android:name="android.permission.INTERNET" />
      <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
      <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
      <uses-permission android:name="android.permission.WAKE_LOCK" />
      <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
      
      <!-- OPTIONAL PERMISSIONS, REMOVE WHATEVER YOU DO NOT NEED -->
        <uses-permission android:name="android.permission.VIBRATE" />
        <uses-permission android:name="android.permission.READ_INTERNAL_STORAGE" />
      <!-- END OPTIONAL PERMISSIONS -->

      <activity
          android:name=".MainActivity"
          android:label="@string/app_name"
          android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
          android:windowSoftInputMode="adjustResize">
          <intent-filter>
              <action android:name="android.intent.action.MAIN" />
              <category android:name="android.intent.category.LAUNCHER" />
          </intent-filter>
        </activity>
      <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
    </application>
  </manifest>
  `;

describe('Android permissions', () => {
  it(`returns empty array if no android permissions key is provided`, () => {
    expect(getAndroidPermissions({})).toMatchObject([]);
  });

  it(`returns android permissions if array is provided`, () => {
    expect(
      getAndroidPermissions({ android: { permissions: ['CAMERA', 'RECORD_AUDIO'] } })
    ).toMatchObject(['CAMERA', 'RECORD_AUDIO']);
  });

  describe('adds permissions in AndroidManifest.xml if given', () => {
    const projectDirectory = resolve(fixturesPath, 'tmp/');
    const appManifestPath = resolve(fixturesPath, 'tmp/android/app/src/main/AndroidManifest.xml');

    beforeAll(async () => {
      await fs.ensureDir(dirname(appManifestPath));
      await fs.copyFile(sampleManifestPath, appManifestPath);
    });

    afterAll(async () => {
      await fs.remove(resolve(fixturesPath, 'tmp/'));
    });

    it('adds permissions if not present, does not duplicate permissions', async () => {
      let givenPermissions = [
        'android.permission.READ_CONTACTS',
        'com.android.launcher.permission.INSTALL_SHORTCUT',
        'com.android.launcher.permission.INSTALL_SHORTCUT',
      ];
      expect(
        await setAndroidPermissions(
          { android: { permissions: givenPermissions } },
          projectDirectory
        )
      ).toBe(true);

      let manifestPermissionsJSON = (await readAndroidManifestAsync(appManifestPath)).manifest[
        'uses-permission'
      ];
      let manifestPermissions = manifestPermissionsJSON.map(e => e['$']['android:name']);

      expect(
        manifestPermissions.every(permission =>
          givenPermissions.concat(requiredPermissions).includes(permission)
        )
      ).toBe(true);
      expect(
        manifestPermissions.filter(e => e === 'com.android.launcher.permission.INSTALL_SHORTCUT')
      ).toHaveLength(1);
    });
  });
});
