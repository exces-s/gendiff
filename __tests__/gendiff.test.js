import gendiff from '../';

const result = [
  'host: hexlet.io',
  'timeout: 20',
  '- timeout: 50',
  '- proxy: 123.234.53.22',
  '+ verbose: true',
];

const file1 = '/__fixtures__/before.json';
const file2 = '/__fixtures__/after.json';

test('compare flat JSONs', () => {
  expect(gendiff(file1, file2).sort()).toBe(result.sort());
});
