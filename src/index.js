import commander from 'commander';
import fs from 'fs';
import _ from 'lodash';

const compare = (file1, file2) => {
  const f1 = JSON.parse(fs.readFileSync(file1));
  const f2 = JSON.parse(fs.readFileSync(file2));
  const f1Keys = Object.keys(f1);
  const f2Keys = Object.keys(f2);

  const commonKeys = _.intersection(f1Keys, f2Keys);
  const f1UniqKeys = _.difference(f1Keys, commonKeys);
  const f2UniqKeys = _.difference(f2Keys, commonKeys);

  const result = [];
  f1UniqKeys.map(key => result.push(`- ${key}: obj1[key]`));
  f2UniqKeys.map(key => result.push(`+ ${key}: obj2[key]`));
  commonKeys.map((key) => {
    if (f2[key] === f1[key]) {
      return result.push(`  ${key}: obj2[key]`);
    }
    return result.push(`+ ${key}: obj2[key]\n- ${key}: obj1[key]`);
  });
};

const program = commander;

program
  .version('0.1.0')
  .arguments('<file1> <file2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action(compare);

const start = () => program.parse(process.argv);
export default start;
