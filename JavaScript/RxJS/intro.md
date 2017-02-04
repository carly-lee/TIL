# Reactive programming
Programming paradigm that works with asynchronous data streams.

- **react to events**   
  the event-driven nature enables the following qualities.
- **react to load**   
  focus on scalability by avoiding contention on shared resources.
- **react to failure**   
  build resilient systems with the ability to recover at all levels.
- **react to users**   
  honor response time guarantees regardless of load 

# Rx

Language neutral model with 3 concepts:

1. Observer/Observable
2. Query operations(map/filter/reduce)
3. How/Where/When - Schedulers: a set of types to parameterize concurrency

## Ordinary interactive programming

iterator pattern 
```javascript
try {
  for( let item in collection ){
    doSomething(item);  // next()
  }
}catch(e){
  handleOrThrow(e);     // error()
}

doCleanup();            //complete()
```

in Rx
```javascript
const collection = Rx.Observable.fromEvent(selector, 'click');
const observer = {
  next: (x) =>{},     // doSomething(x)
  error: (e) =>{},    // handleOrThrow(e)
  complete: () =>{},  // doCleanup() 
};

const subscription = collection.subscribe(observer);

// clean up all resources
subscription.dispose();
```

## Observable

In ReactiveX an observer subscribes to an Observable. Then that observer reacts to whatever item or sequence of items the Observable emits. There are no limits how many subscription an Observable can have. Observable will constantly watch streams and will updated accordingly.
**We can interact with data streams like any regular array.**

Let's think about auto complete scenario.
If a user types really fast and client sends request every time when the user press the key board, that search API is going to get huge amount of requests and it will cost a lot. So in order to prevent that kind of situation, it'd better to reduce data traffic.

```javascript
let words = Rx.Observable.fromEvent( input, 'keyup' )
                        .map( e => e.target.value )
                        .throttle(500)
                        .distinctUntilChanged() // [1]
                        .switchMap((term)=>{  // [2]
                          return search(term);
                        });

```
[1] a user might just press left/right arrow. Although it's still 'keyup' event, it doesn't change the actual data. It emits value when the actual data is changed.    
[2] returns the latest response and cancels previous requests which might come back later when we don't want. 

---

Reference
- [Reactive X](http://reactivex.io/)
- [Matthew Podwysocki - Streaming and event-based programming using FRP and RxJS (FutureJS 2014)](https://youtu.be/zlERo_JMGCw)
- [Functional Programming in Javascript - ReactiveX](http://reactivex.io/learnrx/)
- [RxJS API Doc](http://reactivex.io/rxjs/)