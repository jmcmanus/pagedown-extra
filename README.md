#Overview

This is a collection of [Pagedown][1] plugins to enable support for 
Markdown Extra syntax. Open `demo/demo.html` to try it yourself.
To run the tests, just open `spec/SpecRunner.html` in your browser. Or, to
run a browser-less test from the command line as travis-ci would, run `bundle install` followed
by `bundle exec rake`. You'll need Ruby and the rake gem if you use
the second method.

![travis](https://secure.travis-ci.org/jmcmanus/pagedown-extra.png)


## Usage

First, make sure you have the most recent version of Pagedown (as of Feb 3, 2013),
as it adds more powerful hooks that this implementation relies on.

In order to use the extensions, you'll need to include
`Markdown.Extra.js` after the Pagedown sources. Check out the
demo for a working example.

```javascript
// create a pagedown converter - regular and sanitized versions are both supported
var converter = new Markdown.Converter();
// tell the converter to use Markdown Extra
Markdown.Extra.init(converter);
// convert some markdown
var html = converter.makeHtml("| A | B |\n| :-: | :-: |\n| 1 | 2 |");
```

To use this in Node.js with Pagedown:

```javascript
var pagedown = require("pagedown");
var converter = new pagedown.Converter();
var pagedownExtra = require("pagedown-extra");
pagedownExtra.init(converter);
```

If you're using multiple converters on the same page, you can just call
`Markdown.Extra.init` once for each converter and you're all set.

If you want, you can choose to use only a subset of the extensions currently supported:

```javascript
Markdown.Extra.init(converter, {extensions: ["tables", "fenced_code_gfm", "def_list"]});
```

See the Extension/Option Reference below for a complete list.


### [Tables][2]

The following markdown:

```markdown
| Item      | Value | Qty |
| --------- | -----:|:--: |
| Computer  | $1600 | 5   |
| Phone     |   $12 | 12  |
| Pipe      |    $1 |234  |
```

will render to something like this depending on how you choose to style it:

| Item      | Value | Qty |
| --------- | -----:|:--: |
| Computer  | $1600 | 5   |
| Phone     |   $12 | 12  |
| Pipe      |    $1 |234  |

You can also specify a class for the generated tables using
`Markdown.Extra.init(converter, {table_class: "table table-striped"})` for instance.

Span-level markdown inside of table cells will also be converted.


### [Fenced Code Blocks][3]

Fenced code blocks are supported &agrave; la GitHub. This markdown:

    ```
    var x = 2;
    ```

Will be transformed into:

```html
<pre>
    <code>var x = 2;</code>
</pre>
```

You can specify a syntax highlighter in the options object passed to `Markdown.Extra.init`,
in order to generated html compatible with either [google-code-prettify][4]
or [Highlight.js][5]:

```javascript
// highlighter can be either `prettify` or `highlight`
Markdown.Extra.init(converter, {highlighter: "prettify"});
```

If either of those is specified, the language type will be added to the code tag, e.g.
`<code class="language-javascript">`, otherwise you just get the standard
`<code class="javascript">` as in PHP Markdown Extra. If `prettify` is specified,
`<pre>` also becomes `<pre class="prettyprint">`. Otherwise, the markup is the
same as what Pagedown produces for regular indented code blocks.  For example, when using
`{highlighter: "prettify"}` as shown above, this:

    ```javascript
    var x = 2;
    ```

Would generate the following html:

```html
<pre class="prettyprint">
    <code class="language-javascript">var x = 2;</code>
</pre>
```


### [Definition Lists][6]

```markdown
Term 1
:   Definition 1

Term 2
:   This definition has a code block.

        code block

```

becomes:

```html
<dl>
  <dt>Term 1</dt>
  <dd>
    Definition 1
  </dd>
  <dt>Term 2</dt>
  <dd>
    This definition has a code block.
    <pre><code>code block</code></pre>
  </dd>
</dl>
```

Definitions can contain both inline and block-level markdown.


### [Footnotes][7]

```markdown
Here is a footnote[^footnote].

  [^footnote]: Here is the *text* of the **footnote**.
```

becomes:

```html
<p>Here is a footnote<a href="#fn:footnote" id="fnref:footnote" title="See footnote" class="footnote">1</a>.</p>

<div class="footnotes">
<hr>
<ol>
<li id="fn:footnote">Here is the <em>text</em> of the <strong>footnote</strong>. <a href="#fnref:footnote" title="Return to article" class="reversefootnote">↩</a></li>
</ol>
</div>
```


### [Special Attributes][8]

You can add class and id attributes to headers and gfm fenced code blocks.


    ``` {#gfm-id .gfm-class}
    var foo = bar;
    ```

    ## A Header {#header-id}

    ### Another One ### {#header-id .hclass}

    Underlined  {#what}
    ==========


### [SmartyPants][9]

SmartyPants extension converts ASCII punctuation characters into "smart" typographic punctuation HTML entities. For example:

|                  | ASCII                                              | HTML                                |
 ------------------|----------------------------------------------------|-------------------------------------
| Single backticks | `'Isn't this fun?'`                                | &#8216;Isn&#8217;t this fun?&#8217; |
| Quotes           | `"Isn't this fun?"`                                | &#8220;Isn&#8217;t this fun?&#8221; |
| Dashes           | `This -- is an en-dash and this --- is an em-dash` | This &#8211; is an en-dash and this &#8212; is an em-dash |


### [Newlines][10]

Newlines &agrave; la GitHub (without the need of two white spaces):

```md
Roses are red
Violets are blue
```

becomes:

```html
<p>Roses are red <br>
Violets are blue</p>
```


### [Strikethrough][11]

Strikethrough &agrave; la GitHub:

```md
~~Mistaken text.~~
```

becomes:

```html
<p><del>Mistaken text.</del></p>
```



## Extension / Option Reference
You can enable all of the currently supported extensions with `{extensions: "all"}`. This is also
the default. If specifying multiple extensions, you must provide them as an array. Here
is a list of the current and planned options and extensions. I've chosen to use the 
same naming scheme as the excellent Python Markdown library.

| Extension       | Description |
| --------------- | ----------- |
| fenced_code_gfm | GFM fenced code blocks |
| tables          | Pretty tables! |
| def_list        | Definition lists |
| attr_list       | Special attributes list for headers and fenced code blocks |
| footnotes       | Footnotes |
| smartypants     | SmartyPants |
| newlines        | GFM newlines |
| strikethrough   | GFM strikethrough |
| *smart_strong*  | No strong emphasis in the middle of words |
| *abbr*          | Abbreviations |
| *fenced_code*   | PHP Markdown Extra fenced code blocks |

| Option          | Description |
| --------------- | ----------- |
| table_class     | Class added to all markdown tables. Useful when using frameworks like bootstrap. |
| highlighter     | Code highlighter. Must be one of `highlight` and `prettify` for now |

*Italicized extensions are planned, and will be added in roughly the order shown*

You can also enable all but a subset of extensions by using `exclude` to
list one or more extensions to exclude:
`{exclude: ["newlines"]}`

See PHP Markdown Extra's [documentation][12] for a more complete overview
of syntax. In situations where it differs from how things are done on GitHub --
alignment of table headers, for instance -- I've chosen compatibility with gfm, which
seems to be quickly becoming the most widely used markdown implementation.


### Special Characters

Markdown Extra adds two new special characters, `|` and `:`, that can be escaped
by preceding them with `\`. Doing so will cause the escaped character to be ignored when determining
the extent of code blocks and definition lists.


##License

See LICENSE.txt 


  [1]: http://code.google.com/p/pagedown/ "Pagedown - Google Code"
  [2]: http://michelf.ca/projects/php-markdown/extra/#table
  [3]: http://github.github.com/github-flavored-markdown/
  [4]: http://code.google.com/p/google-code-prettify/ "Prettify"
  [5]: http://softwaremaniacs.org/soft/highlight/en/ "HighlightJs"
  [6]: http://michelf.ca/projects/php-markdown/extra/#def-list
  [7]: https://github.com/fletcher/MultiMarkdown/blob/master/Documentation/MultiMarkdown%20User%27s%20Guide.md#footnotes
  [8]: http://michelf.ca/projects/php-markdown/extra/#spe-attr
  [9]: http://daringfireball.net/projects/smartypants/
  [10]: https://help.github.com/articles/github-flavored-markdown#newlines
  [11]: https://help.github.com/articles/github-flavored-markdown#strikethrough
  [12]: http://michelf.ca/projects/php-markdown/extra/#table "Markdown Extra Table Documentation"
