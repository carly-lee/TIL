# Swift Basic

## Variable types

- **var**  
  variable
- **let**  
  constant.
  > The value of a constant doesn’t need to be known at compile time, but you must assign it a value exactly once. If the initial value doesn’t provide enough information (or if there is no initial value), specify the type by writing it after the variable, separated by a colon.

```swift
var hello = "Hello "
var world: String = "World"

// Combine strings
var msg = hello + world // Hello World

// You can place variables in print
print("Hello \(world)") // Hello World

let quotation = """
I said "I have \(apples) apples."
And then I said "I have \(apples + oranges) pieces of fruit."
"""


let nickname: String? = nil
let fullName: String = "John Appleseed"
let informalGreeting = "Hi \(nickname ?? fullName)" // if nickname is missing fullName will be used as a default value
```

## Data Types

```swift
// Use let to define a constant
// The type of this constant will be Double.
// When there's no type annotation on the floating number, Double is preferred
let pi = 3.14159265359

// Declare an int
var myAge: Int = 42

// Min and Max Integer Size
print("Min Int \(Int64.min)") // Min Int -9223372036854775808
print("Max Int \(Int64.max)") // Max Int 9223372036854775807

// Floats and Doubles store numbers with decimals
var pi2: Float = 3.1415
var pi3: Double = 3.1415

// Min and Max Doubles
print("Min Double \(Double.leastNormalMagnitude)") // Min Double 2.2250738585072e-308
print("Max Double \(Double.greatestFiniteMagnitude)") // Max Double 1.79769313486232e+308

// Max Float
print("Max Float \(Float.greatestFiniteMagnitude)") // Max Float 3.40282e+38
// Float only acurates up to 15 digits
// Other data types : Int8, Int16, Int32, Int64,
// UInt8, UInt16, UInt32, UInt64, Float80

// Booleans
var canVote: Bool = true

// Characters
var myGrade: Character = "A"

// Casting
var three: Double = 3.0
var two: Int = 2

// This would be an error without the cast
var five = three + Double(two)

// Cast to Int
print("3 : \(Int(3.14))") // 3 : 3

// Generate a random value from 1 to 10
var rand = Int.random(in: 1...10)
print("Rand : \(rand)")
```

## Conditionals

### Comparison Operators : > < >= <= == !=

- === : Checks if pointing to same reference
- !== : Checks if don't point at same reference

### if / else

> In an if statement, the conditional must be a Boolean expression—this means that code such as **if score { ... } is an error, not an implicit comparison to zero**.

```swift
var age: Int = 8

if age < 5 {
  print("Go to Preschool")
} else if age == 5 {
  print("Go to Kindergarten")
} else if (age > 5) && (age <= 18){
  let grade: Int = age - 5
  print("Go to Grade \(grade)")
} else {
  print("Go to College")
}
// Go to Grade 3

```

```swift
var optionalString: String? = "Hello"
print(optionalString == nil)
// Prints "false"

var optionalName: String? = "John Appleseed"
var greeting = "Hello!"

// If the optional value is nil, the conditional is false and the code in braces is skipped.
// Otherwise, the optional value is unwrapped and assigned to the constant after let,
// which makes the unwrapped value available inside the block of code.
if let name = optionalName {
    greeting = "Hello, \(name)"
}
```

### switch

> After executing the code inside the switch case that matched, the program exits from the switch statement. Execution doesn’t continue to the next case, so there is no need to explicitly break out of the switch at the end of each case’s code.

```swift
let ingredient = "pasta"

let vegetable = "red pepper"
switch vegetable {
case "celery":
    print("Add some raisins and make ants on a log.")
case "cucumber", "watercress":
    print("That would make a good tea sandwich.")
case let x where x.hasSuffix("pepper"):
    print("Is it a spicy \(x)?")
default:
    print("Everything tastes good in soup.")
}
// Prints "Is it a spicy red pepper?"


// You can also match ranges
let testScore: Int = 89

switch testScore {
case 93...100:
  print("You got an A")
case 85...92:
  print("You got a B")
case 77...84:
  print("You got a C")
case 69...76:
  print("You got a D")
default:
  print("You got an F")
}
// You got a B
```

## Math

