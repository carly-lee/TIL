# [Prime Number](https://en.wikipedia.org/wiki/Prime_number)    
> A prime number (or a prime) is a natural number greater than 1 that has no positive divisors other than 1 and itself.

- Make a function which can verify a given argument is prime number or not.

```javascript

function isPrime(n) {
  if( n < 2 ) return false;
  for( var i=2; i<n; i++ ){
    if( n%i === 0 ) return false;
  }
  return true;
}

isPrime(15) // false
isPrime(5) // true

```
- optimization 

```javascript

function isPrime(n) {
  // check simple cases 
  if( n < 2 || n % 2 === 0 ) return false;
  if( n === 2 || n === 3 ) return true;

  // Increase i by 2 since we've removed the possibility of multiple of 2 from above.
  for( var i=3; i<n; i+=2 ){ 
    if( n%i === 0 ) return false;
  }
  return true;
}

isPrime(15) // false
isPrime(5) // true

```

- Make a function which takes an argument and returns how many prime numbers that argument has.

```javascript
function numberOfPrime(n) {
  var result = 0;
  var isPrime;
  for( var i=2; i<=n; i++ ){
    isPrime = true;
    for( var j=2; j<i; j++ ){ 
      if( i%j===0 ) isPrime = false;
    }
    if( isPrime ) result++;
  }
  return result;
}

numberOfPrime(10); // 4
numberOfPrime(5); // 3
```

