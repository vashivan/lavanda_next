const next = require('next');
const fs = require('fs');
const http = require('http');
const socketPath = process.env.PORT;
const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    if (fs.existsSync(socketPath)) {
        fs.unlinkSync(socketPath);
    }

    const server = http.createServer((req, res) => {
        handle(req, res);
    });

    server.listen(socketPath, () => {
        console.log(`Server is listening on ${socketPath}`);
    });

    fs.chmodSync(socketPath, '0777');
});