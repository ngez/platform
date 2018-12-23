/**
 * @license
 * Copyright (C) 2006 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview
 * some functions for browser-side pretty printing of code contained in html.
 *
 * <p>
 * For a fairly comprehensive set of languages see the
 * <a href="https://github.com/google/code-prettify#for-which-languages-does-it-work">README</a>
 * file that came with this source.  At a minimum, the lexer should work on a
 * number of languages including C and friends, Java, Python, Bash, SQL, HTML,
 * XML, CSS, Javascript, and Makefiles.  It works passably on Ruby, PHP and Awk
 * and a subset of Perl, but, because of commenting conventions, doesn't work on
 * Smalltalk, Lisp-like, or CAML-like languages without an explicit lang class.
 * <p>
 * Usage: <ol>
 * <li> include this source file in an html page via
 *   {@code <script type="text/javascript" src="/path/to/prettify.js"></script>}
 * <li> define style rules.  See the example page for examples.
 * <li> mark the {@code <pre>} and {@code <code>} tags in your source with
 *    {@code class=prettyprint.}
 *    You can also use the (html deprecated) {@code <xmp>} tag, but the pretty
 *    printer needs to do more substantial DOM manipulations to support that, so
 *    some css styles may not be preserved.
 * </ol>
 * That's it.  I wanted to keep the API as simple as possible, so there's no
 * need to specify which language the code is in, but if you wish, you can add
 * another class to the {@code <pre>} or {@code <code>} element to specify the
 * language, as in {@code <pre class="prettyprint lang-java">}.  Any class that
 * starts with "lang-" followed by a file extension, specifies the file type.
 * See the "lang-*.js" files in this directory for code that implements
 * per-language file handlers.
 * <p>
 * Change log:<br>
 * cbeust, 2006/08/22
 * <blockquote>
 *   Java annotations (start with "@") are now captured as literals ("lit")
 * </blockquote>
 * @requires console
 */

// JSLint declarations
/*global console, document, navigator, setTimeout, window, define */

var DecorationsT;

var JobT;

var SourceSpansT;

/** @define {boolean} */
var IN_GLOBAL_SCOPE = true;


var PR;

/**
 * Split {@code prettyPrint} into multiple timeouts so as not to interfere with
 * UI events.
 * If set to {@code false}, {@code prettyPrint()} is synchronous.
 */
var PR_SHOULD_USE_CONTINUATION = true;
if (typeof window !== 'undefined') {
  window['PR_SHOULD_USE_CONTINUATION'] = PR_SHOULD_USE_CONTINUATION;
}

var prettyPrintOne;

var prettyPrint;


var win: any = (typeof window !== 'undefined') ? window : {};
// Keyword lists for various languages.
// We use things that coerce to strings to make them compact when minified
// and to defeat aggressive optimizers that fold large string constants.
var FLOW_CONTROL_KEYWORDS = ["break,continue,do,else,for,if,return,while"];

var C_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "auto,case,char,const,default," +
  "double,enum,extern,float,goto,inline,int,long,register,restrict,short,signed," +
  "sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"];
var COMMON_KEYWORDS = [C_KEYWORDS, "catch,class,delete,false,import," +
  "new,operator,private,protected,public,this,throw,true,try,typeof"];
var CPP_KEYWORDS = [COMMON_KEYWORDS, "alignas,alignof,align_union,asm,axiom,bool," +
  "concept,concept_map,const_cast,constexpr,decltype,delegate," +
  "dynamic_cast,explicit,export,friend,generic,late_check," +
  "mutable,namespace,noexcept,noreturn,nullptr,property,reinterpret_cast,static_assert," +
  "static_cast,template,typeid,typename,using,virtual,where"];
var JAVA_KEYWORDS = [COMMON_KEYWORDS,
  "abstract,assert,boolean,byte,extends,finally,final,implements,import," +
  "instanceof,interface,null,native,package,strictfp,super,synchronized," +
  "throws,transient"];
var CSHARP_KEYWORDS = [COMMON_KEYWORDS,
  "abstract,add,alias,as,ascending,async,await,base,bool,by,byte,checked,decimal,delegate,descending," +
  "dynamic,event,finally,fixed,foreach,from,get,global,group,implicit,in,interface," +
  "internal,into,is,join,let,lock,null,object,out,override,orderby,params," +
  "partial,readonly,ref,remove,sbyte,sealed,select,set,stackalloc,string,select,uint,ulong," +
  "unchecked,unsafe,ushort,value,var,virtual,where,yield"];
var COFFEE_KEYWORDS = "all,and,by,catch,class,else,extends,false,finally," +
  "for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then," +
  "throw,true,try,unless,until,when,while,yes";
var JSCRIPT_KEYWORDS = [COMMON_KEYWORDS,
  "abstract,async,await,constructor,debugger,enum,eval,export,from,function," +
  "get,import,implements,instanceof,interface,let,null,of,set,undefined," +
  "var,with,yield,Infinity,NaN"];
var PERL_KEYWORDS = "caller,delete,die,do,dump,elsif,eval,exit,foreach,for," +
  "goto,if,import,last,local,my,next,no,our,print,package,redo,require," +
  "sub,undef,unless,until,use,wantarray,while,BEGIN,END";
var PYTHON_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "and,as,assert,class,def,del," +
  "elif,except,exec,finally,from,global,import,in,is,lambda," +
  "nonlocal,not,or,pass,print,raise,try,with,yield," +
  "False,True,None"];
var RUBY_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "alias,and,begin,case,class," +
  "def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo," +
  "rescue,retry,self,super,then,true,undef,unless,until,when,yield," +
  "BEGIN,END"];
var SH_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "case,done,elif,esac,eval,fi," +
  "function,in,local,set,then,until"];
var ALL_KEYWORDS = [
  CPP_KEYWORDS, CSHARP_KEYWORDS, JAVA_KEYWORDS, JSCRIPT_KEYWORDS,
  PERL_KEYWORDS, PYTHON_KEYWORDS, RUBY_KEYWORDS, SH_KEYWORDS];
var C_TYPES = /^(DIR|FILE|array|vector|(de|priority_)?queue|(forward_)?list|stack|(const_)?(reverse_)?iterator|(unordered_)?(multi)?(set|map)|bitset|u?(int|float)\d*)\b/;

