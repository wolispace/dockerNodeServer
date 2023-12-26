const http = require("http");

const host = '0.0.0.0';
const showHost = 'localhost';
const port = 8080;

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end(`Hello world! from http://${showHost}:${port}`);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${showHost}:${port}`);
});