# Ruby

## Variable

```ruby
name = "Carly" # String
age = 100 # Integer
height = 6.3 # Decimal
is_tall = # Boolean
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

## Casting & Converting

```ruby
puts 3.14.to_i # 3 : To Integer
puts 3.to_f # 3.0 : To Float(Decimal)
puts 3.to_s # 3 : To String

puts 100 + "50".to_i # 150
puts 100 + "50.99".to_f # 150.99

puts 100 + "50" # Error! No such thing as implicit conversion like JS

num = 20
puts ("num is " + num ) # Error
puts ("num is " + num.to_s ) # No error. convert number to string.
```

## Number & Math

```ruby
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

## Array

```ruby
lucky_numbers = [4,8, "five", 34.0, "nine", 7] # Can store different types into one array
puts lucky_numbers[1,2] # 8, five. start from index 1, take 2 elements
puts lucky_numbers[2..4] # five, 34.0, nine. take elements from index 2 to 4

```

## Function

```ruby
def add_numbers(num1, num2=100)
  return num1 + num2
end

puts add_numbers(4,3) # 7
puts add_numbers(4) # 104

```

## Condition

### Switch case

```ruby
my_grade = "D"
case my_grade
  when "A"
		puts "You Pass"
  when "F"
    puts "You fail"
  else
    puts "Invalid grade"
end

# Invalid grade
```

## Dictionary

```ruby

test_grades = {
  "Andy" => "B+",
  :Stanley => "C",
  "Ryan" => "A",
  3 => 95.2
}

test_grades["Andy"] = "B-"
puts test_grades["Andy"]
puts test_grades[:Stanley]
puts test_grades[3]

=begin
B-
C
95.2
=end

```

## Loop

### For loop

```ruby
for index in 0..5 # from 0 to 5
  puts index
end
# 0 1 2 3 4 5

5.times do |index|
  puts index
end
# 0 1 2 3 4

lucky_nums = [4, 8, 15, 16, 23, 42]

lucky_nums.each do |lucky_num|
  puts lucky_num
end
# 4 8 15 16 23 42
```

## Exception catching

```ruby
begin
  num = 10/0 # divided by 0 (ZeroDivisionError)
rescue
  puts "Error"
end
# Error

begin
  num = 10/0
rescue ZeroDivisionError # Only catch ZeroDivisionError
  puts "Error"
rescue
  puts "All other errors"
end
# Error

begin
  num = 10/0
rescue ZeroDivisionError => e
  puts "Error : #{e}" # Error : divided by 0
rescue
  puts "All other errors"
end

begin
  puts bad_variable
rescue ZeroDivisionError # Only catch ZeroDivisionError
  puts "Error"
rescue
  puts "All other errors"
end
# All other errors
```

### Throw exception

```ruby
raise "Made Up Exception"
```

## Class

```ruby
class Book
  attr_accessor :title, :author # Class member variable

  def readBook()
    puts "Reading #{self.title} by #{self.author}"
  end
end

book1 = Book.new()
book1.title = "Harry Potter"
book1.author = "JK Rowling"

book1.readBook() # Reading Harry Potter by JK Rowling
puts book1.title # Harry Potter
```

### Constructors

```ruby
class Book
  attr_accessor :title, :author
  def initialize(title, author)
    @title = title
    @author = author
  end

  def readBook()
    puts "Reading #{self.title} by #{@author}"
  end
end

book1 = Book.new("Harry Potter", "JK Rowling")
book1.readBook() # Reading Harry Potter by JK Rowling
puts book1.title # Harry Potter

book1.title = "Half-Blood Prince"
puts book1.title # Half-Blood Prince

```

### Getters and Setters

```ruby
class Book
  attr_accessor :title, :author
  def initialize(title, author)
    self.title = title # This refers getter and setter
    @author = author # Doesn't call getter and setter for author
  end

  def title=(title)
    puts "Set"
    @title = title
  end

  def title
    puts "Get"
    return @title
  end

  def author=(author)
    puts "Set author"
    @author = author
  end

  def author
    puts "Get author"
    return @author
  end
end

book1 = Book.new("Harry Potter", "JK Rowling")

puts book1.title # calling getter

# Set
# Get
# Harry Potter
```

## Inheritance

Parent constructor can be reached out with `super` from child class.

```ruby
class Chef

class ItalianChef < Chef # ItalianChef inherits all functionalities from Chef
```

## Files

```ruby
# name, mode. r -> ready only, r+ -> read-write, w -> write-only and create new file, w+ -> read-write ...
File.open("filename.txt", "r") do |file| # Store the file to inside the file variable
  puts file.read() # print out file
  file.write("text")
end # Done with file. close the open file
```

## Modules

Ruby Modules are similar to classes in that they hold a collection of methods, constants, and other module and class definitions. Modules are defined much like classes are, but the module keyword is used in place of the class keyword. **Unlike classes, you cannot create objects based on modules nor can you subclass them;** instead, you specify that you want the functionality of a particular module to be added to the functionality of a class, or of a specific object. Modules stand alone; there is no "module hierarchy" of inheritance. Modules is a good place to collect all your constants in a central location.

```ruby
module Tools # usually starts with capital letter
  def sayhi(name)
    puts "hello #{name}"
  end

  def saybye(name)
    puts "bye #{name}"
  end
end

include Tools # To use module
Tools.sayhi("Carly") # module can be used as a namespace
# hello Carlyß
```

---

References

- [Ruby Programming Language - Full Course](https://youtu.be/t_ispmWmdjY)
- [Ruby Programming | In One Video](https://youtu.be/8wZ2ZD--VTk)
- [File modes in Ruby](https://stackoverflow.com/a/3682374/3148633)
- [rubylearning.com](rubylearning.com)
