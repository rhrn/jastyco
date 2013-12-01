(function(doc) {

  var ioScriptRegex = /socket\.io\/socket\.io\.js/i;

  var scripts = doc.getElementsByTagName('script');
  var links = doc.getElementsByTagName('link');
  var resources = {}, source, parent, next, element;
  var head = document.getElementsByTagName('head')[0];
  var html = document.body.parentNode;

  var style = document.createElement("style");
  var rule = "transition: all .3s ease-out;"
  var css = [".livejs-loading * { ", rule, " -webkit-", rule, "-moz-", rule, "-o-", rule, "}"].join('');

  style.setAttribute("type", "text/css");
  head.appendChild(style);
  style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));

  function getPath(href) {
    parser = doc.createElement('a');
    parser.href = href;
    return parser.pathname.substr(1);
  }

  var htmlPath = doc.location.pathname.substr(1);

  if (htmlPath.substr(-5) !== '.html') {
    htmlPath += 'index.html';
  }

  resources[htmlPath] = true;

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

        html.classList.add('livejs-loading');

        element = doc.createElement('link');
        element.setAttribute('rel', 'stylesheet');
        element.setAttribute('href', '/' + path + '?now=' + new Date() * 1);

        next ? parent.insertBefore(element, next) : parent.appendChild(element);
        resources[path] = element;
        parent.removeChild(source);
  
        setTimeout(function() {
          html.classList.remove('livejs-loading');
        }, 500);

      } else if (file.destext === '.js' || file.destext === '.html') {

        doc.location.reload();

      }

    }

  });

})(document);
