const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const FILE_NAME = 'yourtext.txt';
const WELCOME_MESSAGE = 'Enter some text:\n';
const BYE_MESSAGE = `Thank you! Your text is saved to file ${FILE_NAME}\n`;

const file = path.join(__dirname, FILE_NAME);
const stream = fs.createWriteStream(file);

const handleExit = (message) => {
  stdout.write(message);
  process.exit();
};

stdout.write(WELCOME_MESSAGE);

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    handleExit(BYE_MESSAGE);
  }
  stream.write(data);
});

process.on('SIGINT', () => handleExit(BYE_MESSAGE));