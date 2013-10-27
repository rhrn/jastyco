var fs = require('fs');
var json5 = require('json5');
var options = {}, keys = {}, key = '';
var cwd = process.cwd();

var optionToJson = function(opt) {

  if (opt.charAt(0) !== '{') {
    opt = '{' + opt;
  }

  if (opt.charAt(opt.length) !== '}') {
    opt += '}';
  }

  try {
    return json5.parse(opt);
  } catch (e) {
    return {};
  }

};

module.exports = {

  defaults: function() {

    return {
      jade: {
        pretty: true
      },
      coffee: {
        bare: true
      },
      styl: {
        compress: false,
        nib: true
      },
      src: '',
      dest: '',
      delete: false,
      build: false,
      copy: '',
      patterns: '**/*.jade **/*.coffee **/*.styl',
      configPath: this.configPath(cwd, 'jastyco.json')
    };

  },

  isJSON: function(o) {
    return !!(o && typeof o === 'object' && !Array.isArray(o));
  },

  extend: function extend(one, two) {
    var _this = this, key, extended = {};
    for (key in one) {
      extended[key] = one[key];
    }
    for (key in two) {
      if (_this.isJSON(one[key]) && _this.isJSON(two[key])) {
        extended[key] = _this.extend(one[key], two[key]);
      } else {
        extended[key] = two[key];
      }
    }
    return extended;
  },

  extractOptions: function(defaultOptions, program) {

    var _this = this;

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
        if (
          (key === 'jade'
          || key === 'coffee'
          || key === 'styl')
          && typeof program[key] === 'string'
        ) {
          options[key] = _this.extend(defaultOptions[key], optionToJson(program[key]));
        } else {
          options[key] = program[key];
        }

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
