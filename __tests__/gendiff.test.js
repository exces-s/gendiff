import fs from 'fs';
import genDiff from '../src';

// path to file from package root
const pathToResultFile = '__tests__/__fixtures__/result.txt';

const pathToBeforeJsonFile = '__tests__/__fixtures__/before.json';
const pathToAfterJsonFile = '__tests__/__fixtures__/after.json';

const pathToBeforeYamlFile = '__tests__/__fixtures__/before.yml';
const pathToAfterYamlFile = '__tests__/__fixtures__/after.yml';

const pathToBeforeIniFile = '__tests__/__fixtures__/before.ini';
const pathToAfterIniFile = '__tests__/__fixtures__/after.ini';

test('genDiff flat JSONs', () => {
  expect(genDiff(pathToBeforeJsonFile, pathToAfterJsonFile))
    .toEqual(fs.readFileSync(pathToResultFile, 'utf8'));
});

test('genDiff flat YAMLs', () => {
  expect(genDiff(pathToBeforeYamlFile, pathToAfterYamlFile))
    .toEqual(fs.readFileSync(pathToResultFile, 'utf8'));
});

test('genDiff flat JSON & YAML', () => {
  expect(genDiff(pathToBeforeJsonFile, pathToAfterYamlFile))
    .toEqual(fs.readFileSync(pathToResultFile, 'utf8'));
});

test('genDiff flat INIs', () => {
  expect(genDiff(pathToBeforeIniFile, pathToAfterIniFile))
    .toEqual(fs.readFileSync(pathToResultFile, 'utf8'));
});
