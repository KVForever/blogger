/*
 * Class: SWE2511 - Blogger
 *
 * Utility functions
 */

// Helper functions for parameter validation
/*
 * Checks if a value is defined
 */
const isDefined = (value) => (
    value !== undefined && value !== null && typeof(value) !== 'undefined'
);

/*
 * Checks if value is defined, is a string, and has a length > 0
 */
const isNonEmptyString = (value) => (
    isDefined(value) && typeof(value) === "string" && value.length > 0
);

/*
 * Checks if value is string that contains only letters and numbers
 */
const isAlphaNumeric = (text) => {
    const alphanumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUBWXYZ".split('');
    return text
        .split('')                                                  // Split the text into characters
        .map((char) => { return alphanumeric.indexOf(char) >= 0; }) // Search for the character in the valid characters
        .every((element) => { return element === true; })   // Every character must be found
};

/*
 * Checks if value is string that starts with a letter
 */
const startsWithLetter = (text) => {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUBWXYZ".split('');
    return letters.indexOf(text[0]) >= 0;
};