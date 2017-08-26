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
  x ? Right(x) : Left(null)

const findColor2 = name =>
  fromNullable({red: '#ff4444', blue: '#3b5998', yellow: '#fff68f'}[name])

const result2 = findColor2('green')
                .map(c => c.slice(1))
                .fold(e => 'no color', c => c.toUpperCase())
console.log( result2 ) // no color 