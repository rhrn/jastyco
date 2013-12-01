(function(doc) {

  var ioScriptRegex = /socket\.io\/socket\.io\.js/i;

  var scripts = doc.getElementsByTagName('script');
  var links = doc.getElementsByTagName('link');
  var resources = {}, source, parent, next, element;

  function getPath(href) {
    parser = doc.createElement('a');
    parser.href = href;
    return parser.pathname.substr(1);
  }

  html = doc.location.pathname.substr(1);

  if (html.substr(-5) !== '.html') {
    html += 'index.html';
  }

  resources[html] = true;

  var i, link, script, path, ioHost;
  for(i in scripts) {
    script = scripts[i];
    if (script.src) {
      path = getPath(script.src);
      resources[path] = script;

      if (script.src.match(ioScriptRegex)) {
        ioHost = script.src.replace(ioScriptRegex, '');
      }
    }
  }

  for(i in links) {
    link = links[i];
    if (link.href && link.rel && link.rel === 'stylesheet') {
      path = getPath(link.href);
      resources[path] = link;
    }
  }

  var socket = io.connect(ioHost);

  socket.on('jastyco', function(event, file, dest) {

    path = file.destpath.substr(dest.length);

    if (event == 'changed' && resources.hasOwnProperty(path)) {

      source = resources[path];
      parent = source.parentNode;
      next = source.nextSibling;

      if (file.destext === '.css') {

        element = doc.createElement('link');
        element.setAttribute('rel', 'stylesheet');
        element.setAttribute('href', '/' + path + '?now=' + new Date() * 1);

        next ? parent.insertBefore(element, next) : parent.appendChild(element);
        resources[path] = element;
        parent.removeChild(source);

      } else if (file.destext === '.js' || file.destext === '.html') {

        doc.location.reload();

      }

    }

  });

})(document);
