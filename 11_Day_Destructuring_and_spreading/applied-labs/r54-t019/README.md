# R54-T019: configuration merge

mergeConfig(defaults, overrides) copies the defaults and then applies every override that is not undefined. Because the condition is !== undefined, an override of 0 or false is kept.

The decisive condition is overrides[key] !== undefined. The test file holds a one-line mutant that changes it to a plain truthy check, which drops 0 and false. The same assertion passes for mergeConfig and fails for the mutant.

Run from the repository root:

    node --test 11_Day_Destructuring_and_spreading/applied-labs/r54-t019/example.test.mjs
