const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const CSS_FOLDER = 'styles';
const DIST_FOLDER = 'project-dist';
const BUNDLE_NAME = 'bundle.css';

async function generateBundle(cssFolder, bundlePath) {
  try {
    const files = await fs.readdir(cssFolder);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    
    const contentPromises = cssFiles.map((file) => {
      const filePath = path.join(cssFolder, file);
      return fs.readFile(filePath, { encoding: 'utf8' });
    });
    
    const contents = await Promise.all(contentPromises);
    const bundle = contents.join(os.EOL);
    
    await fs.writeFile(bundlePath, bundle);
    console.log('bundle.css is created!');
  } catch (err) {
    console.error(err);
  }
}

const cssFolder = path.join(__dirname, CSS_FOLDER);
const distFolder = path.join(__dirname, DIST_FOLDER);
const bundlePath = path.join(distFolder, BUNDLE_NAME);
generateBundle(cssFolder, bundlePath);