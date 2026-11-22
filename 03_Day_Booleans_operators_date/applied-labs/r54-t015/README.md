# R54-T015: edit permission rule

canEdit(user, post) is true only when the user is authenticated and is either the owner of the post or an admin. It uses no clock, storage or network, so nothing needs to be injected, and the fixture in fixture.json gives the same answers every time.

The last test runs the fixture in two separate node processes and checks that both runs give the same results as the expected values.

Run from the repository root:

    node --test 03_Day_Booleans_operators_date/applied-labs/r54-t015/example.test.mjs
