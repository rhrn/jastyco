var fs = require('fs');
var gaze = require('gaze');
var filetools = require('./filetools');

var jade, coffee, stylus, globule;

var jastyco = {

  plugins: {
    jade: {
      compile: function(src, options) {
        var copmiled = jade.compile(src, options);
        return copmiled();
      }
    },
    coffee: {
      compile: function(src, options) {
        var copmiled = coffee.compile(src, options);
        return copmiled;
      }
    },
    styl: {
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

  file: function(srcpath, options) {

    var file = filetools.info(srcpath, options);

    filetools.mkdir(file.destdir);

    return file;

  },

  compile: function(event, file, options) {

    fs.readFile(file.srcpath, function(err, data) {

      try {

        compiled = jastyco.plugins[file.srcext].compile(data.toString(), options);
        fs.writeFile(file.destpath, compiled, function(err) {
          if (!err) {
            console.log('%s %s to %s', event, file.srcpath, file.destpath);
          }
        });

      } catch (e) {
        console.log(e);
      }

    });

  },

  copy: function(file) {
    fs.readFile(file.srcpath, function(err, data) {
      fs.writeFile(file.destcopy, data, function(err) {
        if (!err) {
          console.log('copy %s to %s', file.srcpath, file.destcopy);
        }
      });
    });
  }
};

exports.jastyco = function (options) {

  options.dest = filetools.prepPath(options.dest);

  options.src = filetools.prepPath(options.src);

  console.log ('options:', "\n", options);

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

  patterns = filetools.patternsToArray(options.patterns, options);

  copy = false;
  if (options.copy != '') {
    copy = filetools.patternsToArray(options.copy, options);
  }

  var compileOptions;

  if (options.build) {

    var files, i, j;

    for (i in patterns) {

      files = globule.find(patterns[i]);

      for (j in files) {

        file = jastyco.file(files[j], options);

        compileOptions = {
          pretty: true,
          bare: true,
          filename: file.srcpath
        }

        jastyco.compile('build', file, compileOptions);

      }

    }

    if (copy) {

      for (i in copy) {

        files = globule.find(copy[i]);
        
        for (j in files) {

          file = jastyco.file(files[j], options);

          jastyco.copy(file);

        }

      }

    }

  } else {

    var file;

    gaze(patterns, function(err, watcher) {

      this.on('all', function(event, srcpath) {

        file = jastyco.file(srcpath, options);
        
        if (event === 'changed' || event === 'added') {

          compileOptions = {
            pretty: true,
            bare: true,
            filename: file.srcpath
          }

          jastyco.compile(event, file, compileOptions);

        } else if (event === 'deleted') {
          if (options.delete === true) {
            fs.unlink(file.destpath, function(err) {
              console.log('deleted ', file.destpath);
            });
          } else {
            console.log('did not deleted ', file.destpath);
          }
        }

      });

    });

    if (copy) {

      gaze(copy, function(err, watcher) {

        this.on('all', function(event, srcpath) {

          file = jastyco.file(srcpath, options);

          jastyco.copy(file);

        });

      });

    }

  }
};
