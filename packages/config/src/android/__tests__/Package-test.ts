import { getPackage, setPackageInAndroidManifest, setPackageInBuildGradle } from '../Package';

// TODO: use fixtures for manifest/build.gradle instead of inline strings

const EXAMPLE_ANDROID_MANIFEST = `
<application
  android:name="com.helloworld"
/>
`;

const EXAMPLE_BUILD_GRADLE = `
android {
    compileSdkVersion rootProject.ext.compileSdkVersion
    buildToolsVersion rootProject.ext.buildToolsVersion

    defaultConfig {
        applicationId "com.helloworld"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
    }
}
`;

describe('package', () => {
  it(`returns null if no package is provided`, () => {
    expect(getPackage({})).toBe(null);
  });

  it(`returns the package if provided`, () => {
    expect(getPackage({ android: { package: 'com.example.xyz' } })).toBe('com.example.xyz');
  });

  it(`sets the applicationId in build.gradle if package is given`, () => {
    expect(
      setPackageInBuildGradle({ android: { package: 'my.new.app' } }, EXAMPLE_BUILD_GRADLE)
    ).toMatch("applicationId 'my.new.app'");
  });

  it(`sets the android:name in AndroidManifest.xml if package is given`, () => {
    expect(
      setPackageInAndroidManifest({ android: { package: 'my.new.app' } }, EXAMPLE_ANDROID_MANIFEST)
    ).toMatch('android:name="my.new.app"');
  });

  // TODO: add test cases for passing in a different package name to replace in third param
});
