module.exports = {
  fs: require('node:fs'),
  path: require('node:path'),
  querystring: require('node:querystring'),
  templates: require('../templates/templates.js'),

  readFileSync(file) {
   return this.fs.readFileSync(file); 
  },

  // get a filename from the url eg: /layout.css or /src1/game.js
  getFileFromUrl: function (req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return url.pathname;
  },

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
      type: app.type,
      version: 123,
      content: `Hi from the content area`,
      scripts: this.buildScriptList(),
      info: `<div>Hello world! from [${app.nodeEnv}] ${app[app.type].url}</div>`,
    }
    template = this.templates.render('index.html', params);
    app.res.write(template);
    app.res.end();
  },

  getContentType: function(extname) {
    // Determine the content type
    const mimeTypes = {
      '.css': 'text/css',
      '.js': 'application/javascript',
      // Add more MIME types as needed
    };
    
    return mimeTypes[extname] || 'application/octet-stream';
  },
  
  // loads a file and renders it in the web browser 
  render: function (app) {
    let extname = String(this.path.extname(app.filePath)).toLowerCase();


    let fileFolder = extname == '.js' ? '.' : './public';

    console.log(`Loading file ${fileFolder}${app.filePath}`);

    try {
      const content = this.fs.readFileSync(`${fileFolder}${app.filePath}`, 'utf8');
      // Serve the file
      app.res.writeHead(200, { 'Content-Type': this.getContentType(extname) });
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
        const postData = this.querystring.parse(body);
        const { id, data } = postData;

        try {
          this.fs.writeFileSync(`./_saves/_save_${id}.txt`, data);
          resolve(true); // Return true if the file was saved successfully
        } catch (err) {
          console.error(err);
          resolve(false); // Return false if there was an error
        }
        

      });
    });
  },

};
