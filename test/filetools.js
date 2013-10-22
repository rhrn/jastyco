var should = require('chai').should();
var filetools = require('../src/filetools');
var utils = require('../src/utils');
var fs = require('fs');

var file, srcpath, options, destdir, path, patterns;

describe('filetools test', function() {

  describe('validate file info', function() {

    options = {
      "dest": "destination",
      "src":  "source",
      "cwd":  "/home/user/git/jastyco"
    };

    it('should be coffee-script support', function() {

      name = 'app';
      srcext = 'coffee';
      srcfile = name + '.' + srcext;
      srcdir = 'static/js/';
      srcpath = options.src +  srcdir + srcfile;
      destdir = options.dest + srcdir;
      destext = '.js';
      destfile = name + destext;
      destpath = destdir + destfile;
      destcopy = destdir + srcfile;

      file = filetools.info(srcpath, options); 

      file.srcpath.should.equal(srcpath);
      file.srcfile.should.equal(srcfile);
      file.srcdir.should.equal(srcdir);
      file.srcext.should.equal(srcext);
      file.name.should.equal(name);
      file.destdir.should.equal(destdir);
      file.destext.should.equal(destext);
      file.destfile.should.equal(destfile);
      file.destpath.should.equal(destpath);
      file.destcopy.should.equal(destcopy);
      
    });

    it('should be stylus support', function() {

      name = 'app';
      srcext = 'styl';
      srcfile = name + '.' + srcext;
      srcdir = 'static/js/';
      srcpath = options.src +  srcdir + srcfile;
      destdir = options.dest + srcdir;
      destext = '.css';
      destfile = name + destext;
      destpath = destdir + destfile;
      destcopy = destdir + srcfile;

      file = filetools.info(srcpath, options); 

      file.srcpath.should.equal(srcpath);
      file.srcfile.should.equal(srcfile);
      file.srcdir.should.equal(srcdir);
      file.srcext.should.equal(srcext);
      file.name.should.equal(name);
      file.destdir.should.equal(destdir);
      file.destext.should.equal(destext);
      file.destfile.should.equal(destfile);
      file.destpath.should.equal(destpath);
      file.destcopy.should.equal(destcopy);

    });

    it('should be jade support', function() {

      name = 'app';
      srcext = 'jade';
      srcfile = name + '.' + srcext;
      srcdir = 'static/js/';
      srcpath = options.src +  srcdir + srcfile;
      destdir = options.dest + srcdir;
      destext = '.html';
      destfile = name + destext;
      destpath = destdir + destfile;
      destcopy = destdir + srcfile;

      file = filetools.info(srcpath, options); 

      file.srcpath.should.equal(srcpath);
      file.srcfile.should.equal(srcfile);
      file.srcdir.should.equal(srcdir);
      file.srcext.should.equal(srcext);
      file.name.should.equal(name);
      file.destdir.should.equal(destdir);
      file.destext.should.equal(destext);
      file.destfile.should.equal(destfile);
      file.destpath.should.equal(destpath);
      file.destcopy.should.equal(destcopy);

    });

  });

  it('should be create directory', function(done) {

    var mkdir = 'test/data/mkdir';
    destdir = mkdir + '/public/static';

    filetools.rmdir(mkdir);
    filetools.mkdir(destdir);

    if (fs.statSync(destdir).isDirectory()) {
      filetools.rmdir(mkdir);
      done();
    }

  });

  describe('right paths', function() {

    it('should be right prep path', function() {
      
      path = filetools.prepPath();
      path.should.equal('');

      path = filetools.prepPath('/');
      path.should.equal('');

      path = filetools.prepPath('src');
      path.should.equal('src/');

      path = filetools.prepPath('/dest');
      path.should.equal('dest/');

      path = filetools.prepPath('/dest/public');
      path.should.equal('dest/public/');

      path = filetools.prepPath('/dest/public/');
      path.should.equal('dest/public/');

    });

    it('should be right file with out src and dest', function() {

      options = utils.defaults();

      options.src = filetools.prepPath('');
      options.dest = filetools.prepPath('');

      filepath = 'src/view.some';

      info = filetools.info(filepath, options);

      info.srcfile.should.equal(options.src + 'view.some');
      info.destfile.should.equal(options.dest + 'view.some');

    });

    it('should be right file with src and dest', function() {

      options = utils.defaults();

      options.cwd = '/home/jastyco';
      options.src = filetools.prepPath('src');
      options.dest = filetools.prepPath('dest');

      file = 'js/js.some';
      filepath = options.cwd + '/' + options.src + file;

      info = filetools.info(filepath, options);

      info.srcpath.should.equal(options.src + file);
      info.destpath.should.equal(options.dest + file);

    });
    
  });

  it('should be splited by space', function() {

    patterns = '  **/*.jade       **/*.styl   *.coffee  ';
    patterns = filetools.patternsToArray(patterns);

    patterns.should.be.a('array');
    patterns.should.have.length(3);
    patterns[0].should.be.equal('**/*.jade');
    patterns[1].should.be.equal('**/*.styl');
    patterns[2].should.be.equal('*.coffee');

  });

});
