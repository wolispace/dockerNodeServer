// templating functions
module.exports = {
  
  // reads the named file and replaces params with the values passed
  render: function (fs, fileName, values) {
   let template = this.read(fs, fileName);
   return this.fill(template, values);
  },

  // reads in a template files from te templates folder
  read: function (fs, fileName) {
    return fs.readFileSync(`./templates/${fileName}`, 'utf8');
  },

  // returns the template with all ${key} replaced with the {key: "value", ...} passed in
  fill: function (template, values) {
    return template.replace(/\$\{(\w+)\}/g, (_, key) => values[key]);
  }
  
};
