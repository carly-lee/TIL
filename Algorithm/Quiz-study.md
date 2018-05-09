## 이상한 문자 만들기

toWeirdCase함수는 문자열 s를 매개변수로 입력받습니다.
문자열 s에 각 단어의 짝수번째 인덱스 문자는 대문자로, 홀수번째 인덱스 문자는 소문자로 바꾼 문자열을 리턴하도록 함수를 완성하세요.
예를 들어 s가 try hello world라면 첫 번째 단어는 TrY, 두 번째 단어는 HeLlO, 세 번째 단어는 WoRlD로 바꿔 TrY HeLlO WoRlD를 리턴하면 됩니다.

주의 문자열 전체의 짝/홀수 인덱스가 아니라, 단어(공백을 기준)별로 짝/홀수 인덱스를 판단합니다.

```javascript
function toWeirdCase(s){
  return s.split(' ').map((word, index) => {
    return word.split('').map((v, i) => {
      return i%2===0 ? v.toUpperCase() : v.toLowerCase();
    }).join('');
  }).join(' ');
}
```

```javascript
function toWeirdCase(s){
  return s.toUpperCase().replace(/(\w)(\w)/g, a => a[0]+a[1].toLowerCase())

}
```


// 아래는 테스트로 출력해 보기 위한 코드입니다.
console.log("결과 : " + toWeirdCase("try hello world"));


## 행렬의 곱셈 
행렬의 곱셈은, 곱하려는 두 행렬의 어떤 행과 열을 기준으로, 좌측의 행렬은 해당되는 행, 우측의 행렬은 해당되는 열을 순서대로 곱한 값을 더한 값이 들어갑니다. 행렬을 곱하기 위해선 좌측 행렬의 열의 개수와 우측 행렬의 행의 개수가 같아야 합니다. 곱할 수 있는 두 행렬 A,B가 주어질 때, 행렬을 곱한 값을 출력하는 productMatrix 함수를 완성해 보세요.

