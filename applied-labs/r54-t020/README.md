# R54-T020: numeric summary

summarize(numbers) returns { sum, average } for a nonempty array of numbers. An empty array, anything that is not an array, and any item that is not a number are rejected.

The tests try 10, 100 and 1000 numbers. They check the sum and average and count how many elements were read through a Proxy. The function reads each element once, so the count equals the input size. No speed limit is checked.

Run from the repository root:

    node --test ./applied-labs/r54-t020/example.test.mjs
