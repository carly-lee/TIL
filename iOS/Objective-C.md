# Objective-C 

- When variables are logged using NSLog, it needs a format specifier like C.
[Format Specifiers - Apple doc] (https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/Strings/Articles/formatSpecifiers.html#//apple_ref/doc/uid/TP40004265-SW1)

- Objective-C objects are defined with the * in front of variable names, like this: *NSString *name*

> NSNumber exists as a wrapper to scalar numbers so you can store them in collections and pass them polymorphically with other NSObjects. They are not really used to store numbers in actual math. **If you do math on them it is much slower than performing the operation on just the scalars**. http://stackoverflow.com/questions/494002/how-to-add-two-nsnumber-objects

```objective-c
NSString *firstName = @"Carly";
NSString *lastName = @"Lee";

// This doesn't work 
NSString *fullName = firstName + lastName;

// Should be like this. colon : means the message expects arguments.
NSString *fullName = [firstName stringByAppendingString:lastName];

//or like this 
NSString *fullname = [NSString stringWithFormat:@"%@ %@", firstName, lastName];
```

## Creating an empty object 

```objective-c
NSArray *emptyArray = [NSArray array];
NSString *emptyString = [NSString string];
NSDictionary *emptyDict = [NSDictionary dictionary];

// or

NSString *emptyString = [[NSString alloc] init];
NSArray *emptyArray = [[NSArray alloc] init];
NSDictionary *emptyDictionary = [[NSDictionary alloc] init];

NSString *copy = [[NSString alloc] initWithString:otherString];
```

## isEqualToString 
in order to compare two strings. It will return YES or NO.

```objective-c
[myString isEqualToString:otherString]
```

## Fast Enumeration 
**Fast Enumeration** earns its name by being faster than a traditional c-style for loop because it limits message sending, which **_can be slow when enumerating a 1000+ item collection object_**. 

```objective-c
for(variable-type variable-name in collection){
  NSLog(@"Test collection %@", variable-name);
}
```

## Code block
Tasks could be wrapped in block and used reapeatly. 
**Code Block** can returns value when it's executed. If there's no return value, it should be defined as 'void'.
This is basically the same with function.

```objective-c
// Without arguments
void (^helloToWorld)(void) = ^{
  NSLog(@"Hello world!");
};

helloToWorld();

// With arguments
void (^addNumbers)(NSUInteger, NSUInteger) = ^(NSUInteger num1, NSUInteger num2){
  NSLog(@"The sum of the numbers is %lu", num1 + num2);
};

addNumbers(2, 2);

void (^logCount)(NSArray *) = ^(NSArray *array){
  NSLog(@"There are %lu objects in this array", [array count]);
};

logCount(@[@"Apple", @"Grape"]);
logCount(@[@"Pie", @"Cookie", @"Chocolate", @"Candy"]);

```

## enumerateObjectsUsingBlock
This is similar to 'map' in ES6.

```objective-c
// the last argument allows you to stop enumerating the array if you want.
void (^enumeratingBlock)(NSString *, NSUInteger, BOOL *) = 
  ^(NSString *item, NSUInteger index, BOOL *stop){
    NSLog(@"%@ is at %lu", item, index); 
  };
                         
[array enumerateObjectsUsingBlock:enumeratingBlock];

//or could be executed diretly without assigning to a variable. 
[array enumerateObjectsUsingBlock:
  ^(NSString *item, NSUInteger index, BOOL *stop){
    NSLog(@"%@ is at %lu", item, index);  
  }
];

```

## Class
- The name of class should be started with capital letter.
- There are header file(\*.h) and implementation file(*.m) for one class.

> It's used to separate between the public and private parts of a class. The .m file is the implementation. It is where all the logic goes, all the data is processed and stored, etc... The .h file is the interface of that class. It's literally like an API for your own class. It tells other classes how to use it and how to interface with it.  
[*.h and *.m file in Objective-c](http://stackoverflow.com/questions/17558210/h-and-m-files-in-objective-c)

- Class has a variable called 'self'. It represents the class itself by memory address. Similar to 'this' in other language.

- header file(**Me.h**)
```objective-c
@interface Me : NSObject { // initializer 
  NSNumber *_phoneNumber; // private property
}

@property (readonly) NSString *myName; 
@property NSString *nickName;

- (void)greeting; // there is no return value 
- (NSString *)selfIntroduction; // if there is a return value
- (void)sayHello:(NSString *)yourName // if there is an argument to pass in

@end
```
- implementation file(**Me.m**)
```objective-c
#import "Me.h" // import header file

@implementation Me 
- (Me *)init; // initializer
{
 _myName = @"Carly Lee"; 
 // Since 'myName' is a read-only variable, it cannot be referenced by self.
 return [super init];
}

- (void)greeting;
{
    NSLog(@"Hello.");
}

- (void)selfIntroduction
{
  return @"I'm Carly.";
}

- (void)sayHello:(NSString *)yourName
{
  NSLog([NSString stringWithFormat:@"Hi, %@. Nice to meet you.", yourName]);
}
@end
```
- Usage 
```objective-c
#import "Me.h"

Me *carly = [[Me alloc] init]; // Declare class instance 

NSString *herName = [carly selfIntroduction]; // Store the return value
NSLog(@"%@", herName); // I'm Carly.

[carly sayHello:@"GitHub"] // Hi, GitHub. Nice to meet you.

```

- If you don't know the type of the object at compile time, you can declare the object as a generic Objective-C Object using id type. 

```objective-c
id anotherMe = [[Me alloc] init]; // There should be no *.
```

- If you created an object by a generic id, you can call property by dot notation.

```objective-c
Me *anotherMe = [[Me alloc] init];
me.nickName = @"talk box";
NSLog(@"%@", me.nickName);
```
Should be like this 

```objective-c
id anotherMe = [[Me alloc] init];
[anotherMe setNickName:@"talk box"];
NSLog(@"%@", [anotherMe nickName]);
```