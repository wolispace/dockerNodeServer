const http = require("http");

const nodeEnv = process.env.NODE_ENV;

const host = '0.0.0.0';
const showHost = 'localhost';
const port = 8080;

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end(`Hello world! from [${nodeEnv}] http://${showHost}:${port}`);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on [${nodeEnv}] http://${showHost}:${port}`);
});