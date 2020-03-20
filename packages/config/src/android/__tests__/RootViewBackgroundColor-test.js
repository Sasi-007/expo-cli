import fs from 'fs-extra';
import { dirname, resolve } from 'path';
import { getRootViewBackgroundColor, setRootViewBackgroundColor } from '../RootViewBackgroundColor';
import { readAndroidManifestAsync as readXMLFileAsync } from '../Manifest';
const fixturesPath = resolve(__dirname, 'fixtures');
const sampleStylesXMLPath = resolve(fixturesPath, 'styles.xml');

describe('Root view background color', () => {
  it(`returns null if no backgroundColor is provided`, () => {
    expect(getRootViewBackgroundColor({})).toBe(null);
  });

  it(`returns backgroundColor if provided`, () => {
    expect(getRootViewBackgroundColor({ backgroundColor: '#111111' })).toMatch('#111111');
  });

  it(`returns the backgroundColor under android if provided`, () => {
    expect(
      getRootViewBackgroundColor({
        backgroundColor: '#111111',
        android: { backgroundColor: '#222222' },
      })
    ).toMatch('#222222');
  });

  describe('write colors.xml correctly', () => {
    const projectDirectory = resolve(fixturesPath, 'tmp/');
    const stylesXMLPath = resolve(fixturesPath, 'tmp/android/app/src/main/res/values/styles.xml');

    beforeAll(async () => {
      await fs.ensureDir(dirname(stylesXMLPath));
      await fs.copyFile(sampleStylesXMLPath, stylesXMLPath);
    });

    afterAll(async () => {
      await fs.remove(resolve(fixturesPath, 'tmp/'));
    });

    it(`sets the android:windowBackground in Styles.xml if backgroundColor is given`, async () => {
      expect(
        await setRootViewBackgroundColor({ backgroundColor: '#654321' }, projectDirectory)
      ).toBe(true);

      let stylesJSON = await readXMLFileAsync(stylesXMLPath);
      expect(
        stylesJSON.resources.style
          .filter(e => e['$']['name'] === 'AppTheme')[0]
          .item.filter(item => item['$'].name === 'android:windowBackground')[0]['_']
      ).toMatch('#654321');
    });
  });
});
