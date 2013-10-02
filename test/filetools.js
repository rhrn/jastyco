var should = require('chai').should();
var filetools = require('../src/filetools');
var fs = require('fs');

var file, srcpath, options, destdir;

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
      srcdir = '/static/js/';
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
      srcdir = '/static/js/';
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
      srcdir = '/static/js/';
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

});
