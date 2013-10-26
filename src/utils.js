var fs = require('fs');
var json5 = require('json5');
var options = {}, keys = {}, key = '';
var cwd = process.cwd();

module.exports = {

  defaults: function() {

    return {
      src: '',
      dest: '',
      delete: false,
      build: false,
      copy: '',
      patterns: '**/*.jade **/*.coffee **/*.styl',
      configPath: this.configPath(cwd, 'jastyco.json')
    };

  },

  extend: function extend(one, two) {
    var extended = {}, key;
    for (key in one) {
      extended[key] = one[key];
    }
    for (key in two) {
      extended[key] = two[key];
    }
    return extended;
  },

  extractOptions: function(defaultOptions, program) {

    keys = Object.keys(defaultOptions);

    if (program === undefined) {
      program = {args:[]};
    } else {
      if (typeof program.args === 'undefined') {
        program.args = [];
      }
    }

    for (var i in keys) {
      key = keys[i];
      if (program.hasOwnProperty(key)) {
        options[key] = program[key];
      }
    }

    if (program.args.length) {
      options.patterns = program.args[0];
    }

    return options;
  }, 

  configPath: function(cwd, file) {
    return cwd + '/' + file;
  },

  readConfig: function(configPath) {
    if (fs.existsSync(configPath)) {
      return json5.parse(fs.readFileSync(configPath).toString());
    }
    return {};
  }

};
