import assert from 'node:assert/strict';
import test from 'node:test';
const knowledgeIndexScript = require('../../scripts/knowledge-index.js') as {
    parseKnowledgeDocument: (markdown: string) => {
        id: string;
        title: string;
        module: string;
        url: string | null;
        chunks: Array<{
            id: string;
            documentId: string;
            title: string;
            module: string;
            text: string;
            url: string | null;
        }>;
    };
};

test('parseKnowledgeDocument reads frontmatter and splits markdown into chunks', (): void => {
    const markdown = `---
id: about-endre
title: Über Endre Bock
module: INFO
url: https://example.invalid/info
---

Ein kurzer Einstieg.

## Beruf
Entwickelt Software.

## Interessen
Mag SciFi.
`;

    const result = knowledgeIndexScript.parseKnowledgeDocument(markdown);

    assert.equal(result.id, 'about-endre');
    assert.equal(result.title, 'Über Endre Bock');
    assert.equal(result.module, 'INFO');
    assert.equal(result.url, 'https://example.invalid/info');
    assert.deepStrictEqual(
        result.chunks.map((chunk) => chunk.id),
        ['about-endre#0', 'about-endre#1', 'about-endre#2']
    );
    assert.equal(result.chunks[0].text, 'Ein kurzer Einstieg.');
    assert.equal(result.chunks[1].text, '## Beruf\nEntwickelt Software.');
    assert.equal(result.chunks[2].text, '## Interessen\nMag SciFi.');
});