```swift
print("5 + 4 = \(5 + 4)") // 5 + 4 = 9
print("5 - 4 = \(5 - 4)") // 5 - 4 = 1
print("5 * 4 = \(5 * 4)") // 5 * 4 = 20
print("5.0 / 4.0 = \(5.0 / 4.0)") // 5.0 / 4.0 = 1.25
print("5/ 4.0 = \(5 / 4.0)") // 5.0 / 4.0 = 1.25
// 5/4 will be just 1. should be double.
print("5 % 4 = \(5 % 4)") // 5 % 4 = 1

// Math Functions
print("abs(-5) = \(abs(-5))") // abs(-5) = 5
print("floor(5.5) = \(floor(5.5))") // floor(5.5) = 5.0
print("ceil(5.4) = \(ceil(5.4))") // ceil(5.4) = 6.0
print("max(5,4) = \(max(5,4))") // max(5,4) = 5
print("min(5,4) = \(min(5,4))") // min(5,4) = 4
print("pow(5,2) = \(pow(5,2))") // pow(5,2) = 25
print("sqrt(25) = \(sqrt(25))") // sqrt(25) = 5.0
print("log(2.71828) = \(log(2.71828))") // log(2.71828) = 0.999999327347282
```

## String

```swift
// Escape Characters : \\ \t \n \" \'
var randStr = "This is a random string"
var randStr2 = " and here is another"

// Join strings
var randStr3 = randStr + randStr2 // This is a random string and here is another

// String length
print("Length : \(randStr3.count)") // Length : 43

// Get the first character
print("First : \(randStr3[randStr3.startIndex])") // First : T

// Get the 5th character
let index5 = randStr3.index(randStr3.startIndex, offsetBy: 5)
print("5th : \(randStr3[index5])") // 5th : i

// Check if string is empty
print("Empty : \(randStr.isEmpty)") // Empty : false

// Insert a character at an index
randStr2.insert("A", at: randStr2.startIndex) // A and here is another

// Insert a string at an index
randStr2.insert(contentsOf: " string ", at: randStr2.index(randStr2.startIndex, offsetBy: 2))
print(randStr2) // A  string and here is another

// Get a substring
let startIndex = randStr2.index(randStr2.startIndex, offsetBy: 2)
let endIndex = randStr2.index(randStr2.startIndex, offsetBy: 9)
let stringRange = startIndex ..< endIndex
let subStr = randStr2[stringRange] // string

// Replace a string
// Check if there is a match
if let hereMatch = randStr2.range(of: "here"){
  randStr2.replaceSubrange(hereMatch, with: "there")
}
print(randStr2) // A  string and there is another

let galaxy = "Milky Way 🐮"
for char in galaxy {
  print(char)
}
/*
M
i
l
k
y

W
a
y

🐮
*/
```

## Arrays

```swift
// Make empty array
var array1 = [Int]() // []

// Check if array is empty
print("Empty \(array1.isEmpty)") // Empty true

// Add value to array
array1.append(5) // [5]

// Add another item
array1 += [7, 9] // [5, 7, 9]

// Get array item
print("Index 1 : \(array1[1])") // Index 1 : 7

// Change value at index
array1[0] = 4 // [4, 7, 9]

// Insert at an index
array1.insert(10, at: 3) // [4,7,9,10]

// Remove item
array1.remove(at: 3) // [4,7,9]

// Change multiple values
array1[0...2] = [1,2,3] // [1,2,3]

// Length of array
print("Length : \(array1.count)") // Length : 3

// Fill array with a value
var array2 = Array(repeating: 0, count: 5) // [0, 0, 0, 0, 0]

// Combine arrays
var array3 = array1 + array2 // [1, 2, 3, 0, 0, 0, 0, 0]

// Iterate through an array
for item in array3 {
  print(item)
}

// Get index and value
for (index, value) in array3.enumerated() {
  print("\(index) : \(value)") // 0 : 1, 0 : 2 ...
}

```

## Loop

### for

```swift
var array4 = [1,2,3]

// Iterate through array
for item in array4 {
  print(item)
}
// 1,2,3

// Iterate with a range
for i in 1...5 {
  print(i)
}
// 1,2,3,4,5
```

### for where

```swift
for i in 1...10 where i % 2 == 0 {
  print("Even : \(i)")
}
/*
Even : 2
Even : 4
Even : 6
Even : 8
Even : 10
*/
```

