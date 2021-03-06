# [Professor Frisby Introduces Composable Functional JavaScript](https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript)

## 1. Create linear data flow with container style types(Box)   
In the following code, several operations happens in one function.
What following function does is take a string and trim it, parse int, add number to it and get the char code from string.

```javascript
const nextCharForNumberString = str => {
  const trimmed = str.trim()
  const number = parseInt(trimmed)
  const nextNumber = number + 1
  return String.fromCharCode(nextNumber)
}

const result = nextCharForNumberString('  64 ')
console.log( result ) // A
```
The above code could be rewritten like below.   
However, it is quite hard to follow and not straightforward.

```javascript
const nextCharForNumberString = str => String.fromCharCode( parseInt( str.trim() ) +1 )
const result = nextCharForNumberString('  64 ')
console.log( result ) // A
```

Let's make small functions which does only one work at a time and compose it.   
Since 'string' in javascript cannot be mapped, it needs to be in a box in order to be mapped.

```javascript
const nextCharForNumberString = str =>
  [str]
  .map(s => s.trim())
  .map(s => parseInt(s))
  .map(i => i + 1)
  .map(i => String.fromCharCode(i)) // [ 'A' ]
```
We've captured each assignment in a very minimal context.   
Since each expression has its own state completely contained, there are no side effects.

```javascript
const Box = x =>            // [1] Capture the given 'x' into closure.
({
  map: f => Box(f(x)),      // [2] The return value type should be the same for chaining. It is called 'identity functor'.
  fold: f => f(x),          // [3] Unwrap the return value.
  inspect: ()=> `Box(${x})` // [4] Just for easier debugging.
})

const nextCharForNumberString = str => 
  Box(str)
  .map(s => s.trim()) // [5] 'Map' is a composition. It takes input and returns the output. More functions can be added. 
  .map(r => parseInt(r))
  .map(i => i+1)
  .fold(i => String.fromCharCode(i))

const result = nextCharForNumberString('  64 ')
console.log( result ) // Box('A')
```

## 2. Refactor imperative code to a single composed expression using Box

What following codes do is going to take a string of money and a string of a percentage, and return us what the discount will be.

- Imperative codes 

```javascript
const moneyToFloat = str => parseFloat(str.replace(/\$/g, ''))

const percentToFloat = str => {
  const replaced = str.replace(/\%/g, '')
  const number = parseFloat(replaced)
  return number * 0.01
}

const applyDiscount = (price, discount) => {
  const cost = moneyToFloat(price)
  const savings = percentToFloat(discount)
  return cost - cost * savings
}

const result = applyDiscount( '$5.00', '20%' )
console.log( result ) // 4
```

- Refactored code

```javascript
const Box = x =>
({
  map: f => Box(f(x)),     
  fold: f => f(x),
  inspect: ()=> `Box(${x})` 
})

const moneyToFloat = str =>
  Box(str)
    .map(s => s.replace(/\$/g, ''))
    .map(r => parseFloat(r)) // Box allows us to un-nest expression.

const percentToFloat = str =>
  Box(str.replace(/\%/g, ''))
    .map(replaced => parseFloat(replaced))
    .map(number => number * 0.01)

const applyDiscount = (price, discount) => // we can work with multiple variables in a box by nesting with closures.
  moneyToFloat(price)
    .fold(cost =>
      percentToFloat(discount) 
        .fold(savings => cost - cost * savings))

const result = applyDiscount( '$5.00', '20%' )
console.log( result ) // 4
```

## 3. Enforce a null check with composable code branching using Either

> Either is defined as a Right or a Left. 
Right and Left are sub types of Either.    
Right works the same way like Box. It runs operation when the x is ture.   
Left also has the basic structure but it doesn't run anything just return the value wrapped in a Left.

```javascript
const Right = x =>
({
  map: f => Right(f(x)),     
  fold: (f, g) => g(x),       // [1]
  inspect: ()=> `Right(${x})` 
})

const Left = x =>
({
  map: f => Left(x),          // Ignores all the requests and returns the given value.
  fold: (f, g) => f(x),       // [1]
  inspect: ()=> `Left(${x})` 
})

const rightResult = Right(3).map(x => x+1).map(x => x/2).fold(x => 'error', x => x)
console.log( rightResult ) // 2

const leftResult = Left(3).map(x => x+1).map(x => x/2).fold(x => 'error', x => x)
console.log( leftResult ) // error
```

[1] The difference between 'Right' and 'Left' is 'fold'.  
If it's 'Right', it runs the second function. If it's 'Left', it runs the first function.    
This allows us to do pure functional error handling way.    

```javascript
const Right = x =>
({
  map: f => Right(f(x)),     
  fold: (f, g) => g(x),       
  inspect: ()=> `Right(${x})` 
})

const Left = x =>
({
  map: f => Left(x),          
  fold: (f, g) => f(x),       
  inspect: ()=> `Left(${x})` 
})

const findColor = name =>
  ({red: '#ff4444', blue: '#3b5998', yellow: '#fff68f'})[name]

const result = findColor('red').slice(1).toUpperCase()
console.log( result ) // FF4444 
//If we try to find a color there isn't like 'green', the app will be dead. Because, there is no return value from 'findColor' and we try run slice on the null.


// using Right and Left  

const fromNullable = x =>
  x ? Right(x) : Left(null)

const findColor = name =>
  fromNullable({red: '#ff4444', blue: '#3b5998', yellow: '#fff68f'}[name])

const result = findColor('green')
                .map(c => c.slice(1)) 
                .fold(e => 'no color', c => c.toUpperCase())
console.log( result ) // no color 
```
Even if we try to find a color 'findColor' doesn't have, the app doesn't die since 'findColor' returns 'Left' which can be mapped over.

## 4. Use chain for composable error handling with nested Eithers

