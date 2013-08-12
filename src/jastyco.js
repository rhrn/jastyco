var fs = require('fs');
var gaze = require('gaze');
var cwd = process.cwd();

var jade, coffee, stylus, globule;

var jastyco = {

  plugins: {
    jade: {
      ext: '.html',
      compile: function(src, options) {
        var copmiled = jade.compile(src, options);
        return copmiled();
      }
    },
    coffee: {
      ext: '.js',
      compile: function(src, options) {
        var copmiled = coffee.compile(src, options);
        return copmiled;
      }
    },
    styl: {
      ext: '.css',
      compile: function(src, options) {
        var copmiled;
        stylus(src)
          .set('filename', options.filename)
          .render(function(err, css) {
            copmiled = css;
          });
        return copmiled;
      } 
    }
  },

  file: function(options, filepath) {
    
    //console.log ('cwd', cwd, filepath);
    //console.log ('F:', options, filepath);

    if (filepath.charAt(0) == '/' || options.src == options.dest) {
      filepath = filepath.replace(cwd + '/', '');
      options.dest = '';
      options.src = '';
    } else {
      options.dest += '/';
      options.src += '/';
    }


    index    = filepath.lastIndexOf('.');
    //console.log('index', index);
    filename = filepath.substr(0, index);
    //console.log('filename', filename);
    ext      = filepath.substr(index + 1);
    //console.log('ext', ext);
    filedest = options.dest + filename + jastyco.plugins[ext].ext;
    //console.log('filedest', filedest);

    return {
      index: index,
      filepath: filepath,
      filename: filename,
      ext: ext,
      cwd: cwd,
      filedest: filedest
    }

  },

  compile: function(event, file, options) {

    fs.readFile(file.filepath, function(err, data) {
      //console.log ('complie', event, file, options, data);
      try {
        compiled = jastyco.plugins[file.ext].compile(data.toString(), options);
        fs.writeFile(file.filedest, compiled, function(err) {
          if (!err) {
            console.log('%s %s to %s', event, file.filepath, file.filedest);
            delete data;
          }
        });
      } catch (e) {
        console.log(e);
      }
    });

  }
};

exports.jastyco = function (options) {

  console.log('options', options);

  if (options.build) {
    globule = require('globule');
  }

  if (/\.jade/.test(options.patterns)) {
    jade = require('jade');
  }

  if (/\.coffee/.test(options.patterns)) {
    coffee = require('coffee-script');
  }

  if (/\.styl/.test(options.patterns)) {
    stylus = require('stylus');
  }

  patterns = options.patterns.split(" ");

  var compileOptions = {
    pretty: true,
    bare: true
  };

  var compileOptions;

  if (options.build) {
    var files;
    for (var i in patterns) {
      files = globule.find(patterns[i]);
      for (var j in files) {

        file = jastyco.file(options, files[j]);

        compileOptions = {
          pretty: true,
          bare: true,
          filename: file.filepath
        }


        //compileOptions.filename = file.filepath;

        jastyco.compile('build', file, compileOptions);
      }
    }
  } else {

    gaze(patterns, function(err, watcher) {

      var file;

      this.on('all', function(event, filepath) {
        
        if (event === 'changed' || event === 'added') {

          file = jastyco.file(options, filepath);

          compileOptions = {
            pretty: true,
            bare: true,
            filename: file.filepath
          }

          jastyco.compile(event, file, compileOptions);

        } else if (event === 'deleted') {
          console.log('delete, not implemented', file.filepath);
        }
      });

    });

  }
};
