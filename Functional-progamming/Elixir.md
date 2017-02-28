# Elixir
Elixir is a dynamic, functional language designed for building scalable and maintainable applications.

## Functions   
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

The = symbol in Elixir is called the match operator. It matches values on one side against corresponding structures on the other side.

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


---

References

- [elixir-lang](http://elixir-lang.org/)
- [Try Elixir](http://campus.codeschool.com/courses/try-elixir/)