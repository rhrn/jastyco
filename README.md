### Watch and compile jade, stylus, coffee-script files  
Tool that help develop with `jade`, `stylus` and `coffee-script`  

- Support  
  * Watch files by pattern and compile on changes  
  * Source and destination directories  
  * Default configure  

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

Run with defaults
```
jastyco
```

Run with build option
```
jastyco -b
```

Run with source and destination direcories, also work with (--build)
```
jastyco -d dest -s src
```

Project default config  
Create `jastyco.json` with content
```
{
  "src": "src",
  "dest": "dest"
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
-c, --config <config>      config file. "jastyco.json" default
```

#### Known issues
* not watch for new directories
