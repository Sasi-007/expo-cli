import path from 'path';
import fs from 'fs-extra';
import { Builder, Parser } from 'xml2js';
import { Document } from './Manifest';

export async function getProjectColorsXMLPathAsync(projectDir: string): Promise<string | null> {
  try {
    const shellPath = path.join(projectDir, 'android');
    if ((await fs.stat(shellPath)).isDirectory()) {
      const colorsPath = path.join(shellPath, 'app/src/main/res/values/colors.xml');
      await fs.ensureFile(colorsPath);
    } else {
      throw new Error('No android directory found in your project.');
    }
  } catch (error) {}

  return null;
}

export async function readColorsXMLAsync(colorsPath: string): Promise<Document> {
  const contents = await fs.readFile(colorsPath, { encoding: 'utf8', flag: 'r' });
  const parser = new Parser();
  const manifest = parser.parseStringPromise(contents);
  return manifest;
}

export async function writeColorsXMLAsync(colorsPath: string, colorsContent: any): Promise<void> {
  const colorsXml = new Builder().buildObject(colorsContent);
  await fs.ensureDir(path.dirname(colorsPath));
  await fs.writeFile(colorsPath, colorsXml);
}
