# Currying

## Example - request util

```javascript
function getResponse( response ){
	const promise = new Promise(( resolve, reject ) => {
		if( response.status >= 200 && response.status < 400 ){
			resolve( response.json());
		}else{
			reject( response );
		}
	});
	return promise;
}

const defaultOptions = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
    }
  };

const request = defaults => method => options => {
    options = Object.assign( {}, defaults, method );
    return fetch( options.url, options )
        .then(getResponse)
        .then(response => response.json());
}

// add default header
const customRequest = request(defaultOptions);

// make request functions by method types.
const get = customRequest('GET');
const post = customRequest('POST');
const put = customRequest('PUT');

// usage
const getUserInfo = get({ url: '/user/me' });
const updateUserInfo = put({ url: '/user/me', nickname: 'Curry' });

```

# Partial application

---

References

- [Scenic City Summit 2016: Jeremy Fairbank - Functional Programming Basics in ES6 (JavaScript)](https://youtu.be/HvMemAgOw6I)
- [Ingredients of Effective Functional JavaScript: Closures, Partial Application and Currying](https://hackernoon.com/ingredients-of-effective-functional-javascript-closures-partial-application-and-currying-66afe055102a#.fyaw1xrkh)   
- [Curry or Partial Application? The Difference Between
Partial Application and Curry](https://medium.com/javascript-scene/curry-or-partial-application-8150044c78b8#.ivm6re1zq)   
- [Master the JavaScript Interview: What is Function Composition?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-function-composition-20dfb109a1a0#.n29szqx1m)
- [Functional JavaScript: Function Composition For Every Day Use.](https://hackernoon.com/javascript-functional-composition-for-every-day-use-22421ef65a10#.ecdho8gvf)