const All = x =>
({
  x,
  concat: ({x:y}) => All(x && y),
  inspect: () => `All(${x})`
})

const res = All(true).concat(All(false)) // All(false)
const res2 = All(true).concat(All(true)) // All(true)

console.log(res)
console.log(res2)