// token style names.  correspond to css classes
/**
 * token style for a string literal
 * @const
 */
var PR_STRING = 'str';
/**
 * token style for a keyword
 * @const
 */
var PR_KEYWORD = 'kwd';
/**
 * token style for a comment
 * @const
 */
var PR_COMMENT = 'com';
/**
 * token style for a type
 * @const
 */
var PR_TYPE = 'typ';
/**
 * token style for a literal value.  e.g. 1, null, true.
 * @const
 */
var PR_LITERAL = 'lit';
/**
 * token style for a punctuation string.
 * @const
 */
var PR_PUNCTUATION = 'pun';
/**
 * token style for plain text.
 * @const
 */
var PR_PLAIN = 'pln';

/**
 * token style for an sgml tag.
 * @const
 */
var PR_TAG = 'tag';
/**
 * token style for a markup declaration such as a DOCTYPE.
 * @const
 */
var PR_DECLARATION = 'dec';
/**
 * token style for embedded source.
 * @const
 */
var PR_SOURCE = 'src';
/**
 * token style for an sgml attribute name.
 * @const
 */
var PR_ATTRIB_NAME = 'atn';
/**
 * token style for an sgml attribute value.
 * @const
 */
var PR_ATTRIB_VALUE = 'atv';

/**
 * A class that indicates a section of markup that is not code, e.g. to allow
 * embedding of line numbers within code listings.
 * @const
 */
var PR_NOCODE = 'nocode';


var REGEXP_PRECEDER_PATTERN = '(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*';


function combinePrefixPatterns(regexs) {
  var capturedGroupIndex = 0;

  var needToFoldCase = false;
  var ignoreCase = false;
  for (var i = 0, n = regexs.length; i < n; ++i) {
    var regex = regexs[i];
    if (regex.ignoreCase) {
      ignoreCase = true;
    } else if (/[a-z]/i.test(regex.source.replace(
      /\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi, ''))) {
      needToFoldCase = true;
      ignoreCase = false;
      break;
    }
  }

  var escapeCharToCodeUnit = {
    'b': 8,
    't': 9,
    'n': 0xa,
    'v': 0xb,
    'f': 0xc,
    'r': 0xd
  };

  function decodeEscape(charsetPart) {
    var cc0 = charsetPart.charCodeAt(0);
    if (cc0 !== 92 /* \\ */) {
      return cc0;
    }
    var c1 = charsetPart.charAt(1);
    cc0 = escapeCharToCodeUnit[c1];
    if (cc0) {
      return cc0;
    } else if ('0' <= c1 && c1 <= '7') {
      return parseInt(charsetPart.substring(1), 8);
    } else if (c1 === 'u' || c1 === 'x') {
      return parseInt(charsetPart.substring(2), 16);
    } else {
      return charsetPart.charCodeAt(1);
    }
  };

  function encodeEscape(charCode) {
    if (charCode < 0x20) {
      return (charCode < 0x10 ? '\\x0' : '\\x') + charCode.toString(16);
    }
    var ch = String.fromCharCode(charCode);
    return (ch === '\\' || ch === '-' || ch === ']' || ch === '^')
      ? "\\" + ch : ch;
  };

  function caseFoldCharset(charSet) {
    var charsetParts = charSet.substring(1, charSet.length - 1).match(
      new RegExp(
        '\\\\u[0-9A-Fa-f]{4}'
        + '|\\\\x[0-9A-Fa-f]{2}'
        + '|\\\\[0-3][0-7]{0,2}'
        + '|\\\\[0-7]{1,2}'
        + '|\\\\[\\s\\S]'
        + '|-'
        + '|[^-\\\\]',
        'g'));
    var ranges = [];
    var inverse = charsetParts[0] === '^';

    var out = ['['];
    if (inverse) { out.push('^'); }

    for (var i = inverse ? 1 : 0, n = charsetParts.length; i < n; ++i) {
      var p = charsetParts[i];
      if (/\\[bdsw]/i.test(p)) {  // Don't muck with named groups.
        out.push(p);
      } else {
        var start = decodeEscape(p);
        var end;
        if (i + 2 < n && '-' === charsetParts[i + 1]) {
          end = decodeEscape(charsetParts[i + 2]);
          i += 2;
        } else {
          end = start;
        }
        ranges.push([start, end]);
        // If the range might intersect letters, then expand it.
        // This case handling is too simplistic.
        // It does not deal with non-latin case folding.
        // It works for latin source code identifiers though.
        if (!(end < 65 || start > 122)) {
          if (!(end < 65 || start > 90)) {
            ranges.push([Math.max(65, start) | 32, Math.min(end, 90) | 32]);
          }
          if (!(end < 97 || start > 122)) {
            ranges.push([Math.max(97, start) & ~32, Math.min(end, 122) & ~32]);
          }
        }
      }
    }

    // [[1, 10], [3, 4], [8, 12], [14, 14], [16, 16], [17, 17]]
    // -> [[1, 12], [14, 14], [16, 17]]
    ranges.sort(function (a, b) { return (a[0] - b[0]) || (b[1] - a[1]); });
    var consolidatedRanges = [];
    var lastRange = [];
    for (var i = 0; i < ranges.length; ++i) {
      var range = ranges[i];
      if (range[0] <= lastRange[1] + 1) {
        lastRange[1] = Math.max(lastRange[1], range[1]);
      } else {
        consolidatedRanges.push(lastRange = range);
      }
    }

    for (var i = 0; i < consolidatedRanges.length; ++i) {
      var range = consolidatedRanges[i];
      out.push(encodeEscape(range[0]));
      if (range[1] > range[0]) {
        if (range[1] + 1 > range[0]) { out.push('-'); }
        out.push(encodeEscape(range[1]));
      }
    }
    out.push(']');
    return out.join('');
  };

  function allowAnywhereFoldCaseAndRenumberGroups(regex) {
    // Split into character sets, escape sequences, punctuation strings
    // like ('(', '(?:', ')', '^'), and runs of characters that do not
    // include any of the above.
    var parts = regex.source.match(
      new RegExp(
        '(?:'
        + '\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]'  // a character set
        + '|\\\\u[A-Fa-f0-9]{4}'  // a unicode escape
        + '|\\\\x[A-Fa-f0-9]{2}'  // a hex escape
        + '|\\\\[0-9]+'  // a back-reference or octal escape
        + '|\\\\[^ux0-9]'  // other escape sequence
        + '|\\(\\?[:!=]'  // start of a non-capturing group
        + '|[\\(\\)\\^]'  // start/end of a group, or line start
        + '|[^\\x5B\\x5C\\(\\)\\^]+'  // run of other characters
        + ')',
        'g'));
    var n = parts.length;

    // Maps captured group numbers to the number they will occupy in
    // the output or to -1 if that has not been determined, or to
    // undefined if they need not be capturing in the output.
    var capturedGroups = [];

    // Walk over and identify back references to build the capturedGroups
    // mapping.
    for (var i = 0, groupIndex = 0; i < n; ++i) {
      var p = parts[i];
      if (p === '(') {
        // groups are 1-indexed, so max group index is count of '('
        ++groupIndex;
      } else if ('\\' === p.charAt(0)) {
        var decimalValue = +p.substring(1);
        if (decimalValue) {
          if (decimalValue <= groupIndex) {
            capturedGroups[decimalValue] = -1;
          } else {
            // Replace with an unambiguous escape sequence so that
            // an octal escape sequence does not turn into a backreference
            // to a capturing group from an earlier regex.
            parts[i] = encodeEscape(decimalValue);
          }
        }
      }
    }

    // Renumber groups and reduce capturing groups to non-capturing groups
    // where possible.
    for (var i = 1; i < capturedGroups.length; ++i) {
      if (-1 === capturedGroups[i]) {
        capturedGroups[i] = ++capturedGroupIndex;
      }
    }
    for (var i = 0, groupIndex = 0; i < n; ++i) {
      var p = parts[i];
      if (p === '(') {
        ++groupIndex;
        if (!capturedGroups[groupIndex]) {
          parts[i] = '(?:';
        }
      } else if ('\\' === p.charAt(0)) {
        var decimalValue = +p.substring(1);
        if (decimalValue && decimalValue <= groupIndex) {
          parts[i] = '\\' + capturedGroups[decimalValue];
        }
      }
    }

    // Remove any prefix anchors so that the output will match anywhere.
    // ^^ really does mean an anchored match though.
    for (var i = 0; i < n; ++i) {
      if ('^' === parts[i] && '^' !== parts[i + 1]) { parts[i] = ''; }
    }

    // Expand letters to groups to handle mixing of case-sensitive and
    // case-insensitive patterns if necessary.
    if (regex.ignoreCase && needToFoldCase) {
      for (var i = 0; i < n; ++i) {
        var p = parts[i];
        var ch0 = p.charAt(0);
        if (p.length >= 2 && ch0 === '[') {
          parts[i] = caseFoldCharset(p);
        } else if (ch0 !== '\\') {
          // TODO: handle letters in numeric escapes.
          parts[i] = p.replace(
            /[a-zA-Z]/g,
            function (ch) {
              var cc = ch.charCodeAt(0);
              return '[' + String.fromCharCode(cc & ~32, cc | 32) + ']';
            });
        }
      }
    }

    return parts.join('');
  };

  var rewritten = [];
  for (var i = 0, n = regexs.length; i < n; ++i) {
    var regex = regexs[i];
    if (regex.global || regex.multiline) { throw new Error('' + regex); }
    rewritten.push(
      '(?:' + allowAnywhereFoldCaseAndRenumberGroups(regex) + ')');
  }

  return new RegExp(rewritten.join('|'), ignoreCase ? 'gi' : 'g');
};


