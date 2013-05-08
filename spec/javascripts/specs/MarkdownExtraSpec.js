describe("Markdown.Extra", function() {
  // basic code block
  var codeBlock = "```foolang\nfoo=bar;\n```";
  // expected code block html
  var codeBlockHtml ='<pre><code class="foolang">foo=bar;</code></pre>';

  // basic table
  var table = "h1 | h2 | h3\n:- | :-: | -:\n1 | 2 | 3";
  var tableVerbose = "| h1 | h2 | h3 |\n| :- | :-: | -: |\n| 1 | 2 | 3 |";
  // expected table html
  var tableHtml ='<table>\n' +
    '<thead>\n' +
    '<tr>\n' +
    '  <th style="text-align:left;">h1</th>\n' +
    '  <th style="text-align:center;">h2</th>\n' +
    '  <th style="text-align:right;">h3</th>\n' +
    '</tr>\n' +
    '</thead>\n' +
    '<tr>\n' +
    '  <td style="text-align:left;">1</td>\n' +
    '  <td style="text-align:center;">2</td>\n' +
    '  <td style="text-align:right;">3</td>\n' +
    '</tr>\n' +
    '</table>';
  // table containing inline and block-level tags and markdown
  var tableComplex = "h1|h2|h3\n-|-|-\n`code`|##hdr##|<script></script>";

  // markdown for a group of elements using attribute lists
  var attrList = "``` {#gfm-id .gfm-class}\n" +
    "var foo = bar;\n" +
    "```\n\n" +
    "## A Header {#header-id}\n\n" +
    "### Another One ### {#header-id .hclass}\n\n" +
    "Underlined {#what}\n" +
    "==========\n";
  // expected output for attribute list markdown
  var attrListHtml = '<pre id="gfm-id" class="gfm-class"><code>var foo = bar;</code></pre>\n\n' +
    '<h2 id="header-id">A Header</h2>\n\n' +
    '<h3 id="header-id" class="hclass">Another One</h3>\n\n' +
    '<h1 id="what">Underlined</h1>';

  var defList = "Term 1\nTerm 2\n:   Def1";
  var defListHtml = "<dl>\n<dt>Term 1</dt>\n<dt>Term 2</dt>\n<dd>Def1</dd>\n</dl>";
  var defListComplex = "Term 1\n\n" +
    ":   This definition has a code block, a blockquote and a list.\n\n" +
    "        code block.\n\n" +
    "    > block quote\n" +
    "    > on two lines.\n\n" +
    "    1.  first list item\n" +
    "    2.  second list item\n\n" +
    "Term 2\n\n" +
    ":   Definition 2\n\n";

  // some basic markdown without extensions
  var markdown = "#TestHeader\n_This_ is *markdown*" +
    "\n\nCool. And a link: [google](http://www.google.com)";

  function strip(str) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  describe("when setting options", function() {
    var converter;

    beforeEach(function() {
      converter = new Markdown.Converter();
    });

    it("should default to use 'all' extensions", function() {
      var extra = Markdown.Extra.init(converter);
      spyOn(extra, "tables").andCallThrough();
      spyOn(extra, "fencedCodeBlocks").andCallThrough();
      spyOn(extra, "definitionLists").andCallThrough();
      spyOn(extra, "hashHeaderAttributeBlocks").andCallThrough();
      spyOn(extra, "hashFcbAttributeBlocks").andCallThrough();
      converter.makeHtml(markdown);
      expect(extra.tables).toHaveBeenCalled();
      expect(extra.fencedCodeBlocks).toHaveBeenCalled();
      expect(extra.definitionLists).toHaveBeenCalled();
      expect(extra.hashHeaderAttributeBlocks).toHaveBeenCalled();
      expect(extra.hashFcbAttributeBlocks).toHaveBeenCalled();
    });

    it("should use 'all' extensions if specified", function() {
      var extra = Markdown.Extra.init(converter, {extensions: "all"});
      spyOn(extra, "tables").andCallThrough();
      spyOn(extra, "fencedCodeBlocks").andCallThrough();
      spyOn(extra, "definitionLists").andCallThrough();
      spyOn(extra, "hashHeaderAttributeBlocks").andCallThrough();
      spyOn(extra, "hashFcbAttributeBlocks").andCallThrough();
      converter.makeHtml(markdown);
      expect(extra.tables).toHaveBeenCalled();
      expect(extra.fencedCodeBlocks).toHaveBeenCalled();
      expect(extra.definitionLists).toHaveBeenCalled();
      expect(extra.hashHeaderAttributeBlocks).toHaveBeenCalled();
      expect(extra.hashFcbAttributeBlocks).toHaveBeenCalled();
    });

    it("should use 'tables' extension if specified", function() {
      var extra = Markdown.Extra.init(converter, {extensions: "tables"});
      spyOn(extra, "tables").andCallThrough();
      spyOn(extra, "fencedCodeBlocks").andCallThrough();
      converter.makeHtml(markdown);
      expect(extra.tables).toHaveBeenCalled();
      expect(extra.fencedCodeBlocks).wasNotCalled();
    });

    it("should use 'fenced_code_gfm' extension if specified", function() {
      var extra = Markdown.Extra.init(converter, {extensions: "fenced_code_gfm"});
      spyOn(extra, "tables").andCallThrough();
      spyOn(extra, "fencedCodeBlocks").andCallThrough();
      converter.makeHtml(markdown);
      expect(extra.fencedCodeBlocks).toHaveBeenCalled();
      expect(extra.tables).wasNotCalled();
    });

    it("should use 'def_list' extension if specified", function() {
      var extra = Markdown.Extra.init(converter, {extensions: "def_list"});
      spyOn(extra, "definitionLists").andCallThrough();
      spyOn(extra, "hashHeaderAttributeBlocks").andCallThrough();
      spyOn(extra, "hashFcbAttributeBlocks").andCallThrough();
      converter.makeHtml(markdown);
      expect(extra.definitionLists).toHaveBeenCalled();
      expect(extra.hashHeaderAttributeBlocks).wasNotCalled();
      expect(extra.hashFcbAttributeBlocks).wasNotCalled();
    });

    it("should use 'attr_list' extension if specified", function() {
      var extra = Markdown.Extra.init(converter, {extensions: "attr_list"});
      spyOn(extra, "hashHeaderAttributeBlocks").andCallThrough();
      spyOn(extra, "hashFcbAttributeBlocks").andCallThrough();
      spyOn(extra, "definitionLists").andCallThrough();
      converter.makeHtml(markdown);
      expect(extra.hashHeaderAttributeBlocks).toHaveBeenCalled();
      expect(extra.hashFcbAttributeBlocks).toHaveBeenCalled();
      expect(extra.definitionLists).wasNotCalled();
    });

    it("should apply table class if specified", function() {
      Markdown.Extra.init(converter, {table_class: "table-striped"});
      var html = converter.makeHtml(table);
      expect(html).toMatch(/<table class="table-striped">/);
    });

    it("should format code for highlight.js if specified", function() {
      Markdown.Extra.init(converter, {highlighter: "highlight"});
      var html = converter.makeHtml(codeBlock);
      expect(html).toMatch(/<pre><code class="language-foolang">/);
    });

    it("should format code for prettify if specified", function() {
      Markdown.Extra.init(converter, {highlighter: "prettify"});
      var html = converter.makeHtml(codeBlock);
      expect(html).toMatch(/<pre class="prettyprint"><code class="language-foolang">/);
    });

    it("should use regular converter if specified for markdown inside tables", function() {
      Markdown.Extra.init(converter);
      var html = converter.makeHtml(tableComplex);
      expect(html).toMatch(/<script>/);
    });

    it("should use sanitizing converter if specified for markdown inside tables", function() {
      var sconv = Markdown.getSanitizingConverter();
      Markdown.Extra.init(sconv);
      var html = sconv.makeHtml(tableComplex);
      expect(html).not.toMatch(/<script>/);
    });
  });

  describe("when using the sanitizing converter", function() {
    var sconv;

    describe("with fenced code blocks", function() {
      beforeEach(function() {
        sconv = Markdown.getSanitizingConverter();
        Markdown.Extra.init(sconv, {extensions: "fenced_code_gfm"});
      });

      it("should convert code blocks correctly", function() {
        var html = strip(sconv.makeHtml(codeBlock));
        expect(html).toEqual(codeBlockHtml);
      });

      it("should recognize code blocks at beginning of input", function() {
        var html = sconv.makeHtml(codeBlock + '\n\n' + markdown);
        expect(html).toMatch(/<pre><code/);
      });

      it("should recognize code blocks at end of input", function() {
        var html = sconv.makeHtml(markdown + '\n\n' + codeBlock);
        expect(html).toMatch(/<pre><code/);
      });

      it("should recognize code blocks surrounded by blank lines", function() {
        var html = sconv.makeHtml('\n' + codeBlock + '\n');
        expect(html).toMatch(/<pre><code/);
      });

      it("should recognize consecutive code blocks (no blank line necessary)", function() {
        var html = sconv.makeHtml(codeBlock + '\n' + codeBlock);
        expect(html).toMatch(/<\/pre>[\s\S]*<pre>/);
      });

      it("should not recognize code blocks within block-level tags", function() {
        var html = sconv.makeHtml('<div>' + codeBlock + '</div>');
        expect(html).not.toMatch(/<pre><code/);
      });
    });

    describe("with tables", function() {
      beforeEach(function() {
        sconv = Markdown.getSanitizingConverter();
        Markdown.Extra.init(sconv, {extensions: "tables"});
      });

      it("should convert tables properly", function() {
        var html = strip(sconv.makeHtml(table));
        expect(html).toEqual(tableHtml);
      });

      it("should recognize tables at beginning of input", function() {
        var html = sconv.makeHtml(table + '\n\n' + markdown);
        expect(html).toMatch(/table/);
      });

      it("should recognize tables at end of input", function() {
        var html = sconv.makeHtml('markdown' + '\n\n' + table);
        expect(html).toMatch(/table/);
      });

      it("should have correct number of columns", function() {
        var html = sconv.makeHtml(table);
        var matches = html.match(/<\/th>/g);
        expect(matches.length).toEqual(3);
      });

      it('should have correct alignment of table data', function() {
        var html = sconv.makeHtml(table);
        var matches = html.match(/<td style="text-align:(left|right|center);">/g);
        expect(matches[0]).toMatch("left");
        expect(matches[1]).toMatch("center");
        expect(matches[2]).toMatch("right");
      });

      it('should not require initial/final pipes', function() {
        var html1 = sconv.makeHtml(table);
        var html2 = sconv.makeHtml(tableVerbose);
        expect(html1).toEqual(html2);
      });

      it('should not create tables if properly escaped', function() {
        var escapedTable = "h1 \\| h2 \\| h3\n:- | :-: | -:\n1 | 2 | 3";
        var escapedTable2 = "\\| h1 \\| h2 \\| h3\n\\| :- | :-: | -:\n\\| 1 | 2 | 3";
        var html = sconv.makeHtml(escapedTable);
        var html2 = sconv.makeHtml(escapedTable2);
        expect(html).not.toMatch(/table/);
        expect(html2).not.toMatch(/table/);
      });

      it('should find tables following escaped rows', function() {
        var escapedTable = "foo \\| bar \\| baz\n :- | - | -\n h1 | h2 | h3\n :- | :-: | -:\n 1 | 2 | 3";
        var escapedTable2 = "\\| foo \\| bar \\| baz\n| :- | - | -\n| h1 | h2 | h3\n| :- | :-: | -:\n| 1 | 2 | 3";
        var html = sconv.makeHtml(escapedTable);
        var html2 = sconv.makeHtml(escapedTable2);
        expect(html).not.toMatch(/foo<\/th>/);
        expect(html).toMatch(/h1<\/th>/);
        expect(html2).not.toMatch(/foo<\/th>/);
        expect(html2).toMatch(/h1<\/th>/);
      });

      it('should convert inline data in tables', function() {
        var html = sconv.makeHtml(tableComplex);
        expect(html).toMatch(/<code>/);
        expect(html).not.toMatch(/<h2>/);
      });

      it("should not recognize tables within block-level tags", function() {
        var html = sconv.makeHtml('<div>' + tableHtml + '</div>');
        expect(html).not.toMatch(/table/);
      });

      it("should treat $ and ~ properly", function() {
        var text ="|a|~b|\n|-|-|\n|$1|$2|";
        var html = sconv.makeHtml(text);
        expect(html).toMatch(/<table>[\s\S]*~[\s\S]*\$[\s\S]*<\/table>/);
      });
    });

    describe("with definition lists", function() {
      beforeEach(function() {
        sconv = Markdown.getSanitizingConverter();
        Markdown.Extra.init(sconv, {extensions: "def_list"});
      });

      it("should convert definition lists properly", function() {
        var html = strip(sconv.makeHtml(defList));
        expect(html).toEqual(defListHtml);
      });

      it("should wrap <dt> contents with <p> if preceded by a blank line", function() {
        var defList = "Term 1\nTerm 2\n\n:   Def1";
        var html = sconv.makeHtml(defList);
        expect(html).toMatch(/<p>Def1<\/p>/);
      });

      it("should not convert definition list if escaped", function() {
        var defList = "Term 1\nTerm 2\n\\:   Def1";
        var html = sconv.makeHtml(defList);
        expect(html).not.toMatch(/<dl>/);
      });

      it("should convert inline elements in terms and definitions", function() {
        var defList = "Term 1\nTerm 2 [link](http://www.foo.com)\n:   *foo*";
        var html = sconv.makeHtml(defList);
        expect(html).toMatch(/<a href[\s\S]*<em>/);
      });

      it("should convert block-level elements in definitions", function() {
        var html = sconv.makeHtml(defListComplex);
        expect(html).toMatch(/<pre><code>[\s\S]*<blockquote>[\s\S]*<ol>/);
      });

      it("should not convert a list with multiple defs into multiple lists", function() {
        var html = sconv.makeHtml(defListComplex);
        var matches = html.match(/<dl>/g);
        expect(matches.length).toEqual(1);
      });
    });

    describe("with attribute lists", function() {
      beforeEach(function() {
        sconv = Markdown.getSanitizingConverter();
        Markdown.Extra.init(sconv);
      });

      it("should correctly apply attributes to headers", function() {
        var hdrBlock1 = "Hello There {#header-id .class1}\n=========";
        var hdrBlock2 = "## Hello There {#header-id .class1}";
        var hdrBlock3 = "## Hello There ##  {#header-id .class1}";
        var html1 = sconv.makeHtml(hdrBlock1);
        var html2 = sconv.makeHtml(hdrBlock2);
        var html3 = sconv.makeHtml(hdrBlock3);
        expect(html1).toMatch(/<h1 id="header-id" class="class1">/);
        expect(html2).toMatch(/<h2 id="header-id" class="class1">/);
        expect(html3).toMatch(/<h2 id="header-id" class="class1">/);
      });

      it("should correctly apply attributes to fenced code blocks", function() {
        var text = "```\t{.test-class #test-id} \nfoo=bar;\n  var x;\n\n```";
        var html = sconv.makeHtml(text);
        expect(html).toMatch(/<pre id="test-id" class="test-class">/);
      });

      it("should correctly apply attributes to fenced code blocks with a specified language", function() {
        var text = "```foolang {.prettyprint .foo #awesome}\nfoo=bar;\n```";
        var html = sconv.makeHtml(text);
        expect(html).toMatch(/<pre id="awesome" class="prettyprint foo">/);
      });

      it("should merge classes with preexisting classes", function() {
        var text = "```foolang  {.test-class .prettyprint} \n\n foo=bar; \n\n```";
        var converter = Markdown.getSanitizingConverter();
        Markdown.Extra.init(converter, {highlighter: "prettify"});
        var html = converter.makeHtml(text);
        expect(html).toMatch(/<pre class="test-class prettyprint">/);
      });

      it("should work correctly with multiple items", function() {
        var html = sconv.makeHtml(attrList);
        expect(html).toEqual(attrListHtml);
      });
    });
  });

  describe("when using multiple converters on a single page", function() {
    var conv1, conv2;

    beforeEach(function() {
      conv1 = new Markdown.Converter();
      conv2 = Markdown.getSanitizingConverter();
    });

    it("should not interfere with one another", function() {
      Markdown.Extra.init(conv1, {extensions: "tables"});
      Markdown.Extra.init(conv2, {extensions: "fenced_code_gfm"});
      var testData = table + '\n\n' + codeBlock;
      var html1 = conv1.makeHtml(testData);
      var html2 = conv2.makeHtml(testData);

      expect(html1).toMatch(/table/);
      expect(html2).not.toMatch(/table/);
      expect(html1).not.toMatch(/pre/);
      expect(html2).toMatch(/pre/);
    });
  });
});
