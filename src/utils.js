var fs = require('fs');

module.exports = {

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

  defaultOptions: function(program, defaultPatterns) {

    if (program === undefined) {
      program = {args:[]};
    } else {
      if (typeof program.args === 'undefined') {
        program.args = [];
      }
    }

    return {
      build: program.build || false,
      src: program.src || '',
      dest: program.dest || '',
      copy: program.copy || '',
      patterns: program.patterns || program.args[0] || defaultPatterns
    };
  }, 

  configPath: function(cwd, file) {
    return cwd + '/' + file;
  },

  readConfig: function(configPath) {
    var config = {};
    if (fs.existsSync(configPath)) {
      // allow json strict mode only
      config = JSON.parse(fs.readFileSync(configPath).toString());
    }
    return config;
  }

};
