import fs from 'fs-extra';
import { dirname, resolve } from 'path';
import { getStatusBarColor, setStatusBarColor } from '../StatusBar';
import { readAndroidManifestAsync as readXMLFileAsync } from '../Manifest';
const fixturesPath = resolve(__dirname, 'fixtures');
const sampleStylesXMLPath = resolve(fixturesPath, 'styles.xml');

describe('Android primary color', () => {
  it(`returns 'translucent' if no status bar color is provided`, () => {
    expect(getStatusBarColor({})).toMatch('translucent');
    expect(getStatusBarColor({ androidStatusBar: {} })).toMatch('translucent');
  });

  it(`returns statusbar color if provided`, () => {
    expect(getStatusBarColor({ androidStatusBar: { backgroundColor: '#111111' } })).toMatch(
      '#111111'
    );
  });

  describe('write statusbar color to colors.xml correctly', () => {
    const projectDirectory = resolve(fixturesPath, 'tmp/');
    const stylesXMLPath = resolve(fixturesPath, 'tmp/android/app/src/main/res/values/styles.xml');

    beforeAll(async () => {
      await fs.ensureDir(dirname(stylesXMLPath));
      await fs.copyFile(sampleStylesXMLPath, stylesXMLPath);
    });

    afterAll(async () => {
      //await fs.remove(resolve(fixturesPath, 'tmp/'));
    });

    it(`sets the colorPrimaryDark item in Styles.xml if 'androidStatusBar.backgroundColor' is given`, async () => {
      expect(
        await setStatusBarColor(
          { androidStatusBar: { backgroundColor: '#654321' } },
          projectDirectory
        )
      ).toBe(true);

      let stylesJSON = await readXMLFileAsync(stylesXMLPath);
      expect(
        stylesJSON.resources.style
          .filter(e => e['$']['name'] === 'AppTheme')[0]
          .item.filter(item => item['$'].name === 'colorPrimaryDark')[0]['_']
      ).toMatch('#654321');
    });

    it(`sets the status bar to translucent if no 'androidStatusBar.backgroundColor' is given`, async () => {
      expect(await setStatusBarColor({}, projectDirectory)).toBe(true);
    });
  });
});
