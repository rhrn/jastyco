exports.options = {
  files: "**/*.jade **/*.coffee **/*.styl"
}

exports.jastyco = function (patterns) {

  if (patterns === undefined) {
    console.log('patterns not found. load defaults... "%s"', exports.options.files);
    patterns = exports.options.files;
  }

  var fs = require('fs');
  var gaze = require('gaze');

  var jade, coffee, stylus;

  if (/\.jade/.test(patterns)) {
    jade = require('jade');
  }

  if (/\.coffee/.test(patterns)) {
    coffee = require('coffee-script');
  }

  if (/\.styl/.test(patterns)) {
    stylus = require('stylus');
  }

  var plugins = {
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
  };

  patterns = patterns.split(" ");

  gaze(patterns, function(err, watcher) {

    var ext, index, filename;

    this.on('all', function(event, filepath) {
      
      if (event === 'changed' || event === 'added') {

        index    = filepath.lastIndexOf('.');
        filename = filepath.substr(0, index);
        ext      = filepath.substr(index + 1);
        filedest = filename + plugins[ext].ext;

        options = {
          filename: filepath,
          pretty: true,
          bare: true
        };

        fs.readFile(filepath, function(err, data) {
          try {
            compiled = plugins[ext].compile(data.toString(), options);
            fs.writeFile(filedest, compiled, function(err) {
              if (!err) {
                console.log('%s %s to %s', event, filepath, filedest);
              }
            });
          } catch (e) {
            console.log(e);
          }
        });
      } else if (event === 'deleted') {
        console.log('delete', filepath);
      }
    });

  });
};
