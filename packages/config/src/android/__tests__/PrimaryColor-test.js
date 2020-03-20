import fs from 'fs-extra';
import { dirname, resolve } from 'path';
import { getPrimaryColor, setPrimaryColor } from '../PrimaryColor';
import { readAndroidManifestAsync as readXMLFileAsync } from '../Manifest';
const fixturesPath = resolve(__dirname, 'fixtures');
const sampleStylesXMLPath = resolve(fixturesPath, 'styles.xml');

describe('Android primary color', () => {
  it(`returns default if no primary color is provided`, () => {
    expect(getPrimaryColor({})).toBe('#023c69');
  });

  it(`returns primary color if provided`, () => {
    expect(getPrimaryColor({ primaryColor: '#111111' })).toMatch('#111111');
  });

  describe('write primary color to colors.xml correctly', () => {
    const projectDirectory = resolve(fixturesPath, 'tmp/');
    const stylesXMLPath = resolve(fixturesPath, 'tmp/android/app/src/main/res/values/styles.xml');

    beforeAll(async () => {
      await fs.ensureDir(dirname(stylesXMLPath));
      await fs.copyFile(sampleStylesXMLPath, stylesXMLPath);
    });

    afterAll(async () => {
      await fs.remove(resolve(fixturesPath, 'tmp/'));
    });

    it(`sets the colorPrimary item in Styles.xml if backgroundColor is given`, async () => {
      expect(await setPrimaryColor({ primaryColor: '#654321' }, projectDirectory)).toBe(true);

      let stylesJSON = await readXMLFileAsync(stylesXMLPath);
      expect(
        stylesJSON.resources.style
          .filter(e => e['$']['name'] === 'AppTheme')[0]
          .item.filter(item => item['$'].name === 'colorPrimary')[0]['_']
      ).toMatch('#654321');
    });
  });
});
