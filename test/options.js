var should = require('chai').should();
var utils = require('../src/utils');

var one, two, three, options, program, configPath,
  config;

describe('options test', function() {

  it('should be extend', function() {

    one = {
      one: "one",
      override: "one"
    };

    two = {
      two: "two",
      override: "two"
    };

    three = utils.extend(one, two);

    three.should.have.property('one');
    three.should.have.property('two');
    three.should.have.property('override');
    three.override.should.equal('two');

  });

  it('should be default options', function() {

    options = utils.defaultOptions({}, 'defaultPattern');

    options.should.have.property('build');
    options.build.should.equal(false);
    options.should.have.property('src');
    options.src.should.equal('');
    options.should.have.property('dest');
    options.dest.should.equal('');
    options.should.have.property('copy');
    options.copy.should.equal('');
    options.should.have.property('patterns');
    options.patterns.should.equal('defaultPattern');

  });


  it('should be overriden default options', function() {

    program = {
      build: true,
      src: 'src',
      dest: 'dest',
      copy: 'copy',
      patterns: 'patterns'
    };

    options = utils.defaultOptions(program, 'defaultPattern');

    options.should.have.property('build');
    options.build.should.equal(true);
    options.should.have.property('src');
    options.src.should.equal('src');
    options.should.have.property('dest');
    options.dest.should.equal('dest');
    options.should.have.property('copy');
    options.copy.should.equal('copy');
    options.should.have.property('patterns');
    options.patterns.should.equal('patterns');

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
