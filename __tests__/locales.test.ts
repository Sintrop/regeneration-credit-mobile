import fs from 'fs';
import path from 'path';

import en from '../src/lang/locales/en.json';
import pt from '../src/lang/locales/pt.json';

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [fullKey] : flatten(value, fullKey);
  });
}

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(fullPath);
    return /\.tsx?$/.test(entry.name) ? [fullPath] : [];
  });
}

const enKeys = flatten(en.translation as Tree);
const ptKeys = flatten(pt.translation as Tree);

describe('locales', () => {
  it('have the same keys in English and Portuguese', () => {
    expect(enKeys.filter(key => !ptKeys.includes(key))).toEqual([]);
    expect(ptKeys.filter(key => !enKeys.includes(key))).toEqual([]);
  });

  it('have no empty keys', () => {
    expect(enKeys.filter(key => key.split('.').includes(''))).toEqual([]);
    expect(ptKeys.filter(key => key.split('.').includes(''))).toEqual([]);
  });

  it('define every static key used in the source code', () => {
    const srcDir = path.join(__dirname, '..', 'src');
    const usedKeys = new Set<string>();
    for (const file of sourceFiles(srcDir)) {
      const content = fs.readFileSync(file, 'utf8');
      for (const match of content.matchAll(/\bt\(\s*['"]([\w.]+)['"]/g)) {
        usedKeys.add(match[1]);
      }
    }
    expect([...usedKeys].filter(key => !enKeys.includes(key)).sort()).toEqual([]);
  });
});
