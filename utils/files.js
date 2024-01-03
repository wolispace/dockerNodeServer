module.exports = {
  fs: require('node:fs'),
  path: require('node:path'),
  templates: require('../templates/templates.js'),

  // returns a list of files in the named folder
  readFolder: function (folderPath) {
    return this.fs.readdirSync(folderPath).map(fileName => {
      return this.path.join(folderPath, fileName);
    });
  },

  //returns a list of js files to be included in the html page
  buildScriptList: function () {
    let fileList = this.readFolder('src1');
    let html = '';
    fileList.forEach(filePath => {
      html += `<script src="${filePath}" ></script>`;
    });

    return html;
  },

  renderHomePage: function (app) {
    let params = {
      version: 123,
      content: `Hi from the content area`,
      scripts: this.buildScriptList(),
      info: `<div>Hello world! from [${app.nodeEnv}] ${app.url}</div>`,
    }
    template = this.templates.render('index.html', params);
    app.res.write(template);
    app.res.end();
  },

  // loads a file and renders it in the wb browser 
  render: function (app, filePath) {
    // Determine the content type
    let extname = String(this.path.extname(filePath)).toLowerCase();
    let contentType = 'text/html';
    const mimeTypes = {
      '.css': 'text/css',
      '.js': 'application/javascript',
      // Add more MIME types as needed
    };

    contentType = mimeTypes[extname] || 'application/octet-stream';

    let fileFolder = extname == '.js' ? '.' : './public';

    console.log(`Loading file ${fileFolder}${filePath}`);

    try {
      const content = this.fs.readFileSync(`${fileFolder}${filePath}`, 'utf8');
      // Serve the file
      app.res.writeHead(200, { 'Content-Type': contentType });
      app.res.end(content, 'utf-8');
    } catch (err) {
      console.error(err);
      // Handle errors (like file not found)
      app.res.writeHead(500);
      app.res.end(`Sorry, check with the site admin for error: ${err.code} ..\n`);
    }
  },

  saveData: function (app) {
    this.outputFile(app.req).then(success => {
      if (success) {
        app.res.writeHead(200, { 'Content-Type': 'text/plain' });
        app.res.end('Data written to file');
      } else {
        app.res.writeHead(500, { 'Content-Type': 'text/plain' });
        app.res.end('Server error');
      }
    });
  },
  
  outputFile: function (req) {
    return new Promise((resolve, reject) => {
      let body = '';
  
      req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
      });
  
      req.on('end', () => {
        const postData = querystring.parse(body);
        const { id, data } = postData;
  
        fs.writeFile(`./_saves/_save_${id}.txt`, data, err => {
          if (err) {
            console.error(err);
            resolve(false); // Return false if there was an error
          } else {
            resolve(true); // Return true if the file was saved successfully
          }
        });
      });
    });
  },

}
