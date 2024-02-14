const http = require("node:http");
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


app.url = `http://${app.http.showHost}:${app.http.externalPort}`;

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

server.http = http.createServer(requestListener);
server.http.listen(app.http.port, app.http.host, () => {
  console.log(`\nServer is running on [${app.nodeEnv}] ${app.url}`);
});