```javascript
const Right = x =>
({
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: ()=> `Right(${x})`
})

const Left = x =>
({
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: ()=> `Left(${x})`
})

const fromNullable = x =>
  x != null ? Right(x) : Left(null)

const fs = require('fs')

const getPort = () => {
  try {
    const str = fs.readFileSync('config.json') // {port: 8888}
    const config = JSON.parse(str)
    return config.port
  }catch(e){
    return 3000
  }
}

// Refactor 'getPort()'

const tryCatch = f => {
  try {
    return Right(f())
  }catch(e){
    return Left(e)
  }
}

const getPort = () =>
  tryCatch(() => fs.readFileSync('config.json')) // [1] Right('')
  .map(c => tryCatch(() => JSON.parse(c))) // [2] Right(Right('')) or Right(Left())
  .fold(e => 3000, c => 
    c.fold(e => 3000, c => c.port)) // Need to fold twice!

const result = getPort()
console.log(result) // 8888

```

[1] It returns wrapped value.   
[2] Whatever the input is, it wraps the value and returns it.   
So the result value will be wrapped 2 times. It will be quite confusing to figure it out and we need to fold twice which is a bit inconvenient.

That's why we need 'chain' in the Either.

```javascript
const Right = x =>
({
  chain: f => f(x), // Basically works the same way like map but we don't put the value in a Box
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: ()=> `Right(${x})`
})

const Left = x =>
({
  chain: f => Left(x),
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: ()=> `Left(${x})`
})

const fromNullable = x =>
  x != null ? Right(x) : Left(null)

const tryCatch = f => {
  try {
    return Right(f())
  }catch(e){
    return Left(e)
  }
}

const fs = require('fs')

const getPort = () =>
  tryCatch(() => fs.readFileSync('config.json'))
  .chain(c => tryCatch(() => JSON.parse(c))) // [1] Right('')
  .fold(e => 3000, c => c.port)

const result = getPort()
console.log(result) // 8888

```

[1] Since we used 'chain' method, it will return only one 'Right'.

The difference between 'chain' and 'fold' is that 'fold' takes a value out of the box whether it's 'Right' or 'Left'.    
However, 'chain' expects you run a function and return another one. Thus, **'chain' would be one of the steps in the middle and 'fold' will be used to take the result value out of the box**.

## 5. A collection of Either examples compared to imperative code

```javascript
// Imperative code
const openSite = ()=>{
  if( current_user ){
    return renderPage(current_user)
  }else{
    return showLogin()
  }
}
// Refactored code using Either
const openSite = ()=>
  fromNullable(current_user)
  .fold(showLogin, renderPage)
```

```javascript
const getPrefs = user => {
  if( user.premium ){
    return loadPrefs(user.preferences)
  }else{
    return defaultPrefs
  }
}

const getPrefs = user =>
  (user.premium ? Right(user) : Left('not premium'))
  .map(u => u.preferences)
  .fold(() => defaultPrefs, prefs => loadPrefs(prefs))
```

```javascript
const streetName = user => {
  const address = user.address
  if(address){
    const street = address.street
    if( street ) return street.name
  }
  return 'no street'
}

const streetName = user =>
  fromNullable(user.address)
  .chain(a => fromNullable(a.street))
  .map(s => s.name)
  .fold(e => 'no street', n => n)
```

```javascript
const concatUniq = (x, ys) => {
  const found = ys.filter(y => y === x)[0]
  return found ? ys : ys.concat(x)
}

const concatUniq = (x, ys) =>
  fromNullable(ys.filter(y => y === x)[0])
  .fold(() => ys.concat(x), y => ys)
```

```javascript
const wrapExamples = example => {
  if( example.previewPath ){
    try{
      example.preview = fs.readFileSync(example.previewPath)
    }catch(e){}
  }
  return example
}

const readFile = x => tryCatch(() => fs.readFileSync(x))

const wrapExamples = example =>
  fromNullable(example.previewPath)
  .chain(readFile)
  .fold(() => example,
        preview => Object.assign({}, example, { preview }))
```

```javascript
const parseDbUrl = cfg => {
  try{
    const c = JSON.parse(cfg)
    if(c.url){
      return c.url.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    }
  }catch(e){
    return null
  }
}

const parseDbUrl = cfg => 
  tryCatch(() => JSON.parse(cfg))
  .chain(c => fromNullable(c.url))
  .fold(e => null,
        u => u.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/))
```

## 6. Create types with Semigroups
A type with a concat method that is associative.

> associative: (mathematics) giving the same result no matter what order the parts of a calculation are done,   
> for example **(a × b) × c = a × (b × c)**    
> Definition of associative adjective from the Oxford Advanced Learner's Dictionary

```javascript
const str = "a".concat("b").concat("c") // abc
const arr = [1,2].concat([3,4]).concat([5,6]) // [1, 2, 3, 4, 5, 6]
// String and Array are semigroup since it has 'concat' method.

const arr = [1,2].concat(([3,4]).concat([5,6])) // [1, 2, 3, 4, 5, 6]
// Even if we concat inner part first, we will get the same result. That's called associativity.
```
> Append/prepend grouping doesn't really matter with a semigroup, and that is a great property that holds.
> You might remember associativity from addition. If we say **1 + (1 + 1) == (1 + 1) + 1**.    
> It does not matter how we group the operations. It will always the same result. That is one property we get from semigroups.   

```javascript
const Sum = x =>
({
  x,
  concat: ({x:y}) => Sum(x + y), // Since concat receives another 'Sum' type, we need to assign 'x' from other 'Sum' to 'y'
  inspect: () => `Sum(${x})`
})

const res = Sum(1).concat(Sum(2)) // Sum(3)
const res = Sum('a').concat(Sum('b')) // Sum(ab)
```

```javascript
const All = x =>
({
  x,
  concat: ({x:y}) => All(x && y),
  inspect: () => `All(${x})`
})

const res = All(true).concat(All(false)) // All(false)
const res = All(true).concat(All(true)) // All(true)
```

```javascript
const First = x => // This will always keep the first one.
({
  x,
  concat: _ => First(x),
  inspect: () => `First(${x})`
})
const res = First("blah").concat(First("ice cream")).concat(First("meta programming")) // First(blah)
```

## 7. Semigroup examples

A user 'Nico' has accidentally made two accounts.   
We want to merge those accounts. Using Semigroup we can concat/combine two things together.