function extractSourceSpans(node, isPreformatted) {
  var nocode = /(?:^|\s)nocode(?:\s|$)/;

  var chunks = [];
  var length = 0;
  var spans = [];
  var k = 0;

  function walk(node) {
    var type = node.nodeType;
    if (type == 1) {  // Element
      if (nocode.test(node.className)) { return; }
      for (var child = node.firstChild; child; child = child.nextSibling) {
        walk(child);
      }
      var nodeName = node.nodeName.toLowerCase();
      if ('br' === nodeName || 'li' === nodeName) {
        chunks[k] = '\n';
        spans[k << 1] = length++;
        spans[(k++ << 1) | 1] = node;
      }
    } else if (type == 3 || type == 4) {  // Text
      var text = node.nodeValue;
      if (text.length) {
        if (!isPreformatted) {
          text = text.replace(/[ \t\r\n]+/g, ' ');
        } else {
          text = text.replace(/\r\n?/g, '\n');  // Normalize newlines.
        }
        // TODO: handle tabs here?
        chunks[k] = text;
        spans[k << 1] = length;
        length += text.length;
        spans[(k++ << 1) | 1] = node;
      }
    }
  };

  walk(node);

  return {
    sourceCode: chunks.join('').replace(/\n$/, ''),
    spans: spans
  };
};

function appendDecorations(
  sourceNode, basePos, sourceCode, langHandler, out) {
  if (!sourceCode) { return; }

  var job = {
    sourceNode: sourceNode,
    pre: 1,
    langExtension: null,
    numberLines: null,
    sourceCode: sourceCode,
    spans: null,
    basePos: basePos,
    decorations: null
  };
  langHandler(job);
  out.push.apply(out, job.decorations);
};

var notWs = /\S/;

/**
 * Given an element, if it contains only one child element and any text nodes
 * it contains contain only space characters, return the sole child element.
 * Otherwise returns undefined.
 * <p>
 * This is meant to return the CODE element in {@code <pre><code ...>} when
 * there is a single child element that contains all the non-space textual
 * content, but not to return anything where there are multiple child elements
 * as in {@code <pre><code>...</code><code>...</code></pre>} or when there
 * is textual content.
 */
function childContentWrapper(element) {
  var wrapper = undefined;
  for (var c = element.firstChild; c; c = c.nextSibling) {
    var type = c.nodeType;
    wrapper = (type === 1)  // Element Node
      ? (wrapper ? element : c)
      : (type === 3)  // Text Node
        ? (notWs.test(c.nodeValue) ? element : wrapper)
        : wrapper;
  }
  return wrapper === element ? undefined : wrapper;
};

