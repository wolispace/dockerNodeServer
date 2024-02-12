// templating functions
module.exports = {
  fs: require('node:fs'),
  
  // reads the named file and replaces params with the values passed
  render: function (fileName, values) {
   let template = this.read(fileName);
   return this.fill(template, values);
  },

  // reads in a template files from the templates folder
  read: function (fileName) {
    return this.fs.readFileSync(`./templates/${fileName}`, 'utf8');
  },

  // returns the template with all ${key} replaced with the {key: "value", ...} passed in
  fill: function (template, values) {
    return template.replace(/\$\{(\w+)\}/g, (_, key) => values[key]);
  }
  
};
