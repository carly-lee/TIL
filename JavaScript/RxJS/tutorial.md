# Creates an Observables from events 

```javascript
import $ from 'jquery';
import Rx from 'rxjs/Rx';

const input = $('#input');
const output = $('#output');

const inputStream$ = Rx.Observable.fromEvent(input, 'keyup');
inputStream$.subscribe(
  (e)=>{
    console.log(e.target.value);
  },
  (error)=>{
    console.log('error');
  },
  ()=>{
    console.log('Completed');
  }
)

Rx.Observable.fromEvent(document, 'mousemove')
             .subscribe(
               (e)=>{
                 output.html('<h1>X: ' + e.clientX + ' Y: ' + e.clientY +'</h1>' );
               },
               (error)=>{
                 console.log('error');
               },
               ()=>{
                 console.log('Completed');
               }
             )
```

# Creates Observables from arrays

```javascript
const numbers = [33,44,55,66,77];

Rx.Observable.from(numbers)
             .subscribe(
               (v)=>{
                 console.log(v);
               },
               (error)=>{
                 console.log(error);
               },
               (complete)=>{
                 console.log('Completed');
               }
             )
/**
 * 33
 * 44
 * 55
 * 66
 * 77
 * Completed
 */

const posts = [
  { title: 'Post One', body: 'This is the body' },
  { title: 'Post Two', body: 'This is the body' },
  { title: 'Post Three', body: 'This is the body' },
];

Rx.Observable.from(posts)
             .subscribe(
               (post)=>{
                 console.log(post.title, post.body);
               },
               (error)=>{
                 console.log(error);
               },
               (complete)=>{
                 console.log('Completed');
               }
             )
```

# Creates an Observable from scratch 

```javascript
const source$ = new Rx.Observable( observer =>{
  console.log('Creating Observable' );

  observer.next('Hello world');
  observer.next('Another value');

  observer.error( new Error('Error: Something went wrong'));

  setTimeout(()=>{
    observer.next('Yet another value');
    observer.complete();
  }, 3000);
});

source$
.catch( err => Rx.Observable.of( err )) // takes the value passed in and turns it into an Observable
.subscribe(
  (x)=>{
    console.log(x);
  },
  (err)=>{
    console.log(err);
  },
  (complete)=>{
    console.log('completed');
  }
)
```

# Creates an Observable from Promise

```javascript
const myPromise = new Promise((resolve, reject)=>{
  console.log( 'Creating Promise' );
  setTimeout(()=>{
    resolve( 'Hello from promise' );
  }, 2000);
});

Rx.Observable.fromPromise(myPromise)
             .subscribe(
               (x)=>{
                 console.log( x );
               }
             )
```

# Interval, Timer & Range

## Interval 

```javascript
// emits a valve every 100ms
const source$ = Rx.Observable.interval(100)
  .take(5); // This stops at 5. zero base

source$.subscribe(
  (x)=>{
    console.log(x);
  },
  (err)=>{
    console.log(err);
  },
  ()=>{
    console.log('Completed');
  }
)
```
## Timer
emits a value after spent an amount of time passed as a first parameter   
basically (delay, interval)

```javascript
Rx.Observable.timer(5000, 1000)
  .take(5) // This stops at 5. zero base
  .subscribe(
    (x)=>{
      console.log(x);
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      console.log('Completed');
    }
  )
```

## Range
range(start, plus from start)

```javascript
// (25, 100) => 25, 26, 27 ... 124
Rx.Observable.range(25, 100);
.subscribe(
  (x)=>{
    console.log(x);
  },
  (err)=>{
    console.log(err);
  },
  ()=>{
    console.log('Completed');
  }
)
```
# Map & Pluck

## Map

```javascript
const source$ = Rx.Observable.interval(1000)
  .take(10)
  .map(v => v * 2);

source$.subscribe(
  (v)=>{
    console.log(v);
  }
)

const source$ = Rx.Observable.from(['John', 'Tom', 'Shawn'])
  .map( v => v.toUpperCase() )
  .map( v => 'I am ' + v );

source$.subscribe(
  (v)=>{
    console.log(v);
  }
)
```

## Pluck

```javascript
function getUser(username){
  return $.ajax({
    url: 'https://api.github.com/users/' + username,
    dataType: 'jsonp',
  }).promise();
}

Rx.Observable.fromPromise( getUser('carly-lee') )
  .map(user => user.data.name )
  .subscribe(
    (name)=>{
      console.log(name);
    }
  );

const users = [
  { name: 'Will', age: 34 },
  { name: 'Mike', age: 33 },
  { name: 'Paul', age: 35 }
];

const users$ = Rx.Observable.from(users)
  .pluck('name'); // pass the key 

users$.subscribe( x => console.log(x) );

```

# Merge & Concat

## Merge

```javascript
//of() takes whatever passed in and turns it into an Observable
Rx.Observable.of('Hello')
  .merge( Rx.Observable.of( 'Everyone' ))
  .subscribe( x => console.log(x));

Rx.Observable.interval(2000)
  .merge(Rx.Observable.interval(500))
  .take(25)
  .subscribe( x => console.log(x));

const source1$ = Rx.Observable.interval(2000).map( v => 'Merge1: '+v );
const source2$ = Rx.Observable.interval(500).map( v => 'Merge2: '+v );

Rx.Observable.merge(source1$, source2$)
  .take(25)
  .subscribe( x => console.log( x ));
```

## Concat

```javascript
const source1$ = Rx.Observable.range(0, 5).map( v => 'Source1: '+v );
const source2$ = Rx.Observable.range(6, 5).map( v => 'Source2: '+v );

// it executes source1$ first and runs source2$ after source1$ is finished.
Rx.Observable.concat(source1$, source2$)
  .subscribe( x => console.log( x ));
```

# MergeMap & SwitchMap

## MergeMap

- Projects each source value to an Observable which is merged in the output Observable.
- Stop us having a nested subscribe()

```javascript
// Shouldn't do double subscribe()
Rx.Observable.of('Hello')
  .subscribe((v)=>{
    Rx.Observable.of(v+' Everyone')
      .subscribe(x => console.log(x));
  });

// Correct way
Rx.Observable.of('Hello')
  .mergeMap( v => {
    return Rx.Observable.of( v + ' Everyone')
  })
  .subscribe(x => console.log(x));
```

## SwitchMap
Projects each source value to an Observable which is merged in the output Observable, emitting values only from the most recently projected Observable.

```javascript
function getUser(username){
  return $.ajax({
    url: 'https://api.github.com/users/' + username,
    dataType: 'jsonp',
  }).promise();
}

const inputSource$ = Rx.Observable.fromEvent($('#input'), 'keyup')
  .map( e => e.target.value )
  .switchMap( v => {
    return Rx.Observable.fromPromise( getUser( v ) );
  });

inputSource$.subscribe(
  (x)=>{
          console.log(x);
          $('#name').text(x.data.name);
          $('#blog').text(x.data.blog);
          $('#repos').text('Public Repos: ' + x.data.public_repos);
        }
)

```

---
References
- [RxJS Observables Crash Course](https://youtu.be/ei7FsoXKPl0)
- [RxJS API Doc](http://reactivex.io/rxjs/)