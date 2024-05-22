const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const serviceWorkerFile = path.join(buildDir, 'ServiceWorkerManager.js');
const tmpServiceWorkerFile = path.join(buildDir, 'ServiceWorkerManager.js.tmp');

try {
    fs.unlinkSync(serviceWorkerFile);
} catch (error) {
}

console.log('Build ServiceWorkerManager...');
execSync('npm run build:service-worker-manager:compile');

process.chdir(buildDir);

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles('.').filter(file => file !== 'ServiceWorkerManager.js').map(file => `"${file}"`.replace(/\\/g, '/')).join(',');

const version = Date.now().toString();

console.log('Update ServiceWorkerManager...');

fs.renameSync(serviceWorkerFile, tmpServiceWorkerFile);
fs.writeFileSync(serviceWorkerFile, `const version = '${version}';\n`);
fs.appendFileSync(serviceWorkerFile, `const fileList = [${files}];\n`);

const tempContent = fs.readFileSync(tmpServiceWorkerFile, 'utf8')
    .split('\n')
    .filter(line => !line.startsWith('const version') && !line.startsWith('const fileList'))
    .join('\n');

fs.appendFileSync(serviceWorkerFile, tempContent);
fs.unlinkSync(tmpServiceWorkerFile);

console.log('Done.');
