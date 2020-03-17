import { getScheme, setScheme } from '../Scheme';

// TODO: use fixtures for manifest/build.gradle instead of inline strings

const EXAMPLE_ANDROID_MANIFEST = `
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.helloworld">
    <application
    android:name=".MainApplication"
    android:theme="@style/AppTheme">
    
    <activity android:name=".MainActivity">
      <intent-filter android:label="Shooter">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <!-- Accepts URIs that begin with "link://exampleurl” -->
        <data android:scheme="link"
              android:host="exampleurl" />
      </intent-filter>
    </activity>
    <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
  </application>
</manifest>
`;

describe('scheme', () => {
  it(`returns null if no scheme is provided`, () => {
    expect(getScheme({})).toBe(null);
  });

  it(`returns the scheme if provided`, () => {
    expect(getScheme({ scheme: 'myapp' })).toBe('myapp');
  });

  it(`sets the android:scheme in AndroidManifest.xml if scheme is given`, () => {
    expect(setScheme({ scheme: 'myapp' }, EXAMPLE_ANDROID_MANIFEST)).toMatch(
      `android:scheme="myapp"`
    );
  });
});
