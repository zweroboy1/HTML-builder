const fsPromises = require('fs').promises;
const path = require('path');
const START_PATH = 'secret-folder';

const folder = path.join(__dirname, START_PATH);

async function printFiles(folder) {
  try {
    const files = await fsPromises.readdir(folder);
    for (const file of files) {
      const filePath = path.join(folder, file);      
      const stat = await fsPromises.stat(filePath);
      if (stat.isFile()) {
        const { name, ext } = path.parse(filePath);
        const extension = ext.slice(1);
        console.log(`${name} - ${extension} - ${stat.size}b`);
      } 
    }
  } catch (err) {
    console.error(err);
  }
}

printFiles(folder);