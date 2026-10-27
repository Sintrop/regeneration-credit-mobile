import fs from 'fs';
import path from 'path';

import en from '../src/lang/locales/en.json';
import pt from '../src/lang/locales/pt.json';
import es from '../src/lang/locales/es.json';

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
const esKeys = flatten(es.translation as Tree);

describe('locales', () => {
  it.each([
    ['Portuguese', ptKeys],
    ['Spanish', esKeys],
  ])('have the same keys in English and %s', (_, keys) => {
    expect(enKeys.filter(key => !keys.includes(key))).toEqual([]);
    expect(keys.filter(key => !enKeys.includes(key))).toEqual([]);
  });

  it('have no empty keys', () => {
    expect(enKeys.filter(key => key.split('.').includes(''))).toEqual([]);
    expect(ptKeys.filter(key => key.split('.').includes(''))).toEqual([]);
    expect(esKeys.filter(key => key.split('.').includes(''))).toEqual([]);
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

describe('interpolation', () => {
  function placeholders(value: string) {
    return [...value.matchAll(/{{(\w+)}}/g)].map(match => match[1]).sort();
  }

  function values(tree: Tree, prefix = ''): Record<string, string> {
    return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      return typeof value === 'string' ? { ...acc, [fullKey]: value } : { ...acc, ...values(value, fullKey) };
    }, {});
  }

  const enValues = values(en.translation as Tree);

  it.each([
    ['Portuguese', values(pt.translation as Tree)],
    ['Spanish', values(es.translation as Tree)],
  ])('uses the same placeholders in English and %s', (_, translated) => {
    const mismatches = Object.keys(enValues).filter(
      key => placeholders(enValues[key]).join() !== placeholders(translated[key] ?? '').join(),
    );
    expect(mismatches).toEqual([]);
  });
});
