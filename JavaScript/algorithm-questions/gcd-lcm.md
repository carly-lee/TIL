# [Greatest Common Divisor(GCD)](https://en.wikipedia.org/wiki/Greatest_common_divisor)
>In mathematics, the greatest common divisor (gcd) of two or more integers, when at least one of them is not zero, is the largest positive integer that divides the numbers without a remainder. For example, the GCD of 8 and 12 is 4.

## Find the greatest common divisor of two **positive** integers

GCD(최대공약수)  = (a*b)/LCM(최소공배수)

In general, find GCD first of two numbers and find LCM using that GCD.

### 1. Find the GCD without optimization
- The GCD can never be greater than smaller number between two numbers.
- Start loop with smaller number until find the greatest number that these two numbers share in common. 

```javascript
function getGCD( a, b ){

  for( var i = b; i > 0; i-- ){
    if( a%i === 0 && b%i === 0 ) break;
  }
  console.log( 'gcd : ', i );
}

getGCD(12, 9); // 3
```

### [Euclidean Algorithm](https://en.wikipedia.org/wiki/Euclidean_algorithm) [쉬운 한국어 설명](http://mathbees2.blogspot.kr/2014/09/4_24.html)
> The Euclidean algorithm is based on the principle that the greatest common divisor of two numbers does not change if the larger number is replaced by its difference with the smaller number.

- Find a remainder by dividing the largest number by the smallest number.
- Repeat that until the remainder becomes 0.

```javascript
function getGCD( high, low ){
  // 12 8
  // 8 4 
  // 4 0
  if( low === 0 ) return high;
  return getGCD( low, high%low );
}

getGCD(12, 8); // 4
```

Since the recursive functions cost expensive, it is recommended to change it to loop.

```javascript
function getGCD( high, low ){
  var temp;
  while(low){
    temp = high%low;
    high = low;
    low = temp;
  }
  return high;
}

getGCD(12, 9); // 3
```

## Find the GCD of more than two positive integers

```javascript
function getGCD( high, low ){ 
  var temp; 
  while(low){ 
    temp = high%low; 
    high = low; 
    low = temp; 
  } 
  return high; 
}

function getGCDs(array){
  var gcd = getGCD(array[0], array[1]);
  for( var j=2; j<array.length; j++ ){
    gcd = getGCD( array[j], gcd );
  }
  return gcd;
}

getGCDs([3, 9, 15, 21]); // 3
getGCDs([105, 210, 252]) // 21
```


# [Least Common Multiple(LCM)](https://en.wikipedia.org/wiki/Least_common_multiple)
>In arithmetic and number theory, the least common multiple of two integers a and b is the smallest positive integer that is divisible by both a and b. Since division of integers by zero is undefined, **this definition has meaning only if a and b are both different from zero**...

## Find the LCM of two positive integers

- LCM(최소공배수) = (a*b)/GCD(최대공약수)

```javascript
function getGCD( high, low ){ 
  var temp; 
  while(low){ 
    temp = high%low; 
    high = low; 
    low = temp; 
  } 
  return high; 
}

function getLCM( a, b ){
  return a*b/getGCD(a,b);
}

getLCM( 4, 8 ); // 8
getLCM( 3, 7 ); // 21
```


## Find the LCM of more than two positive integers

```javascript
function getGCD( high, low ){ 
  var temp; 
  while(low){ 
    temp = high%low; 
    high = low; 
    low = temp; 
  } 
  return high; 
}

function getLCM( a, b ){
  return a*b/getGCD(a,b);
}

function nlcm(num) {
  var lcm = getLCM(num[0],num[1] );
  for( var j=2; j<num.length; j++ ){
    lcm = getLCM( num[j], lcm );
  }
  return lcm;
}

nlcm([2,6,8,14]); // 168
```



