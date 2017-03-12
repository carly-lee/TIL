# Flatten promise with generator 

```javascript
const url = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json'
const fetch = require('node-fetch')

function* createQuoteFetcher(){
  const response = yield fetch(url)
  const quote = yield response.json()
  return `${quote.quoteText} -${quote.quoteAuthor}`
}

const quoteFetcher = createQuoteFetcher()

quoteFetcher.next().value
  .then(res => quoteFetcher.next(res).value)
  .then(res => quoteFetcher.next(res).value)
  .then(quote => console.log(quote))
  .catch(err => console.log(err))
```
Since waiting the response and parsing it as json are generic behavior. We can get rid of this generic behavior from our execution code.

```javascript
function* createQuoteFetcher(){
  const response = yield fetch(url)
  const quote = yield response.json()
  return `${quote.quoteText} -${quote.quoteAuthor}`
}

const coroutine = (gen) => {
  const generator = gen()
  const handle = (result) => {
    if(result.done) return Promise.resolve(result.value)
    return Promise.resolve(result.value)
      .then(res => handle( generator.next(res)) )
  }
  return handle( generator.next() )
}

const quoteFetcher = coroutine(createQuoteFetcher)
  .then(quote => console.log(quote))
  .catch(err => console.log(err))
```

---

References

- [Write simple asynchronous code with JavaScript generators](https://egghead.io/courses/write-simple-asynchronous-code-with-javascript-generators)