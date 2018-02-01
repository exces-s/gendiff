import fs from 'fs';
import genDiff from '../src';

// path to file from package root
const pathToResultFile = '__tests__/__fixtures__/result.txt';
const pathToResultTreeFile = '__tests__/__fixtures__/resultTree.txt';

const pathToBeforeJsonFile = '__tests__/__fixtures__/before.json';
const pathToAfterJsonFile = '__tests__/__fixtures__/after.json';

const pathToBeforeYamlFile = '__tests__/__fixtures__/before.yml';
const pathToAfterYamlFile = '__tests__/__fixtures__/after.yml';

const pathToBeforeIniFile = '__tests__/__fixtures__/before.ini';
const pathToAfterIniFile = '__tests__/__fixtures__/after.ini';

const pathToTreeBeforeJsonFile = '__tests__/__fixtures__/treeBefore.json';
const pathToTreeAfterJsonFile = '__tests__/__fixtures__/treeAfter.json';

const pathToTreeBeforeYamlFile = '__tests__/__fixtures__/treeBefore.yml';
const pathToTreeAfterYamlFile = '__tests__/__fixtures__/treeAfter.yml';

const pathToTreeBeforeIniFile = '__tests__/__fixtures__/treeBefore.ini';
const pathToTreeAfterIniFile = '__tests__/__fixtures__/treeAfter.ini';


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
test('genDiff tree JSONs', () => {
  expect(genDiff(pathToTreeBeforeJsonFile, pathToTreeAfterJsonFile))
    .toEqual(fs.readFileSync(pathToResultTreeFile, 'utf8'));
});
test('genDiff tree YAMLs', () => {
  expect(genDiff(pathToTreeBeforeYamlFile, pathToTreeAfterYamlFile))
    .toEqual(fs.readFileSync(pathToResultTreeFile, 'utf8'));
});
test('genDiff tree INIs', () => {
  expect(genDiff(pathToTreeBeforeIniFile, pathToTreeAfterIniFile))
    .toEqual(fs.readFileSync(pathToResultTreeFile, 'utf8'));
});
