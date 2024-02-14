const http = require("node:http");
const https = require('node:https');
const files = require('./utils/files.js');

const server = {};

const app = {
  nodeEnv: process.env.NODE_ENV,
  http: {
    host: '0.0.0.0',
    showHost: 'localhost',
    port: process.env.INTERNAL_PORT,
    externalPort: process.env.EXTERNAL_PORT,
  },
  https: {
    host: '0.0.0.0',
    showHost: 'localhost',
    port: process.env.INTERNAL_PORT_SSH,
    externalPort: process.env.EXTERNAL_PORT_SSH,
  },
};

app.http.url = `http://${app.http.showHost}:${app.http.externalPort}`;
app.https.url = `https://${app.https.showHost}:${app.https.externalPort}`;

const requestListener = function (req, res) {
  app.req = req;
  app.res = res;
  app.filePath = files.getFileFromUrl(req);

  app.type = req.socket.localPort == app.http.port ? 'http' : 'https';

  // Get the original URL from the request
  app.originalUrl = `${app.type}://${req.headers.host}${req.url}`;


  console.log(`Request ${req.method} for ${app.filePath} on ${app.type} at ${app.originalUrl}`);
  if (req.method === 'POST') {
    files.saveData(app);
  } else {
    if (app.filePath === '/') {
      files.renderHomePage(app);
    } else {
      files.render(app);
    }
  }
}

server.http = http.createServer(requestListener);
server.http.listen(app.http.port, app.http.host, () => {
  console.log(`\nServer is running on [${app.nodeEnv}] ${app.http.url}`);
});

// self-sign by using cert.pem instead of obtaining a ca.pem for the real world
server.https = https.createServer({
  key: files.readFileSync('_keys/key.pem'),
  cert: files.readFileSync('_keys/cert.pem'),
  ca: files.readFileSync('_keys/cert.pem')
}, requestListener);

server.https.listen(app.https.port, app.https.host, () => {
  console.log(`\nServer is running on https [${app.nodeEnv}] ${app.https.url}`);
});


