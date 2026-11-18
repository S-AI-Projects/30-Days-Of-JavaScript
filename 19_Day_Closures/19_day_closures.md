<div align="center">
  <h1> 30 Days Of JavaScript: Closures</h1>
  <a class="header-badge" target="_blank" href="https://www.linkedin.com/in/asabeneh/">
  <img src="https://img.shields.io/badge/style--5eba00.svg?label=LinkedIn&logo=linkedin&style=social">
  </a>
  <a class="header-badge" target="_blank" href="https://twitter.com/Asabeneh">
  <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/asabeneh?style=social">
  </a>

<sub>Author:
<a href="https://www.linkedin.com/in/asabeneh/" target="_blank">Asabeneh Yetayeh</a><br>
<small> January, 2020</small>
</sub>

</div>

[<< Day 18](../18_Day_Promises/18_day_promises.md) | [Day 20 >>](../20_Day_Writing_clean_codes/20_day_writing_clean_codes.md)

![Thirty Days Of JavaScript](../images/banners/day_1_19.png)
- [Day 19](#day-19)
	- [Closure](#closure)
	- [Exercises](#exercises)
		- [Exercises: Level 1](#exercises-level-1)
		- [Exercises: Level 2](#exercises-level-2)
		- [Exercises: Level 3](#exercises-level-3)
	- [Added Activity](#added-activity)
		- [Applied Lab (r54-t032)](#applied-lab-r54-t032)

# Day 19

## Closure

JavaScript allows writing function inside an outer function. We can write as many inner functions as we want. If inner function access the variables of outer function then it is called closure.

```js
function outerFunction() {
    let count = 0;
    function innerFunction() {
        count++
        return count
    }

    return innerFunction
}
const innerFunc = outerFunction()

console.log(innerFunc())
console.log(innerFunc())
console.log(innerFunc())
```

```sh
1
2
3
```

Let us more example of inner functions

```js
function outerFunction() {
    let count = 0;
    function plusOne() {
        count++
        return count
    }
    function minusOne() {
        count--
        return count
    }

    return {
        plusOne:plusOne(),
        minusOne:minusOne()
    }
}
const innerFuncs = outerFunction()

console.log(innerFuncs.plusOne)
console.log(innerFuncs.minusOne)
```

```sh
1
0
```

🌕 You are making progress. Maintain your momentum,  keep the good work.  Now do some exercises for your brain and for your muscle.

## Exercises

### Exercises: Level 1

1. Create a closure which has one inner function

### Exercises: Level 2

1. Create a closure which has three inner functions

### Exercises: Level 3

1. Create a personAccount out function. It has firstname, lastname, incomes, expenses  inner variables. It has totalIncome, totalExpense, accountInfo,addIncome, addExpense and accountBalance inner functions. Incomes is a set of incomes and its description and expenses is also a set of expenses and its description.

## Added Activity

### Applied Lab (r54-t032)

- **Lab**: [Closure Isolation & Boundary Validation Applied Lab](./applied-labs/r54-t032/README.md)
- **Inputs & Expected Results**:
  - Increment Counter A twice → Expected Result: Counter A value is `2`, Counter B remains `0` (enclosed lexical state, zero global variable leakage).
  - Empty or invalid step input (`""`, `"-5"`, `"abc"`) → Expected Result: Explicit boundary rejection with descriptive error, preserving counter value without modification.
  - Subsequent valid step (`"3"`) → Expected Result: Error cleared, counter increments correctly.
- **Contribution Focus**: Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.

🎉 CONGRATULATIONS ! 🎉

[<< Day 18](../18_Day_Promises/18_day_promises.md) | [Day 20 >>](../20_Day_Writing_clean_codes/20_day_writing_clean_codes.md)