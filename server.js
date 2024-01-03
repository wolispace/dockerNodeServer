const http = require("node:http");
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
  app.filePath = files.getFileFromUrl(req);

  console.log(`Request ${req.method} for ${app.filePath}`);
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

const server = http.createServer(requestListener);
server.listen(app.port, app.host, () => {
  console.log(`\nServer is running on [${app.nodeEnv}] ${app.url}`);
});