```javascript
const { Map } = require("immutable-ext") // fantasyland extension of immutable.js 

const Sum = x =>
({
  x,
  concat: ({x:y}) => Sum(x + y),
  inspect: () => `Sum(${x})`
})

const All = x =>
({
  x,
  concat: ({x:y}) => All(x && y),
  inspect: () => `All(${x})`
})

const First = x => 
({
  x,
  concat: _ => First(x),
  inspect: () => `First(${x})`
})

// 'name' shouldn't be concatenated so it will be 'First'.
const acct1 = Map({ name: First('Nico'), isPaid: All(true), points: Sum(10),
friends: ['Franklin'] })

const acct2 = Map({ name: First('Nico'), isPaid: All(false), points: Sum(10),
friends: ['Gatsby'] })

const res = acct.concat(acct2)
console.log(res.toJS())

/*
{ name: First(Nico),
  isPaid: All(false),
  points: Sum(20),
  friends: [ 'Franklin', 'Gatsby' ] }
*/

```

## 8. Ensure failsafe combination using monoids

```
1 + 0 // 1    
2 + 0 // 2   
3 + 0 // 3   
```
We have a neutral element here that acts as an identity of sorts that gives us back our element we're trying to concat with. If we have a special element like the zero here under addition, we have what's called a **monoid**, that is _a semigroup with a special element in there that acts like a neutral identity_.

```javascript
Sum.empty = () => Sum(0) // No matter how many times add 0, the result doesn't change.

// true && true -> true 
// false && true -> false 
// so the neutral element is 'true' here.
All.empty = () => All(true)
```

There's no neutral element for 'First' since the first element can be anything.   
These neutral elements can be rewritten like below.

```javascript
const sum = xs => xs.reduce((acc, x) => acc + x, 0)

const all = xs => xs.reduce((acc, x) => acc && x, true)

const first = xs => xs.reduce((acc, x) => acc)

console.log(first([])) // This will break. Because it doesn't have any value to return.
```

> A semigroup, it does not have an element to return so it's not a safe operation, whereas with the monoids we could take as many as we possibly want, even none, and still return us back something. It's a perfectly safe operation here that we can reduce as many of them as we'd like.

## 9. A curated collection of Monoids and their uses

```javascript
const Sum = x =>
({
  x, 
  concat: ({x: y}) => Sum(x + y)
})

Sum.empty = () => Sum(0)
```

```javascript
const Product = x =>
({
  x,
  concat: ({x: y}) => Product(x * y)
})

Product.empty = () => Product(1)
```

```javascript
const Any = x =>
({
  x,
  concat: ({x: y}) => Any(x || y)
})

Any.empty = () => Any(false)
```

```javascript
const All = x =>
({
  x, 
  concat: ({x: y}) => All(x && y)
})

All.empty = () => All(true)
```

```javascript
const Max = x =>
({
  x,
  concat: ({x: y}) => Max(x > y ? x : y)
})

Max.empty = () => Max(-Infinity) // This will be always less than any number passed in. 
```

```javascript
const Min = x =>
({
  x,
  concat: ({x: y }) => Min(x < y ? x : y)
})

Min.empty = () => Min(Infinity) // This will be always grater than any number passed in.
```

```javascript
const Right = x =>
({
  fold: (f, g) => g(x),
  map: f => Right(f(x)),
  concat: o =>
    o.fold(e => Left(e),
           r => Right(x.concat(r)))
})

const Left = x =>
({
  fold: (f, g) => f(x),
  map: f => Left(x),
  concat: o => Left(x)
})

const stats = List.of({page: 'Home', views: 40},
                      {page: 'About', views: 10},
                      {page: 'Blog', views: 4})
stats.foldMap(x =>
    fromNullable(x.views).map(Sum), Right(Sum(0)))
// Right(Sum(54))

const stats = List.of({page: 'Home', views: 40},
                      {page: 'About', views: 10},
                      {page: 'Blog', views: null})
stats.foldMap(x =>
    fromNullable(x.views).map(Sum), Right(Sum(0)))
// Left(null) 

```

```javascript
const First = either =>
({
  fold: f => f(either),
  concat: o =>
      either.isLeft ? o : First(either)
})

First.empty = () => First(Left())

const find = (xs, f) =>
    List(xs)
    .foldMap(x =>
        First(f(x) ? Right(x) : Left()), First.empty())
    .fold(x => x)

find([3,4,5,6,7], x => x > 4)
// Right(5)
```

```javascript
const Fn = f =>
({
  fold: f,
  concat: o =>
      Fn(x => f(x).concat(o.fold(x)))
})

const hasVowels = x => !!x.match(/[aeiou]/ig)
const longWord = x => x.length >= 5

const both = Fn(compose(All, hasVowels))
             .concat(Fn(compose(All, longWord)))

['gym', 'bird', 'lilac']
.filter(x => both.fold(x).x)
// [lilac]
```

```javascript
const Pair = (x, y) =>
({
  x,
  y,
  concat: ({x: 1, y: 1}) =>
      Pair(x.concat(x1), y.concat(y1))
})
```

## 10. Unbox types with foldMap

```javascript
Box(3).fold(x => x) // 3
Right(3).fold(e => e, x => x) // 3
```
'fold' takes the value out of the context. foldMap does the same but also with mapping.

```javascript
const { Map, List } = require('immutable-ext')
const { Sum } = require('../monoid')

const res = [Sum(1), Sum(2), Sum(3)]
    .reduce((acc, x) => acc.concat(x), Sum.empty())

console.log(res)
```
Since it's just calling concat, we could just call .fold(Sum.empty()) here, and that would do the exact same thing.

