# R54-T013: immutable array update

replaceById(items, id, replacement) returns a new array. The record with the given id is swapped for the replacement. Every other record is the same object as before, and the original array is not changed. If the id is not found, the new array has the same contents as the old one.

The tests compare the result with a small expected table and with a plain loop version.

Run from the repository root:

    node --test 05_Day_Arrays/applied-labs/r54-t013/example.test.mjs
