# Functional Programming
> Functional Programming is a style of writing programs by simply composing a set of pure functions.

순수한 함수들을 조합하여 프로그램을 만드는 방법론

함수형 프로그래밍에서 중요한 원칙들 

- Pure functions 
- Function composition
- Avoid shared state 
- Avoid mutating state
- Avoid side effects 

이것들이 함수형 프로그래밍의 주된 장점이자 원칙들이다. 위의 원칙들이 모여서 선언적(declarative)이고 예상이 가능한 프로그래밍을 가능하게 한다.

## Pure function

-  **참조 투명성(referential transparency)**: 프로그램 동작의 변경없이 관련 값을 대체할 수 있다면 표현식을 참조 상 투명하다고 할 수 있다. 동일한 인자에 대해 동일한 값을 반환한다. 결과값이 없는 함수는 순수한 함수가 아니다. 테스트가 쉽고 코드의 흐름을 파악하는데 매우 유용하다.
- **부작용(side-effects)이 없다.** 모든 일은 함수 안에서 일어나고 외부의 state를 변형하지 않는다. 숨겨진 입력이나 출력이 없다. 때문에 의존성이 매우 적고 광범위하게 활용이 가능하다.

### Pure
```javascript
const add = (x, y) => x + y;

add(2, 3) === 5;
add(2, 3) === 5;
add(2, 3) === 5;
```
똑같은 입력값을 넣으면 항상 똑같은 결과값이 나온다는걸 보장한다.   
이 경우 함수를 단순 결과값인 5로 바꿔도 프로그램에 변화가 없다.  
하지만 add가 부작용을 가지고 있었다면 함수를 변경하지 않고 단순 결과값으로 바꾸는건 불가능하다.

### Impure

```javascript
const processNext = () => {
  const message = InboxQueue.popMessage();
  if(message){
    process(message);
  }
}
```
위의 함수는 보이는 매개변수와 반환값은 없다. 하지만 의존성이 있고 무언가 한다는 것을 볼 수 있다.  
이 경우는 숨겨진 입출력이 있는 것이다.   
숨겨진 입력은 popMessage()를 호출하기 전의 InboxQueue 상태이고, 숨겨진 출력은 process 호출로 인해 발생하는 모든 것과 모든 일이 끝나고 났을 때의 InboxQueue 상태이다.   
이 경우는 어떠한 입력이 올지 예상이 불가능하고 그에 따라서 출력이 어떻게 이루어지는지도 전혀 알 수 없다.   

```javascript
let name = 'Jeremy';
const setName = newName => {
  name = newName; // global variable dependency
}

const printUpperName = () => {
  console.log( name.toUpperCase() ) // I/O
}

describe('api', () => {
  beforeEach(() => mockConsoleLog());
  afterEach(() => restoreConsoleLog());

  it('sets and prints the name', () => {
    printUpperName();

    expect(console.log).calledWith('JEREMY');

    setName('Jet');
    printUpperName();

    expect(console.log).calledWith('JET');
  })
})
```
이러한 순수하지 않은 함수들은 프로그램을 예상하기 힘들게 만들고 테스트를 작성하기 어렵게 만든다.  

```javascript
const upperName = name => name.toUpperCase();

describe('api', () => {
  it('returns an uppercase name', () => {
    expect(upperName('Jeremy')).to.equal('JEREMY');
    expect(upperName('Jet')).to.equal('JET');
  })
})
```
순수한 함수는 숨겨진 입출력이나 부작용이 없으므로 테스트도 한결 쉽게 작성 할 수 있다.

## Declarative programming style

### Imperative
원하는 결과까지를 절차적으로 **어떻게** 하는지 설명하는 스타일을 Imperative하다고 한다.

```javascript
function doubleNumbers(numbers){
  const doubled = [];
  const l = numbers.length;

  for(let i = 0; i<l; i++){
    doubled.push(numbers[i] * 2);
  }

  return doubled;
}

console.log(doubleNumbers([1,2,3])) // [2,4,6]
```

### Declarative

원하는 결과를 바로 선언하는 식의 스타일. HTML, SQL등이 해당된다.   

```javascript
function doubleNumbers(numbers){
  return numbers.map(n => n * 2);
}
console.log(doubleNumbers([1,2,3])) // [2,4,6]
```

## Immutability

```javascript
const hobbies = [
  'programming',
  'reading',
  'music'
];

const firstTwo = hobbies.splice(0,2);

console.log(firstTwo) // ["programming", "reading"]

console.log(hobbies) // ["music"] 
```
마지막에 hobbies에 뭐가 들어있었는지 다시 확인하려니 처음과 다르게 music만 받게 된다.   
중간에 typo로 인해 splice가 들어가서 global state가 변경되었기 때문이다.   
이렇게 global state를 변경해서 문제가 생기는 경우 프로그램을 실행하지 않으면 확인할 수 없다.   

## Closure
함수가 쓰여질 때의 환경을 기억한다.

