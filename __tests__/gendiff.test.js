import fs from 'fs';
import genDiff from '../src';

// path to file from package root
const result = fs.readFileSync('__tests__/__fixtures__/result.txt', 'utf8');

const oldFileJSON = '__tests__/__fixtures__/before.json';
const newFileJSON = '__tests__/__fixtures__/after.json';

const oldFileYAML = '__tests__/__fixtures__/before.yml';
const newFileYAML = '__tests__/__fixtures__/after.yml';

test('genDiff flat JSONs', () => {
  expect(genDiff(oldFileJSON, newFileJSON)).toEqual(result);
});

test('genDiff flat YAMLs', () => {
  expect(genDiff(oldFileYAML, newFileYAML)).toEqual(result);
});

test('genDiff flat JSON & YAML', () => {
  expect(genDiff(oldFileJSON, newFileYAML)).toEqual(result);
});
