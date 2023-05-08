const fsPromises = require('fs').promises;
const path = require('path');
const SOURCE_FOLDER = 'files';
const NEW_FOLDER = 'files-copy';

async function copyDir(sourceFolder, newFolder) {
  const sourcePath = path.join(__dirname, sourceFolder);
  const destPath = path.join(__dirname, newFolder);

  try {
    await fsPromises.access(destPath);
  } catch (err) {
    try {
      await fsPromises.mkdir(destPath);
    } catch (err) {
      console.error('Error creating directory:', err);
    }
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
    }
  }
}

copyDir(SOURCE_FOLDER, NEW_FOLDER);