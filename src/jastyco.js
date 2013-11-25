var fs = require('fs');
var gaze = require('gaze');
var filetools = require('./filetools');

var jade, coffee, stylus, globule, io, socket, staticDest, globalOptions;
var scriptAnchorRegEx = /\<\/body\>\s*\<\/html\>/g;
var ioScript = '/socket.io/socket.io.js';
var liveScript = '/socket.io/jastyco/livereload.js';

var prepareScripts = function(file, options) {
  return '<script src="//' + options.host + ':' + options.port + file + '"></script>';
};

var jastyco = {

  plugins: {
    jade: {
      compile: function(src, options) {
        var copmiled = jade.compile(src, options);
        copmiled = copmiled();
        if (globalOptions.livereload && !globalOptions.build) {
          var match = copmiled.match(scriptAnchorRegEx);
          if (match !== null) {
            copmiled = copmiled.replace(scriptAnchorRegEx, ioScript + liveScript + match[0]);
          } else {
            copmiled += ioScript + liveScript;
          }
        }
        return copmiled;
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
        var styl = stylus(src).set('filename', options.filename);
        if (options.nib) {
          styl.include(require('nib').path);
        }
        styl.set('compress', options.compress);
        styl.render(function(err, css) {
          copmiled = css;
        });
        return copmiled || '';
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
            if (socket && globalOptions.livereload[file.destext.substr(1)]) {
              socket.emit('jastyco', event, file, staticDest);
            }
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
          if (socket && globalOptions.livereload[file.destext.substr(1)]) {
            socket.emit('jastyco', 'copy', file, staticDest);
          }
        }
      });
    });
  }
};

exports.jastyco = function (options) {

  options.dest = filetools.prepPath(options.dest);

  options.src = filetools.prepPath(options.src);

  console.log ('options:', "\n", options);
  
  if (options.static && !options.build) {
    filetools.staticServer(options);
  }

  if (options.livereload && !options.build) {
    if (options.livereload.staticDest) {
      staticDest = filetools.prepPath(options.livereload.staticDest);
    } else {
      staticDest = options.dest;
    }

    ioScript   = prepareScripts(ioScript, options.livereload);
    liveScript = prepareScripts(liveScript, options.livereload);

    io = require('socket.io').listen(options.livereload.port, {log: false});
    io.on('connection', function(sock) {
      socket = sock;
    });
    io.settings.static.add('/jastyco/livereload.js', {
      file: __dirname + '/livereload.js'
    });
    console.log('socket.io started: %s:%d', options.livereload.host, options.livereload.port);
  }

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

  globalOptions = options;

  var compileOptions;

  if (options.build) {

    var files, i, j;

    for (i in patterns) {

      files = globule.find(patterns[i]);

      for (j in files) {

        file = jastyco.file(files[j], options);

        compileOptions = options[file.srcext];
        compileOptions.filename = file.srcpath;

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

          compileOptions = options[file.srcext];
          compileOptions.filename = file.srcpath;

          jastyco.compile(event, file, compileOptions);

        } else if (event === 'deleted') {

          setTimeout(function() {

            fs.exists(srcpath, function(exists) {

              if (exists) {

                compileOption = options[file.srcext];
                compileOptions.filename = file.srcpath;
                jastyco.compile('changed', file, compileOptions);

              } else {

                if (options.delete === true) {
                  fs.unlink(file.destpath, function(err) {
                    console.log('deleted ', file.destpath);
                  });
                } else {
                  console.log('did not deleted ', file.destpath);
                }

              }

            });

          }, 300);

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
