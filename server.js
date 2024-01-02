const http = require("node:http");
const fs = require('node:fs');
const path = require('node:path');

const nodeEnv = process.env.NODE_ENV;

const host = '0.0.0.0';
const showHost = 'localhost';
const port = 8080;


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
  let template = readTemplate('templates/index.html');
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);

  let html = buildScriptList();

  template = template.replace('[content]', html);
  template += `<div>Hello world! from [${nodeEnv}] http://${showHost}:${port}</div>`;
  res.write(template);
  res.end();
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on [${nodeEnv}] http://${showHost}:${port}`);
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

function readTemplate (filePath) {
  return fs.readFileSync(filePath, 'utf8');
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