const Sum = x =>
({
  x,
  concat: ({x:y}) => Sum(x + y),
  inspect: () => `Sum(${x})`
})

const res = Sum(1).concat(Sum(2)) 
const res2 = Sum('a').concat(Sum('b')) 

console.log(res)
console.log(res2)