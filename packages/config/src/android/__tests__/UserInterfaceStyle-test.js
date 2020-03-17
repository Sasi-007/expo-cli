import {
  ON_CONFIGURATION_CHANGED,
  addOnConfigurationChangedMainActivity,
  getUserInterfaceStyle,
  setUiModeAndroidManifest,
} from '../UserInterfaceStyle';

// TODO: use fixtures for manifest/build.gradle instead of inline strings

const EXAMPLE_ANDROID_MANIFEST = `
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.helloworld">
    <application
    android:name=".MainApplication"
    android:theme="@style/AppTheme">
    
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

const EXAMPLE_MAIN_ACTIVITY_BEFORE = `
package com.helloworld;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "HelloWorld";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
`;

describe('User interface style', () => {
  it(`returns null if no userInterfaceStyle is provided`, () => {
    expect(getUserInterfaceStyle({})).toBe(null);
  });

  it(`returns the userInterfaceStyle if provided`, () => {
    expect(getUserInterfaceStyle({ userInterfaceStyle: 'light' })).toBe('light');
  });

  it(`returns the userInterfaceStyle under android if provided`, () => {
    expect(
      getUserInterfaceStyle({
        userInterfaceStyle: 'dark',
        android: { userInterfaceStyle: 'light' },
      })
    ).toBe('light');
  });

  it(`sets the android:configChanges in AndroidManifest.xml if userInterfaceStyle is given`, () => {
    expect(
      setUiModeAndroidManifest({ userInterfaceStyle: 'light' }, EXAMPLE_ANDROID_MANIFEST)
    ).toMatch(`android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"`);
  });

  it(`adds the onConfigurationChanged method in MainActivity.java if userInterfaceStyle is given`, () => {
    expect(
      addOnConfigurationChangedMainActivity(
        { userInterfaceStyle: 'light' },
        EXAMPLE_MAIN_ACTIVITY_BEFORE
      )
    ).toMatch(ON_CONFIGURATION_CHANGED);
  });

  it(`makes no changes to the androidManifest or MainActivity if userInterfaceStyle value provided`, () => {
    expect(setUiModeAndroidManifest({}, EXAMPLE_ANDROID_MANIFEST)).toMatch(
      EXAMPLE_ANDROID_MANIFEST
    );
    expect(addOnConfigurationChangedMainActivity({}, EXAMPLE_MAIN_ACTIVITY_BEFORE)).toMatch(
      EXAMPLE_MAIN_ACTIVITY_BEFORE
    );
  });
});