### for stride

```swift
// Use stride to create even values from 10 to 2
for i in stride(from: 10, through:2, by: -2){
    print(i)
}
/*
10
8
6
4
2
*/
```

### while

```swift
var i: Int = 1
while i < 10 {

  if i % 2 == 0 {
    i += 1
    // Continue jumps back to the beginning of the loop
    continue
  }

  if i == 7 {
    // Break ends the loop
    break
  }

  print(i)
  i += 1
}

// 1, 3, 5
```

### Repeat while

```swift
// Generate a random number
let magicNum: Int = Int.random(in: 1...10)
var guess: UInt32 = 0

// Run the code at least once
repeat {
 print("Guess : \(guess)")
 guess += 1
} while (magicNum != guess)

 print("Magic Number was \(magicNum)")

```

### Iterator

```swift
 // Create an iterator that pops out the next value with next
var i = (1...5).makeIterator()
while let i = i.next(){
    print(i)
}
// 1,2,3,4,5
```

## Dictionaries

Stores unordered lists of key value pairs

```swift
// Create empty dictionary
var dict1 = [Int: String]() // [:]

// Check if empty
print("Empty : \(dict1.isEmpty)") // Empty : true

// Create an item with index of 1
dict1[1] = "Paul Smith"

// Create a dictionary with a string key
var cust: [String: String] = ["1": "Sally Marks", "2": "Paul Marks"]

// Size of dictionary
print("Size : \(cust.count)") // Size : 2

// Add an item
cust["3"] = "Doug Holmes"

// Change a value
cust["3"] = "Doug Marks"

// Get a value
if let name = cust["3"] {
  print("Index 3 : \(name)") // Index 3 : Doug Marks
}

// Remove a key value pair
cust["3"] = nil

// Iterate through a dictionary
for (key, value) in cust {
  print("\(key) : \(value)")
}
/*
2 : Paul Marks
1 : Sally Marks
*/
```

## Tuples

Tuples are finite group of values that are related

```swift
let height: Double = 6.25
let weight: Int = 175

// Create a tuple
let myData = (height, weight)

// Access values
print("Height : \(myData.0)") // Height : 6.25

// You can name values
let myData2 = (height: 6.25, weight: 175)

print("Weight : \(myData2.weight)") // Weight : 175
```

## Optional

Optionals are used to indicate that there may not be a value. Everything that can have a value of nil should be declared optional. It's like 'Maybe'.

```swift
// Check for nil
if politicalParty != nil {

  // Get the value (Forced Unwrapping)
  // It returns Optional(party). so should be unwrapped.
  let party = politicalParty!
  print("Party : \(party)") // Party : Independent
}

// Optional binding is used to check if an optional
// has a value
if let party = politicalParty {
  print("Party : \(party)") // Party : Independent
} else {
  print("No Party")
}

// If nil use coalescing operator to assign a value
let party = politicalParty ?? "No Party"
```

## Functions

