# Downshow [![build status](https://secure.travis-ci.org/acornejo/downshow.png)](http://travis-ci.org/acornejo/downshow)

A simple JavaScript library to convert HTML to markdown.

This library has no external dependencies, and has been tested 
in Chrome, Safari and Firefox. It probably works with Internet Explorer,
but your milage may vary.

Downshow is **tiny!**, only 4.5kb minified and 1.5kb gzip'ed.

It relies on the browsers DOM engine to parse the input HTML and produce
the markdown output. When a browser DOM engine is not available (i.e.
when running in the server on node.js) it fallsback on jsdom. 
In more detail, the DOM tree of the input HTML is processed in reverse breadth
first search order (aka reverse level order traversal). Every supported
HTML element is replaced with its markdown equivalent, and unsupported
elements are stripped out and replaced by their sanitized text contents.
The default node parser ignores all element attributes and strips all
HTML tags from the output (however this behavior can be overriden
through custom node parsers).

The source code is released under the MIT license, and therefore places
almost no restrictions on what you can do with it.

## Quick Start

Suppose somehwere in your document you have the following html fragment.

``` html
<div id="content">
<h1>Downshow</h1>
A simple JavaScript library to convert HTML to markdown.
<h2>Quick Start</h2>
That was <strong>very</strong> simple right?
</div>
```

Using downshow you can easily convert this HTML fragment to markdown:

```js
var html_content = document.getElementById('content').innerHTML;
var markdown = downshow(html_content);
console.log(markdown);
```

Which should produce:

```md
# Downshow

A simple JavaScript library to convert HTML to markdown

## Quick Start

That was **very** simple right?
```

### Server-side usage

Install via npm (it requires jsdom).

    $ npm install downshow

That is it!, the downshow module is ready to be used in your own nodejs
projects. For example:

    $ echo 'var downshow=require("downshow"); console.log(downshow("Hello <b>world</b>!"));' | node

Which produces

`Hello **world**!`

### Extending Markdown Syntax

By creating a custom node parser it is possible to change the way the
HTML is processed and converted to markdown. Through custom node parsers
it is also possible to extend the produced markdown syntax.

To illustrate this, consider the following HTML fragment.

```html
<div id="content">
    Regular text.<br/>
    <b>Bold text</b><br/>
    <em>Italics text</em><br/>
    <u>Underlined text</u><br/>
    <span class="underline">More underlined text</span>
</div>
```

If we run it through downshow we see the following output.

```md
Regular text.
**Bold text**
_Italics text_
Underlined text
More underlined text
```

Since the vanilla markdown syntax does not support underlined text,
downshow ignored the underline tags and stripped them from the
output.

The next javascript fragment defines a custom node parser that extends
the markdown syntax to allow underline text by wrapping it with the $
character. 

```js
function nodeParser(doc, node) {
  bool underline = false;
  if (node.tagName === 'U')
      underline = true;
  else if (node.tagName === 'SPAN') {
    var classlist = ' ' + node.className + ' ';
    if (classlist.indexOf(' underline ') != -1) {
      underline = true;
    }
  }
  if (underline === true)
      return doc.createTextNode('$' + node.innerHTML + '$');
  return false;
}
```

To run downshow using the custom nodeParser we use:

    downshow(html_content, {nodeParser: nodeParser});

The output using the custom node parser is:

```md
Regular text.
**Bold text**
_Italics text_
$Underlined text$
$More underlined text$
```

## Uses and Limitations

The main use of converting HTML to markdown is to reduce the security
considerations that arise when storing and manipulating raw HTML which
was produced by an (untrusted) third party.

For this purpose downshow strips all HTML tags from its output and
produce a sanitized subset of Markdown which contains no HTML markup. In
this respect, downshow does not support letting `raw` HTML tags into the
markup.

Using the nodeParser option it is possible to allow certain tags and
attributes to be passed through to the markdown output, although this
would only work for toplevel elements. Custom nodeParsers are not meant
to be used to let HTML go through, and this usage is highly discouraged
(and unsafe).

If you need certain additional formatting in the produced markdown, it
is instead recommended to extend the markdown syntax to support this,
which can be done with custom node parsers as shown in the underline
example above.
