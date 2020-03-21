import path from 'path';
import fs from 'fs-extra';
import { Builder, Parser } from 'xml2js';
import { Document } from './Manifest';

export async function getProjectStylesXMLPathAsync(projectDir: string): Promise<string | null> {
  try {
    const shellPath = path.join(projectDir, 'android');
    if ((await fs.stat(shellPath)).isDirectory()) {
      const stylesPath = path.join(shellPath, 'app/src/main/res/values/styles.xml');
      await fs.ensureFile(stylesPath);
      return stylesPath;
    }
  } catch (error) {
    throw new Error(`Could not create android/app/src/main/res/values/styles.xml`);
  }

  return null;
}

export async function readStylesXMLAsync(stylesPath: string): Promise<Document> {
  const contents = await fs.readFile(stylesPath, { encoding: 'utf8', flag: 'r' });
  const parser = new Parser();
  const manifest = parser.parseStringPromise(contents);
  return manifest;
}

export async function writeStylesXMLAsync(stylesPath: string, stylesContent: any): Promise<void> {
  const stylesXml = new Builder().buildObject(stylesContent);
  await fs.ensureDir(path.dirname(stylesPath));
  await fs.writeFile(stylesPath, stylesXml);
}