```javascript
const createAdder = (x) => {
  return (y) => x + y;
}

const add3 = createAdder(3);

console.log(add3(2))// 5
console.log(add3(3));// 6
```
createAdder가 실행이 종료되어도 반환된 함수는 createAdder의 매개변수 x에 대한 접근이 가능하다.   
함수가 쓰여질때의 그 스코프를 그대로 기억하고 있는 것이다.

```javascript
const debounce = (func, delay)=>{
  let inDebounce = undefined;
  return (...args)=>{
    clearTimeout(inDebounce);
    inDebounce = setTimeout(()=>{
      func.apply(this, args);
    }, delay);
  };
};

const logClicked = () => console.log('clicked');
  
const debouncedLog = debounce(logClicked, 300); 

window.document.addEventListener('click', (e) => {
  debouncedLog();
});

```

## Curry
> Currying is a process to reduce functions of more than one argument to functions of one argument with the help of lambda calculus.

```
f(n)(m) --> f'(n, m)
```

```javascript
const add = x => y => x + y;
```

```javascript
multiply = (n, m) => (n * m)
multiply(3, 4) === 12 // true

curryedMultiply = (n) => ( (m) => multiply(n, m) )
triple = curryedMultiply(3)
triple(4) === 12 // true
```

```javascript
const map = fn => array => array.map(fn);
const multiply = x => y => x * y;
const pluck = key => object => object[key];

const discount = multiply(0.98);
const tax = multiply(1.0925);

const customRequest = request({ headers: { 'X-Custom': 'mykey' }});

customRequest({ url: '/cart/items' })
  .then( map(pluck('price')) )
  .then( map(discount) )
  .then( map(tax) );

/*
input data
[
  {price: 5},
  {price: 10},
  {price: 3}
]

output
[
  5.35,
  10.71,
  3.21
]
*/
```
카트 안의 물품들의 가격을 추출하고 할인을 적용하고 세금을 적용한다. 각각 작은 함수들을 순차적으로 적용해서 결과를 도출한다.

## Higher Order Function
자바스크립트에서 함수는 일등시민이다. 변수에 넣거나, 매개 변수로 전달하는 등 기본 데이터 타입과 똑같이 사용 될 수 있다.   
Higher Order Function이란 다른 함수를 매개변수로 받아서 결과를 반환하는 함수이다. array의 map, filter, reduce등이 대표적인 higher order function이다.

```javascript
let animals = [
  { name: 'Fluffy', species: 'rabbit' },
  { name: 'Daum', species: 'dog' },
  { name: 'Lucky', species: 'dog' },
  { name: 'Harold', species: 'fish' },
  { name: 'Jimmy', species: 'cat' },
  { name: 'Tom', species: 'cat' }
]

let dogs = [];
for(let i=0; i<animals.length; i++){
  if(animals[i].species === 'dog'){
    dogs.push(animals[i])
  }
}

console.log(dogs) 
// [{ name: 'Daum', species: 'dog' },{ name: 'Lucky', species: 'dog' }]

```
```javascript
let animals = [
  { name: 'Fluffy', species: 'rabbit' },
  { name: 'Daum', species: 'dog' },
  { name: 'Lucky', species: 'dog' },
  { name: 'Harold', species: 'fish' },
  { name: 'Jimmy', species: 'cat' },
  { name: 'Tom', species: 'cat' }
]

const dogs = animals.filter((animal) => animal.species === 'dog' )
//다른 함수를 매개변수로 받아서 실행한다.

console.log(dogs)
// [{ name: 'Daum', species: 'dog' },{ name: 'Lucky', species: 'dog' }]
```


## Function composition
두 개 이상의 함수들을 조합해서 새로운 함수를 만들어 내는 것. 레고 블럭처럼 작은 함수들을 조합해서 복잡한 과제를 해결하는 방법이다.
```
f(g(x))
```

