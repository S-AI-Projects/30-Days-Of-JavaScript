# R54-T035 Check Results

- Node: v26.13.1
- Status: PASSED

| Check | Expected | Actual | Passed |
| :--- | :--- | :--- | :--- |
| single_click | `"1"` | `"1"` | true |
| keyboard_activation | `"2"` | `"2"` | true |
| remount_no_duplicate | `"3"` | `"3"` | true |
| cleanup_prevents_updates | `{"count":"3","status":"cleaned-up"}` | `{"count":"3","status":"cleaned-up"}` | true |
| isolated_fixtures_agree | `"AGREE"` | `"AGREE"` | true |
| zero_runtime_errors | `0` | `0` | true |