```javascript
// in 'immutable-ext'
fold : function(empty) {
  return this.foldMap(x => x, empty)
},
foldMap : function(f, empty) {
  return empty != null
  ? this.reduce((acc, x) => acc.concat(f(x)), empty)
  : this.reduce((acc, x) => acc.concat(f(x)))
},

// immutable-js
reduce(
  reducer: (reduction: R, value: V, key: K, iter: Iterable) => R,
  initialReduction?: R,
  context?: any
): R

const res = [Sum(1), Sum(2), Sum(3)]
    .fold(Sum.empty())
    //.reduce((acc, x) => acc.concat(x), Sum.empty())
```
The reason we have to pass Sum.empty() in is because there's no way to know if it's an empty list, where to start, and what to return.

The same thing like 'List' can be done with 'Map' as well since 'Map' is the collection of things.
```javascript
const res = Map({brian: Sum(3), sara: Sum(5)})
    .fold(Sum.empty())

// However, in the map we don't have tha value as a monoid in the most of cases.
// We can map over the value and put the value into the monoid and fold it.
const res = Map({brian: 3, sara: 5})
    .map(Sum)
    .fold(Sum.empty())

// This can be done using foldMap in one step.
const res = Map({brian: 3, sara: 5})
    .foldMap(Sum, Sum.empty())
```

## 11. Delay Evaluation with LazyBox

With Box, we are able to map over each function, and pass our input to output, and work-like function composition here.
```javascript
const Box = x =>            
({
  map: f => Box(f(x)),      
  fold: f => f(x),          
  inspect: ()=> `Box(${x})`
})

const result = Box(' 64 ')
               .map(abba => abba.trim())
               .map(trimmed => new Number(trimmed))
               .map(number => number + 1)
               .map(x => String.fromCharCode(x))
               .fold(x => x.toLowerCase()) // a
```

A LazyBox will take, instead of an x, will take a g here for a function. This is basically lazy function composition.
```javascript
const LazyBox = g =>
({
  fold: f => f(g()),
  map: f => LazyBox(() => f(g()))
})

const result = LazyBox(() => ' 64 ')
               .map(abba => abba.trim())
               .map(trimmed => new Number(trimmed))
               .map(number => number + 1)
               .map(x => String.fromCharCode(x))
               .fold(x => x.toLowerCase())
```
'fold' acts like trigger. Before calling 'fold', nothings actually happens.

## 12. Capture Side Effects in a Task
Now, we're going to use this 'data.task' on NPM here from Folktale. We can make Task from anything. It acts like Box + Either but lazy. In order to capture the value, we need to 'fork'.

```javascript
const Task require('data.task')

Task.of(1)
.fork(e => console.log('err', e),
      x => console.log('success', x))

// success 1

Task.rejected(1)
.fork(e => console.log('err', e),
      x => console.log('success', x))

// err 1

Task.rejected(1) // Task(1)
.map(x => x + 1)
.chain(x => Task.of(x + 1))
.fork(e => console.log('err', e),
      x => console.log('success', x))

// err 1
```
'rejected' ignores everything and returns 'err 1' like 'Left'.   
We also can chain from the task.

```javascript
// This will just run immediately.
const launchMissiles = () => 
    console.log("launch missiles!")

// If we capture this in a Task, it will be lazy, and we can compose with it. 
const launchMissiles = () => 
    new Task((rej, res) => {
        console.log("launch missiles!")
        res("missile")
    })

launchMissiles()
.map(x => x + "!")
.fork(e => console.log('err', e),
      x => console.log('success', x))
```
**If we don't fork it here, it just don't run at all**.   
So we can do things lazy like below.

```javascript
const app = launchMissiles().map(x => x + "!")

app.fork(e => console.log('err', e),
         x => console.log('success', x))

// We can do more computations before it runs.
app
  .map(x => x + "!")
  .fork(e => console.log('err', e),
        x => console.log('success', x))
```

## 13. Use Task for Asynchronous Actions

```javascript
const Task = require('data.task')
const fs = require('fs')

const app = () => 
    fs.readFile('config.json', 'utf-8', (err, contents) => {
        if(err) throw err

        const newContents = contents.replace(/8/g, '6')

        fs.writeFile('config.json', newContents, (err, _) => {
            if (err) throw err
            console.log('success!')
        })
    })
```
Convert it to use tasks

```javascript
const readFile = (filename, enc) =>
    new Task((rej, res) => 
    fs.readFile(filename, enc, (err, contents) =>
        err ? rej(err) : res(contents)))
        
const writeFile = (filename, contents) =>
    new Task((rej, res) => 
    fs.readFile(filename, contents, (err, success) =>
        err ? rej(err) : res(success)))

const app = 
    readFile('config.json', 'utf-8')
    .map(contents => .replace(/8/g, '6'))
    .chain(contents => writeFile('config1.json', contents))

app.fork(e => console.log(e),
         x => console.log('success'))

//  config1.json: {"port": 8888} -> {"port": 6666}
```
'Task' works quite similar to 'Promise' in JavaScript.
But there is difference. Task is lazy and Promise isn't.
>Promises are eager, which means they are not pure - **they will immediately run side effects upon construction**. Task will allow you to work with values as though they were there, but it does not run until you tell it with fork() - usually outside your pure application.

## 14. You've been using Functors
The definition of a functor is **any type with a map method**. It must obey a few laws.    
Any type fx, some functor holding x, when we map f over it and then we map g over it, that should be the same as running map once over it by saying first run  f, then run g.

```javascript
const `Box` = require('./`Box`')
const Task = require('data.task')
const Either = require('./either')
const {Right, Left, FromNullable} = Either
const { List, Map } = require('immutable-ext')

// law : fx.map(f).map(g) == fx.map(x => g(f(x)))

const res1 = Box('squirrels')
            .map(s => s.substr(5))
            .map(s => s.toUpperCase())

const res2 = Box('squirrels')
            .map(s => s.substr(5).toUpperCase())
console.log(res1, res2) // Box(RELS) Box(RELS)
```
This works for any type here. We could use our Right, Left here as well. 

```javascript
const id = x => x

// fx.map(id) == id(fx)
// If I have a functor x and I map id over my type, that will be the same as just calling id on fx.

const res1 = Box('crayons').map(id)
const res2 = id(Box('crayons'))

console.log(res1, res2) // Box(crayons) Box(crayons)
```
## 15. Lift into a Pointed Functor with of
'of' is really a generic interface to be able to place a value into our type, or we call it lifting a value to our type.

