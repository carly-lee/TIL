# Website Performance Optimization

## Rendering process optimization

![](https://github.com/carly-lee/TIL/raw/master/resouces/images/incremental-dom-and-recent-trend-of-frontend-development-5-638.jpg)
![](https://github.com/carly-lee/TIL/raw/master/resouces/images/incremental-dom-and-recent-trend-of-frontend-development-7-638.jpg)

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


Reference : [In English](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/) [In Korean](http://d2.naver.com/helloworld/59361)

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