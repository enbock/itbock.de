const http = require('http');

// .env must win over variables already set in the shell (e.g. a user-level OPENAI_API_KEY from other tools)
Object.assign(process.env, require('util').parseEnv(require('fs').readFileSync('.env', 'utf8')));

const handlers = require('../build/lambda.js');
const port = Number(process.env.PORT || 3000);
const stage = process.env.STAGE_NAME || 'dev';
const allowedOrigins = ['http://localhost:3001', 'https://www.itbock.de'];

const routes = {
    'POST /generate-token': handlers.generateTokenHandler,
    'POST /validate-token': handlers.validateTokenHandler,
    'POST /gpt': handlers.gptHandler,
    'POST /audio-transform': handlers.audioTransformHandler,
    'POST /i18n': handlers.i18nHandler,
    'GET /replication/start': handlers.startReplicationHandler
};

function readBody(request) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        request.on('data', (chunk) => chunks.push(chunk));
        request.on('end', () => resolve(chunks.length ? Buffer.concat(chunks).toString('utf8') : null));
        request.on('error', reject);
    });
}

const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const path = url.pathname.startsWith(`/${stage}/`) ? url.pathname.slice(stage.length + 1) : url.pathname;
    const origin = request.headers.origin;
    const cors = {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-Amzn-Trace-Id,session-id',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
    };

    if (request.method === 'OPTIONS') {
        response.writeHead(200, cors).end();
        return;
    }

    const handler = routes[`${request.method} ${path}`];
    if (!handler) {
        response.writeHead(403, {...cors, 'Content-Type': 'application/json'}).end(JSON.stringify({message: 'Forbidden'}));
        return;
    }

    try {
        const result = await handler({
            httpMethod: request.method,
            path,
            headers: request.headers,
            queryStringParameters: Object.fromEntries(url.searchParams),
            body: await readBody(request),
            isBase64Encoded: false
        }, {});
        response.writeHead(result.statusCode, {...cors, ...result.headers}).end(result.body);
    } catch (error) {
        console.error(error);
        response.writeHead(502, {...cors, 'Content-Type': 'application/json'}).end(JSON.stringify({message: 'Internal server error'}));
    }
});

server.listen(port, () => console.log(`Local API: http://localhost:${port}/${stage}`));
