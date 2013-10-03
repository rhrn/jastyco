var fs = require('fs');

module.exports = {

  plugins: {

    jade: {
      ext: '.html'
    },

    styl: {
      ext: '.css'
    },

    coffee: {
      ext: '.js'
    }

  },

  info: function(srcpath, options) {

    var indexExt, indexDir, srcext, srcfile = '',
      srcdir, name, destext, destdir, destfile, destpath;

    if (srcpath.charAt(0) == '/') {
      srcpath = srcpath.replace(options.cwd + '/', '');
    }

    indexExt = srcpath.lastIndexOf('.');
    indexDir = srcpath.lastIndexOf('/');

    srcext   = srcpath.substr(indexExt + 1);
    srcfile  = srcpath.substr(indexDir + 1);
    srcdir   = srcpath.substr(0, srcpath.length - srcfile.length);
    name     = srcfile.substr(0, srcfile.length - (srcext.length + 1));

    if (this.plugins[srcext]) {
      destext = this.plugins[srcext].ext;
    } else {
      destext = '.' + srcext;
    }

    if (options.src.length > 2) {
      srcdir = srcdir.substr(options.src.length);
    }

    destdir  = options.dest + srcdir;
    destfile = name + destext;
    destpath = destdir + destfile;
    destcopy = destdir + srcfile;

    return {
      srcpath:  srcpath,
      srcfile:  srcfile,
      srcdir:   srcdir,
      srcext:   srcext,
      name:     name,
      destdir:  destdir,
      destext:  destext,
      destfile: destfile,
      destpath: destpath,
      destcopy: destcopy
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

  rmdir: function(path) {

    if (fs.existsSync(path)) {

      var _this = this;
      var curPath;

      fs.readdirSync(path).forEach(function(file, index) {

        curPath = path + "/" + file;

        if (fs.statSync(curPath).isDirectory()) {
          _this.rmdir(curPath);
        } else {
          fs.unlinkSync(curPath);
        }

      });

      fs.rmdirSync(path);
    }
  }

};
