import {
  allPermissions,
  getAndroidPermissions,
  requiredPermissions,
  setAndroidPermissions,
} from '../Permissions';

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

  it('does not add permission if its already present', () => {
    expect(
      setAndroidPermissions({ android: { permissions: ['VIBRATE'] } }, EXAMPLE_ANDROID_MANIFEST)
    ).toMatch(EXAMPLE_ANDROID_MANIFEST);
  });

  it('does add permission if not already present', () => {
    expect(
      setAndroidPermissions({ android: { permissions: ['READ_SMS'] } }, EXAMPLE_ANDROID_MANIFEST)
    ).toMatch(`<uses-permission android:name="android.permission.READ_SMS"/>`);
  });
});
