const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

async function buildCoded() {
    const {stdout, stderr} = await exec('npm run build:tsc');
    console.log('TSC: Error =', stdout);
    if (stderr) process.exit(1);
}

async function installProductionLibraries() {
    fs.copyFileSync('package.json', 'build/package.json');
    fs.copyFileSync('package-lock.json', 'build/package-lock.json');

    const installCmd = 'npm i --omit=dev';
    const installOptions = {cwd: './build'};
    const {error: installError, stdout: installStdout} = await exec(installCmd, installOptions);
    console.log('Install modules: Error = ', installError, 'Output = ', installStdout);
    if (installError) process.exit(1);
}

async function build() {
    try {
        await buildCoded();
        await installProductionLibraries();

    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
}

build().then();
