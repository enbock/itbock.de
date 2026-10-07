const {spawnSync} = require('child_process');
const fs = require('fs');

// .env must win over variables already set in the shell (e.g. a user-level OPENAI_API_KEY from other tools)
Object.assign(process.env, require('util').parseEnv(require('fs').readFileSync('.env', 'utf8')));

const env = process.env;
const stackName = env.STACK_NAME || 'itbock-backend';
const stageName = env.STAGE_NAME || 'dev';
const artifactBucket = env.DEPLOY_ARTIFACT_BUCKET;
const packagedTemplate = 'template.packaged.yaml';

for (const key of ['OPENAI_API_KEY', 'S3_BUCKET_NAME', 'DEPLOY_ARTIFACT_BUCKET']) {
    if (!env[key]) {
        console.error(`Missing ${key} in .env`);
        process.exit(1);
    }
}

function aws(args, options = {}) {
    const result = spawnSync('aws', args, {encoding: 'utf8', stdio: options.capture ? ['inherit', 'pipe', 'inherit'] : 'inherit'});
    if (result.status !== 0) process.exit(result.status || 1);
    return result.stdout;
}

aws([
    'cloudformation', 'package',
    '--template-file', 'template.yaml',
    '--s3-bucket', artifactBucket,
    '--s3-prefix', stackName,
    '--output-template-file', packagedTemplate
]);

aws([
    'cloudformation', 'deploy',
    '--template-file', packagedTemplate,
    '--stack-name', stackName,
    '--capabilities', 'CAPABILITY_IAM',
    '--no-fail-on-empty-changeset',
    '--parameter-overrides',
    `StageName=${stageName}`,
    `BucketName=${env.S3_BUCKET_NAME}`,
    `TokenPath=${env.S3_TOKEN_PATH || 'Backend/Token'}`,
    `UserDataPath=${env.S3_USER_DATA_PATH || 'Backend/Users'}`,
    `SessionPath=${env.S3_SESSION_PATH || 'Backend/Session/'}`,
    `KnowledgePath=${env.S3_KNOWLEDGE_PATH || 'Backend/Knowledge/'}`,
    `OpenAiApiKey=${env.OPENAI_API_KEY}`
]);

const apiId = aws([
    'cloudformation', 'describe-stacks',
    '--stack-name', stackName,
    '--query', "Stacks[0].Outputs[?OutputKey=='RestApiId'].OutputValue | [0]",
    '--output', 'text'
], {capture: true}).trim();

// The CloudFormation deployment resource only runs on stack creation; later API changes need a new deployment.
aws(['apigateway', 'create-deployment', '--rest-api-id', apiId, '--stage-name', stageName, '--description', `deploy ${new Date().toISOString()}`]);

fs.rmSync(packagedTemplate, {force: true});

// Go live: point the custom domain (root base path) at this API and stage. Set DOMAIN_NAME= (empty) to skip.
const domainName = env.DOMAIN_NAME ?? 'api.itbock.de';
if (domainName) {
    const current = spawnSync('aws', [
        'apigateway', 'get-base-path-mapping', '--domain-name', domainName, '--base-path', '(none)', '--output', 'json'
    ], {encoding: 'utf8'});

    if (current.status !== 0) {
        if (!current.stderr.includes('NotFoundException')) {
            console.error(current.stderr);
            process.exit(current.status || 1);
        }
        aws(['apigateway', 'create-base-path-mapping', '--domain-name', domainName, '--rest-api-id', apiId, '--stage', stageName]);
        console.log(`Created mapping ${domainName} -> ${apiId}/${stageName}`);
    } else {
        const mapping = JSON.parse(current.stdout);
        if (mapping.restApiId === apiId && mapping.stage === stageName) {
            console.log(`${domainName} already points to ${apiId}/${stageName}`);
        } else {
            aws([
                'apigateway', 'update-base-path-mapping', '--domain-name', domainName, '--base-path', '(none)',
                '--patch-operations', `op=replace,path=/restapiId,value=${apiId}`, `op=replace,path=/stage,value=${stageName}`
            ]);
            console.log(`${domainName}: ${mapping.restApiId}/${mapping.stage} -> ${apiId}/${stageName} (rollback: update-base-path-mapping back to ${mapping.restApiId})`);
        }
    }
}

console.log('Deployed. Stack: ' + stackName + ', REST API id: ' + apiId + ', stage: ' + stageName);
