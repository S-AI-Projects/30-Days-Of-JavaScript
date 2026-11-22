# R54-T017: keyed DOM updates

createList(container) returns add() and remove(). Each record is an li element stored by its id, so adding a record with an id that already exists updates that element instead of creating a second one, and removing an id that is not there does nothing.

Worked example, which is exactly what the check runs:

1. Input: add { id: 'a', text: 'A' } and { id: 'b', text: 'B' }.
2. Intermediate state: the list holds A and B. Adding A a second time still leaves A and B.
3. Input: remove 'a'.
4. Output: the list holds exactly B. Removing 'missing' afterwards does not throw and leaves B.

Setup, inside this folder:

    npm install
    npx playwright install chromium

Check, from the repository root:

    node 22_Day_Manipulating_DOM_object/applied-labs/r54-t017/check.mjs
