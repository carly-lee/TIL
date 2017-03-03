# Elixir
Elixir is a dynamic, functional language designed for building scalable and maintainable applications.

## Functions   
Functions are “**first class citizens**” in Elixir meaning they can be passed as arguments to other functions in the same way as integers and strings. 

### Named functions 
All named functions in Elixir must be part of an enclosing module.   
There's no 'return' statement since the last evaluated value returns from function automatically.

```elixir
defmodule Account do # Define new module

  def balance(initial, spending) do # Define new function
    initial = spending
  end

end

current_balance = Account.balance(1000, 200)
IO.puts "Current balance: US $#{current_balance}"
```

### Anonymous functions
It has no name and no module obviously. It can be created inline and are delimited by the keywords **fn** and **end**

```elixir
max_balance = fn(amount) -> "Max: #{amount}" end

add = fn a, b -> a + b end
double = fn a -> add.(a, a) 

(fn -> x = 0 end).() # In order to invoke anonymous functions, we must use the .() syntax.
```

The **&** operator is used to create helper functions in a short and concise way.

```elixir
fun = fn x -> x + 1 end 

fun = &(&1 + 1) 
# The &1 represents the first argument passed into the function. 
```

## Pipe
When functions get nested it makes code hard to read and look more complicated.

```
f(x)
g(f(x), y)
j(i(h(g(f(x),y),z))) // It's quite hard to grasp the logic at the first glance.
```

```elixir
defmodule Account do
  def balance(initial, spending) do
    interest(discount(initial, 10), 0.1)
  end

  def discount(total, amount) do
  end

  def interest(total, rate) do
  end
end
```

Using pipe operator   
Now we can read the function order just from left to right.

```elixir
defmodule Account do
  def balance(initial, spending) do
    discount(initial, 10) |> interest(0.1)
  end
  ...
end
```

## Pattern matching 

The **=** symbol in Elixir is called the match operator. It matches values on one side against corresponding structures on the other side.

```elixir
iex> 1 = x
1
iex> 2 = x
** (MatchError) no match of right hand side value: 1
```

```elixir
iex> {a, b, c} = {:hello, "world", 42}
{:hello, "world", 42}
iex> a
:hello
iex> b
"world"
```
A pattern match will error if the sides can’t be matched.

```elixir
iex> {a, b, c} = {:hello, "world"}
** (MatchError) no match of right hand side value: {:hello, "world"}
```

String concatenation is done with **<>**

```elixir
"Elixir is fun" <> adj = "Elixir is functional"
IO.puts adj # ctional
```

```elixir
defmodule Account do
  def run_transaction(balance, amount, type) do
    if type == :deposit do 
      balance + amount
    else
      balance - amount
  end
end

Account.run_transaction(1000, 50, :deposit)
Account.run_transaction(1050, 30, :withdrawal)
```
  
'IF' statement can be replaced with pattern matching.   
Using pattern matching in function arguments, functions can be split into multiple clauses.

```elixir
defmodule Account do
  def run_transaction(balance, amount, :deposit) do 
    balance + amount
  end
  
  def run_transaction(balance, amount, :withdrawal) do
    balance - amount
  end
end

Account.run_transaction(1000, 50, :deposit)
Account.run_transaction(1050, 30, :withdrawal)
```

Calling functions using pipe 

```elixir
...

1000
|> Account.run_transaction(50, :deposit)
|> Account.run_transaction(30, :withdrawal)

```

## List

```elixir
list = [1, 2, 3]
[a, b, c] = list # a: 1, b: 2, c: 3
```

### Splitting a list with the cons operator   
The cons operator **|** is used to split a list into head and tail.

```elixir
iex> [head | tail] = [1, 2, 3]
[1, 2, 3]
iex> head
1
iex> tail
[2, 3]
```

- Using | operator in function pattern matching

```elixir
defmodule Language do
  def print_list([head | tail]) do
    IO.puts "Head: #{head}"
    IO.puts "Tail: #{tail}"
  end
end

Language.print_list(["Elixir", "JavaScript", "Haskell"])
# Head: Elixir
# Tail: JavaScriptHaskell
```

- Print words indivisibly using recursion

```elixir
defmodule Language do
  # The recursive case
  def print_list([head | tail]) do
    IO.puts head
    print_list(tail)
  end

  # The base case where the function does not invoke itself.
  def print_list([]) do
  end
end

Language.print_list(["Elixir", "JavaScript", "Haskell"])
# Elixir
# JavaScript
# Haskell
```

## Tuples
Elixir uses curly brackets to define tuples. It's an ordered collection of elements typically used as return values from functions.

```elixir
iex> {:ok, "hello"}
{:ok, "hello"}
iex> tuple_size {:ok, "hello"}
2
```

Tuples can hold many elements of different data types, but mostly it's used with two-element tuples where the first element is an atom.

```elixir
{:ok, "Some content"}
{:error, :enoent}
```

- Using tuples with pattern matching

```elixir
{status, content} = {:ok, "Some content"}
{:error, message} = {:error, "Some error message"}

{:ok, content} = File.read("path/to/existing/file")
{:error, :enoent} = File.read("path/to/unknown/file")

# Above concepts can be used like below 

defmodule Customers do
  def parse_file({:ok, content}) do
    IO.puts "Customers: #{content}"
  end

  def parse_file({:error, _}) do # Ignore the unused second matched variable
    IO.puts "Parsing error"
  end
end
```

