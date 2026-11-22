# R54-T018: search and sort

searchAndSort(items, query) keeps the characters whose name contains the query, ignoring case, and then sorts them by speed as numbers. That puts speed 2 before speed 10, which a text sort would get wrong.

Empty state and recovery: a query that matches nothing shows "No characters found" and an empty list. Typing a valid query next fills the list again on the same page, with no reload.

Setup, inside this folder:

    npm install
    npx playwright install chromium

Check, from the repository root:

    node 29_Day_Mini_project_animating_characters/applied-labs/r54-t018/check.mjs
