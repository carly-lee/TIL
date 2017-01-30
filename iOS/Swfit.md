# Swift

## Variable types

- **var**   
mutable. can be changed its value after it is created.
- **let**    
immutable. constant. the value cannot be changed after it is created.

```swift 
// ...from TableView
// We can check if the varibale is exist or not
if cell.textLabel! != nil {
  // '!' means 'required'. it says the value will be absolutely not 'null'.
  cell.textLabel!.text = "Hello friend."
}

// but better use Optional chaning. 
// '?' after optional property means first check if it exists.
// basically the same meaning with above 
cell.textLabel?.text = "Hello world."
```