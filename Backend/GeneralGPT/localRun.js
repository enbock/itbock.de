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
            },
            {
                content: "Sehr gerne. Bitte klicken Sie auf den folgenden Link, um zur Homepage von 2020 zu gelangen.",
                role: "assistant"
            },
            {
                content: "okay",
                role: "user"
            }
        ]
    })
}).then(e => console.log(e));