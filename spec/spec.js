describe("headers", function() {
  it("h1", function() {
    expect(downshow("<h1>H1</h1>")).toEqual('# H1');
  });

  it("h2", function() {
    expect(downshow("<h2>H2</h2>")).toEqual('## H2');
  });

  it("h3", function() {
    expect(downshow("<h3>H3</h3>")).toEqual('### H3');
  });

  it("h4", function() {
    expect(downshow("<h4>H4</h4>")).toEqual('#### H4');
  });

  it("h5", function() {
    expect(downshow("<h5>H5</h5>")).toEqual('##### H5');
  });

  it("h6", function() {
    expect(downshow("<h6>H6</h6>")).toEqual('###### H6');
  });

  it("h1+h2", function() {
    expect(downshow("<h1>H1</h1><h2>H2</h2>")).toEqual("# H1\n\n## H2");
  });
});

describe("inline span elements", function() {
  it("bold", function() {
    expect(downshow("<strong>bold</strong>")).toEqual("**bold**");
    expect(downshow("<b>bold</b>")).toEqual("**bold**");
  });

  it("italic", function() {
    expect(downshow("<em>italic</em>")).toEqual("_italic_");
    expect(downshow("<i>italic</i>")).toEqual("_italic_");
  });

  it("nested bold and italic.", function() {
    expect(downshow("<b>bold and <i>italic</i>.</b>")).toEqual("**bold and _italic_.**");
    expect(downshow("<i>bold and <b>italic</b>.</i>")).toEqual("_bold and **italic**._");
  });

  it("image", function() {
    var html = "<img alt=\"example image\" title=\"example title\" src=\"http://example.com/img/62838.jpg\"/>";
    var md = "![example image](http://example.com/img/62838.jpg \"example title\")";
    expect(downshow(html)).toEqual(md);

    html = "<img alt=\"example image\" src=\"http://example.com/img/62838.jpg\"/>";
    md = "![example image](http://example.com/img/62838.jpg)";
    expect(downshow(html)).toEqual(md);

    html = "<img src=\"http://example.com/img/62838.jpg\"/>";
    md = "![](http://example.com/img/62838.jpg)";
    expect(downshow(html)).toEqual(md);
  });
  
  it("link", function() {
    var html = "<a href=\"http://www.example.com/\" title=\"example title\">example link</a>";
    var md = "[example link](http://www.example.com/ \"example title\")";
    expect(downshow(html)).toEqual(md);

    html = "<a href=\"http://www.example.com/\">example title</a>";
    md = "[example title](http://www.example.com/)";
    expect(downshow(html)).toEqual(md);
  });  
});

describe("separator elements", function() {
  it("br", function() {
    expect(downshow("a<br/>b")).toEqual("a\n\nb");
  });

  it("hr", function() {
    expect(downshow("<hr/>")).toEqual("***");
    expect(downshow("a<hr/>b")).toEqual("a\n***\nb");
  });
});

describe("lists", function() {
  it("unordered list", function() {
    var html = "<ul><li>item a</li><li>item b</li></ul>";
    var md = "- item a\n- item b";
    expect(downshow(html)).toEqual(md);
  });

  it("ordered list", function() {
    var html = "<ol><li>item a</li><li>item b</li></ol>";
    var md = "1. item a\n1. item b";
    expect(downshow(html)).toEqual(md);
  });
  
  it("nested lists", function() {
    var html = "<ul><li>item a<ul><li>item aa</li><li>item ab</li></ul></li><li>item b</li></ul>";
    var md = "- item a\n    - item aa\n    - item ab\n- item b";
    expect(downshow(html)).toEqual(md);
  });
});

describe("blockquotes", function() {
  it("single blockquote", function() {
    var html = "<blockquote>This is blockquoted</blockquote>";
    var md = "> This is blockquoted";
    expect(downshow(html)).toEqual(md);
  });

  it("separated blockquote", function() {
    var html = "<blockquote>This is blockquoted</blockquote> <blockquote>and this too</blockquote>";
    var md = "> This is blockquoted\n\n> and this too";
    expect(downshow(html)).toEqual(md);
  });

  it("paragrphs in blocquotes", function() {
    var html = "<blockquote>\n<p>Lorem ipsum</p>\n<p>Lorem ipsum</p>\n</blockquote>";
    var md = "> Lorem ipsum\n\n> Lorem ipsum";
    expect(downshow(html)).toEqual(md);

    html = "<blockquote>\n<p>Lorem ipsum</p>\n</blockquote>\n<blockquote>\n<p>Lorem ipsum</p>\n</blockquote>";
    expect(downshow(html)).toEqual(md);
  });
  
  it("nested blockquote", function() {
    var html = "<blockquote>blockquoted<blockquote>nested blockquoted</blockquote></blockquote>";
    var md = "> blockquoted\n\n> > nested blockquoted";
    expect(downshow(html)).toEqual(md);
  });
});