function createSimpleLexer(shortcutStylePatterns, fallthroughStylePatterns) {
  var shortcuts = {};
  var tokenizer;
  (function () {
    var allPatterns = shortcutStylePatterns.concat(fallthroughStylePatterns);
    var allRegexs = [];
    var regexKeys = {};
    for (var i = 0, n = allPatterns.length; i < n; ++i) {
      var patternParts = allPatterns[i];
      var shortcutChars = patternParts[3];
      if (shortcutChars) {
        for (var c = shortcutChars.length; --c >= 0;) {
          shortcuts[shortcutChars.charAt(c)] = patternParts;
        }
      }
      var regex = patternParts[1];
      var k = '' + regex;
      if (!regexKeys.hasOwnProperty(k)) {
        allRegexs.push(regex);
        regexKeys[k] = null;
      }
    }
    allRegexs.push(/[\0-\uffff]/);
    tokenizer = combinePrefixPatterns(allRegexs);
  })();

  var nPatterns = fallthroughStylePatterns.length;

  var decorate = function (job) {
    var sourceCode = job.sourceCode, basePos = job.basePos;
    var sourceNode = job.sourceNode;

    var decorations = [basePos, PR_PLAIN];
    var pos = 0;  // index into sourceCode
    var tokens = sourceCode.match(tokenizer) || [];
    var styleCache = {};

    for (var ti = 0, nTokens = tokens.length; ti < nTokens; ++ti) {
      var token = tokens[ti];
      var style = styleCache[token];
      var match = void 0;

      var isEmbedded;
      if (typeof style === 'string') {
        isEmbedded = false;
      } else {
        var patternParts = shortcuts[token.charAt(0)];
        if (patternParts) {
          match = token.match(patternParts[1]);
          style = patternParts[0];
        } else {
          for (var i = 0; i < nPatterns; ++i) {
            patternParts = fallthroughStylePatterns[i];
            match = token.match(patternParts[1]);
            if (match) {
              style = patternParts[0];
              break;
            }
          }

          if (!match) {  // make sure that we make progress
            style = PR_PLAIN;
          }
        }

        isEmbedded = style.length >= 5 && 'lang-' === style.substring(0, 5);
        if (isEmbedded && !(match && typeof match[1] === 'string')) {
          isEmbedded = false;
          style = PR_SOURCE;
        }

        if (!isEmbedded) { styleCache[token] = style; }
      }

      var tokenStart = pos;
      pos += token.length;

      if (!isEmbedded) {
        decorations.push(basePos + tokenStart, style);
      } else {  // Treat group 1 as an embedded block of source code.
        var embeddedSource = match[1];
        var embeddedSourceStart = token.indexOf(embeddedSource);
        var embeddedSourceEnd = embeddedSourceStart + embeddedSource.length;
        if (match[2]) {
          // If embeddedSource can be blank, then it would match at the
          // beginning which would cause us to infinitely recurse on the
          // entire token, so we catch the right context in match[2].
          embeddedSourceEnd = token.length - match[2].length;
          embeddedSourceStart = embeddedSourceEnd - embeddedSource.length;
        }
        var lang = style.substring(5);
        // Decorate the left of the embedded source
        appendDecorations(
          sourceNode,
          basePos + tokenStart,
          token.substring(0, embeddedSourceStart),
          decorate, decorations);
        // Decorate the embedded source
        appendDecorations(
          sourceNode,
          basePos + tokenStart + embeddedSourceStart,
          embeddedSource,
          langHandlerForExtension(lang, embeddedSource),
          decorations);
        // Decorate the right of the embedded section
        appendDecorations(
          sourceNode,
          basePos + tokenStart + embeddedSourceEnd,
          token.substring(embeddedSourceEnd),
          decorate, decorations);
      }
    }
    job.decorations = decorations;
  };
  return decorate;
};

