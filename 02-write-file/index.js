const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const FILE_NAME = 'yourtext.txt';
const WELCOME_MESSAGE = 'Enter some text:\n';
const BYE_MESSAGE = `Thank you! Your text is saved to file ${FILE_NAME}\n`;

const file = path.join(__dirname, FILE_NAME);
const stream = fs.createWriteStream(file);

stdout.write(WELCOME_MESSAGE);

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write(BYE_MESSAGE);
    process.exit();
  }
  stream.write(data);
});

process.on('SIGINT', () => {
  stdout.write(BYE_MESSAGE);
  process.exit();
});