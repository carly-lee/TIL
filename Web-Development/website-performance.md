# Website Performance Optimization

## Rendering process optimization

![Rendering on a broswer](https://github.com/carly-lee/TIL/raw/master/resouces/images/incremental-dom-and-recent-trend-of-frontend-development-5-638.jpg)
![Dynamic page via Javascript](https://github.com/carly-lee/TIL/raw/master/resouces/images/incremental-dom-and-recent-trend-of-frontend-development-7-638.jpg)

1. A user requests a page.
2. A web browser requests markup from the server.
3. When the browser recevies the markup, it tokenizes the markup and generates DOM tree. 
4. While the browser generates DOM Tree, the browser constructs Render Tree which is combined with DOM Tree and CSS information for displaying elements on the screen in the right order.
5. The browser sets coordinates of elements accoding to CSS and put elements on the right position.
6. The browser starts to paint the page and the user starts to see the page as well.

_* Firefox and IE do not render the screen until CSS is completely downloaded. So putting CSS file into <head> tag is a good choice._

_* .js files are better to be positioned in the right before the end of <body> tag to prevent interupting the browser's rendering process. If .js file is in the middle, the browser will stop rendering and wait for download complete and parsing the .js file. It means a user could wait more to see the first rendered screen._

DOM(Document Object Model) : API for valid HTML and well-formed XML documents.

## Understanding web browser

![](https://github.com/carly-lee/TIL/raw/master/resouces/images/image017.png)

- Chrome has seperate rendering engine on every tab. Every tab has an independent process. 

- For the better user experience, rendering engine displays what it receives on the screen while it waits rest of contents from the network.

- **Script**    
Browser does parsing a document and executes it at the same time. When it meets \<script> tag, it pauses the parsing process. It waits until the script downloaded and execution completed. Authors can add the "defer" attribute to a script, in which case it will not halt document parsing and will execute after the document is parsed. HTML5 adds an option to mark the script as asynchronous so it will be parsed and executed by a different thread.

- **Speculative parsing**   
Both WebKit and Firefox do this optimization. While executing scripts, another thread parses the rest of the document and finds out what other resources need to be loaded from the network and loads them. _In this way, resources can be loaded on parallel connections and overall speed is improved._ Note: the speculative parser only parses references to external resources like external scripts, style sheets and images: it doesn't modify the DOM tree–that is left to the main parser

- **Style Sheet**  
 Theoretically, Style sheet does not need to wait or stop the document parsing since it does not change the DOM tree.  However, there is an issue if script asks for style information during the document parsing. If the style sheet is not parsed yet, the script will provide the wrong answer. Firefox blocks all scripts when there is a style sheet that is still being loaded and parsed. WebKit blocks scripts only when they try to access certain style properties that may be affected by unloaded style sheets.

- **Relationship between DOM tree and Render tree**
The renderers correspond to DOM elements, but not a 1: 1 mapping. For example, non-visual DOM elements such as the <head> element are not added to the render tree. In addition, elements with a 'none' value assigned to the 'display' attribute do not appear in the tree.


## Minimize AJAX requests on initial loading

1. A user requests a page.
2. The browser downloads markup and renders it. There is no actual data and only layout at this time.
3. 'onload' event invoked after javascript is downloaded and parsed.
4. After the event has been invoked, the browser executes AJAX requests and starts to paint the page with the acutal data.
5. Completes the screen. 

**_\* If there was no AJAX request, a user would have seen the screen on step 3._** However, because of the AJAX call, a user should wait until step 5.

**_\* The same rendering process is repeated._** The broswer paints the screen from step 1 ~ 3 and step 4 ~ 5.

**Solution: Use server-side rendering.** At initial load, the server sends the markup including data and Front-end calls AJAX requests when there is user's requests.


Reference : [In Korean](http://wikibook.co.kr/article/web-sites-optimization-1/)

## Try to touch DOM as less as you can

## Optimize CSS 

1. Style data is a very large construct, holding the numerous style properties, this can cause memory problems.
2. Finding the matching rules for each element can cause performance issues if it's not optimized. Traversing the entire rule list for each element to find matches is a heavy task. 
3. Applying the rules involves quite complex cascade rules that define the hierarchy of the rules.

* Firefox has two extra trees for easier style computation: the **rule tree** and **style context tree**. WebKit also has style objects but they are not stored in a tree like the style context tree, only the DOM node points to its relevant style.


## References

- [Ryan Seddon: So how does the browser actually render a website | JSConf EU 2015](https://youtu.be/SmE4OwHztCc)
- [How broswer works](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/) [(In Korean)](http://d2.naver.com/helloworld/59361)
- [Incremental DOM and Recent Trend of Frontend Development](http://www.slideshare.net/zoetrope/incremental-dom-and-recent-trend-of-frontend-development)