function sourceDecorator(options) {
  var shortcutStylePatterns = [], fallthroughStylePatterns = [];
  if (options['tripleQuotedStrings']) {
    // '''multi-line-string''', 'single-line-string', and double-quoted
    shortcutStylePatterns.push(
      [PR_STRING, /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,
        null, '\'"']);
  } else if (options['multiLineStrings']) {
    // 'multi-line-string', "multi-line-string"
    shortcutStylePatterns.push(
      [PR_STRING, /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,
        null, '\'"`']);
  } else {
    // 'single-line-string', "single-line-string"
    shortcutStylePatterns.push(
      [PR_STRING,
        /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,
        null, '"\'']);
  }
  if (options['verbatimStrings']) {
    // verbatim-string-literal production from the C# grammar.  See issue 93.
    fallthroughStylePatterns.push(
      [PR_STRING, /^@\"(?:[^\"]|\"\")*(?:\"|$)/, null]);
  }
  var hc = options['hashComments'];
  if (hc) {
    if (options['cStyleComments']) {
      if (hc > 1) {  // multiline hash comments
        shortcutStylePatterns.push(
          [PR_COMMENT, /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, null, '#']);
      } else {
        // Stop C preprocessor declarations at an unclosed open comment
        shortcutStylePatterns.push(
          [PR_COMMENT, /^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/,
            null, '#']);
      }
      // #include <stdio.h>
      fallthroughStylePatterns.push(
        [PR_STRING,
          /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,
          null]);
    } else {
      shortcutStylePatterns.push([PR_COMMENT, /^#[^\r\n]*/, null, '#']);
    }
  }
  if (options['cStyleComments']) {
    fallthroughStylePatterns.push([PR_COMMENT, /^\/\/[^\r\n]*/, null]);
    fallthroughStylePatterns.push(
      [PR_COMMENT, /^\/\*[\s\S]*?(?:\*\/|$)/, null]);
  }
  var regexLiterals = options['regexLiterals'];
  if (regexLiterals) {
    /**
     * @const
     */
    var regexExcls = regexLiterals > 1
      ? ''  // Multiline regex literals
      : '\n\r';
    /**
     * @const
     */
    var regexAny = regexExcls ? '.' : '[\\S\\s]';
    /**
     * @const
     */
    var REGEX_LITERAL = (
      // A regular expression literal starts with a slash that is
      // not followed by * or / so that it is not confused with
      // comments.
      '/(?=[^/*' + regexExcls + '])'
      // and then contains any number of raw characters,
      + '(?:[^/\\x5B\\x5C' + regexExcls + ']'
      // escape sequences (\x5C),
      + '|\\x5C' + regexAny
      // or non-nesting character sets (\x5B\x5D);
      + '|\\x5B(?:[^\\x5C\\x5D' + regexExcls + ']'
      + '|\\x5C' + regexAny + ')*(?:\\x5D|$))+'
      // finally closed by a /.
      + '/');
    fallthroughStylePatterns.push(
      ['lang-regex',
        RegExp('^' + REGEXP_PRECEDER_PATTERN + '(' + REGEX_LITERAL + ')')
      ]);
  }

  var types = options['types'];
  if (types) {
    fallthroughStylePatterns.push([PR_TYPE, types]);
  }

  var keywords = ("" + options['keywords']).replace(/^ | $/g, '');
  if (keywords.length) {
    fallthroughStylePatterns.push(
      [PR_KEYWORD,
        new RegExp('^(?:' + keywords.replace(/[\s,]+/g, '|') + ')\\b'),
        null]);
  }

  shortcutStylePatterns.push([PR_PLAIN, /^\s+/, null, ' \r\n\t\xA0']);

  var punctuation =
    // The Bash man page says

    // A word is a sequence of characters considered as a single
    // unit by GRUB. Words are separated by metacharacters,
    // which are the following plus space, tab, and newline: { }
    // | & $ ; < >
    // ...

    // A word beginning with # causes that word and all remaining
    // characters on that line to be ignored.

    // which means that only a '#' after /(?:^|[{}|&$;<>\s])/ starts a
    // comment but empirically
    // $ echo {#}
    // {#}
    // $ echo \$#
    // $#
    // $ echo }#
    // }#

    // so /(?:^|[|&;<>\s])/ is more appropriate.

    // http://gcc.gnu.org/onlinedocs/gcc-2.95.3/cpp_1.html#SEC3
    // suggests that this definition is compatible with a
    // default mode that tries to use a single token definition
    // to recognize both bash/python style comments and C
    // preprocessor directives.

    // This definition of punctuation does not include # in the list of
    // follow-on exclusions, so # will not be broken before if preceeded
    // by a punctuation character.  We could try to exclude # after
    // [|&;<>] but that doesn't seem to cause many major problems.
    // If that does turn out to be a problem, we should change the below
    // when hc is truthy to include # in the run of punctuation characters
    // only when not followint [|&;<>].
    '^.[^\\s\\w.$@\'"`/\\\\]*';
  if (options['regexLiterals']) {
    punctuation += '(?!\s*\/)';
  }

  fallthroughStylePatterns.push(
    // TODO(mikesamuel): recognize non-latin letters and numerals in idents
    [PR_LITERAL, /^@[a-z_$][a-z_$@0-9]*/i, null],
    [PR_TYPE, /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/, null],
    [PR_PLAIN, /^[a-z_$][a-z_$@0-9]*/i, null],
    [PR_LITERAL,
      new RegExp(
        '^(?:'
        // A hex number
        + '0x[a-f0-9]+'
        // or an octal or decimal number,
        + '|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)'
        // possibly in scientific notation
        + '(?:e[+\\-]?\\d+)?'
        + ')'
        // with an optional modifier like UL for unsigned long
        + '[a-z]*', 'i'),
      null, '0123456789'],
    // Don't treat escaped quotes in bash as starting strings.
    // See issue 144.
    [PR_PLAIN, /^\\[\s\S]?/, null],
    [PR_PUNCTUATION, new RegExp(punctuation), null]);

  return createSimpleLexer(shortcutStylePatterns, fallthroughStylePatterns);
};

var decorateSource = sourceDecorator({
  'keywords': ALL_KEYWORDS,
  'hashComments': true,
  'cStyleComments': true,
  'multiLineStrings': true,
  'regexLiterals': true
});

function numberLines(node, startLineNum, isPreformatted) {
  var nocode = /(?:^|\s)nocode(?:\s|$)/;
  var lineBreak = /\r\n?|\n/;

  var document = node.ownerDocument;

  var li = document.createElement('li');
  while (node.firstChild) {
    li.appendChild(node.firstChild);
  }
  // An array of lines.  We split below, so this is initialized to one
  // un-split line.
  var listItems = [li];

  function walk(node) {
    var type = node.nodeType;
    if (type == 1 && !nocode.test(node.className)) {  // Element
      if ('br' === node.nodeName.toLowerCase()) {
        breakAfter(node);
        // Discard the <BR> since it is now flush against a </LI>.
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      } else {
        for (var child = node.firstChild; child; child = child.nextSibling) {
          walk(child);
        }
      }
    } else if ((type == 3 || type == 4) && isPreformatted) {  // Text
      var text = node.nodeValue;
      var match = text.match(lineBreak);
      if (match) {
        var firstLine = text.substring(0, match.index);
        node.nodeValue = firstLine;
        var tail = text.substring(match.index + match[0].length);
        if (tail) {
          var parent = node.parentNode;
          parent.insertBefore(
            document.createTextNode(tail), node.nextSibling);
        }
        breakAfter(node);
        if (!firstLine) {
          // Don't leave blank text nodes in the DOM.
          node.parentNode.removeChild(node);
        }
      }
    }
  };

  // Split a line after the given node.
  function breakAfter(lineEndNode) {
    // If there's nothing to the right, then we can skip ending the line
    // here, and move root-wards since splitting just before an end-tag
    // would require us to create a bunch of empty copies.
    while (!lineEndNode.nextSibling) {
      lineEndNode = lineEndNode.parentNode;
      if (!lineEndNode) { return; }
    }

    function breakLeftOf(limit, copy) {
      // Clone shallowly if this node needs to be on both sides of the break.
      var rightSide = copy ? limit.cloneNode(false) : limit;
      var parent = limit.parentNode;
      if (parent) {
        // We clone the parent chain.
        // This helps us resurrect important styling elements that cross lines.
        // E.g. in <i>Foo<br>Bar</i>
        // should be rewritten to <li><i>Foo</i></li><li><i>Bar</i></li>.
        var parentClone = breakLeftOf(parent, 1);
        // Move the clone and everything to the right of the original
        // onto the cloned parent.
        var next = limit.nextSibling;
        parentClone.appendChild(rightSide);
        for (var sibling = next; sibling; sibling = next) {
          next = sibling.nextSibling;
          parentClone.appendChild(sibling);
        }
      }
      return rightSide;
    };

    var copiedListItem = breakLeftOf(lineEndNode.nextSibling, 0);

    // Walk the parent chain until we reach an unattached LI.
    for (var parent;
      // Check nodeType since IE invents document fragments.
      (parent = copiedListItem.parentNode) && parent.nodeType === 1;) {
      copiedListItem = parent;
    }
    // Put it on the list of lines for later processing.
    listItems.push(copiedListItem);
  };

  // Split lines while there are lines left to split.
  for (var i = 0;  // Number of lines that have been split so far.
    i < listItems.length;  // length updated by breakAfter calls.
    ++i) {
    walk(listItems[i]);
  }

  // Make sure numeric indices show correctly.
  if (startLineNum === (startLineNum | 0)) {
    listItems[0].setAttribute('value', startLineNum);
  }

  var ol = document.createElement('ol');
  ol.className = 'linenums';
  var offset = Math.max(0, ((startLineNum - 1 /* zero index */)) | 0) || 0;
  for (var i = 0, n = listItems.length; i < n; ++i) {
    li = listItems[i];
    // Stick a class on the LIs so that stylesheets can
    // color odd/even rows, or any other row pattern that
    // is co-prime with 10.
    li.className = 'L' + ((i + offset) % 10);
    if (!li.firstChild) {
      li.appendChild(document.createTextNode('\xA0'));
    }
    ol.appendChild(li);
  }

  node.appendChild(ol);
};


function recombineTagsAndDecorations(job) {
  var isIE8OrEarlier: any = /\bMSIE\s(\d+)/.exec(navigator.userAgent);
  isIE8OrEarlier = isIE8OrEarlier && +isIE8OrEarlier[1] <= 8;
  var newlineRe = /\n/g;

  var source = job.sourceCode;
  var sourceLength = source.length;
  // Index into source after the last code-unit recombined.
  var sourceIndex = 0;

  var spans = job.spans;
  var nSpans = spans.length;
  // Index into spans after the last span which ends at or before sourceIndex.
  var spanIndex = 0;

  var decorations = job.decorations;
  var nDecorations = decorations.length;
  // Index into decorations after the last decoration which ends at or before
  // sourceIndex.
  var decorationIndex = 0;

  // Remove all zero-length decorations.
  decorations[nDecorations] = sourceLength;
  var decPos, i;
  for (i = decPos = 0; i < nDecorations;) {
    if (decorations[i] !== decorations[i + 2]) {
      decorations[decPos++] = decorations[i++];
      decorations[decPos++] = decorations[i++];
    } else {
      i += 2;
    }
  }
  nDecorations = decPos;

  // Simplify decorations.
  for (i = decPos = 0; i < nDecorations;) {
    var startPos = decorations[i];
    // Conflate all adjacent decorations that use the same style.
    var startDec = decorations[i + 1];
    var end = i + 2;
    while (end + 2 <= nDecorations && decorations[end + 1] === startDec) {
      end += 2;
    }
    decorations[decPos++] = startPos;
    decorations[decPos++] = startDec;
    i = end;
  }

  nDecorations = decorations.length = decPos;

  var sourceNode = job.sourceNode;
  var oldDisplay = "";
  if (sourceNode) {
    oldDisplay = sourceNode.style.display;
    sourceNode.style.display = 'none';
  }
  try {
    var decoration = null;
    while (spanIndex < nSpans) {
      var spanStart = spans[spanIndex];
      var spanEnd = (spans[spanIndex + 2])
        || sourceLength;

      var decEnd = decorations[decorationIndex + 2] || sourceLength;

      var end: any = Math.min(spanEnd, decEnd);

      var textNode = (spans[spanIndex + 1]);
      var styledText;
      if (textNode.nodeType !== 1  // Don't muck with <BR>s or <LI>s
        // Don't introduce spans around empty text nodes.
        && (styledText = source.substring(sourceIndex, end))) {
        // This may seem bizarre, and it is.  Emitting LF on IE causes the
        // code to display with spaces instead of line breaks.
        // Emitting Windows standard issue linebreaks (CRLF) causes a blank
        // space to appear at the beginning of every line but the first.
        // Emitting an old Mac OS 9 line separator makes everything spiffy.
        if (isIE8OrEarlier) {
          styledText = styledText.replace(newlineRe, '\r');
        }
        textNode.nodeValue = styledText;
        var document = textNode.ownerDocument;
        var span = document.createElement('span');
        span.className = decorations[decorationIndex + 1];
        var parentNode = textNode.parentNode;
        parentNode.replaceChild(span, textNode);
        span.appendChild(textNode);
        if (sourceIndex < spanEnd) {  // Split off a text node.
          spans[spanIndex + 1] = textNode
            // TODO: Possibly optimize by using '' if there's no flicker.
            = document.createTextNode(source.substring(end, spanEnd));
          parentNode.insertBefore(textNode, span.nextSibling);
        }
      }

      sourceIndex = end;

      if (sourceIndex >= spanEnd) {
        spanIndex += 2;
      }
      if (sourceIndex >= decEnd) {
        decorationIndex += 2;
      }
    }
  } finally {
    if (sourceNode) {
      sourceNode.style.display = oldDisplay;
    }
  }
};


/** Maps language-specific file extensions to handlers. */
var langHandlerRegistry = {};

function registerLangHandler(handler, fileExtensions) {
  for (var i = fileExtensions.length; --i >= 0;) {
    var ext = fileExtensions[i];
    if (!langHandlerRegistry.hasOwnProperty(ext)) {
      langHandlerRegistry[ext] = handler;
    } else if (win['console']) {
      console['warn']('cannot override language handler %s', ext);
    }
  }
};
function langHandlerForExtension(extension, source) {
  if (!(extension && langHandlerRegistry.hasOwnProperty(extension))) {
    registerLangHandler(decorateSource, ['default-code']);
    registerLangHandler(
      createSimpleLexer(
        [],
        [
          [PR_PLAIN, /^[^<?]+/],
          [PR_DECLARATION, /^<!\w[^>]*(?:>|$)/],
          [PR_COMMENT, /^<\!--[\s\S]*?(?:-\->|$)/],
          // Unescaped content in an unknown language
          ['lang-', /^<\?([\s\S]+?)(?:\?>|$)/],
          ['lang-', /^<%([\s\S]+?)(?:%>|$)/],
          [PR_PUNCTUATION, /^(?:<[%?]|[%?]>)/],
          ['lang-', /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],
          // Unescaped content in javascript.  (Or possibly vbscript).
          ['lang-js', /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],
          // Contains unescaped stylesheet content
          ['lang-css', /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],
          ['lang-in.tag', /^(<\/?[a-z][^<>]*>)/i]
        ]),
      ['default-markup', 'htm', 'html', 'mxml', 'xhtml', 'xml', 'xsl']);
    registerLangHandler(
      createSimpleLexer(
        [
          [PR_PLAIN, /^[\s]+/, null, ' \t\r\n'],
          [PR_ATTRIB_VALUE, /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, '\"\'']
        ],
        [
          [PR_TAG, /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],
          [PR_ATTRIB_NAME, /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
          ['lang-uq.val', /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],
          [PR_PUNCTUATION, /^[=<>\/]+/],
          ['lang-js', /^on\w+\s*=\s*\"([^\"]+)\"/i],
          ['lang-js', /^on\w+\s*=\s*\'([^\']+)\'/i],
          ['lang-js', /^on\w+\s*=\s*([^\"\'>\s]+)/i],
          ['lang-css', /^style\s*=\s*\"([^\"]+)\"/i],
          ['lang-css', /^style\s*=\s*\'([^\']+)\'/i],
          ['lang-css', /^style\s*=\s*([^\"\'>\s]+)/i]
        ]),
      ['in.tag']);
    registerLangHandler(
      createSimpleLexer([], [[PR_ATTRIB_VALUE, /^[\s\S]+/]]), ['uq.val']);
    registerLangHandler(sourceDecorator({
      'keywords': CPP_KEYWORDS,
      'hashComments': true,
      'cStyleComments': true,
      'types': C_TYPES
    }), ['c', 'cc', 'cpp', 'cxx', 'cyc', 'm']);
    registerLangHandler(sourceDecorator({
      'keywords': 'null,true,false'
    }), ['json']);
    registerLangHandler(sourceDecorator({
      'keywords': CSHARP_KEYWORDS,
      'hashComments': true,
      'cStyleComments': true,
      'verbatimStrings': true,
      'types': C_TYPES
    }), ['cs']);
    registerLangHandler(sourceDecorator({
      'keywords': JAVA_KEYWORDS,
      'cStyleComments': true
    }), ['java']);
    registerLangHandler(sourceDecorator({
      'keywords': SH_KEYWORDS,
      'hashComments': true,
      'multiLineStrings': true
    }), ['bash', 'bsh', 'csh', 'sh']);
    registerLangHandler(sourceDecorator({
      'keywords': PYTHON_KEYWORDS,
      'hashComments': true,
      'multiLineStrings': true,
      'tripleQuotedStrings': true
    }), ['cv', 'py', 'python']);
    registerLangHandler(sourceDecorator({
      'keywords': PERL_KEYWORDS,
      'hashComments': true,
      'multiLineStrings': true,
      'regexLiterals': 2  // multiline regex literals
    }), ['perl', 'pl', 'pm']);
    registerLangHandler(sourceDecorator({
      'keywords': RUBY_KEYWORDS,
      'hashComments': true,
      'multiLineStrings': true,
      'regexLiterals': true
    }), ['rb', 'ruby']);
    registerLangHandler(sourceDecorator({
      'keywords': JSCRIPT_KEYWORDS,
      'cStyleComments': true,
      'regexLiterals': true
    }), ['javascript', 'js', 'ts', 'typescript']);
    registerLangHandler(sourceDecorator({
      'keywords': COFFEE_KEYWORDS,
      'hashComments': 3,  // ### style block comments
      'cStyleComments': true,
      'multilineStrings': true,
      'tripleQuotedStrings': true,
      'regexLiterals': true
    }), ['coffee']);
    registerLangHandler(
      createSimpleLexer([], [[PR_STRING, /^[\s\S]+/]]), ['regex']);
  }
  if (!(extension && langHandlerRegistry.hasOwnProperty(extension))) {
    // Treat it as markup if the first non whitespace character is a < and
    // the last non-whitespace character is a >.
    extension = (/^\s*</).test(source)
      ? 'default-markup'
      : 'default-code';
  }
  return langHandlerRegistry[extension];
};


function applyDecorator(job) {
  var opt_langExtension = job.langExtension;

  try {
    // Extract tags, and convert the source code to plain text.
    var sourceAndSpans = extractSourceSpans(job.sourceNode, job.pre);

    var source = sourceAndSpans.sourceCode;
    job.sourceCode = source;
    job.spans = sourceAndSpans.spans;
    job.basePos = 0;

    // Apply the appropriate language handler
    langHandlerForExtension(opt_langExtension, source)(job);
    // Integrate the decorations and tags back into the source code,
    // modifying the sourceNode in place.
    recombineTagsAndDecorations(job);
  } catch (e) {
    if (win['console']) {
      console['log'](e && e['stack'] || e);
    }
  }
}

export function $prettyPrintOne(sourceCodeHtml, opt_langExtension, opt_numberLines) {

  var nl = opt_numberLines || false;

  var langExtension = opt_langExtension || null;

  var container: any = document.createElement('div');
  // This could cause images to load and onload listeners to fire.
  // E.g. <img onerror="alert(1337)" src="nosuchimage.png">.
  // We assume that the inner HTML is from a trusted source.
  // The pre-tag is required for IE8 which strips newlines from innerHTML
  // when it is injected into a <pre> tag.
  // http://stackoverflow.com/questions/451486/pre-tag-loses-line-breaks-when-setting-innerhtml-in-ie
  // http://stackoverflow.com/questions/195363/inserting-a-newline-into-a-pre-tag-ie-javascript
  container.innerHTML = '<pre>' + sourceCodeHtml + '</pre>';
  container = (container.firstChild);
  if (nl) {
    numberLines(container, nl, true);
  }

  var job = {
    langExtension: langExtension,
    numberLines: nl,
    sourceNode: container,
    pre: 1,
    sourceCode: null,
    basePos: null,
    spans: null,
    decorations: null
  };
  applyDecorator(job);
  return container.innerHTML;
};

function $prettyPrint(opt_whenDone, opt_root) {
  var root = opt_root || document.body;
  var doc = root.ownerDocument || document;
  function byTagName(tn) { return root.getElementsByTagName(tn); }
  // fetch a list of nodes to rewrite
  var codeSegments = [byTagName('pre'), byTagName('code'), byTagName('xmp')];
  var elements = [];
  for (var i = 0; i < codeSegments.length; ++i) {
    for (var j = 0, n = codeSegments[i].length; j < n; ++j) {
      elements.push(codeSegments[i][j]);
    }
  }
  codeSegments = null;

  var clock: any = Date;
  if (!clock['now']) {
    clock = { 'now': function () { return +(new Date); } };
  }

  // The loop is broken into a series of continuations to make sure that we
  // don't make the browser unresponsive when rewriting a large page.
  var k = 0;

  var langExtensionRe = /\blang(?:uage)?-([\w.]+)(?!\S)/;
  var prettyPrintRe = /\bprettyprint\b/;
  var prettyPrintedRe = /\bprettyprinted\b/;
  var preformattedTagNameRe = /pre|xmp/i;
  var codeRe = /^code$/i;
  var preCodeXmpRe = /^(?:pre|code|xmp)$/i;
  var EMPTY = {};

  function doWork() {
    var endTime = (win['PR_SHOULD_USE_CONTINUATION'] ?
      clock['now']() + 250 /* ms */ :
      Infinity);
    for (; k < elements.length && clock['now']() < endTime; k++) {
      var cs = elements[k];

      // Look for a preceding comment like
      // <?prettify lang="..." linenums="..."?>
      var attrs = EMPTY;
      {
        for (var preceder = cs; (preceder = preceder.previousSibling);) {
          var nt = preceder.nodeType;
          // <?foo?> is parsed by HTML 5 to a comment node (8)
          // like <!--?foo?-->, but in XML is a processing instruction
          var value = (nt === 7 || nt === 8) && preceder.nodeValue;
          if (value
            ? !/^\??prettify\b/.test(value)
            : (nt !== 3 || /\S/.test(preceder.nodeValue))) {
            // Skip over white-space text nodes but not others.
            break;
          }
          if (value) {
            attrs = {};
            value.replace(
              /\b(\w+)=([\w:.%+-]+)/g,
              function (_, name, value) { attrs[name] = value; });
            break;
          }
        }
      }

      var className = cs.className;
      if ((attrs !== EMPTY || prettyPrintRe.test(className))
        // Don't redo this if we've already done it.
        // This allows recalling pretty print to just prettyprint elements
        // that have been added to the page since last call.
        && !prettyPrintedRe.test(className)) {

        // make sure this is not nested in an already prettified element
        var nested = false;
        for (var p = cs.parentNode; p; p = p.parentNode) {
          var tn = p.tagName;
          if (preCodeXmpRe.test(tn)
            && p.className && prettyPrintRe.test(p.className)) {
            nested = true;
            break;
          }
        }
        if (!nested) {
          // Mark done.  If we fail to prettyprint for whatever reason,
          // we shouldn't try again.
          cs.className += ' prettyprinted';

          // If the classes includes a language extensions, use it.
          // Language extensions can be specified like
          //     <pre class="prettyprint lang-cpp">
          // the language extension "cpp" is used to find a language handler
          // as passed to PR.registerLangHandler.
          // HTML5 recommends that a language be specified using "language-"
          // as the prefix instead.  Google Code Prettify supports both.
          // http://dev.w3.org/html5/spec-author-view/the-code-element.html
          var langExtension = attrs['lang'];
          if (!langExtension) {
            langExtension = className.match(langExtensionRe);
            // Support <pre class="prettyprint"><code class="language-c">
            var wrapper;
            if (!langExtension && (wrapper = childContentWrapper(cs))
              && codeRe.test(wrapper.tagName)) {
              langExtension = wrapper.className.match(langExtensionRe);
            }

            if (langExtension) { langExtension = langExtension[1]; }
          }

          var preformatted;
          if (preformattedTagNameRe.test(cs.tagName)) {
            preformatted = 1;
          } else {
            var currentStyle = cs['currentStyle'];
            var defaultView = doc.defaultView;
            var whitespace = (
              currentStyle
                ? currentStyle['whiteSpace']
                : (defaultView
                  && defaultView.getComputedStyle)
                  ? defaultView.getComputedStyle(cs, null)
                    .getPropertyValue('white-space')
                  : 0);
            preformatted = whitespace
              && 'pre' === whitespace.substring(0, 3);
          }

          // Look for a class like linenums or linenums:<n> where <n> is the
          // 1-indexed number of the first line.
          var lineNums = attrs['linenums'];
          if (!(lineNums = lineNums === 'true' || +lineNums)) {
            lineNums = className.match(/\blinenums\b(?::(\d+))?/);
            lineNums =
              lineNums
                ? lineNums[1] && lineNums[1].length
                  ? +lineNums[1] : true
                : false;
          }
          if (lineNums) { numberLines(cs, lineNums, preformatted); }

          // do the pretty printing
          var prettyPrintingJob = {
            langExtension: langExtension,
            sourceNode: cs,
            numberLines: lineNums,
            pre: preformatted,
            sourceCode: null,
            basePos: null,
            spans: null,
            decorations: null
          };
          applyDecorator(prettyPrintingJob);
        }
      }
    }
    if (k < elements.length) {
      // finish up in a continuation
      win.setTimeout(doWork, 250);
    } else if ('function' === typeof opt_whenDone) {
      opt_whenDone();
    }
  };

  doWork();
};