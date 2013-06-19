# Downshow [![build status](https://secure.travis-ci.org/acornejo/downshow.png)](http://travis-ci.org/acornejo/downshow)

A simple JavaScript library to convert HTML to markdown.

This library has no external dependencies, and has been tested 
in Chrome, Safari and Firefox. It probably works with Internet Explorer,
but your milage may vary.

Downshow is **tiny!**, only 3kb minified and 1kb gzip'ed.

It relies on javascript's DOM to parse the input HTML and produce the markdown
output.In more detail, the DOM tree of the input HTML is processed in reverse breadth
first search order. Every supported HTML element is replaced with its markdown
equivalent. Unsupported elements are stripped out and replaced by their
sanitized text contents. All element attributes are ignored by the
default node parser, but it is possible to extend the behavior through
custom node parsers.

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
var markdown = showdown(html_content);
console.log(markdown);
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

Since the vanilla markdown syntax does not support underlined text, the
html tags were ignored and stripped from the output.

The next javascript fragment extends the markdown syntax to allow
underline text by wrapping it with the $ character.


```js
function nodeParser(doc, node) {
  bool underline = false;
  if (node.tagName === 'U')
      underline = true;
  else if (node.tagName === 'SPAN') {
    var classlist = ' ' + node.className + ' ';
    if (classlist.indexOf('underline') != -1) {
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

The output now is:

```md
Regular text.
**Bold text**
_Italics text_
$Underlined text$
$More underlined text$
```

## Uses and Limitations

Perhaps the main uses of converting HTML to markdown is to avoid the
security considerations that arise when storing and manipulating raw
HTML which was produced by an (untrusted) third party.

For this purpose downshow will strip all HTML tags from its output and
produce a sanitized subset of Markdown which contains no HTML markup. 

Using the nodeParser option it is possible to allow certain tags and
attributes to be passed through to the markdown output. However, this
will only work for toplevel elements, and such a use is discouraged.

If you need certain additional formatting in the produced markdown, we
instead recommend that you extend the markdown syntax as shown above.
