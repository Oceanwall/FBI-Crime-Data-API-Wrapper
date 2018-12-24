# Changelog

All notable changes to this project will be documented in this file.

## TO-DO

* Further abstract error handling.
* Add methods to get information by year range.
* Take state IDs in addition to state abbreviations.
* Get changelog versions linking to their proper releases.

## 1.1.0 - 2018-12-24

### Added
* Extended functionality of wrapper, adding new methods:
	* getCrimeByORI
	* getMultipleCrimesByORI
	* getAgenciesByRegion
	* getAgenciesByCoordinates
	* getAllStates
	* getStatesByRegion
* Test cases for robust error handling:
	* Invalid number of arguments
	* Bad argument types
	* Incorrect arguments (and subsequent API return values)
* This changelog.

### Changed
* Example file now demonstrates use via promises and asnychronous functions as opposed to simply listing out example function calls.
* Centralized error handling has been moved out to RequestCreator.js.
* Updated documentation and README.

### Removed
* Strict error handling can no longer be disabled.

## 1.0.0 - 2018-09-03

### Added

* Fulfills all default functionality of the FBI Uniform Crime Reporting API.
* Basic test cases to ensure correctness of function return values.
* Auto-generated documentation using documentation.js.
* [Published to NPM.](https://www.npmjs.com/package/fbi-ucr-api)