```swift
// Define your return type and you can define
// default values
func getSum2(num1: Int, num2: Int = 1) -> Int{
  return num1 + num2
}

print("Sum : \(getSum2(num1: 8, num2: 6))") // Sum : 14

// If you don't want to provide the parameter labels do this
// You can provide default values if you want
func getSum2(_ x:Int=1, _ y:Int) -> Int {
    return x + y
}
print("Sum : \(getSum2(5, 4))")

// You can overload (have multiple functions with the same name)
// if they receive different parameter and return types
func getSum2(_ x:Double, _ y:Double) -> Double {
    return x + y
}
print("Sum : \(getSum2(5.4, 4.5))")

// A variadic parameter allows for an unknown
// number of parameters
func getSum3(nums: Int...) -> Int{
  var sum: Int = 0
  for num in nums {
    sum += num
  }
  return sum
}

print("Sum : \(getSum3(nums: 1,2,3,4,5))") // Sum : 15

// Nested functions are only callable by the enclosing function

func doMath(num1: Double, num2: Double){
  func mult() -> Double{
    return num1 / num2
  }

  print("Mult : \(mult())") // Mult : 0.833333333333333
}

doMath(num1: 5.0, num2: 6.0)

// Return multiple values
// Use a tuple to make a compound value—for example, to return multiple values from a function.
func calculateStatistics(scores: [Int]) -> (min: Int, max: Int, sum: Int) {
    var min = scores[0]
    var max = scores[0]
    var sum = 0

    for score in scores {
        if score > max {
            max = score
        } else if score < min {
            min = score
        }
        sum += score
    }

    return (min, max, sum)
}
let statistics = calculateStatistics(scores: [5, 3, 100, 3, 9])
print(statistics.sum)
// Prints "120"
print(statistics.2)
// Prints "120"
// The elements of a tuple can be referred to either by name or by number.


// You can't change the values of parameters.
// Function parameters are constants by default.
// func changeMe(_ x: Int) -> Void{
//    x = 10
// }
//

// You can however create a new variable with the same name and change it
func changeMe(_ x: Int) -> Void{
    let x: Int = 10
    print("x : \(x)")
}
changeMe(5) // X : 10

// In-Out Parameters
// An in-out parameter has a value that is passed in to the function, is modified by the function,
// and is passed back out of the function to replace the original value.
// You can only pass a variable as the argument for an in-out parameter.
// You cannot pass a constant or a literal value as the argument,
/// because constants and literals cannot be modified.
// You place an ampersand (&) directly before a variable’s name when you pass it as an argument to an in-out parameter,
// to indicate that it can be modified by the function.
var a = 10
var b = 20
func swapTwoInts(_ a: inout Int, _ b: inout Int) {
    let temporaryA = a
    a = b
    b = temporaryA
}

swapTwoInts(&a, &b)
print("swapTwoInts : \(a) / \(b)") // swapTwoInts : 20 / 10

// Functions can be assiged to variables and can be passed to
// be used in other functions and returned from functions
func multBy2(_ num: Int) -> Int{
    return num * 2
}
// Assign function to a variable
var timesTwo = multBy2
print("4 * 2 = \(timesTwo(4))")

// Pass a function into another function and return nothing
func runFunc(_ f:() -> ()) {
    f()
}
func print4() -> Void{
    print("4")
}
runFunc(print4)

// Pass a function that does return a value
func doMath(_ f: (Int) -> Int, _ x: Int) {
    print("Result : \(f(x))")
}
doMath(timesTwo, 4) // Result : 8

// Return a function
func funcMaker(val: Int) -> (Int) -> Int {
    func addVals(num1: Int) -> Int{
        return num1 + val
    }
    return addVals
}
let add4 = funcMaker(val: 4)
print("4 + 5 = \(add4(5))") // 4 + 5 = 9
```

## Closures

Closures are self-contained blocks of functionality that can be passed around and used in your code.
Closures can capture and store references to any constants and variables from the context in which they are defined.
This is known as closing over those constants and variables. Swift handles all of the memory management of capturing for you.

### Closure Expression Syntax

{ (parameters) -> return type in
statements
}

You can write a closure without a name by surrounding code with braces ({}).
Use in to separate the arguments and return type from the body.

```swift
numbers.map({ (number: Int) -> Int in
    let result = 3 * number
    return result
})
```

When a closure’s type is already known, such as the callback for a delegate, you can omit the type of its parameters, its return type, or both. Single statement closures implicitly return the value of their only statement.

```swift
let mappedNumbers = numbers.map({ number in 3 * number })
print(mappedNumbers)
// Prints "[60, 57, 21, 36]"

// You can refer to parameters by number instead of by name
let sortedNumbers = numbers.sorted { $0 > $1 }
print(sortedNumbers)
// Prints "[20, 19, 12, 7]"
```

```swift
func backward(_ s1: String, _ s2: String) -> Bool {
    return s1 > s2
}

// can be re-written as below

{ (s1: String, s2: String) -> Bool in
    return s1 > s2
}

// Because the sorting closure is passed as an argument to a method,
// Swift can infer the types of its parameters and the type of the value it returns.
{ s1, s2 in return s1 > s2 }

// Implicit Returns from Single-Expression Closures
{ s1, s2 in s1 > s2 }
```

In Swift, the simplest form of a closure that can capture values is a nested function, written within the body of another function.
A nested function can capture any of its outer function’s arguments and can also capture any constants and variables defined within the outer function.