[연습: 매트릭스 곱](https://msdn.microsoft.com/ko-kr/library/hh873134.aspx)

```javascript
function productMatrix(A, B) {
	var answer = new Array();
	for( let row = 0; row<A.length; row++ ){
    answer.push([]);
		for( let col = 0; col<B[0].length; col++ ){
      answer[row][col] = 0;
      for( let inner = 0; inner <A[row].length; inner++ ){
       	answer[row][col] += A[row][inner] * B[inner][col];
      }
    }
  }
  return answer;
}

// 아래는 테스트로 출력해 보기 위한 코드입니다.
var a = [ [1,2],
          [4,5],
        	[6,7] ];
var b = [ [1,2,3],
          [4,5,6] ];
console.log("결과 : " + productMatrix(a, b)); 
//결과 : 
//9,12,15,
//24,33,42,
//34,47,60

```


## 괄호 확인하기
is_pair함수는 문자열 s를 매개변수로 입력받습니다.
s에 괄호가 알맞게 짝지어져 있으면 True를 아니면 False를 리턴하는 함수를 완성하세요.
예를들어 s가 (hello)()면 True이고, )(이면 False입니다.
s가 빈 문자열("")인 경우는 없습니다.

```javascript
function is_pair(s){
  var stack = [];
  for( var i=0; i<s.length; i++ ){
    if( s[i] === '(' ) stack.push(s[i]);
    if( s[i] === ')' ){
      if( stack.length < 1 ) return false;
      else stack.pop();
    }
  }
  return stack.length === 0;
}

// 아래는 테스트로 출력해 보기 위한 코드입니다.
console.log( is_pair("(hello)()") )
console.log( is_pair(")(") )
```

## 가장 긴 팰린드롬
앞뒤를 뒤집어도 똑같은 문자열을 palindrome이라고 합니다.
longest_palindrom함수는 문자열 s를 매개변수로 입력받습니다.
s의 부분문자열중 가장 긴 palindrom의 길이를 리턴하는 함수를 완성하세요.
예를들어 s가 토마토맛토마토이면 7을 리턴하고 토마토맛있어이면 3을 리턴합니다.

### recursive

```javascript
function longest_palindrom(s){
  // 함수를 완성하세요
  if (s === s.split("").reverse().join("")) {
    return s.length;
  } else {
    var A = longest_palindrom(s.substring(0, s.length-1));
    var B = longest_palindrom(s.substring(1, s.length));
    return Math.max(A, B);
  }
}

// 아래는 테스트로 출력해 보기 위한 코드입니다.
console.log( longest_palindrom("토마토맛토마토") )
console.log( longest_palindrom("토마토맛있어") )
```

### non recursive
재귀적 해결방법은 읽기 편하나 자바스크립트는 재귀 함수 최적화가 아직 도입되지 않아서 성능이 떨어지는 단점이 있다.  
반복문으로 바꾼 경우는 아래와 같음
```javascript
function isPalindrom(s){
  return s === s.split("").reverse().join("");
}

function longest_palindrom(s){
  let start = 0;
  let end = s.length-1;
  let size = 1;
  
  while(end > 0){
    if(isPalindrom(s.slice(start))){
      size = Math.max(s.slice(start).length, size);
    }
    if(isPalindrom(s.slice(0, end))){
      size = Math.max(s.slice(0, end).length, size);
    }
    start ++;
    end --;
  }
  return size;
}

// 아래는 테스트로 출력해 보기 위한 코드입니다.
console.log( longest_palindrom("토마토맛토마토") )
console.log( longest_palindrom("토마토맛있어") )
console.log( longest_palindrom("zzbaabcd") ) 

```

## 땅따먹기(동적 프로그래밍 문제)

땅따먹기 게임을 하려고 합니다. 땅따먹기 게임의 땅(land)은 총 N행 4열로 이루어져 있고, 모든 칸에는 점수가 쓰여 있습니다. 1행부터 땅을 밟으며 한 행씩 내려올 때, 각 행의 4칸 중 한 칸만 밟으면서 내려와야 합니다. 단, 땅따먹기 게임에는 한 행씩 내려올 때, 같은 열을 연속해서 밟을 수 없는 특수 규칙이 있습니다.

예를 들면,

| 1 | 2 | 3 | 5 |

| 5 | 6 | 7 | 8 |

| 4 | 3 | 2 | 1 |

로 땅이 주어졌다면, 1행에서 네번째 칸 (5)를 밟았으면, 2행의 네번째 칸 (8)은 밟을 수 없습니다.

마지막 행까지 모두 내려왔을 때, 얻을 수 있는 점수의 최대값을 return하는 solution 함수를 완성해 주세요. 위 예의 경우, 1행의 네번째 칸 (5), 2행의 세번째 칸 (7), 3행의 첫번째 칸 (4) 땅을 밟아 16점이 최고점이 되므로 16을 return 하면 됩니다.

제한사항
행의 개수 N : 100,000 이하의 자연수
열의 개수는 4개이고, 땅(land)은 2차원 배열로 주어집니다.
점수 : 100 이하의 자연수

```javascript
function solution(land) {
  const dp = [];
  for(let i = 0; i<land.length; i++){
      dp.push(Array.apply(null, new Array(4)).map(() => 0))
  }
  
  for(let i = 0; i<4; i++){
    dp[0][i] = land[0][i];
  }
  
  for(let i = 1; i<land.length; i++){
    for(let j = 0; j<4; j++){
      for(let k = 0; k<4; k++){
        if(k!==j){
          dp[i][j] = Math.max(dp[i][j], land[i][j] + dp[i-1][k])
        }
      }
    }
  }
  
  let result = 0;
  for(let i = 0; i<4; i++){
    result = Math.max(result, dp[land.length-1][i])
  }
  
  return result;
}

 //아래는 테스트로 출력해 보기 위한 코드입니다.
var board = [[ 1, 2, 3, 5 ], [ 5, 6, 7, 8 ], [ 4, 3, 2, 1]];
console.log(solution(board, 3));
```

```javascript
function hopscotch(board, size) {
  const dp = [];
  for(let i = 0; i<size; i++){
    dp.push(Array.apply(null, new Array(4)).map(() => 0))
  }
  
  dp[0] = [...board[0]];
  
  for(let i = 1; i<size; i++){
    for(let j = 0; j<4; j++){
      dp[i][j] = board[i][j] + Math.max(...dp[i-1].filter((v,idx) => idx !== j));
    }
  }
  
  return dp.reduce((acc, row) => Math.max(acc, ...row), 0);
}

 //아래는 테스트로 출력해 보기 위한 코드입니다.
var board = [[ 1, 2, 3, 5 ], [ 5, 6, 7, 8 ], [ 4, 3, 2, 1]];
console.log(hopscotch(board, 3));
```

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

```javascript

```

---

References

- [프로그래머스](https://programmers.co.kr/learn/challenges)
