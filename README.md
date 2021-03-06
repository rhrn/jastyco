### Preprocessors manager  
Watch and compile `jade`, `stylus`, `coffee-script` files  

* Features  
  * Watch files by pattern and compile on changes, also support copy  
  * Compiling files in batch mode  
  * Source and destination directories  
  * Default project config 
  * Direct options to `jade` and `coffee-script`  
  * Included `nib` css3 extension for `stylus`  
  * Built-in static server  
  * Livereload (alpha)

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

To compile files in batch mode, run:
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
  -X, --delete               delete dest file on delete source file. "false" default
  --jade <jade>              jade options. {"pretty":true} default
  --coffee <coffee>          coffee options. {"bare":true} default
  --styl <styl>              stylus options. {"compress":false,"nib":true} default
  --static <static>          static server options. {"port":8050} default
  --livereload <livereload>  livereload options. {"host":"localhost","port":8070,"css":true,"js":true,"html":true,"staticDest":null} default
```

* `jade` and `coffee` options pass to compiler  
* `stylus` option `nib` for enable extension, `compress` for uglify  
  for use nib in `.styl` needs import
```
@import 'nib'
```

* `copy` useful for frameworks which had self compile,  
for example `express` use `jade` as template engine  
or already css, js, fonts...  

* for disable `static` or `livereload` use `false` value
  ```
  ...
  static: false,
  livereload: false
  ...
  ```

* `livereoad` - support css, js, html (inspired by livejs.com)  
works in `watch` mode only, by auto inject 2 script into static html  
for manual include scripts with src  
`//{livereload-host}:{livereload-port}/socket.io/socket.io.js` and  
`//{livereload-host}:{livereload-port}/socket.io/jastyco/livereload.js`
where livereload-host, livereload-port taken from config  


Override options via cli, example:
```
jastyco --jade "pretty:false" --coffee "bare:false" --styl="nib:false" --static "post:8088" --livereload "false"
```

Config `jastyco.json` example:
```
{
  "src": "src",
  "dest": "dest",
  "patterns": "**/*.coffee **/*.styl",
  "copy": "**/*.jade **/*.css **/*.eot **/*.svg **/*.ttf **/*.woff",
  "jade": {
    "pretty": true
  },
  "coffee": {
    "bare": true
  },
  "styl": {
    "compress": false,
    "nib": true
  },
  "delete": true,
  "static": {
    "port": 8088
  },
  livereload: false
}
```

* [jade](http://jade-lang.com/)
* [coffee-script](http://coffeescript.org/)
* [stylus](http://learnboost.github.io/stylus/)
* [nib](http://visionmedia.github.io/nib/)

[Change log](https://github.com/rhrn/jastyco/blob/master/CHANGES.md)

#### Known issues
* not watch for new directories. required relaunch `jastyco`
