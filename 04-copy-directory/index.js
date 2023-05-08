const fsPromises = require('fs').promises;
const path = require('path');
const SOURCE_FOLDER = 'files';
const NEW_FOLDER = 'files-copy';

async function copyDir(sourcePath, destPath) {
  try {    
    await fsPromises.rm(destPath, { recursive: true, force: true});
    await fsPromises.mkdir(destPath, { recursive: true });
  } catch (error) {
    console.error('Error creating directory:', error);
    return;
  }

  const files = await fsPromises.readdir(sourcePath);
  for (const file of files) {
    const sourceFile = path.join(sourcePath, file);
    const destFile = path.join(destPath, file);
    const fileStat = await fsPromises.stat(sourceFile);

    if (fileStat.isDirectory()) {
      await copyDir(sourceFile, destFile);
    } else {
      const content = await fsPromises.readFile(sourceFile);
      await fsPromises.writeFile(destFile, content);
      console.log(`${destFile} is copied`);
    }
  }
}

const sourcePath = path.join(__dirname, SOURCE_FOLDER);
const destPath = path.join(__dirname, NEW_FOLDER);
copyDir(sourcePath, destPath);