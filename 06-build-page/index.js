const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const DIST_FOLDER = 'project-dist';
const INDEX_NAME = 'index.html';
const CSS_FOLDER = 'styles';
const COMPONENTS_FOLDER = 'components';
const ASSETS_FOLDER = 'assets';
const TEMPLATE_NAME = 'template.html';
const BUNDLE_NAME = 'style.css';

async function copyDir(sourcePath, destPath) {
  try {    
    await fs.rm(destPath, { recursive: true, force: true});
    await fs.mkdir(destPath, { recursive: true });
  } catch (error) {
    console.error('Error creating directory:', error);
    return;
  }

  const files = await fs.readdir(sourcePath);
  for (const file of files) {
    const sourceFile = path.join(sourcePath, file);
    const destFile = path.join(destPath, file);
    const fileStat = await fs.stat(sourceFile);

    if (fileStat.isDirectory()) {
      await copyDir(sourceFile, destFile);
    } else {
      const content = await fs.readFile(sourceFile);
      await fs.writeFile(destFile, content);
      console.log(`${destFile} is copied`);
    }
  }
}

async function createHtml(componentsFolder, templatePath) { 
  try {  
    const files = await fs.readdir(componentsFolder);
    const htmlFiles = files.filter((file) => path.extname(file) === '.html');
    const components = {};

    for (const file of htmlFiles) {
      const componentName = path.parse(file).name;
      const filePath = path.join(componentsFolder, file);
      const content = await fs.readFile(filePath, { encoding: 'utf8' });
      components[componentName] = content;
    }

    let html = await fs.readFile(templatePath, { encoding: 'utf8' });
    for (const [tag, replacement] of Object.entries(components)) {
      const regex = new RegExp(`{{${tag}}}`, 'g');
      html = html.replace(regex, replacement);
    }
    return html;} catch (error) {
    console.error('Error of creating index html:', error);
    return;
  }
}

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
    console.log('CSS Bundle is generated');
  } catch (err) {
    console.error(err);
  }
}

async function buildPage(options) {
  const {assets, dist, index, components, template, css, bundleName} = options;

  const distFolder = path.join(__dirname, dist);
  const distMainFile = path.join(distFolder, index);
  const sourceAssetsFolder = path.join(__dirname, assets);
  const componentsFolder = path.join(__dirname, components);
  const distAssetsFolder = path.join(distFolder, assets);
  const sourceCssFolder = path.join(__dirname, css);
  const bundlePath = path.join(distFolder, bundleName);
  const templatePath = path.join(__dirname, template);
 
  try {
    await copyDir(sourceAssetsFolder, distAssetsFolder);
    console.log('All assets are copied');
    const pageHtml  = await createHtml(componentsFolder, templatePath);
    await fs.writeFile(distMainFile, pageHtml, 'utf8');
    console.log('index.html is created');
    await generateBundle(sourceCssFolder, bundlePath);
  } catch (err) {
    console.error(err);
  }
}

const options = {
  assets: ASSETS_FOLDER,
  dist: DIST_FOLDER,
  index: INDEX_NAME,
  components: COMPONENTS_FOLDER,
  template: TEMPLATE_NAME,
  css: CSS_FOLDER,
  bundleName: BUNDLE_NAME
};
buildPage(options);