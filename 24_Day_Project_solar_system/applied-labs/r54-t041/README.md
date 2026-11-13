# Applied Lab (r54-t041): Celsius to Fahrenheit Converter

> **Contribution focus**: Implement the required behavior from the explicit contract; show the smallest useful complete example.

This applied lab extends the interactive form and DOM calculation concepts from **Day 24: Project Solar System** by building an accessible temperature conversion form without external dependencies.

## Explicit Contract

1. **Conversion Formula**:
   $$\text{°F} = \left(\text{°C} \times \frac{9}{5}\right) + 32$$
2. **Explicit Test Cases**:
   - `0` °C → `32` °F
   - `100` °C → `212` °F
   - `-40` °C → `-40` °F
3. **Blank Input Validation**:
   - Submitting empty or whitespace input displays an accessible error message.
   - Accessible markup uses `role="alert"` and `aria-live="polite"`.
   - The input has `aria-describedby="celsius-error"` and `aria-invalid="true"` when in error state.
4. **Labelled Output**:
   - The output is explicitly labelled with `<label for="fahrenheit-output">` and paired with `<output id="fahrenheit-output" for="celsius-input">`.

## Running the Example

Start the local standalone application:

```bash
node 24_Day_Project_solar_system/applied-labs/r54-t041/example.js
```

## Running the Automated Checks

Run the automated Playwright validation suite:

```bash
node 24_Day_Project_solar_system/applied-labs/r54-t041/check.mjs
```

Test results, inputs, actual versus expected outputs, and tool versions are recorded in `work/R54-T041/`.
