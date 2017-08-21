const Box = x =>            
({
  map: f => Box(f(x)),      
  fold: f => f(x),          
  inspect: ()=> `Box(${x})` 
})

const nextCharForNumberString = str => 
  Box(str)
  .map(s => s.trim()) // Box('64')  
  .map(r => parseInt(r)) // Box(64)
  .map(i => i + 1) // Box(65)
  .fold(i => String.fromCharCode(i)) // A

const result = nextCharForNumberString('  64 ')
console.log( result ) // A