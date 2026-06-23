# Node Unit Test Documentation

This document summarizes the unit test coverage in the `Node/tests` folder for the Nutrition App backend.

Each file uses an in-memory SQLite database (`better-sqlite3`) and validates the helper functions in `Node/src/helpers/` with repository-level integration tests.

---

## `customFood.helper.test.ts`

Suite: `customFood.helper.ts with in-memory database`

Tests cover:
- `CreateCustomFoodInDatabase`
  - throws if any required parameter is missing
  - throws when the provided `userId` does not exist
  - returns a sanitized custom food object when valid
- `GetCustomFoodByIdFromDatabase`
  - throws if the custom food ID is not found
  - returns the expected custom food data when found
- `GetCustomFoodByUserIdFromDatabase`
  - throws if user ID is missing or invalid
  - returns the correct custom foods for a given user ID
- `UpdateCustomFoodInDatabase`
  - updates an existing custom food record successfully
  - throws if the target custom food ID does not exist
- `DeleteCustomFoodInDatabase`
  - deletes an existing custom food successfully
  - throws if the custom food ID does not exist

Notes:
- Ensures custom food creation and retrieval preserve data fields.
- Confirms invalid lookups and updates raise exceptions.

---

## `dietaryRestriction.helper.test.ts`

Suite: `dietaryRestriction.helper.ts with in-memory database`

Tests cover:
- `CreateDietaryRestrictionInDatabase`
  - throws when required fields are missing
  - returns a mapped dietary restriction object on success
- `GetAllDietaryRestrictionsFromDatabase`
  - returns all created dietary restrictions with mapped output
- `GetDietaryRestrictionByIdFromDatabase`
  - returns a restriction by ID when found
  - throws if the restriction is not found
- `UpdateDietaryRestrictionInDatabase`
  - updates an existing restriction successfully
  - throws when the restriction does not exist
- `DeleteDietaryRestrictionInDatabase`
  - removes an existing restriction successfully
  - throws when the restriction does not exist
- `AssignDietaryRestrictionToPatientInDatabase`
  - creates patient-restriction mapping successfully
- `GetPatientDietaryRestrictionsFromDatabase`
  - returns mapped dietary restrictions assigned to a patient
- `RemoveDietaryRestrictionFromPatientInDatabase`
  - deletes an existing mapping successfully
  - throws when the mapping does not exist

Notes:
- The tests also create supporting patient and user records to validate relations.

---

## `flag.helper.test.ts`

Suite: `flag.helper.ts with in-memory database`

Tests cover:
- `GetFlagsDayFromDatabase`
  - throws if date or patient ID is invalid
  - returns expected flag results for food file entries
  - returns expected flag results for custom food entries
- `GetFlagsWeekFromDatabase`
  - throws if date or patient ID is invalid
  - returns expected weekly flag results for food file entries
- `GetFlagsCustomTimePeriodFromDatabase`
  - throws if date range or patient ID is invalid
  - returns expected flag results for a custom time period using food file entries

Notes:
- Test fixtures include both FCDB and custom food logs.
- Validates nutritional flag generation for day, week, and custom time range outputs.

---

## `foodLog.helper.test.ts`

Suite: `foodLog.helper.ts with in-memory database`

Tests cover:
- `CreateFoodLogInDatabase`
  - throws when any required parameter is missing (FCDB and custom variants)
  - throws when both `CustomFoodId` and `FCDBFoodId` are defined or both missing
  - throws when `patientId` or `custom food` references do not exist
  - returns a sanitized food log object on success
- `GetFoodLogByIdFromDatabase`
  - throws if the food log is not found
  - returns the specified food log when found
- `GetFoodLogByPatientIdFromDatabase`
  - throws if patient ID is missing or invalid
  - returns correct food logs for a given patient
- `GetFoodLogsByDateAndPatientIdFromDatabase`
  - throws if patient ID or date is invalid
  - returns correct food logs for a given patient and date
- `UpdateFoodLogInDatabase`
  - updates an existing food log successfully
  - throws if the log does not exist
- `DeleteFoodLogInDatabase`
  - removes an existing food log successfully
  - throws if the log does not exist

Notes:
- Uses both FCDB and custom food log test data.
- Verifies proper validation of cross-entity references.

---

## `medicalCondition.helper.test.ts`

Suite: `medicalCondition.helper.ts with in-memory database`

Tests cover:
- `CreateMedicalConditionInDatabase`
  - throws when required fields are missing
  - returns a mapped medical condition object on success
- `GetAllMedicalConditionsFromDatabase`
  - returns all created medical conditions with mapped output
- `GetMedicalConditionByIdFromDatabase`
  - returns a medical condition by ID when found
  - throws if the condition is not found
