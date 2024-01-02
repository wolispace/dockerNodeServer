const http = require("node:http");
const fs = require('node:fs');
const path = require('node:path');
const templates = require('./templates/templates.js');

const app = {
  nodeEnv: process.env.NODE_ENV,
  host: '0.0.0.0',
  showHost: 'localhost',
  port: 8080,
};

app.url = `http://${app.showHost}:${app.port}`;

const requestListener = function (req, res) {
  // Parse the URL to get the path
  const url = new URL(req.url, `http://${req.headers.host}`);
  let filePath = url.pathname;
  console.log(`Request for ${filePath}`);
  if (filePath === '/') {
    showHomePage(res);
  } else {
    returnFile(res, filePath);
  }
};

function showHomePage(res) {
  let params = {
    version: 123, 
    content: buildScriptList(),
    info: `<div>Hello world! from [${app.nodeEnv}] ${app.url}</div>`,
  }
  template = templates.render(fs, 'index.html', params);
  res.write(template);
  res.end();
}

const server = http.createServer(requestListener);
server.listen(app.port, app.host, () => {
  console.log(`Server is running on [${app.nodeEnv}] ${app.url}`);
});

function readFolder(folderPath) {
  return fs.readdirSync(folderPath).map(fileName => {
    return path.join(folderPath, fileName);
  });
}

function buildScriptList() {
  let fileList = readFolder('src1');
  let html = '';
  fileList.forEach(filePath => {
    html += `<div>${filePath}</div>`;
  });

  return html;
}

function returnFile(res, filePath) {
  // Determine the content type
  let extname = String(path.extname(filePath)).toLowerCase();
  let contentType = 'text/html';
  const mimeTypes = {
    '.css': 'text/css',
    '.js': 'application/javascript',
    // Add more MIME types as needed
  };

  contentType = mimeTypes[extname] || 'application/octet-stream';

  // Read the file from the file system
  fs.readFile('./public' + filePath, function(error, content) {
    if (error) {
      console.error(error);
      // Handle errors (like file not found)
      res.writeHead(500);
      res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
    } else {
      // Serve the file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}