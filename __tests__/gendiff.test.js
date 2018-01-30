import gendiff from '../src';

const result = `{
- proxy: 123.234.53.22
+ verbose: true
  host: hexlet.io
+ timeout: 20
- timeout: 50
}`;


const oldFileJSON = '__tests__/__fixtures__/before.json';
const newFileJSON = '__tests__/__fixtures__/after.json';

test('compare flat JSONs', () => {
  expect(gendiff(oldFileJSON, newFileJSON)).toEqual(result);
});

const oldFileYAML = '__tests__/__fixtures__/before.yml';
const newFileYAML = '__tests__/__fixtures__/after.yml';

test('compare flat YAMLs', () => {
  expect(gendiff(oldFileYAML, newFileYAML)).toEqual(result);
});
