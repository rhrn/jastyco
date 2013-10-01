### Preprocessors manager  
Watch and compile jade, stylus, coffee-script files  
Tool that help develop with `jade`, `stylus` and `coffee-script`  

* Support  
  * Watch files by pattern and compile or copy on changes  
  * Source and destination directories  
  * Default configure  

 [![Build Status](https://travis-ci.org/rhrn/jastyco.png?branch=master)](https://travis-ci.org/rhrn/jastyco)
 [![Dependency Status](https://gemnasium.com/rhrn/jastyco.png)](https://gemnasium.com/rhrn/jastyco)
 [![NPM version](https://badge.fury.io/js/jastyco.png)](http://badge.fury.io/js/jastyco)

#### Installing

linux users
```
sudo npm install -g jastyco
```

mac os x users (brew)
```
npm install -g jastyco
```

#### Usage

Run in the project directory with defaults
```
jastyco
```
example output
```
options: 
{ build: false,
  src: 'src/',
  dest: 'dest/',
  copy: 'src/**/*.jade',
  patterns: '**/*.coffee **/*.styl',
  cwd: '/home/rhrn/git/project' }
```

Run with build option
```
jastyco -b
```
example output
```
...
build src/models/users.coffee to dest/models/users.js
build src/server.coffee to dest/server.js
copy src/views/home.jade to dest/views/home.jade
copy src/static/css/main.styl to dest/static/css/main.css
build src/controllers/home.coffee to dest/controllers/home.js
...
```

Run with source and destination direcories, also work with (--build)
```
jastyco -d dest -s src
```

Project default config  
Need create `jastyco.json` in root project directory. for example:
```
{
  "src": "src",
  "dest": "dest",
  "patterns": "**/*.coffee **/*.styl",
  "copy": "src/**/*.jade"
}
```

Run in background
```
jastyco &
```

Help
```
jastyco --help

Usage: jastyco [options] patterns

Options:

-h, --help                 output usage information
-b, --build                compile sources
-s, --src <src>            source directory. current default
-d, --dest <dest>          destination directory. current default
-p, --patterns <patterns>  files patterns. "**/*.jade **/*.coffee **/*.styl" default
-cp, --copy <patterns>     files to copy patterns
-c, --config <config>      config file. "jastyco.json" default
```

#### Known issues
* not watch for new directories
