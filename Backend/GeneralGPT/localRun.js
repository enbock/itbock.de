x = require('./build/index.js');
x.handler({
    body: JSON.stringify({
        messages: [
            {
                content: "Das Terminal ist betriebsbereit und nimmt nun Spracheingaben entgegen.",
                role: "assistant"
            },
            {
                content: "bitte zur alten Homepage gehen",
                role: "user"
            }
        ]
    })
}).then(e => console.log(e));
