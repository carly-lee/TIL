# Compositon 

- **Inheritance**   
Decide types what they **are**.   
Takes less memory and performance cost than 'composition'.   
Force people to predict the future architecture in early stage.

```javascript
  class Dog {

    constructor(){
      this.sound = 'woof';
    }

    talk() {
      console.log( this.sound );
    }
  }

  const sniffles = new Dog();
  sniffles.talk(); // woof 

  $('button').click( sniffles.talk ); // 'this' binded to global

  // to avoid not wanted 'this' binding side effects, 
  // it could be explicitly binded using 'bind()'
  $('button').click( sniffles.talk.bind(sniffles) );
```

- **Compositon**   
Decide types what they **do**.    
Easy to do, less side effects.   
Flexable to reflect addtional feature requirements.

In JavaScript, composition can be achieved by factory function.
Factory function looks like below.

```javascript
/* 
'dog()' returns a closure. 
So 'bark()' still can reach to 'sound' and 'sound' will be treated like private.
*/
  const dog = ()=> {
    const sound = 'woof';
    return {
      bark: ()=> console.log( sound );
    }
  }
  const sniffles = dog();
  sniffles.talk(); // woof 

  $('button').click( sniffles.talk ); // 'this' binded as expected!
```


## Compositon over Inheritance

- Inheritance is not required in JavaScript.
- Composition could prevent 'this' bind side effects.
- It's easy and flexable to handle (sometimes mercurial) business requirements.
- In Inheritance, if parent class would have been changed, there could be huge side effects on child classes. Also, child classes might inherit unnessary functions as well.
- composition is about 'doing' not 'being'. Though even a shared behavior would have been changed, other composite objects will be fine since the changed behavior has only one clear purpose which is behave in that way.

Making a murder robot dog using composition.

```javascript
// passing 'state' as an argument to share the state
const barker = (state) => ({   
  bark: () => console.log('Woof, I am ' + state.name)
});

const driver = (state) => ({
  drive: () => state.position = state.position + state.speed
});

const murderRobotDog = (name)  => {

  let state = {
    name,
    speed: 100,
    position: 0
  }

  return Object.assign(
        {},
        barker(state),
        driver(state),
        killer(state)
    );
};
const bruno =  murderRobotDog('bruno');
bruno.bark(); // "Woof, I am Bruno"
```

reference 
- [Composition over Inheritance](https://medium.com/humans-create-software/composition-over-inheritance-cb6f88070205#.e03go36vv)
- [Master the JavaScript Interview: What is Function Composition?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-function-composition-20dfb109a1a0#.3j54z47br)
- [Master the JavaScript Interview: What is Functional Programming?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0#.hjjkfjh5f)