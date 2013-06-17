# Downshow

A simple JavaScript library to convert HTML to markdown.

This library has no external dependencies, and has been tested 
in Chrome, Safari and Firefox. It probably works with Internet Explorer,
but your milage may vary.

It relies on javascript's DOM to parse the input HTML and produce the markdown
output.  In more detail, the DOM tree is processed in reverse breadth
first search order, translating each supported Element to its markdown
equivalent. Element attributes are ignored, and unsupported elements are
stripped out.

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

## Uses and Limitations

One of the main uses of converting HTML to markdown, is to avoid the
security considerations that arise when storing and manipulating raw
HTML which was produced by an (untrusted) third party.

With this in mind, downshow will strip any HTML tags from its output and
produce a safe subset of Markdown which contains no HTML markup. It
would be easy to overrride this behavior and allow certain tags and
attributes to be passed along (for instance, allow span/div tags with
their class and style attributes).

At the moment this functionality is not implemented (since I have no use
for it). However, if there is interest I can add this as an option to
the library.

### Server-side usage

Install via npm (it requires jsdom).

    $ npm install downshow

Then include and use as at will in your own projects.

```js
var downshow = require('downshow');
console.log(downshow('Hello <b>world</b>!'));