`makeIncrementer` contains a nested function called `incrementer`.
The nested `incrementer()` function captures two values, `runningTotal` and `amount`, from its surrounding context.
After capturing these values, `incrementer` is returned by `makeIncrementer` as a closure that increments `runningTotal` by `amount` each time it is called.

```swift
func makeIncrementer(forIncrement amount: Int) -> () -> Int {
    var runningTotal = 0
    func incrementer() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementer
}

var incrementBy2 = makeIncrementer(forIncrement: 2)
print(incrementBy2()) // 2
print(incrementBy2()) // 4
print(incrementBy2()) // 6


// Square every item in an array with map
// map excepts a closure

let squaredNums = numbers.map {
    (num: Int) -> String in
    "\(num * num)"
}

print(squaredNums)

// Used to filter out values in an array
let nums2 = [1,2,3,4,5,6]

let evenNums = nums2.filter{
  (num: Int) -> Bool in
  return num % 2 == 0
}

print(evenNums) // [2, 4, 6]


// Reduces array values into one value
let sum2 = nums2.reduce(0) {
  (x: Int, y: Int) -> Int in
  return x + y
}

print(sum2) // 21
```

## Enumeratoins

Define types with a limited number of cases

```swift
enum Emotion {
  case joy
  case anger
  case fear
  case disgust
  case sad
}

var feeling = Emotion.joy

// change the value
feeling = .anger

// Check value
print("Angry : \(feeling == .anger)") // Angry : true
```

## Structs

Structs group related data together

> One of the most important differences between structures and classes is that structures are always copied when they are passed around in your code, but classes are passed by reference.

```swift
struct Rectangle {
  var height = 0.0
  var length = 0.0

  // You can include functions
  func area() -> Double{
    let area = height * length
    return area
  }
}

// Create a Rectangle
let myRect = Rectangle(height: 10.0, length: 5.0)

print("Area : \(myRect.height) * \(myRect.length) = \(myRect.area())")
// Area : 10.0 * 5.0 = 50.0
```

## Classes

```swift
class Animal {
  var name: String = "No Name"
  var height: Double = 0.0
  var weightInKg: Double = 0.0
  var sound: String = "No Sound"

  init(name: String, height: Double, weightInKg: Double, sound: String){
    self.name = name
    self.height = height
    self.weightInKg = weightInKg
    self.sound = sound
  }

  func getInfo(){
    print("\(self.name) is \(self.height) cms tall and weighs \(self.weightInKg) kgs and likes to say \(self.sound)")
  }

 // properties can have a getter and a setter.
  var weightInGram: Double {
        get {
            return self.weightInKg * 1000
        }
        // if the name is not defined after 'set' the new value can be called with *newValue* implicitly
        set (newWeightInKgs) {
            return newWeightInKgs * 1000
        }
    }

  // You can create overloaded methods if you change
  // the attributes
  func getSum(num1: Int, num2: Int) -> Int{
    return num1 + num2
  }

  func getSum(num1: Double, num2: Double) -> Double{
    return num1 + num2
  }

}

// no new statement
var rover = Animal(name: "Rover", height: 38, weight: 12.7, sound: "Ruff")

rover.getInfo()
// Rover is 38.0 cms tall and weighs 12.7 kgs and likes to say Ruff
```

Use **deinit** to create a deinitializer if you need to perform some cleanup before the object is deallocated.

### Inheritance

```swift
class Dog: Animal{

  // Dog can extend or override methods in Animal
  // A func marked as final can't be overridden by
  // subclasses

  final func digHole(){
    print("\(self.name) digs a hole")
  }

  override func getInfo(){

    // You can call a method in the superclass
    super.getInfo()
    print("and digs holes")
  }

}

var spot = Dog(name: "Spot", height: 38, weight: 12.7, sound: "Ruff")

// Dog inherits everything in Animal
spot.getInfo()
/*
Spot is 38.0 cms tall and weighs 12.7 kgs and likes to say Ruff
and digs holes
*/

spot.digHole()
//Spot digs a hole


// You can pass any subclass type and the right method
// is automatically called
func printGetInfo(animal: Animal){
  animal.getInfo()
}

printGetInfo(animal: rover)
//Rover is 38.0 cms tall and weighs 12.7 kgs and likes to say Ruff

printGetInfo(animal: spot)
/*
Spot is 38.0 cms tall and weighs 12.7 kgs and likes to say Ruff
and digs holes
*/


// You can set and get values with the dot operator
spot.name = "Doug"
print(spot.name) // Doug

// Testing overloaded methods
print("2 + 5 = \(spot.getSum(num1: 2,num2: 5))") // 2 + 5 = 7
print("2.2 + 5.6 = \(spot.getSum(num1: 2.2,num2: 5.6))") // 2.2 + 5.6 = 7.8

// Check the class type
print("Is Spot a Dog : \(spot is Animal)") // Is Spot a Dog : true
```

