# [Professor Frisby Introduces Composable Functional JavaScript](https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript)

- Create linear data flow with container style types(Box)   
In the following code, several operations happens in one function.

```javascript
const nextCharForNumberString = str => {
  const trimmed = str.trim();
  const number = parseInt(trimmed);
  const nextNumber = number + 1;
  return String.fromCharCode(nextNumber);
}

const result = nextCharForNumberString('  64 ');
console.log( result );
```
The above code could be rewritten like below.
However, it is quite hard to follow and not straightforward.

```javascript
const nextCharForNumberString = str => String.fromCharCode( parseInt(str.trim()) +1 );
const result = nextCharForNumberString('  64 ');
console.log( result );
```

Let's make small functions which does only one work at a time and compose it.
Since 'string' in javascript cannot be mapped, it needs to be in a box in order to be mapped.

```javascript
const Box = x =>
({
  map: f => Box(f(x)),      // [1]
  fold: f => f(x),
  inspect: ()=> `Box(${x})` // [2]
});

const nextCharForNumberString = str => 
  Box(str)
  .map(s => s.trim()) // [3]
  .map(r => parseInt(r))
  .map(i => i+1)
  .fold(i => String.fromCharCode(i)); //[4]

const result = nextCharForNumberString('  64 ');
console.log( result );
```
[1] The return value type should be the same for chaining. It is called 'identity functor'   
[2] For easier debugging.   
[3] 'Map' is a composition. It takes input and returns the output. More functions can be added.   
[4] Unwrap the return value.

---

References

- [Professor Frisby Introduces Composable Functional JavaScript](https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript)