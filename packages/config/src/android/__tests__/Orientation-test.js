import fs, { ensureDir } from 'fs-extra';
import { dirname, resolve } from 'path';

import { getOrientation, setAndroidOrientation } from '../Orientation';

const fixturesPath = resolve(__dirname, 'fixtures');
const projectDirectory = resolve(fixturesPath, 'tmp/');
const sampleManifestPath = resolve(fixturesPath, 'react-native-AndroidManifest.xml');

describe('Android orientation', () => {
  beforeAll(async () => {
    const appManifestPath = resolve(fixturesPath, 'tmp/android/app/src/main/AndroidManifest.xml');

    await fs.ensureDir(dirname(appManifestPath));
    await fs.copyFile(sampleManifestPath, appManifestPath);
  }, 1000);

  afterAll(async () => {
    await fs.remove(resolve(fixturesPath, 'tmp/'));
  }, 1000);

  it(`returns null if no orientation is provided`, () => {
    expect(getOrientation({})).toBe(null);
  });

  it(`returns orientation if provided`, () => {
    expect(getOrientation({ orientation: 'landscape' })).toMatch('landscape');
  });

  it('adds orientation attribute if not present', async () => {
    expect(await setAndroidOrientation({ orientation: 'landscape' }, projectDirectory)).toBe(true);
  });

  it('replaces orientation attribute if present', async () => {
    expect(await setAndroidOrientation({ orientation: 'portrait' }, projectDirectory)).toBe(true);
  });

  it('does nothing if no orientation is provided', async () => {
    expect(await setAndroidOrientation({}, projectDirectory)).toBe(false);
  });

  it('does nothing if no android manifest', async () => {
    expect(await setAndroidOrientation({}, 'wrong/path')).toBe(false);
  });
});
