/**
 * Contribution focus: Start from a working version, capture its behavior and extract one clearly named responsibility without changing the contract.
 *
 * Task: R54-T036 (Day 7: Function Defaults & Greeting Refactor)
 * Contract:
 *  - name="Ada", language="en" gives "Hello, Ada!"
 *  - omitted language uses "en" (e.g. name="Ada" -> "Hello, Ada!")
 *  - blank name is rejected (e.g. "", "   ", null, undefined)
 */

const SALUTATIONS = {
  en: 'Hello',
  es: '¡Hola',
  fr: 'Bonjour',
  de: 'Hallo'
};

// --- Initial working implementation before extraction ---
function greetInitial(name, language = 'en') {
  if (name === null || name === undefined || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Name cannot be blank');
  }
  const langKey = typeof language === 'string' && language.trim().length > 0 ? language.trim().toLowerCase() : 'en';
  const salutation = SALUTATIONS[langKey] || SALUTATIONS.en;
  if (langKey === 'es') {
    return `${salutation}, ${name.trim()}!`;
  }
  return `${salutation}, ${name.trim()}!`;
}

// --- Refactored implementation: Extracted clearly named responsibility ---
/**
 * Extracted responsibility: Resolves the appropriate salutation prefix for a given language code.
 */
function resolveSalutation(language = 'en') {
  if (!language || typeof language !== 'string' || language.trim().length === 0) {
    return SALUTATIONS.en;
  }
  const normalizedLang = language.trim().toLowerCase();
  return SALUTATIONS[normalizedLang] || SALUTATIONS.en;
}

/**
 * Extracted responsibility: Validates and sanitizes person name.
 */
function validateName(name) {
  if (name === null || name === undefined || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Name cannot be blank');
  }
  return name.trim();
}

/**
 * Main refactored greeting function orchestrating the extracted responsibilities.
 */
function greet(name, language = 'en') {
  const sanitizedName = validateName(name);
  const salutation = resolveSalutation(language);
  return `${salutation}, ${sanitizedName}!`;
}

if (process.argv[1] && process.argv[1].endsWith('example.js')) {
  console.log('=== Day 7: Function Defaults & Greeting Refactor Demonstration ===');
  console.log('1. Standard greeting (name="Ada", language="en"):', greet('Ada', 'en'));
  console.log('2. Default language (name="Ada", omitted language):', greet('Ada'));
  console.log('3. Additional language support (es):', greet('Ada', 'es'));
  
  try {
    console.log('4. Blank name rejection test:');
    greet('   ');
  } catch (err) {
    console.log('   Caught expected error:', err.message);
  }
}

export {
  greetInitial,
  resolveSalutation,
  validateName,
  greet
};
