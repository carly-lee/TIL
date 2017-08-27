const First = x => 
({
  x,
  concat: _ => First(x),
  inspect: () => `First(${x})`
})
const res = First("blah").concat(First("ice cream")).concat(First("meta programming")) 

console.log(res)