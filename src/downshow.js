/**
 * downshow.js -- A javascript library to convert HTML to markdown.
 *
 *  Copyright (c) 2013 Alex Cornejo.
 *
 *  Original Markdown Copyright (c) 2004-2005 John Gruber
 *    <http://darlingfireball.net/projects/markdown/>
 *
 * Redistributable under a BSD-style open source license.
 *
 * downshow has no external dependencies. It has been tested in chrome and
 * firefox, it probably works in internet explorer, but YMMV.
 *
 * Basic Usage:
 *
 * console.log(downshow(document.getElementById('#yourid').innerHTML));
 *
 * TODO:
 *
 * - Lists are always paragraph mode. Figure out a way to handle non
 * paragraph lists AND paragraph list simultaneously and correctly. 
 *
 * - Fix extra newline problems without breaking anything.
 *
 * - Find a cleaner way to handle the ">" character in blockquotes.
 */

(function () {
  var global = this;
  var doc;

  /**
   * Returns every element in root in their bfs traversal order.
   *
   * In the process it transforms any nested lists to conform to the w3c
   * standard, see:
   * http://www.w3.org/wiki/HTML_lists#Nesting_lists
   */
  function bfsOrder(root) {
    var inqueue = [root], outqueue = [];
    while (inqueue.length > 0) {
      var elem = inqueue.shift();
      outqueue.push(elem);
      var children = elem.childNodes;
      var liParent = null;
      for (var i=0 ; i<children.length; i++) {
        if (children[i].nodeType == 1) {
          if (children[i].tagName === 'LI') {
            liParent = children[i];
          } else if ((children[i].tagName === 'UL' || children[i].tagName === 'OL') && liParent) {
            liParent.appendChild(children[i]);
            i--;
            continue;
          } 
          children[i]._bfs_parent = elem;
          inqueue.push(children[i]);
        }
      }
    }
    outqueue.shift();
    return outqueue;
  }

  /**
   * Remove whitespace and newlines from beginning and end of a stirng.
   */
  function trim(str) {
    return str.replace(/^\s\s*/,'').replace(/\s\s*$/, '');
  }

  /**
   * Remove all newlines, and all whitespace from the
   * beginning and the end of
   * */ 
  function nltrim(str) {
    return trim(str.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, ' '));
  }

  /**
   * Add prefix to the beginning of every line in block.
   */
  function prefixBlock(prefix, block, skipEmpty) {
    var lines = block.replace(/^\s+|\s+$/g,'').split('\n');
    for (var i =0; i<lines.length; i++) {
      // Do not prefix empty lines
      if (lines[i].length === 0 && skipEmpty === true)
        continue;
      else
        lines[i] = prefix + lines[i];
    }
    return lines.join('\n');
  }

  /**
   * Set the node's content.
   * */
  function setContent(node, content, prefix, suffix) {
    if (content.length > 0) {
      var text_content = content;
      if (prefix && suffix)
        text_content = prefix + content + suffix;
      node._bfs_parent.replaceChild(doc.createTextNode(text_content), node);
    }
    else
      node._bfs_parent.removeChild(node);
  }

  /**
   * Process a node in the DOM tree.
   * */
  function processNode(node) {
    if (node.tagName === 'P' || node.tagName === 'DIV')
      setContent(node, '\n\n' + node.innerHTML + '\n');
    else if (node.tagName === 'BR')
      setContent(node, '\n\n');
    else if (node.tagName === 'HR')
      setContent(node, '\n***\n');
    else if (node.tagName === 'H1')
      setContent(node, nltrim(node.innerHTML), '\n# ', '\n');
    else if (node.tagName === 'H2') 
      setContent(node, nltrim(node.innerHTML), '\n## ', '\n');
    else if (node.tagName === 'H3')
      setContent(node, nltrim(node.innerHTML), '\n### ', '\n');
    else if (node.tagName === 'H4') 
      setContent(node, nltrim(node.innerHTML), '\n#### ', '\n');
    else if (node.tagName === 'H5') 
      setContent(node, nltrim(node.innerHTML), '\n##### ', '\n');
    else if (node.tagName === 'H6')
      setContent(node, nltrim(node.innerHTML), '\n###### ', '\n');
    else if (node.tagName === 'B' || node.tagName === 'STRONG')
      setContent(node, nltrim(node.innerHTML), '**', '**');
    else if (node.tagName === 'I' || node.tagName === 'EM')
      setContent(node, nltrim(node.innerHTML), '_', '_');
    else if (node.tagName === 'A') {
      var href = nltrim(node.href), text = nltrim(node.innerHTML) || href, title = nltrim(node.title);
      if (href)
        setContent(node, '[' + text + '](' + href + (title ? ' "' + title + '"' : '') + ')');
      else
        setContent(node, '');
    } else if (node.tagName === 'IMG') {
      var src = nltrim(node.src), alt = nltrim(node.alt), title = nltrim(node.title);
      if (src)
        setContent(node, '![' + alt + '](' + src  + (title  ? ' "' + title + '"' : '') + ')');
      else
        setContent(node, '');
    } else if (node.tagName === 'BLOCKQUOTE') {
      var content = trim(node.innerHTML);
      // Cannot use setContent because '>' symbol gets translated.
      if (content.length > 0)
        node.outerHTML =  '\n\n' +  prefixBlock('> ', trim(node.innerHTML)) + '\n\n';
      else
        setContent(node, '');
    } else if (node.tagName === 'UL' || node.tagName === 'OL') 
      setContent(node, '\n\n' + node.innerHTML + '\n\n');
    else if (node.tagName === 'CODE') {
      if (node._bfs_parent.tagName == 'PRE') 
        setContent(node, prefixBlock('    ', node.innerHTML) + '\n');
      else
        setContent(node, nltrim(node.innerHTML), '`', '`');
    } else if (node.tagName === 'LI') {
      if (node._bfs_parent.tagName === 'OL') 
        setContent(node, '1. ' + trim(prefixBlock('    ', trim(node.innerHTML), true)) + '\n\n');
      else
        setContent(node, '- ' +  trim(prefixBlock('    ', trim(node.innerHTML), true)) + '\n\n');
    } else 
      setContent(node, node.innerHTML);
  }

  function downshow(html, options) {
    var root = doc.createElement('pre');
    root.innerHTML = html;
    var nodes = bfsOrder(root).reverse();

    if (options && options.nodeParser) {
      for (var i = 0; i<nodes.length; i++) {
        var result = options.nodeParser(doc, nodes[i].cloneNode(true));
        if (result === false)
          processNode(nodes[i]);
        else 
          nodes[i]._bfs_parent.replaceChild(result, nodes[i]);
      }
    } else {
      for (var i = 0; i<nodes.length; i++) {
        processNode(nodes[i]);
      }
    }

    return trim(root.innerHTML)
      // replace &gt; for > in blockquotes
      .replace(/\n(&gt; )+/g, function (match) { return match.replace(/&gt;/g,'>'); })
      // remove empty lines between blockquotes
      .replace(/(\n(?:> )+[^\n]*)\n+(\n(?:> )+)/g, "$1\n$2")
      // remove empty blockquotes
      .replace(/\n((?:> )+[ ]*\n)+/g, '\n\n')
      // remove extra newlines
      .replace(/\n\n\n+/g,'\n\n');
  }

  try {
    doc = document;
  } catch(e) {
    var jsdom = require("jsdom").jsdom;
    doc = jsdom("<html><head></head><body></body></html>");
  }
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = downshow;
    }
    exports.downshow = downshow;
  } else {
    global.downshow = downshow;
  }
}).call(this);