describe("code formatting", function() {
  it("inline code", function () {
    expect(downshow("<code>hello world</code>")).toEqual("`hello world`");
  });

  it("block code", function() {
    var html = "";
    html += "<pre><code>";
    html += "  void main(String[] args) {\n";
    html += "    System.out.println(\"Hello Markdown\");\n";
    html += "  }";
    html += "</code></pre>";

    var md = "";
    md += "    " + "void main(String[] args) {\n";
    md += "    " + "    System.out.println(\"Hello Markdown\");\n";
    md += "    " + "  }";
    
    expect(downshow(html)).toEqual(md);
  });
});  

describe("empty elements", function() {
  it("img", function() {
    expect(downshow("<img alt='Example Image' title='Free example image'>")).toEqual("");
  });
  
  it("link", function() {
    expect(downshow("<a>Empty Link Text</a>")).toEqual("");
  });

  it("lists", function() {
    expect(downshow("<ol><li>item 1</li><li/></ol>")).toEqual("1. item 1");
    expect(downshow("<ul><li>item 1</li><li></li></ol>")).toEqual("- item 1");
  });  

  it("other elements", function() {
    expect(downshow("<h1>  </h1>")).toEqual('');
    expect(downshow("<h2>  </h2>")).toEqual('');
    expect(downshow("<h3>  </h3>")).toEqual('');
    expect(downshow("<h4>  </h4>")).toEqual('');
    expect(downshow("<h5>  </h5>")).toEqual('');
    expect(downshow("<h6>  </h6>")).toEqual('');
    expect(downshow("<div>  </div>")).toEqual('');
    expect(downshow("<p>  </p>")).toEqual('');
    expect(downshow("<b>  </b>")).toEqual('');
    expect(downshow("<i>  </i>")).toEqual('');
  });
});

describe("word spacing", function () {
  it("bold", function() {
    expect(downshow("<strong> hello  world!  </strong>")).toEqual("**hello world!**");
    expect(downshow("<strong>  </strong>")).toEqual('');
  });

  it("italic", function() {
    expect(downshow("<em> hello  world! </em>")).toEqual("_hello world!_");
    expect(downshow("<em>  </em>")).toEqual('');
  });
 
  it("paragraph", function () {
    var html = "this is text before paragraph<p>This is a paragraph</p>this is text after paragraph";
    var md = "this is text before paragraph\n\nThis is a paragraph\n\nthis is text after paragraph";
    expect(downshow(html)).toEqual(md);
  });

  it("headers", function() {
    expect(downshow("<h1> lorem   ipsum  dolor   sit   amet  </h1>")).toEqual('# lorem ipsum dolor sit amet');
    expect(downshow("<h2> lorem   ipsum  dolor   sit   amet  </h2>")).toEqual('## lorem ipsum dolor sit amet');
    expect(downshow("<h3> lorem   ipsum  dolor   sit   amet  </h3>")).toEqual('### lorem ipsum dolor sit amet');
    expect(downshow("<h4> lorem   ipsum  dolor   sit   amet  </h4>")).toEqual('#### lorem ipsum dolor sit amet');
    expect(downshow("<h5> lorem   ipsum  dolor   sit   amet  </h5>")).toEqual('##### lorem ipsum dolor sit amet');
    expect(downshow("<h6> lorem   ipsum  dolor   sit   amet  </h6>")).toEqual('###### lorem ipsum dolor sit amet');
  });

  // it("span element", function() {
  //   expect(downshow("<span>this is span element</span>")).toEqual("this is span element");
  //   expect(downshow("before<span>this is span element</span>after")).toEqual("before this is span element after");
  //   expect(downshow("before <span>this is span element</span> after")).toEqual("before this is span element after");
  // });
});
