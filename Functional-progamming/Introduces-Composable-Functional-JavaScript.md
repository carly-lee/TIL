# [Professor Frisby Introduces Composable Functional JavaScript](https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript)

## 1. Create linear data flow with container style types(Box)   
In the following code, several operations happens in one function.

```javascript
const nextCharForNumberString = str => {
  const trimmed = str.trim()
  const number = parseInt(trimmed)
  const nextNumber = number + 1
  return String.fromCharCode(nextNumber)
}

const result = nextCharForNumberString('  64 ')
console.log( result )
```
The above code could be rewritten like below.
However, it is quite hard to follow and not straightforward.

```javascript
const nextCharForNumberString = str => String.fromCharCode( parseInt(str.trim()) +1 )
const result = nextCharForNumberString('  64 ')
console.log( result )
```

Let's make small functions which does only one work at a time and compose it.
Since 'string' in javascript cannot be mapped, it needs to be in a box in order to be mapped.

```javascript
const Box = x =>            // [1]
({
  map: f => Box(f(x)),      // [2]
  fold: f => f(x),          // [3]
  inspect: ()=> `Box(${x})` // [4]
})

const nextCharForNumberString = str => 
  Box(str)
  .map(s => s.trim()) // [5]
  .map(r => parseInt(r))
  .map(i => i+1)
  .fold(i => String.fromCharCode(i)) 

const result = nextCharForNumberString('  64 ')
console.log( result )
```
[1] Capture the given 'x' into closure.   
[2] The return value type should be the same for chaining. It is called 'identity functor'.    
[3] Unwrap the return value.  
[4] For easier debugging.   
[5] 'Map' is a composition. It takes input and returns the output. More functions can be added.   

## 2. Refactor imperative code to a single composed expression using Box

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
    .map(r => parseFloat(r))

const percentToFloat = str =>
  Box(str.replace(/\%/g, ''))
    .map(replaced => parseFloat(replaced))
    .map(number => number * 0.01)

const applyDiscount = (price, discount) =>
  moneyToFloat(price)
    .fold(cost =>
      percentToFloat(discount)
        .fold(savings => cost - cost * savings))

const result = applyDiscount( '$5.00', '20%' )
console.log( result ) // 4
```

## 3. Enforce a null check with composable code branching using Either

```javascript
const Right = x =>
({
  map: f => Right(f(x)),     
  fold: (f, g) => g(x),       // [1]
  inspect: ()=> `Right(${x})` 
})

const Left = x =>
({
  map: f => Left(x),          // [2]
  fold: (f, g) => f(x),       // [1]
  inspect: ()=> `Left(${x})` 
})

const rightResult = Right(3).map(x => x+1).map(x => x/2).fold(x => 'error', x => x)
console.log( rightResult ) // 2

const leftResult = Left(3).map(x => x+1).map(x => x/2).fold(x => 'error', x => x)
console.log( leftResult ) // error
```

[1] The difference between 'Right' and 'Left' is 'fold'. If it's 'Right', it runs the second function. If it's 'Left', it runs the first function. This allows us to do pure functional error handling way.    
[2] Ignores all the requests and returns the given value.

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


// using Right and Left  

const fromNullable = x =>
  x != null ? Right(x) : Left(null)

const findColor = name =>
  fromNullable({red: '#ff4444', blue: '#3b5998', yellow: '#fff68f'}[name])

const result = findColor('green')
                .map(c => c.slice(1))
                .fold(e => 'no color', c => c.toUpperCase())
console.log( result ) // no color 
```

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

const tryCatch = f => {
  try {
    return Right(f())
  }catch(e){
    return Left(e)
  }
}

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

const getPort = () =>
  tryCatch(() => fs.readFileSync('config.json')) // [1] Right('')
  .map(c => tryCatch(JSON.parse(c))) // [2] Right(Right('')) or Right(Left())
  .fold(e => 3000, c => c.port)

const result = getPort()
console.log(result) // 8888

```

[1] It returns wrapped value.   
[2] Whatever the input is, it wraps value and returns it. So the result value will be wrapped 2 times. It will be quite confusing to figure it out and we need to fold twice which is a bit inconvenient.

That's why we need 'chain' in the Either.

```javascript
const Right = x =>
({
  chain: f => f(x),
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
  .chain(c => tryCatch(JSON.parse(c))) // [1] Right('')
  .fold(e => 3000, c => c.port)

const result = getPort()
console.log(result) // 8888

```

[1] Since we used 'chain' method, it will return only one 'Right'.

The difference between 'chain' and 'fold' is that 'fold' takes a value out of the box whether it's 'Right' or 'Left'. However, 'chain' expects you run a function and return another one. Thus, 'chain' would be one of the steps in the middle and 'fold' will be used to take the result value out of the box.

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

```javascript
const str = "a".concat("b").concat("c")
const arr = [1,2].concat([3,4]).concat([5,6]) // [1]

const arr = [1,2].concat(([3,4]).concat([5,6])) // [2]
```
[1] String and Array are semigroup since it has 'concat' method.   
[2] Even if we concat inner part first, we will get the same result. That's called associativity. 

```javascript
const Sum = x =>
({
  x,
  concat: ({x:y}) => Sum(x + y),
  inspect: () => `Sum(${x})`
})

const res = Sum('1').concat(Sum('2')) // Sum(3)
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

A user 'Nico' has accidentally made two accounts. We want to merge those accounts. Using Semigroup we can concat/combine two things together.

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

const acc2 = Map({ name: First('Nico'), isPaid: All(true), points: Sum(10),
friends: ['Gatsby'] })

const res = acct.concat(acct2)
console.log(res.toJS())

/* Output
{ name: First(Nico),
isPaid: All(false),
points: Sum(12),
friends: [ 'Franklin', 'Gatsby' ] } */
```

## Ensure failsafe combination using monoids

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

## A curated collection of Monoids and their uses

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

## Unbox types with foldMap


```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

---

References

- [Professor Frisby Introduces Composable Functional JavaScript](https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript)
- [Functional Programming for JavaScript People](https://medium.com/@chetcorcos/functional-programming-for-javascript-people-1915d8775504#.qzbqn0mgy)
- [Functional Programming In JavaScript — With Practical Examples (Part 1)](https://medium.freecodecamp.com/functional-programming-in-js-with-practical-examples-part-1-87c2b0dbc276#.8dao66cag)
- [Functional Programming In JavaScript — With Practical Examples (Part 2)](https://medium.freecodecamp.com/functional-programming-in-js-with-practical-examples-part-2-429d2e8ccc9e#.xvyndxcgo)
