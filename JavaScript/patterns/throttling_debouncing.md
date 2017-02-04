# Handling stream of events 

> **Debounce** and **throttle** are two similar (but different!) techniques to _control how many times we allow a function to be executed over time_.

- **Debouncing** will bunch a series of sequential calls to a function into a single call to that function. It ensures that one notification is made for an event that fires multiple times.

- **Throttling** will delay executing a function. It will reduce the notifications of an event that fires multiple times.

> If you have a function that gets called a lot - for example when a resize or mouse move event occurs, it can be called a lot of times. If you don't want this behaviour, you can Throttle it so that the function is called at regular intervals. Debouncing will mean it is called at the end (or start) of a bunch of events.

See the differecne visually [here](http://demo.nimius.net/debounce_throttle/) 

## Debounce   

![Debounce image](https://cdn.css-tricks.com/wp-content/uploads/2016/04/debounce.png)

Allows us to "group" multiple sequential calls in a single one.   
It fires another event when there is differecne from previous. So every different output from previous fires only one event.

<p data-height="346" data-theme-id="0" data-slug-hash="KVxGqN" data-default-tab="result" data-user="dcorb" data-embed-version="2" data-pen-title="Debounce. Trailing" class="codepen">See the Pen <a href="http://codepen.io/dcorb/pen/KVxGqN/">Debounce. Trailing</a> by Corbacho (<a href="http://codepen.io/dcorb">@dcorb</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Throttle   
Allows to our function to execute only once in every X milliseconds. It helps to reduce number of receving stream of events.(Such as scroll, keyboard event and so on.)

> The main difference between this and debouncing is that throttle guarantees the execution of the function regularly, at least every X milliseconds.

<p data-height="428" data-theme-id="0" data-slug-hash="eJLMxa" data-default-tab="result" data-user="dcorb" data-embed-version="2" data-pen-title="Infinite scrolling throttled" class="codepen">See the Pen <a href="http://codepen.io/dcorb/pen/eJLMxa/">Infinite scrolling throttled</a> by Corbacho (<a href="http://codepen.io/dcorb">@dcorb</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## requestAnimationFrame   
a throttle alternative. When your function recalculates and renders elements on screen and you want to guarantee smooth changes or animations. _Note: no IE9 support._

---

References
- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
- [difference-between-throttling-and-debouncing-a-function](http://stackoverflow.com/questions/25991367/difference-between-throttling-and-debouncing-a-function)
- [Debounce in lodash](https://github.com/lodash/lodash/blob/master/debounce.js)
- [Throttle in lodash](https://github.com/lodash/lodash/blob/master/throttle.js)
- [requestAnimationFrame](https://www.html5rocks.com/en/tutorials/speed/animations/)