```javascript
Task.of('hello') // Task('hello')
Either.of('hello') // Right('hello') --> in order to user generic interface of value, 'Right' is chosen.
Box.of(100) // Box(100)
```

## 16. You've been using Monads

![Dependencies](https://github.com/carly-lee/TIL/raw/master/resouces/images/dependencies.png)   


```
Box, Either, Task, List
```
Box, Either, Task, List -- all these types are monads.  
F standing for any of these types here, that places a value into the type and a chain method. These two together create the monadic interface.  

```javascript
F.of, chain(flatMap, bind, >>=)
```
If you look at any language, you'll see this combination(of, chain) to create a monad. 

We going to get the user info using httpGet. Then we do another httpGet to get the comments of the user. The problem here is that we'll end up with a Task of a Task of an array of comments.
```javascript
httpGet('/user')
.map(user => 
    httpGet('/comments/${user.id}') // Task(Task([comments])) <- This is not ideal.

// if we change 'map' to 'chain'...
httpGet('/user')
.chain(user => 
    httpGet('/comments/${user.id}') // Task([comments])
```
The key point of **chain** here is going to **flatten these two types into one**. That's why it's called flatMap sometimes here.

```javascript
// If we didn't call the chain...
httpGet('/user')
.map(user => 
    httpGet('/comments/${user.id}')
    .map(comments => 
        updateDOM(user, comments))) // Task(Task(Task(DOM))) 

// We can flatten the result using 'chain'
httpGet('/user')
.chain(user => 
    httpGet('/comments/${user.id}')
    .chain(comments => 
        updateDOM(user, comments))) // Task(DOM)
```

```javascript
const join = m =>
    m.chain(x => x)
```
This will just return the inner type. If I had a 'Box(Box(x))' this would return me a 'Box(x)' because it just returns its inner type to join it together. We're going to use this to define a few laws here for the monad.   

- The first law 
```javascript
join(m.map(join)) == join(join(m))
```
In order to see it works as expected we need a monad to map over it.

```javascript
const m = Box(Box(Box(3)))
const res1 = join(m.map(join))
const res2 = join(join(m))

console.log( res1, res2 ) // Box(3) Box(3)
```
This should work for any monad.

- The second law

```javascript
join(Box.of(m) == join(m.map(Box.of))
```

```javascript
const m = Box('wonder')
const res1 = join(Box.of(m))
const res2 = join(m.map(Box.of))

console.log( res1, res2 ) // Box(wonder) Box(wonder)
```

If I have some monad m and I chain a function over it to get its value and run f(x), I can actually put it back in the type with M.of here.
```javascript
m.chain(x => M.of(f(x)))
```
We can derive a map method from any monad. That tells us that a monad is a functor. Also, it's an **applicative functor** and a **pointed functor**.

## 17. Build curried functions

'Function currying' is transforming a function that takes multiple arguments into a series of one-argument functions. Every time when a curried function gets called it returns a new function until it gets all arguments in need. And those arguments stores in the closure and cannot be accessed from the outside. When it gets all arguments in need, it returns the final value.

```javascript
const add = (x, y) => x + y

const inc = y => add(1, y) // preload the value 1 

const res = inc(2)

console.log(res)
```

```javascript
const add = x => y => x + y

const inc = y => add(1) // returns a function takes 'y'

const res = inc(2)

console.log(res)
```
Before the curried function returns the value, we can create various functions that preloaded different private value inside of it. The function will use the same calculation logic to return the value using a different set of private value in it.

```javascript
const modulo = dvr => dvd => dvd % dvr

const isOdd = modulo(2)

console.log(isOdd(2)) // 0
console.log(isOdd(21)) // 1

const filter = pred => xs => xs.filter(pred)

const getAllOdds = filter(isOdd)

const res = getAllOdds([1,2,3,4]) // [1, 3]
```

```javascript
const replace = regex => repl => str =>  
    str.replace(regex, repl)

const censor = replace(/[aeiou]/ig)('*')

const res = censor('hello world') // h*ll* w*rld
```
Wait for your data as the last argument so you can keep building up these other functions.

```javascript
const map = f => xs => xs.map(f)

const censor = replace(/[aeiou]/ig)('*')
const censorAll = map(censor)
const res = censorAll(['hello', 'world']) // ['h*ll*', 'w*rld']
```
> Instead of censor working on one thing, we'll work on an array of things just by partially applying map. We've transformed this function to work on single values to a function that works on arrays just by surrounding it in map, and there's our results. That's what currying does. You separate each argument returning a new function, and you typically want your data to be the last argument.

## 18. Applicative Functors for multiple arguments

We have a Box of a function here, and we'd like to apply it to a Box of a value.

```javascript
const Box = require('../box')

const res = Box(x => x + 1).ap(Box(2)) 
console.log(res) // Box(3)
```

```javascript
const Box = x =>
({
    ap: b2 => b2.map(x), // will takes a second box that holds a value and map x over the second box.
    chain: f => f(x),   
    map: f => Box(f(x)),
    fold: f => f(x),
    inspect: () => `Box(${x})`
})
```

What if we want to take an x and a y, and apply x + y?    
Applying it to Box(2), we will have a box of the function 'x => 2 + y'
```javascript
const res = Box(x => y => x + y).ap(Box(2)) // Box(x => 2 + y)
```
We applied Box(2) to a function that takes x and Box returns another function which takes y.
_Because the result Box is holding a function, we can keep applying these boxes with functions in them to boxes with values in them._ **Box(y => 2 + y).ap(Box(3))**. We should end up with a **Box(5)**.

```javascript
const add = x => y => x + y
const res = Box(add).ap(Box(2)).ap(Box(3)) // Box(5)
```
> The effect we've had here is taking 2 boxes, and then calling a function with both arguments. We have 2 boxes at once. We're unboxing both of them, and passing it into 'add' function. Notice it's very important that this is in the curried form. **It takes one argument at a time, and that's because it's going ahead and applying each Box one at a time**.

```javascript
F(x).map(f) == F(f).ap(F(x))

Box(2).map(x => x + 1) == Box(x => x + 1).ap(Box(2))
```
> We call this applicative functors if it has an 'ap' method. If I have any functor f holding an x, and I call map(f), that is equal to a functor holding f applied to a functor holding x.

'ap' takes a functor. 'map' takes a function.    
Both work in the same way but a left and a right side is flipped.

```javascript
// a lift applicative with 2 arguments. 
const liftA2 = (f, fx, fy) =>
    F(f).ap(fx).ap(fy) // We don't know what functor 'F' is.

// Based on the rules we have drawn from above, we can rewrite the function.
// F(f).ap(fx) == fx.map(f)
const liftA2 = (f, fx, fy) =>
    fx.map(f).ap(fy) // We don't need to what functor is.

const add = x => y => x + y

const res = liftA2(add, Box(2), Box(4)) // Box(6)
```

```javascript
const res = Box(add).ap(Box(2)).ap(Box(4))
//add(2, 4)

const res = liftA2(add, Box(2), Box(4))
```

We can curry 'liftA2' as well.

```javascript
const liftA2 = f => a => b => a.map(f).ap(b)

const mult = a => b => a * b

const liftedMult = liftA2(mult) 

console.log( liftedMult(Box(2))(Box(3)) ) //Box(6)
console.log( liftedMult(Box(2))(Box(6)) ) //Box(12)
```

## 19. Apply multiple functors as arguments to a function (Applicatives)

```javascript
const Either = require('../either')

const liftA2 = (f, fx, fy) =>
    fx.map(f).ap(fy)

const $ = selector =>
    Either.of({selector, height: 10})

// passing two different Eithers in
const getScreenSize = (screen, head, foot)=>
    screen - (head.height + foot.height)
```

```javascript
$('header').chain(head =>
    $('footer').map(footer =>
        getScreenSize(800, head, foot)))
```
This will work as expected but things happen sequential.  
It will wait to find header, footer and then run 'getScreenSize'.   
However, we can run these at the same time using applicatives.

```javascript
const getScreenSize = screen => head => foot =>
    screen - (head.height + foot.height)

const res = Either.of(getScreenSize(800))
            .ap($('header'))
            .ap($('footer'))

// Right(780)
```
Based on the rules the following code should end up with the same result. 
```javascript
const liftA2 = (f, fx, fy) =>
    fx.map(f).ap(fy)

const res = liftA2(getScreenSize(800), $('header'), $('footer'))

// Right(780)
```

## 20. List comprehensions with Applicative Functors

```javascript
let result = [];

for(let x of ['teeshirt', 'sweater']) {
    for(let y of ['large', 'medium', 'small']) {
        for(let z of ['black', 'white']) {
          result.push(`${x}-${y}-${z}`);
        }
    }
}

console.log(result)
/*
[ 'teeshirt-large-black',
  'teeshirt-large-white',
  'teeshirt-medium-black',
  'teeshirt-medium-white',
  'teeshirt-small-black',
  'teeshirt-small-white',
  'sweater-large-black',
  'sweater-large-white',
  'sweater-medium-black',
  'sweater-medium-white',
  'sweater-small-black',
  'sweater-small-white' ]
*/
```
We can capture this messy imperative code with an applicative functor. 

```javascript
const { List } = require('immutable-ext')

const merch = () =>
    List.of(x => y => z => `${x}-${y}-${z}`)
    .ap(List(['teeshirt', 'sweater']))
    .ap(List(['large', 'medium', 'small']))
    .ap(List(['black', 'white']))

console.log(merch().toJS())
/*
[ 'teeshirt-large-black',
  'teeshirt-large-white',
  'teeshirt-medium-black',
  'teeshirt-medium-white',
  'teeshirt-small-black',
  'teeshirt-small-white',
  'sweater-large-black',
  'sweater-large-white',
  'sweater-medium-black',
  'sweater-medium-white',
  'sweater-small-black',
  'sweater-small-white' ]
*/
```
> This captures a pattern of a **List Comprehension**. You may have seen in other languages like Python, or CoffeeScript or Haskell. It's very useful in declarative nature and easy to add another case without actually cracking open loops within loops, within loops.

## 21. Write applicatives for concurrent actions

```javascript
const Task = require('data.task')

const Db = ({
  find: id =>
    new Task((rej, res) =>
      setTimeout(() =>
        res({id: id, title: `Project ${id}`}), 100))
})

const reportHeader = (p1, p2) => 
  `Report: ${p1.title} compared to ${p2.title}`

Db.find(20).chain(p1 =>
  Db.find(8).map(p2 =>
    reportHeader(p1, p2)))
```
Db just returns a project with id and title. 'reportHeader' needs to projects as parameters.  
If we find project 1, project 2 and then call reportHeader, it needs to wait for finding 2 projects. However, those 2 projects don't have dependency each other. In this case, we can use applicatives to kick both off at the same time.

```javascript
Task.of(p1 => p2 => reportHeader(p1, p2))
.ap(Db.find(20))
.ap(Db.find(8))
.fork(console.error, console.log) 
//Project 20 compared to Project 8
```
Rather than altering the original function, we could curry the Task. That Db.find(20) and Db.find(8) will kick off at the same time. They don't wait for one to resolve before it calls the second one.

## 22. Leapfrogging types with Traversable

```javascript
const fs = require('fs')
const Task = require('data.task')
const futurize = require('futurize').futurize(Task)
const { List } = require('immutable-ext')

const files = ['box.js', 'config.json']
const res = files.map(fn => readFile(fn, 'utf-8'))
console.log(res)

/**
[ Task { fork: [Function], cleanup: [Function] },
  Task { fork: [Function], cleanup: [Function] } ]
**/
```
As a result of reading files in array, we got an array of Tasks. It's hard to know when all of them are finished and fork each one of them.

> We can very well map fork each one and we want to know when we are all done. Really, what we want is to take this array of tasks and turn it into a Task of an array of results.

###  **[Task] => Task([])**   
> Essentially, we want to turn these types inside out. Or **leapfrog** the types so that the array is on the inside of the Task and the Task is on the outside of the array. Whenever we wanted to commute two types like this, what we can do is instead of calling map we call **traverse**.

```javascript
const files = List(['box.js', 'config.json'])
files.traverse(Task.of, fn => readFile(fn, 'utf-8'))
.fork(console.error, console.log)
```
Now, this Task will be on the outside of the array. We need to set the first argument in the case of not ever running the function which is the second argument. Since the function will always return 'Task', the first argument is 'Task'. Since 'traverse' will return a Task, we can fork. The output will be a list of results.

> "Can we re-arrange any two types?"   
> 
> Not all types have a traverse instance, that means they can't define traverse. Things like Stream for instance. However, the more important thing to know is, if you see a traverse, yes you can traverse it.
> 
> **traverse** expects you to return an applicative functor from this function here. In this case Task is an applicative functor and so this all works out. If we pass something that did not have that method which this relies on under the hood, it would blow up on us. 

## 23. Maintaining structure whilst asyncing

```javascript
const fs = require('fs')
const Task = require('data.task')
const { List, Map } = require('immutable-ext')

const httpGet = (path, params) =>
  Task.of(`${path} result`)

Map({ home: '/', about: '/about-us', blog: '/blog' })
  .map(route => httpGet(route, {}))
```
If we map over each key with httpGet, we would end up with a Map with Tasks.
```javascript
Map({ home: Task('/ result'), about: Task('/about-us result'), blog: Task('/blog')})
```
We would rather, instead of a bunch of these key be tasks, we would want one Task on the outside and all these keys to be already resolved. 

```javascript
Map({ home: '/', about: '/about-us', blog: '/blog' })
  .traverse(Task.of, route => httpGet(route, {}))
  .fork(console.error, console.log)

/*
Map { "home": "/ result", "about": "/about-us result",
"blog": "/blog result" }
*/
```
We can do that with **traverse** function, which we have to give Task.of as the first argument, which matches the return type of this function.

## 24. Principled type conversions with Natural Transformations
Natural Transformation could be called as a type conversion.
> A natural transformation is actually a function that takes a functor holding some a to another functor holding that a. it's a structural change.

```javascript  
F a -> G a
 ```
If we want to take an Either into a Task, we'll take out Either and fold it and into a rejected Task if it's a Left or a successful Task if it's a Right.
```javascript
const eitherToTask = e => 
  e.fold(Task.rejected, Task.of)

eitherToTask(Right('nightingale'))
.fork(e => console.error('err', e),
      r => console.log('res', r))
// res nightingale

eitherToTask(Left('errrrr'))
.fork(e => console.error('err', e),
      r => console.log('res', r))
// err errrrr
```

```javascript
const boxToEither = b =>
    b.fold(Right)

const res = boxToEither(Box(100))
console.log(res)
// Right(100)
```
The reason we choose Right here. Had we chosen a Left we would be violating the laws of natural transformations.

```javascript
nt(x).map(f) == nt(x.map(f))
```
> A natural transformation is anything nt, this function, natural transformation, that when I transform x, some functor, when I map over that with f, it must be equal to mapping f over our functor, and then naturally transforming it afterwards.

When we need a monoid for semigroup of Boxes, Right was the monoid for Box.

```javascript
const res1 = boxToEither(Box(100)).map(x => x * 2)
const res2 = boxToEither(Box(100).map(x => x * 2))
console.log(res1, res2)
//Right(200) Right(200)
```
Any function that satisfies the equation, is a natural transformation.

```javascript
const first = xs =>
    fromNullable(xs[0])

const res1 = first([1,2,3]).map(x => x + 1)
const res2 = first([1,2,3].map(x => x + 1))
// Right(2) Right(2)
```
This will throw it in an Either with fromNullable. What we're doing here is transforming a List into an either. We lose the rest of the List, but that doesn't matter, because this equation is still valid. 

## 25. Apply Natural Transformations in everyday work

```javascript
const { List } = require('immutable-ext')

['hello', 'world']
.chain(x => x.split(''))
```
We can't do this because chain doesn't exist on the array.   
We could do instead do a natural transformation from the array to a List.

```javascript
const res = List(['hello', 'world'])
.chain(x => List(x.split('')))

// List [ "h", "e", "l", "l", "o", "w", "o", "r", "l", "d" ]
```
The constructor of List is the natural transformation.

```javascript
const first = xs => 
    fromNullable(xs[0])

const largeNumbers = xs =>
    xs.filter(x => x > 100)

const larger = x => 
    x * 2

const app = xs =>
    first(largeNumbers(xs).map(larger))

console.log(app([2, 400, 5, 1000])) // Right(800)
```
In this case, it went through and doubled every single number in the array and grabbed the first one. According to natural transformation laws, which is **nt(x).map(f) == nt(x.map(f))**, we don't need to go through the whole array. 

```javascript
const app = xs => 
    first(largeNumbers(xs)).map(larger)
// Right(800)
```
If we grab the first number and then map(larger), it doesn't map every single number.

We're going to have a Db here that finds some user and if the id is greater than 2 we'll accept that and return our fake user here. If it is not, we'll return an error. Our fake user has a best_friend_id. What we're going to do is try to find a user and then find that user's best friend. 
```javascript
const fake = id =>
    ({id: id, name: 'user1', best_friend_id: id + 1})

const Db = ({
    find: id =>
        new Task((rej, res) =>
            res(id > 2 ? Right(fake(id)) : Left('not found')))
})

const eitherToTask = e =>
    e.fold(Task.rejected, Task.of)
```

```javascript
Db.find(3)// Task(Right(user))
.chain(either =>
    either.map(user => Db.find(user.best_friend_id))) // Right(Task(Right(User)))
```

```javascript
Db.find(3)// Task(Right(user))
.chain(eitherToTask) //Task(user)
.chain(user => 
    Db.find(user.best_friend_id)) // Task(Right(user))
.chain(eitherToTask) // Task(user)
.fork(e => console.error(e),
      r => console.log(r))
```

## 26. Isomorphisms and round trip data transformations

> An isomorphism is a pair of functions, to() and from(), where if I call 'to' on x followed by a 'from', I should just get back my original x.  
```
from(to(x)) == x
to(from(y)) == y
```
> It means I can **convert and convert back to get my original x**.
> I claim a string is isomorphic to an array of characters. **These two data types should hold the same information and be able to convert there and back without losing anything**.

```javascript
// String ~ [Char]
const Iso = (to, from) => 
({
  to,
  from
})

const chars = Iso(s => s.split(''), c => c.join(''))
const res = chars.from( chars.to('hello world')) // Split 'hello world' and join it again. 
console.log(res) // hello world

const truncate = str =>
  chars.from( chars.to(str).slice(0, 3) ).concat('...')

// hello world 
// -> ['h', 'e', 'l', 'l', ' ', 'w', 'o', 'r', 'l', 'd' ] 
// -> ['h', 'e', 'l'] 
// -> hel 
// -> hel...
```

```javascript
// [a] ~ Either null a
const singleton = Iso(e => e.fold(() => [], x => [x]), // fold: (f, g) => g(x)
                     ([x]) => x ? Right(x): Left())

const filterEither = (e, pred) =>
  singleton.from( singleton.to(e).filter(pred) )

const res = filterEither(Right('hello'), x => x.match(/h/ig))
              .map(x => x.toUpperCase())

console.log(res) // Right(HELLO)

// Right(hello)
// to -> Right([hello])
// filter -> Right([hello])
// from -> Right('hello')
// Right(HELLO)

const res2 = filterEither(Right('ello'), x => x.match(/h/ig))
              .map(x => x.toUpperCase())

console.log(res2) // Left(undefined)

// Right(hello)
// to -> Right([hello])
// filter -> Right([])
// from -> Left()
// Left(undefined)
```

There's no lost information on both Isomorphisms. It can be converted to another and converted back to original type without losing any information.

## 27. Build a data flow for a real world app
## 28. Retrieve and use data from an api with pure functional constructs
## 29. Find the intersection of sets with Semigroups

We will take two sets of artists and compare them and figure out the commonality between them. We're going to build a flow for our data to flow through. We are going to retrieve the data and then just pass it through a series of functions.

```javascript
//Spotify.js

const Task = require('data.task')
const request = require('request')
const Either = require('data.either')

const httpGet = url =>
  new Task((rej, res) =>
  request(url, (error, response, body) =>
    error? rej(error) : res(body)))

const first = xs => 
  Either.fromNullable(xs[0])

const eitherToTask = e =>
  e.fold(Task.rejected, Task.of)

const parse = Either.try(JSON.parse)

const getJSON = url =>
  httpGet(url)
  .map(parse)
  .chain(eitherToTask)

const findArtist = name =>
  getJSON(`https://api.spotify.com/v1/search?q=${name}&type=artist`)
  .map(result => result.artists.items)
  .map(first) // get the best match
  .chain(eitherToTask)
  .map(artists => artists.map(artist => artist.name))

const relatedArtist = id =>
  getJSON(`https://api.spotify.com/v1/artists/${id}/realated-artists`)
  .map(result => result.artists)

module.exports = { findArtist, relatedArtist }
```
```javascript
const Task = require('data.task')
const Spotify = require('./spotify')
const { List } = require('immutable-ext')
const { Pair, Sum } = require('./monoid')

const argv = new Task((rej, res) => res(process.argv))
const names = argv.map(args => args.slice(2))

const Intersection = xs => 
({
  xs,
  concat: ({ xs: ys }) => 
    Intersection(xs.filter(x => ys.some(y => x === y )))
})

const related = name => 
  Spotify.findArtist(name)
  .map(artist => artist.id)
  .chain(Spotify.relatedArtists)

// [1,2,3,4] ^ [3,4,5,6] = [3,4]

const artistIntersection = rels =>
  rels
  .foldMap(x => Pair(Intersection(x), Sum(x.length))) // Get common related artists and the number how many we compared
  .bimap(x => x.xs, y => y.x)
  .toList()

const main = names => 
  List(names)
  .traverse(Task.of, related)
  .map(artistIntersection)

names.chain(main).fork(console.error, console.log)
```
 
```javascript
const Intersection = xs => // takes an array of Xs
({
  xs,
  concat: ({ xs: ys }) => // Assign Xs to Ys since we need to refer Xs and Ys both
    Intersection(xs.filter(x => ys.some(y => x === y )))
    // It goes through the Xs and filters out if the X is included in the Ys.
})

console.log( Intersection([1,2,3,4]).concat( Intersection([3,4,5,6]) ).xs )
// [3,4]
```

---

References

- [Professor Frisby Introduces Composable Functional JavaScript](https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript)
- [Classroom Coding(Functional Todo App)](https://github.com/DrBoolean/Practically-Functional/tree/answers/todo-app)
- [Fantasy Land Specification](https://github.com/fantasyland/fantasy-land)
- [Functional Programming for JavaScript People](https://medium.com/@chetcorcos/functional-programming-for-javascript-people-1915d8775504#.qzbqn0mgy)
- [Functional Programming In JavaScript — With Practical Examples (Part 1)](https://medium.freecodecamp.com/functional-programming-in-js-with-practical-examples-part-1-87c2b0dbc276#.8dao66cag)
- [Functional Programming In JavaScript — With Practical Examples (Part 2)](https://medium.freecodecamp.com/functional-programming-in-js-with-practical-examples-part-2-429d2e8ccc9e#.xvyndxcgo)
- [Folktale](https://github.com/origamitower/folktale)
- [Functional and Immutable Design Patterns in JavaScript](https://javascriptair.com/episodes/2015-12-30/)
- [ramdajs - curry](http://ramdajs.com/0.19.1/docs/#curry)
- [Why curry helps](https://hughfdjackson.com/javascript/why-curry-helps/)
- [Functional Programming Jargon](https://github.com/hemanth/functional-programming-jargon)
- [Lambda Calculus - Computerphile](https://youtu.be/eis11j_iGMs)