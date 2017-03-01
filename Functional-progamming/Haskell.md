# Haskell

- Purely functional 
- Lazy
- Type inference 

## Basic calculations

```haskell
2 + 3 * 5 -- 17

2 * -4 -- error!! 

2 * (-4) -- -8 needs parentheses

3 / 2 -- 1.5 The / operator in Haskell returns float.

-- Haskell allows us to store extremely large numbers.
3^(19*19) -- 17408965065903192790718823807056436794660272495026354119482811870680105167618464984116279288988714938612096988816320780613754987181355093129514803369660572893075468180597603 
```


## let 
We can use the let keyword to define a name right in GHCI. Doing let a = 1 inside GHCI is the equivalent of writing a = 1 in a script and then loading it.

```haskell
ghci> let lostNumbers = [4,8,15,16,23,42]  
ghci> lostNumbers  
[4,8,15,16,23,42]  
```

## Functions
- The function name cannot be start with uppercase. It's not a convention. It's forced to do so in Haskell.
- The function name is followed by parameters seperated by spaces

```haskell
doubleMe x = x + x  
doubleUs x y = x*2 + y*2   

ghci> doubleUs 4 9  
26  
ghci> doubleUs 2.3 34.2  
73.0  
ghci> doubleUs 28 88 + doubleMe 123  
478  
```
'doubleUs' can be rewritten like below 

```haskell
doubleUs x y = doubleMe x + doubleMe y   
```

## IF statement 
The difference between Haskell's if statement and if statements in imperative languages is that **the else part is mandatory** in Haskell. In Haskell every expression and function must return something.

```haskell
doubleSmallNumber x = if x > 100  
                        then x  
                        else x*2   
```

```bash
*Main> :l program # :loading or :l - loading program 
[1 of 1] Compiling Main             ( program.hs, interpreted )
Ok, modules loaded: Main.
*Main> doubleSmallNumber 120
120
*Main> doubleSmallNumber 12
24
*Main> 
```

Another thing about the if statement in Haskell is that it is an expression. An expression is basically a piece of code that returns a value. Because the else is mandatory, an if statement will always return something and that's why it's an expression. If we wanted to add one to every number that's produced in our previous function, we could have written its body like this.

```haskell
doubleSmallNumber' x = (if x > 100 then x else x*2) + 1  
```

We usually use ' to either denote a strict version of a function (one that isn't lazy) or a slightly modified version of a function or a variable.


---

References

- [Learn You a Haskell for Great Good!](http://learnyouahaskell.com/)
- [Learn You a Haskell on Youtube](https://www.youtube.com/playlist?list=PLPqPwGvHPSZB-urE6QFjKYt6AGXcZqJUh)
- [Learn Haskell in one video](http://www.newthinktank.com/2015/08/learn-haskell-one-video/)