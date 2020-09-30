# Ruby

## Variable 

```ruby
name = "Carly"
age = 100
```

The data type in the variable can be changed.
Data has types but not the variables. Variables only folollows the type of data it holds.

```ruby
age = 100
age = "100" # no error 
```

## String 

```ruby
phrase = "Ruby on Rails"
puts phrase.include? "Train" # false 

puts phrase[0,4] # first 4 chracters. Ruby
```

## Number & Math
```ruby
num = 20
puts ("num is " + num ) # Error
puts ("num is " + num.to_s ) # No error. convert number to string. 

puts 10 / 7 # 1 - Using only integers the result will be also integer
puts 10 / 7.0 # 1.4285714285714286
```

## Getting inputs 

```ruby
puts "Enter your name: "

name = gets  # Wait for the user's input and put the input into the varaible 'name'. 
puts ("Hello " + name + ", you are cool") # will print new line as well
# Hello name
# , you are cool
# When a user press the enter to put the name, Ruby also takes the new line
# To prevent this 
name = gets.chomp() # Remove the new line from the user input
```

```ruby
```

```ruby
```

```ruby
```

```ruby
```

```ruby
```

```ruby
```

```ruby
```

```ruby
```

```ruby
```

---

References 

- [Ruby Programming Language - Full Course](https://youtu.be/t_ispmWmdjY)