![](https://github.com/carly-lee/TIL/raw/master/resouces/images/function-composition.png)   
어떤 함수가 입력을 받아 값을 반환하면, 그 반환된 값이 다른 함수의 입력이 된다. 각각의 함수에서 연산된 데이터를 계속해서 더 이상 다른 함수가 없을 때까지 넘기는 것이다. 

유저 이름을 URL slug로 만들어보자 

1. 이름을 스페이스마다 나누어서 배열로 만든다.
2. 소문자로 mapping한다.
3. -로 연결한다.
4. URI component로 인코딩한다.

```javascript
const toSlug = input => 
encodeURIComponent(
  input.split(' ')
    .map(str => str.toLowerCase())
    .join('-')
);

console.log(toSlug(‘Test Name’)) // ‘test-name'
```
확장성이 떨어지고 읽기 힘들다.

```javascript
const map = fn => arr => arr.map(fn)

const join = str => arr => arr.join(str);

const toLowerCase = str => str.toLowerCase();

const split = splitOn => str => str.split(splitOn);

const toSlug = input => 
encodeURIComponent(
  join('-')(
    map(toLowerCase)(
      split(' ')(
        input
      )
    )
  )
);
console.log(toSlug(‘Test Name’)) // ‘test-name'
```
이렇게 변경하면 그때 그때 용도에 따라 .으로 split을 할수도 있고 *으로 연결을 할수도 있다.

하지만 여전히 안에서 바깥으로 읽는게 불편한데 이 경우는 pipe를 활용하면 편하다.(lodash에서는 flow)
```javascript
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const map = fn => arr => arr.map(fn)

const join = str => arr => arr.join(str);

const toLowerCase = str => str.toLowerCase();

const split = splitOn => str => str.split(splitOn);

const toSlug = pipe(
  split(' '),
  map(toLowerCase),
  join('-'),
  encodeURIComponent
);

console.log(toSlug(‘Test Name’)) // ‘test-name’
```

위의 카트안의 물품 가격 계산을 function composition을 사용하여 한번에 동기로 계산 할 수 있다.
```javascript
import { compose } from 'lodash/fp';

const map = fn => array => array.map(fn);
const multiply = x => y => x * y;
const pluck = key => object => object[key];

const discount = multiply(0.98);
const tax = multiply(1.0925);

const customRequest = request({ headers: { 'X-Custom': 'mykey' }});

customRequest({ url: '/cart/items' })
  .then( map(
    // <--- right to left. became single iteration.
    compose( tax, discount, pluck('price') ) 
    // map( tax( discount( pluck('price') )))
  ));
```

```javascript
function validateResponse( response ){
  return new Promise(( resolve, reject ) => {
    if( response.status >= 200 && response.status < 400 ){
      resolve( response.json() );
    }else{
      reject( response.json() );
    }
  });
}

const defaultOptions = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
    }
  };

const request = defaults => validateFunc => options => {
  options = Object.assign( {}, defaults, options );
  return fetch( options.url, options )
      .then( validateFunc );
}

// make request functions by method types.
const get = request({ method: 'GET', ...defaultOptions})(validateResponse);
const post = request({ method: 'POST', ...defaultOptions})(validateResponse);
const put = request({ method: 'PUT', ...defaultOptions})(validateResponse);

// usage
const getUserInfo = get({ url: '/user/me' });
const updateUserInfo = put({ url: '/user/me', nickname: 'Curry' });
```

## Recursion 

factorial을 재귀 함수로 구현해보자.

```
4! = 4 x 3 x 2 x 1 = 24
```

```javascript
const factorial = n => {
  let result = 1;
  while (n>1){
    result *= n;
    n--;
  }
  return result;
}
```

```javascript
const factorial = n => {
  if( n < 2 ){
    return 1;
  }
  return n * factorial(n - 1);
}

/*
factorial(4)
4 * factorial(3)
4 * 3 * factorial(2)
4 * 3 * 2 * factorial(1)
4 * 3 * 2 * 1
4 * 3 * 2
4 * 6
24
*/
```

재귀함수는 매우 깔끔하고 확장성이 좋으나, 호출 할때마다 호출된 함수가 스택에 쌓이게 되고 이는 퍼포먼스 저하시키는데 많은 영향을 끼친다.

```javascript
factorial(100000) // RangeError: Maximum call stack size exceeded
```

ES6에서는 함수형 프로그래밍 언어에서 기본적으로 제공하는 Tail Call Optimization이 도입됐다. 재귀 함수가 함수가 끝나는 지점에서 가장 마지막에 호출되면 스택에 쌓이는 것이 아니라 하나의 스택에서 계속 교체가 되며 실행된다.

```javascript
const factorial = (n, accum = 1) => {
  if( n< 2 ) {
    return accum;
  }

  return factorial( n-1, n * accum ); 
}

/*
factorial(4, 1)
factorial(3, 4)
factorial(2, 12)
factorial(1, 24)
24
*/
```


- [Scenic City Summit 2016: Jeremy Fairbank - Functional Programming Basics in ES6 (JavaScript)](https://youtu.be/HvMemAgOw6I)
- [참조 투명성](https://ko.wikipedia.org/wiki/%EC%B0%B8%EC%A1%B0_%ED%88%AC%EB%AA%85%EC%84%B1)
- [What is a Pure Function?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976)
- [What is a Function Composition?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-function-composition-20dfb109a1a0)
- [What is Functional Programming?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0)
- [What is a Closure?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-closure-b2f0d2152b36#.ecfskj935)
- [함수형 프로그래밍이란 무엇인가?](https://medium.com/@jooyunghan/%ED%95%A8%EC%88%98%ED%98%95-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80-fab4e960d263)
- [So you want to be a functional programmer](https://medium.com/@cscalfani/so-you-want-to-be-a-functional-programmer-part-1-1f15e387e536)
- [Higher-order functions - Part 1 of Functional Programming in JavaScript](https://youtu.be/BMUiFMZr7vk)
- [Currying in JavaScript ES6](https://blog.benestudio.co/currying-in-javascript-es6-540d2ad09400)
- [Understanding Redux Middleware](https://medium.com/@meagle/understanding-87566abcfb7a)
- [ES6 Tail Call Optimization Explained](http://benignbemine.github.io/2015/07/19/es6-tail-calls/)
- [Playing with ES6: Tail Call Optimization](https://hackernoon.com/es6-tail-call-optimization-43f545d2f68b#.qi8kw0fx2)