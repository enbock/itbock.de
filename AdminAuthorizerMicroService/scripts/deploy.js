var zipdir = require('zip-dir');
var fs = require('fs');
var exec = require('child_process').exec;
var resolve = require('path').resolve;

exec('npx tsc', (error, stdout) => {
    console.log('TSC: Error =', stdout);
    if (error) process.exit(1);
    try {
        fs.unlinkSync('./build/lambda.zip');
    } catch (exception) {

    }
    exec('yarn --modules-folder build/node_modules --production true', (error, stdout) => {
        console.log('Install modules: Error = ', error, 'Output = ', stdout);
        if (error) process.exit(1);

        zipdir('./build', {saveTo: './build/lambda.zip'}, function (err, _) {
            if (err) process.exit(1);
            console.log('Files zipped: Error = ', err);

            exec('aws lambda update-function-code --function-name AdminAuthorizer --zip-file "fileb://' + resolve('build/lambda.zip') + '" --publish', (error, stdout) => {
                console.log('Lambda deploment: Error =', error, 'Output =', stdout);
            });
        });
    });
});
