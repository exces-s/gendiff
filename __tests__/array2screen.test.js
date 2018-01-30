import { compare } from '../src';


const oldFile = '__tests__/__fixtures__/before.json';
const newFile = '__tests__/__fixtures__/after.json';
const result = `{
- proxy: 123.234.53.22
+ verbose: true
  host: hexlet.io
+ timeout: 20
- timeout: 50
}`;

test('compare flat JSONs', () => {
  expect(compare(oldFile, newFile)).toBe(result);
});