- `UpdateMedicalConditionInDatabase`
  - updates an existing condition successfully
  - throws when the condition does not exist
- `DeleteMedicalConditionInDatabase`
  - removes an existing condition successfully
  - throws when the condition does not exist
- `AssignMedicalConditionToPatientInDatabase`
  - creates patient-condition mapping successfully
- `GetPatientMedicalConditionsFromDatabase`
  - returns mapped medical conditions for a patient
- `RemoveMedicalConditionFromPatientInDatabase`
  - deletes an existing patient-condition mapping successfully
  - throws when the mapping does not exist

Notes:
- Covers both CRUD and assignment operations for medical conditions.

---

## `patient.helper.test.ts`

Suite: `patient.helper.ts with in-memory database`

Tests cover:
- `CreatePatientInDatabase`
  - throws when any required parameter is missing
  - throws when `userId` does not match any user
  - returns a sanitized patient object on success
- `GetPatientByIdInDatabase`
  - throws if the patient is not found
  - returns the expected patient data when found
- `GetAllPatientsByUserIdInDatabase`
  - throws if user ID is missing or invalid
  - returns the correct patients for a given user ID
- `UpdatePatientInDatabase`
  - updates an existing patient successfully
  - throws if the patient does not exist
- `DeletePatientInDatabase`
  - removes an existing patient successfully
  - throws if the patient does not exist

Notes:
- Verifies relationship validation between patients and users.

---

## `RDI.helper.test.ts`

Suite: `RDI.helper.ts with in-memory database`

Tests cover:
- `CalculateRDI`
  - throws if the patient ID is invalid or missing
  - returns correct RDI values for a male patient
  - returns correct RDI values for a female patient
  - returns correct RDI values for a pregnant female patient

Notes:
- Uses real patient and medical condition fixtures for sex and pregnancy calculations.

---

## `report.helper.test.ts`

Suite: `flag.helper.ts with in-memory database` (report generator coverage)

Tests cover:
- `GetReportDayFromDatabase`
  - throws if date or patient ID is invalid
  - returns correct daily report values for food file entries
  - returns correct daily report values for custom food entries
- `GetReportWeekFromDatabase`
  - throws if date or patient ID is invalid
  - returns correct weekly report values for food file entries
- `GetReportCustomTimePeriodFromDatabase`
  - throws if date range or patient ID is invalid
  - returns correct report values for a custom time period

Notes:
- Validates report generation across day, week, and custom time period flows.

---

## `search.helper.test.ts`

Suite: `search.helper.ts with in-memory database`

Tests cover:
- `SearchFoodFileAndCustomInDatabaseAndAPI`
  - throws if the user ID is invalid
  - returns matching food file and custom food search results
- `SearchGetFoodFileFromAPI`
  - throws if the food file is not found
  - returns the expected food file data for a valid ID
- `SearchGetCustomFromDatabase`
  - throws if the custom food is not found
  - returns the expected custom food record for a valid ID

Notes:
- Ensures search behavior includes both external API food file lookup and internal custom food storage.

---

## `totalNutrients.helper.test.ts`

Suite: `totalNutrients.helper.ts with in-memory database`

Tests cover:
- `GetTotalNutrientsDayFromDatabase`
  - throws if date or patient ID is invalid
  - returns correct total nutrients calculations for food file entries
  - returns correct total nutrients calculations for custom food entries
- `GetTotalNutrientsWeekFromDatabase`
  - throws if date or patient ID is invalid
  - returns correct weekly total nutrients calculations for food file entries
- `GetTotalNutrientsCustomTimePeriodFromDatabase`
  - throws if date range or patient ID is invalid
  - returns correct total nutrients calculations for a custom time period

Notes:
- Verifies nutrient aggregation over day, week, and custom time ranges.

---

## `user.helper.test.ts`

Suite: `user.helper.ts with in-memory database`

Tests cover:
- `CreateUserInDatabase`
  - throws if username or password is missing
  - saves a user and returns a sanitized object without `passwordHash`
- `GetUserFromDatabase`
  - throws if the user is not found
  - returns a user object without `passwordHash`
- `GetAllUsersFromDatabase`
  - throws when no users exist
  - returns all users without `passwordHash`
- `UpdateUserInDatabase`
  - updates an existing user successfully
  - throws if the user does not exist
- `LoginUserFromDatabase`
  - returns a token and sanitized user on valid credentials
  - throws when the user is not found
  - throws when the password is incorrect
- `DeleteUserInDatabase`
  - removes a user successfully
  - throws if the user does not exist

Notes:
- Ensures authentication flows and user CRUD operations are validated.
