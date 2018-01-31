import fs from 'fs';
import genDiff from '../src';

// path to file from package root
const result = fs.readFileSync('__tests__/__fixtures__/result.txt', 'utf8');

const oldJson = '__tests__/__fixtures__/before.json';
const newJson = '__tests__/__fixtures__/after.json';

const oldYaml = '__tests__/__fixtures__/before.yml';
const newYaml = '__tests__/__fixtures__/after.yml';

const oldIni = '__tests__/__fixtures__/before.ini';
const newIni = '__tests__/__fixtures__/after.ini';

test('genDiff flat JSONs', () => {
  expect(genDiff(oldJson, newJson)).toEqual(result);
});

test('genDiff flat YAMLs', () => {
  expect(genDiff(oldYaml, newYaml)).toEqual(result);
});

test('genDiff flat JSON & YAML', () => {
  expect(genDiff(oldJson, newYaml)).toEqual(result);
});

test('genDiff flat INIs', () => {
  expect(genDiff(oldIni, newIni)).toEqual(result);
});
