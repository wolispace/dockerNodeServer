const http = require("node:http");
const fs = require('node:fs');
const files = require('./utils/files.js');

const app = {
  nodeEnv: process.env.NODE_ENV,
  host: '0.0.0.0',
  showHost: 'localhost',
  port: 8080,
};

app.url = `http://${app.showHost}:${app.port}`;

const requestListener = function (req, res) {
  app.req = req;
  app.res = res;

  // Parse the URL to get the path
  const url = new URL(req.url, `http://${req.headers.host}`);
  let filePath = url.pathname;
  console.log(`Request ${req.method} for ${filePath}`);
  if (filePath === '/') {
    files.renderHomePage(app);
  } else {
    if (req.method === 'POST') {
      files.saveData(app);
    } else {
      files.render(app, filePath);
    }
  }
}

const server = http.createServer(requestListener);
server.listen(app.port, app.host, () => {
  console.log(`Server is running on [${app.nodeEnv}] ${app.url}`);
});

