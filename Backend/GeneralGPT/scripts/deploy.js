const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const {promisify} = require('util');
const zipDir = promisify(require('zip-dir'));
const {resolve} = require('path');

const LAMBDA_NAME = "GeneralGPT";

async function buildCoded() {
    const {stdout, stderr} = await exec('npm run build');
    console.log('TSC: Error =', stdout);
    if (stderr) process.exit(1);
}

function clearFiles() {
    try {
        fs.unlinkSync('./build/lambda.zip');
    } catch (e) {
    }
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

async function zipBuild() {
    try {
        await zipDir('./build', {saveTo: './build/lambda.zip'});
    } catch (zipError) {
        console.log('Files zipped: Error = ', zipError);
        process.exit(1);
    }
}

async function deploy() {
    const updateCmd = `aws lambda update-function-code --function-name ${LAMBDA_NAME} --zip-file "fileb://${resolve('build/lambda.zip')}" --publish`;
    const {error: updateError, stdout: updateStdout} = await exec(updateCmd);
    console.log('Lambda deployment: Error =', updateError, 'Output =', updateStdout);
}

async function buildAndDeploy() {
    try {
        await buildCoded();
        clearFiles();
        await installProductionLibraries();
        await zipBuild();
        await deploy();
    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
}

buildAndDeploy().then();
