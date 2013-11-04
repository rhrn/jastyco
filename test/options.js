var should = require('chai').should();
var utils = require('../src/utils');
var options = utils.defaults();

var one, two, three, options, program, configPath,
  config;

describe('options test', function() {

  it('should be extend', function() {

    one = {
      one: "one",
      override: "one",
      obj: {
        one: "one",
        override: "one"
      },
      disabled: {
        object: true
      }
    };

    two = {
      two: "two",
      override: "two",
      obj: {
        two: "two",
        override: "two"
      },
      disabled: false
    };

    three = utils.extend(one, two);

    three.should.have.property('one');
    three.should.have.property('two');
    three.should.have.property('override');
    three.override.should.equal('two');
    three.obj.one.should.equal('one');
    three.obj.should.have.property('override');
    three.obj.override.should.equal('two');
    three.obj.should.have.property('two');
    three.obj.two.should.equal('two');
    three.should.have.property('disabled');
    three.disabled.should.to.be.false;

  });

  it('should be detect json', function() {

    one = utils.isJSON({});
    one.should.to.be.true;
    one = utils.isJSON([]);
    one.should.to.be.false;
    one = utils.isJSON(null);
    one.should.to.be.false;
    one = utils.isJSON(undefined);
    one.should.to.be.false;
    one = utils.isJSON('');
    one.should.to.be.false;
    
  });

  it('should be default options', function() {

    options = utils.extractOptions(options, options);

    options.should.have.property('build');
    options.build.should.equal(false);
    options.should.have.property('src');
    options.src.should.equal('');
    options.should.have.property('dest');
    options.dest.should.equal('');
    options.should.have.property('copy');
    options.copy.should.equal('');
    options.should.have.property('delete');
    options.delete.should.equal(false);
    options.should.have.property('patterns');
    options.patterns.should.equal(options.patterns);
    options.should.have.property('jade');
    options.jade.should.be.an('object');
    options.should.have.property('coffee');
    options.coffee.should.be.an('object');
    options.should.have.property('styl');
    options.styl.should.be.an('object');
    options.should.have.property('server');
    options.server.should.be.an('object');

  });


  it('should be overriden default options', function() {

    program = {
      build: true,
      src: 'src',
      dest: 'dest',
      copy: 'copy', 
      delete: true,
      patterns: 'patterns', 
      jade: {
        pretty: false
      },
      coffee: {
        bare: false
      },
      styl: {
        nib: false
      },
      server: false
    }

    options = utils.extend(options, program);

    options.should.have.property('build');
    options.build.should.equal(true);
    options.should.have.property('src');
    options.src.should.equal('src');
    options.should.have.property('dest');
    options.dest.should.equal('dest');
    options.should.have.property('copy');
    options.copy.should.equal('copy');
    options.should.have.property('delete');
    options.delete.should.equal(true);
    options.should.have.property('patterns');
    options.patterns.should.equal('patterns');
    options.should.have.property('jade');
    options.jade.pretty.should.equal(false);
    options.should.have.property('coffee');
    options.coffee.bare.should.equal(false);
    options.should.have.property('styl');
    options.styl.nib.should.equal(false);
    options.should.have.property('server');
    options.server.should.equal(false);

  });

  describe('config test', function() {

    it('should be config file', function() {

      configPath = utils.configPath('/config/path', 'jastyco.json');

      configPath.should.equal('/config/path/jastyco.json');

    });

    it('should be empty config', function() {

      config = utils.readConfig();
      config.should.be.an('object');

    });

    it('should be readable config', function() {

      configPath = utils.configPath(__dirname, 'data/jastyco.json');
      config = utils.readConfig(configPath);

      config.should.have.property('build');
      config.build.should.equal(false);
      config.should.have.property('src');
      config.src.should.equal('src');
      config.should.have.property('dest');
      config.dest.should.equal('dest');
      config.should.have.property('copy');
      config.copy.should.equal('**/*.copy');
      config.should.have.property('patterns');
      config.patterns.should.equal('**/*.file');

    });

  });

});
