### Preprocessors manager  
Watch and compile `jade`, `stylus`, `coffee-script` files  

* Support  
  * Watch files by pattern and compile on changes, also support copy  
  * Compiling files in batch mode  
  * Source and destination directories  
  * Default project config  

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
Create files
```
mkdir src
touch src/index.jade
touch src/styles.styl
touch src/js.coffee
```

Run
```
jastyco --src src --dest dest
```

On modification `src` files will put compiled files to `dest` directory
```
changed src/index.jade to dest/index.html
changed src/styles.styl to dest/styles.css
changed src/js.coffee to dest/js.js
```

Also support default config file  
Create `jastyco.json` in root project
```
{
  "src": "src",
  "dest": "dest"
}
```

And you can run simply
```
jastyco
```

To compile files in batch mode, run
```
jastyco -b
```

Help
```
jastyco --help

Usage: jastyco [options] patterns

Options:

-h, --help                 output usage information
-V, --version              output the version number
-b, --build                compile sources in batch mode. "false" default
-s, --src <src>            source directory. current default
-d, --dest <dest>          destination directory. current default
-p, --patterns <patterns>  files compile by patterns. "**/*.jade **/*.coffee **/*.styl" default
-C, --copy <patterns>      copy files on change by patterns
-c, --config <config>      config file. "jastyco.json" default
-X, --delete               delete dest file on delete source. "false" default
```

Config `jastyco.json`
```
{
  "src": "src",
  "dest": "dest",
  "patterns": "**/*.coffee **/*.styl",
  "copy": "**/*.jade src/**/*.css src/**/*.eot src/**/*.svg src/**/*.ttf src/**/*.woff",
  "delete": true
}
```

Note: `copy` useful for frameworks which self compile,  
for example `express` use `jade` as template engine  
or css, js, fonts...

#### Known issues
* not watch for new directories
