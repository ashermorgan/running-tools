# Changelog

## 1.4.1 -- 2024-09-07

### Fixed

- Allow workout split distances to be edited from the Batch Calculator
- Improve accuracy of the VO2 Max race prediction model
- Fix miscellaneous dark mode issues

## 1.4.0 -- 2024-07-11

### Added

- Add Batch Calculator for performing pace, race, and workout calculations over
  a range of input times
- Add Workout Calculator for estimating target workout splits

### Changed

- Open the edit target set dialog automatically after a new target set is
  created

## Removed

- Remove support for using target sets across multiple calculators (excluding
  the Batch Calculator, where applicable)

### Fixed

- Ensure Split Calculator splits are saved after a new target set is created

## 1.3.0 -- 2024-03-25

### Added

- Add about page

### Changed

- Allow target sets to be used across multiple calculators
- Reorganize Race Calculator options and output
- Allow default units to be customized

### Fixed

- Improve input element behavior and validation
- Improve accuracy of the Purdy Points race prediction model for time-based
  targets
- Improve accessibility

## 1.2.0 -- 2021-11-20

### Added

- Add Split Calculator for calculating split paces and cumulative times of
  races

### Changed

- Save calculator state between sessions
- Improve arrow key behavior in time input fields
- Improve formatting of distances and durations

## 1.1.1 -- 2021-09-19

### Fixed

- Fix bug in how default units are chosen
- Fix issue that caused all Pace and Race Calculator results to be NaN after
  updating to version 1.1.0

## 1.1.0 -- 2021-09-16

### Added

- Support time-based targets in Pace and Race Calculators
- Add advanced options and output in Race Calculator

### Changed

- Show the pace of each result in Race Calculator
- Improve calculator interfaces
- Choose default units automatically according to the user's language region

## 1.0.0 -- 2021-08-30

### Added

- Add Race Calculator for estimating equivalent race results
- Implement dark mode

### Changed

- Allow the list of Pace Calculator targets to be edited
- Improve appearance on mobile devices
- Cache inactive pages
- Allow minute and second input fields to wrap around

## 0.2.0 -- 2021-08-18

### Added

- Add Pace Calculator for calculating distances and times that are at equivalent
  paces
- Add Unit Calculator for converting between distance, time, speed, and pace
  units
- Implement Progressive Web App functionality

## 0.1.0 -- 2021-07-29

*Initial release with basic app structure.*
