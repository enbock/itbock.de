const fs = require('fs');
const path = require('path');
const {S3} = require('@aws-sdk/client-s3');
const OpenAI = require('openai');

const EMBEDDING_MODEL = 'text-embedding-3-small';
const KNOWLEDGE_DIRECTORY = path.resolve(__dirname, '..', 'knowledge');
const VALID_MODULES = ['START_SCREEN', 'CONVERSATION', 'OLD_PAGE', 'INFO'];

function stripOptionalQuotes(value) {
    if (
        (value.startsWith('"') && value.endsWith('"'))
        || (value.startsWith('\'') && value.endsWith('\''))
    ) {
        return value.slice(1, -1);
    }

    return value;
}

function parseFrontmatter(markdown) {
    const normalized = markdown.replace(/\r\n/g, '\n');
    if (normalized.startsWith('---\n') === false) {
        throw new Error('Knowledge document is missing frontmatter.');
    }

    const marker = '\n---\n';
    const closingIndex = normalized.indexOf(marker, 4);
    if (closingIndex === -1) {
        throw new Error('Knowledge document frontmatter is not closed.');
    }

    const rawFrontmatter = normalized.slice(4, closingIndex).trim();
    const body = normalized.slice(closingIndex + marker.length).trim();
    const frontmatter = {};

    for (const line of rawFrontmatter.split('\n')) {
        const separatorIndex = line.indexOf(':');
        if (separatorIndex === -1) {
            continue;
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = stripOptionalQuotes(line.slice(separatorIndex + 1).trim());
        frontmatter[key] = value;
    }

    for (const key of ['id', 'title', 'module']) {
        if (typeof frontmatter[key] !== 'string' || frontmatter[key] === '') {
            throw new Error(`Knowledge document frontmatter is missing "${key}".`);
        }
    }

    if (VALID_MODULES.includes(frontmatter.module) === false) {
        throw new Error(`Knowledge document has unsupported module "${frontmatter.module}".`);
    }

    return {
        frontmatter: {
            id: frontmatter.id,
            title: frontmatter.title,
            module: frontmatter.module,
            url: typeof frontmatter.url === 'string' && frontmatter.url !== '' ? frontmatter.url : null
        },
        body
    };
}

function splitBodyIntoChunks(document, body) {
    const lines = body.replace(/\r\n/g, '\n').split('\n');
    const chunks = [];
    let currentHeading = null;
    let currentLines = [];

    const flushChunk = () => {
        const text = [currentHeading, ...currentLines].filter(Boolean).join('\n').trim();
        if (text === '') {
            return;
        }

        chunks.push({
            id: `${document.id}#${chunks.length}`,
            documentId: document.id,
            title: document.title,
            module: document.module,
            text,
            url: document.url
        });
    };

    for (const line of lines) {
        if (line.startsWith('## ')) {
            flushChunk();
            currentHeading = line.trim();
            currentLines = [];
            continue;
        }

        currentLines.push(line);
    }

    flushChunk();

    return chunks;
}

function parseKnowledgeDocument(markdown) {
    const parsed = parseFrontmatter(markdown);
    const chunks = splitBodyIntoChunks(parsed.frontmatter, parsed.body);

    return {
        ...parsed.frontmatter,
        chunks
    };
}

function loadKnowledgeDocuments() {
    return fs.readdirSync(KNOWLEDGE_DIRECTORY)
        .filter((fileName) => fileName.endsWith('.md'))
        .sort()
        .map((fileName) => {
            const markdown = fs.readFileSync(path.join(KNOWLEDGE_DIRECTORY, fileName), 'utf8');
            return parseKnowledgeDocument(markdown);
        });
}

function loadDotEnv() {
    const dotEnvPath = path.resolve(__dirname, '..', '.env');
    if (fs.existsSync(dotEnvPath) === false) {
        return;
    }

    Object.assign(
        process.env,
        require('util').parseEnv(fs.readFileSync(dotEnvPath, 'utf8'))
    );
}

function requireEnvironment(keys) {
    const missing = keys.filter((key) => typeof process.env[key] !== 'string' || process.env[key] === '');
    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
}

async function embedChunks(openai, chunks, batchSize = 100) {
    const embeddedChunks = [];

    for (let index = 0; index < chunks.length; index += batchSize) {
        const batch = chunks.slice(index, index + batchSize);
        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: batch.map((chunk) => chunk.text)
        });
        const embeddings = response.data
            .sort((left, right) => left.index - right.index)
            .map((entry) => entry.embedding);

        embeddedChunks.push(
            ...batch.map((chunk, chunkIndex) => ({
                ...chunk,
                embedding: embeddings[chunkIndex]
            }))
        );
    }

    return embeddedChunks;
}

async function uploadIndex(index) {
    const s3 = new S3();
    const key = `${process.env.S3_KNOWLEDGE_PATH}index.json`;

    await s3.putObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(index),
        ContentType: 'application/json'
    });

    console.log(`Uploaded ${index.chunks.length} chunks to s3://${process.env.S3_BUCKET_NAME}/${key}`);
}

async function main(argv = process.argv.slice(2)) {
    const dryRun = argv.includes('--dry-run');
    const documents = loadKnowledgeDocuments();
    const chunks = documents.flatMap((document) => document.chunks);

    if (dryRun) {
        for (const chunk of chunks) {
            console.log(`${chunk.id} ${chunk.text.length}`);
        }
        console.log(`Dry run completed with ${documents.length} documents and ${chunks.length} chunks.`);
        return;
    }

    loadDotEnv();
    requireEnvironment(['OPENAI_API_KEY', 'S3_BUCKET_NAME', 'S3_KNOWLEDGE_PATH']);

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    const embeddedChunks = await embedChunks(openai, chunks);
    const index = {
        model: EMBEDDING_MODEL,
        createdAt: new Date().toISOString(),
        chunks: embeddedChunks
    };

    await uploadIndex(index);
}

module.exports = {
    EMBEDDING_MODEL,
    parseKnowledgeDocument,
    splitBodyIntoChunks,
    main
};

if (require.main === module) {
    main().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
