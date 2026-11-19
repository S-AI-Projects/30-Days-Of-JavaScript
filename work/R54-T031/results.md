# R54-T031 Check Results

- Node: v26.13.1
- Status: PASSED

| Check | Expected | Actual | Passed |
| :--- | :--- | :--- | :--- |
| initial_series_a | `[{"label":"Alpha","value":"42"},{"label":"Beta","value":"78"},{"label":"Gamma","value":"55"}]` | `[{"label":"Alpha","value":"42"},{"label":"Beta","value":"78"},{"label":"Gamma","value":"55"}]` | true |
| switch_to_series_b | `{"count":3,"rows":[{"label":"Alpha","value":"65"},{"label":"Beta","value":"30"},{"label":"Gamma","value":"90"}]}` | `{"count":3,"rows":[{"label":"Alpha","value":"65"},{"label":"Beta","value":"30"},{"label":"Gamma","value":"90"}]}` | true |
| restore_series_a | `[{"label":"Alpha","value":"42"},{"label":"Beta","value":"78"},{"label":"Gamma","value":"55"}]` | `[{"label":"Alpha","value":"42"},{"label":"Beta","value":"78"},{"label":"Gamma","value":"55"}]` | true |
| empty_series_message | `"Visible no-data message"` | `{"visible":true,"text":"No data available for the selected series."}` | true |
| zero_runtime_errors | `0` | `0` | true |
