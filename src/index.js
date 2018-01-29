import commander from 'commander'; // eslint-disable-line

const program = commander;

program
  .version('0.1.0')
  .arguments('<file1> <file2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action(() => console.log('START'));

const start = () => program.parse(process.argv);
export default start;
