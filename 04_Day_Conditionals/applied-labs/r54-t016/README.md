# R54-T016: score classification refactor

classifyScore(score) returns fail below 40, pass from 40 to 74 and distinction from 75 to 100. Scores outside 0 to 100 throw a RangeError.

The refactor moves the range check into one named function, assertValidScore(). The test keeps the original single function and compares both versions for every score from -5 to 105 in steps of 0.5, so the behaviour is unchanged.

Run from the repository root:

    node --test 04_Day_Conditionals/applied-labs/r54-t016/example.test.mjs