## Lists or tuples?

Lists are stored in memory as linked lists. Accessing the length of a list is a linear operation: we need to traverse the whole list in order to figure out its size. 

Tuples, on the other hand, are stored contiguously in memory. This means getting the tuple size or accessing an element by index is fast. However, updating or adding elements to tuples is expensive because it requires copying the whole tuple in memory.

## Keyword lists
In Elixir, when we have a list of tuples and the first item of the tuple (i.e. the key) is an atom, we call it a keyword list.

```elixir
iex> list = [{:a, 1}, {:b, 2}]
[a: 1, b: 2]
iex> list == [a: 1, b: 2]
true
```

They are typically used as the last argument in function signatures, representing options passed to the function.

```elixir
defmodule Account do
  def balance(transactions, options \\ []) do # \\ used to define default value
    currency = options[:currency] || "dollar"
    symbol = options[:symbol] || "$"

    balance = calculate_balance(transactions)
    "Balance in #{currency}: #{symbol}#{balance}"
  end
end

Account.balance(transactions, currency: "GBP", symbol: "£" )
# Balance in GBP: £200

Account.balance(transactions)
# Balance in dollar: $200
```

## Maps 
Whenever you need a key-value store, maps are the “go to” data structure in Elixir. A map is created using the %{} syntax.

```elixir
iex> map = %{:a => 1, 2 => :b}
%{2 => :b, :a => 1}
iex> map[:a]
1
iex> map[2]
:b
iex> map[:c]
nil
```

Compared to keyword lists, we can already see two differences:

- Maps allow any value as a key.
- Maps’ keys do not follow any ordering.

### Nested data structures

```elixir
iex> users = [
  john: %{name: "John", age: 27, languages: ["Erlang", "Ruby", "Elixir"]},
  mary: %{name: "Mary", age: 29, languages: ["Elixir", "F#", "Clojure"]}
]
[john: %{age: 27, languages: ["Erlang", "Ruby", "Elixir"], name: "John"},
 mary: %{age: 29, languages: ["Elixir", "F#", "Clojure"], name: "Mary"}]

iex> users[:john].age
27
```

### Reading maps with pattern matching

```elixir
person = %{"name" => "Brooke", "age" => 42}
%{"name" => name} = person # Map supports partial match.
IO.puts name # Brooke 


person = %{"name" => "Brooke",
           "address" => %{"city" => "Orlando", "state" => "FL"}}
%{"address" => %{"state" => state }} = person
IO.puts "State : #{state}" # State: FL
```

# Case 
case allows us to compare a value against many patterns until we find a matching one.

```elixir
iex> case {1, 2, 3} do
...>   {4, 5, 6} ->
...>     "This clause won't match"
...>   {1, x, 3} ->
...>     "This clause will match and bind x to 2 in this clause"
...>   _ ->
...>     "This clause would match any value"
...> end
"This clause will match and bind x to 2 in this clause"
```

```elixir
defmodule Account do
  def list_transaction(filename) do
    case File.read(filename) do 
      {:ok, content} -> "Content: #{content}"
      {:error, type} -> "Error: #{type}"
    end
  end
end
```

Clauses also allow extra conditions to be specified via guards.


```elixir
defmodule Account do
  def list_transaction(filename) do
    case File.read(filename) do 
      {:ok, content}
        when byte_size(content) > 10 -> "Content: (...)"
      {:ok, content} -> "Content: #{content}"
      {:error, type} -> "Error: #{type}"
    end
  end
end
```

## Cond
When we want to check different conditions and find the first one that evaluates to true, we may use cond.

```elixir
iex> cond do
...>   2 + 2 == 5 ->
...>     "This will not be true"
...>   2 * 2 == 3 ->
...>     "Nor this"
...>   1 + 1 == 2 ->
...>     "But this will"
...> end
"But this will"
```
This is equivalent to else if clauses in many imperative languages.

If none of the conditions return true, an error (CondClauseError) is raised. For this reason, it may be necessary to add a final condition, equal to true, which will always match.

```elixir 
iex> cond do
...>   2 + 2 == 5 ->
...>     "This is never true"
...>   2 * 2 == 3 ->
...>     "Nor this"
...>   true ->
...>     "This is always true (equivalent to else)"
...> end
"This is always true (equivalent to else)"
```

```elixir
defmodule Validator do
  def validate_age(age) do
    cond do
      age < 18 -> "Under 18"
      age < 21 -> "Under 21"
      true -> "Adult"
    end
  end
end
```

## The Mix Tool
Mix is a build tool installed with Elixir.

- Creating the new project with mix

```bash
$ mix new kv 
```

Mix will create a directory named kv with a few files in it:

```bash
* creating README.md
* creating .gitignore
* creating mix.exs
* creating config
* creating config/config.exs
* creating lib
* creating lib/kv.ex
* creating test
* creating test/test_helper.exs
* creating test/kv_test.exs
```
Both .ex and .exs file extensions are treated the same way. The difference is intention.   
.ex files are meant to be compiled while .exs files are used for scripting such as configuration and testing.

- Compiling the project using mix

```bash
$ cd kv
$ mix compile

# output 
Compiling 1 file (.ex)
Generated kv app
```



---

References

- [elixir-lang](http://elixir-lang.org/)
- [Try Elixir](http://campus.codeschool.com/courses/try-elixir/)
- [Mixing it up with Elixir](http://campus.codeschool.com/courses/mixing-it-up-with-elixir)