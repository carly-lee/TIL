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

const fromNullable = x =>
  x != null ? Right(x) : Left(null)

const fs = require('fs')

// const getPort = () => {
//   try {
//     const str = fs.readFileSync('config.json') // {port: 8888}
//     console.log('str:',str)
//     const config = JSON.parse(str)
//     console.log('config:',config)
//     return config.port
//   }catch(e){
//     return 3000
//   }
// }

// const result = getPort()
// console.log(result)

// Refactor 'getPort()'

const tryCatch = f => {
  try {
    return Right(f())
  }catch(e){
    return Left(e)
  }
}

const getPort = () =>
  tryCatch(() => fs.readFileSync('config.json')) 
  .map(c => tryCatch(() => JSON.parse(c)))
  .fold(e => 3000, c => 
    c.fold(e => 3000, c => c.port))

const result = getPort()
console.log(result) // 8888