## Protocols

Protocols are like interfaces in other languages.
When you adopt a protocol you agree to define the behavior it describes.
Protocol can be used like any other named type.

> Classes, enumerations, and structs can all adopt protocols.

```swift
protocol Flyable {
  // Define if getters and setters are available
  // Put optional before var if you want it to be
  // optional
  var flies: Bool { get set }

  // You define the header for a func but nothing else
  func fly(distMiles: Double) -> String

}

// Adopt multiple protocols class ClassName : prot1, prot2
class Vehicle : Flyable{
  var flies: Bool = false
  var name: String = "No Name"

  func fly(distMiles: Double) -> String {
    if (self.flies){
      return "\(self.name) flies \(distMiles) miles"
    } else {
      return "\(self.name) can't fly"
    }
  }
}

var fordF150 = Vehicle()
fordF150.name = "Ford F-150"
fordF150.flies = false
print(fordF150.fly(distMiles: 10))
// Ford F-150 can't fly
```

```swift
protocol ExampleProtocol {
    var simpleDescription: String { get }
    mutating func adjust() // mutating keyword is only for struct
}

class SimpleClass: ExampleProtocol {
    var simpleDescription: String = "A very simple class."
    var anotherProperty: Int = 69105
    func adjust() {
        simpleDescription += "  Now 100% adjusted."
    }
}

var a = SimpleClass()
a.adjust()
let aDescription = a.simpleDescription

struct SimpleStructure: ExampleProtocol {
    var simpleDescription: String = "A simple structure"
    mutating func adjust() {
        simpleDescription += " (adjusted)"
    }
}
var b = SimpleStructure()
b.adjust()
let bDescription = b.simpleDescription
```

> Notice the use of the **mutating** keyword in the declaration of SimpleStructure to mark a method that modifies the structure. The declaration of SimpleClass doesn’t need any of its methods marked as mutating because methods on a class can always modify the class.

### Extension

> Use extension to add functionality to an existing type, such as new methods and computed properties.

```swift
extension Int: ExampleProtocol {
    var simpleDescription: String {
        return "The number \(self)"
    }
    mutating func adjust() {
        self += 42
    }
}
print(7.simpleDescription)
// Prints "The number 7"
```

## Error handling

```swift
// Define our error by defining a type of the Error protocol

enum DivisionError: Error{
  case DivideByZero
}

// Define we want the error to get thrown from the function
func divide(num1: Float, num2: Float) throws -> Float {
  guard num2 != 0.0 else {
    throw DivisionError.DivideByZero
  }
  return num1/num2
}

// Wrap code that could trigger an error in a do catch block
// catch the error and handle it
do {
  try divide(num1: 4, num2: 0)
} catch DivisionError.DivideByZero {
  print("Can't Divide by Zero")
}
//Can't Divide by Zero

```

> Another way to handle errors is to use try? to convert the result to an optional. If the function throws an error, the specific error is discarded and the result is nil. Otherwise, the result is an optional containing the value that the function returned.

```swift
let dividedNumber = try? divide(num1: 4, num2: 2)
```

## Defer Statement

> Use defer to write a block of code that is executed after all other code in the function, just before the function returns.

```swift
func f() {
    defer { print("First defer") }
    defer { print("Second defer") }
    print("End of function")
}
f()
// Prints "End of function"
// Prints "Second defer"
// Prints "First defer"

```

---

References

- [Swift 3 Tutorial](https://www.youtube.com/watch?v=dKaojOZ-az8)
- [SWift 5 Tutorial](https://youtu.be/Pd8IvykiW20)
- [Swift Language Guide](https://docs.swift.org/swift-book/LanguageGuide/TheBasics.html)
