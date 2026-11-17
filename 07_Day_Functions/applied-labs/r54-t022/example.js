/**
 * Contribution focus: Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.
 *
 * Applied Lab (r54-t022) for Day 7: Functions (Function Defaults & Boundary Validation)
 * Contract:
 *  - greet(name, language = 'en')
 *  - name='Ada', language='en' -> 'Hello, Ada!'
 *  - Omitted language defaults to 'en': greet('Ada') === 'Hello, Ada!'
 *  - Blank name (empty string, whitespace, null, undefined) is rejected with an Error.
 */

const SUPPORTED_GREETINGS = {
  en: 'Hello',
  es: 'Hola',
  fr: 'Bonjour',
  de: 'Hallo'
};

/**
 * Validates a name argument according to strict boundary conditions.
 *
 * Exact boundary conditions:
 * 1. Type boundary: Argument must be a primitive string (rejects null, undefined, number, object, etc.).
 * 2. Empty string boundary: Zero-length string `""` is strictly rejected.
 * 3. Whitespace boundary: Strings consisting only of whitespace characters (spaces, tabs, newlines)
 *    are trimmed to zero length and strictly rejected.
 *
 * @param {unknown} name - Value to validate as a non-blank string
 * @returns {string} Clean trimmed string if valid
 * @throws {TypeError} If name is not a string
 * @throws {Error} If name is blank (empty or whitespace only)
 */
function validateName(name) {
  if (typeof name !== 'string') {
    throw new TypeError('Name must be a string');
  }

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new Error('Name cannot be blank');
  }

  return trimmed;
}

/**
 * Greets a person using a specified language prefix with a default language fallback.
 *
 * @param {string} name - Name of the person (must not be blank)
 * @param {string} [language='en'] - Language code (defaults to 'en')
 * @returns {string} Formatted greeting message (e.g., 'Hello, Ada!')
 */
function greet(name, language = 'en') {
  const validName = validateName(name);

  const greetingPrefix = SUPPORTED_GREETINGS[language];
  if (!greetingPrefix) {
    throw new Error(
      `Unsupported language '${language}'. Supported languages: ${Object.keys(SUPPORTED_GREETINGS).join(', ')}`
    );
  }

  return `${greetingPrefix}, ${validName}!`;
}

// CLI demonstration when executed directly via `node example.js`
if (require.main === module) {
  console.log('--- Applied Lab r54-t022: Function Defaults & Boundary Validation ---');
  console.log('Contribution focus: Concentrate on the stated boundary and invalid/empty-input behavior; explain the exact boundary condition in the lesson.\n');

  console.log("1. Explicit language ('en'):", greet('Ada', 'en'));
  console.log("2. Omitted language (default 'en'):", greet('Ada'));

  try {
    console.log("3. Testing blank name (''):");
    greet('');
  } catch (err) {
    console.log('   -> Rejected as expected:', err.message);
  }

  try {
    console.log("4. Testing whitespace-only name ('   '):");
    greet('   ');
  } catch (err) {
    console.log('   -> Rejected as expected:', err.message);
  }
}

module.exports = {
  greet,
  validateName,
  SUPPORTED_GREETINGS
};
