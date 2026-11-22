# R54-T012: injected logger

sumItems(items, logger) adds up an array. When a logger is passed, it receives one event shaped like { event, count, total } through logger.debug(). Passing console works too. Without a logger the result is the same.

Boundary: an empty array returns 0 and still logs an event with count 0. Anything that is not an array throws a TypeError before anything is logged.

Run from the repository root:

    node --test 13_Day_Console_object_methods/applied-labs/r54-t012/example.test.mjs
