var zipdir = require('zip-dir')
var fs = require('fs');
var exec = require('child_process').exec;
var resolve = require('path').resolve

exec('npx tsc', (error) => {
    console.log("TSC: Error =", error);
    try {
        fs.unlinkSync('./build/lambda.zip');
    } catch (e) {

    }
    zipdir('./build', {saveTo: './build/lambda.zip'}, function (err, buffer) {
        console.log("Files zipped: Error = ", err);

        exec('aws lambda update-function-code --function-name LoadWeatherData --zip-file "fileb://' + resolve('build/lambda.zip') + '" --publish', (error, stdout, b) => {
            console.log("Lambda deploment: Error =", error, "Output =",stdout);
        });
    });
});
