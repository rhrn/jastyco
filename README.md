###Watch and compile jade, stylus, coffee-script files
Tool that help develop with `jade`, `stylus` and `coffee-script`
* Watch files by pattern and compile on changes

####Installing
```
npm install -g jastyco jade stylus coffee-script
```

####Usage

Run with default pattern
```
jastyco
```

Run with custom pattern
```
jastyco "*.jade **/*.coffee *.styl"
```

Run in background
```
jastyco &
```
