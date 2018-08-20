class ErrorChecker {

  constructor() {}

  //checks if a provided item is undefined or null
  exists(item, itemType) {
    if (typeof item == "undefined" || typeof item == "null") {
      throw new Error(`${itemType} does not exist.`);
    }
  }

  invalidParams(functionName) {
    throw new Error(`Invalid parameters were found at function ${functionName}.`);
  }

}

module.exports = ErrorChecker;
