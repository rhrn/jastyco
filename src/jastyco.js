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

    var indexExt, indexDir, srcext, srcfile = '',
      srcdir, name, destext, destdir, destfile, filedest;

    if (filepath.charAt(0) == '/') {
      filepath = filepath.replace(cwd + '/', '');
    }

    indexExt = filepath.lastIndexOf('.');
    indexDir = filepath.lastIndexOf('/');

    srcext   = filepath.substr(indexExt + 1);
    srcfile  = filepath.substr(indexDir + 1);
    srcdir   = filepath.substr(0, filepath.length - srcfile.length);
    name     = srcfile.substr(0, srcfile.length - (srcext.length + 1));

    destext  = jastyco.plugins[srcext].ext;
    if (options.src.length > 2) {
      srcdir = srcdir.substr(options.src.length);
    }
    destdir  = options.dest + srcdir;
    destfile = name + destext;
    filedest = destdir + destfile;

    jastyco.mkdir(destdir);

    return {
      filepath: filepath,
      srcfile:  srcfile,
      srcdir:   srcdir,
      srcext:   srcext,
      name:     name,
      destdir:  destdir,
      destext:  destext,
      filedest: filedest
    }

  },

  mkdir: function(path) {

    var dirs = path.split('/'),
      paths = [], currentDir = '';
    
    dirs.forEach(function(dir) {
      if (dir) {
        currentDir += dir + '/';
        paths.push(currentDir);
      }
    });

    for (var i in paths) {

      if (!fs.existsSync(paths[i])) {
        fs.mkdirSync(paths[i]);
      }
    }

  },

  compile: function(event, file, options) {

    fs.readFile(file.filepath, function(err, data) {

      try {

        compiled = jastyco.plugins[file.srcext].compile(data.toString(), options);
        fs.writeFile(file.filedest, compiled, function(err) {
          if (!err) {
            console.log('%s %s to %s', event, file.filepath, file.filedest);
          }
        });

      } catch (e) {
        console.log(e);
      }

    });

  },

  copy: function(file) {
    fs.readFile(file.filepath, function(err, data) {
      fs.writeFile(file.destdir + file.srcfile, data, function(err) {
        if (!err) {
          console.log('copy %s to %s', file.filepath, file.destdir + file.srcfile);
        }
      });
    });
  }
};

exports.jastyco = function (options) {

  if (options.dest.charAt(options.dest.length - 1) != '/') {
    options.dest += '/';
  }

  if (options.src.charAt(options.src.length - 1) != '/') {
    options.src += '/';
  }

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

  patterns = options.patterns.split(" ");

  copy = false;
  if (options.copy != '') {
    copy = options.copy.split(" ");
  }

  var compileOptions;

  if (options.build) {

    var files, i, j;

    for (i in patterns) {

      files = globule.find(patterns[i]);

      for (j in files) {

        file = jastyco.file(options, files[j]);

        compileOptions = {
          pretty: true,
          bare: true,
          filename: file.filepath
        }

        jastyco.compile('build', file, compileOptions);

      }

    }

    if (copy) {

      for (i in copy) {

        files = globule.find(copy[i]);
        
        for (j in files) {

          file = jastyco.file(options, files[j]);

          jastyco.copy(file);

        }

      }

    }

  } else {

    var file;

    gaze(patterns, function(err, watcher) {

      this.on('all', function(event, filepath) {

        file = jastyco.file(options, filepath);
        
        if (event === 'changed' || event === 'added') {

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


    if (copy) {

      gaze(options.copy, function(err, watcher) {

        this.on('all', function(event, filepath) {

          file = jastyco.file(options, filepath);

          jastyco.copy(file);

        });

      });

    }

  }
};
