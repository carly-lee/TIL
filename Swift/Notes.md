# Notes about Swift 


`@testable import Target`: Import the target as testable from different target.

`accessibilityIdentifier`: Usually used for testing to distinguish elements

`private(set) var name: String`: private setter. the `name` can be read from within the module but set from the class/struct where it's defined.

`@discardableResult`: Telling compiler that we are going to ignore the return value from the function.

## Computed Property 

`var progress: Double { current / total }`: This is read-only computed property. It doesn't store the value on the memory, it computes the body every time when the property is called. When the variable doesn't get accessed much, using computed property is good option because it's not holding memory.

## Value type vs Reference type 

Struct and Enumeration are value type so it is immutable. When it is passed as parameters, it's copied and passed as value so changing the value of parameter doesn't affect original Struct or Enumeration. Basic value types on Swifts are all Struct as well. (Int, Double, String, Array so on.)

Class is a reference type.


## Extensions 

The way of extending functionality of existing Struct, Enumeration, Protocol and Class. It's also used for code organization.
By extending Protocol, a Protocol can have default behavior.

