#!/bin/bash

# Script to migrate Jest tests to Vitest
echo "Migrating test files from Jest to Vitest..."

# Find all test files
TEST_FILES=$(find ./src ./test -name "*.spec.ts" -o -name "*.e2e-spec.ts")

# Loop through each file and make the changes
for file in $TEST_FILES; do
  echo "Processing $file..."
  
  # Add Vitest imports
  sed -i '' '1s/^/import { describe, it, expect, beforeEach, vi, afterEach, beforeAll, afterAll } from "vitest";\n/' "$file"
  
  # Replace Jest functions with Vitest
  sed -i '' 's/jest\.fn()/vi\.fn()/g' "$file"
  sed -i '' 's/jest\.mock/vi\.mock/g' "$file"
  sed -i '' 's/jest\.spyOn/vi\.spyOn/g' "$file"
  sed -i '' 's/jest\.clearAllMocks/vi\.clearAllMocks/g' "$file"
  sed -i '' 's/jest\.resetAllMocks/vi\.resetAllMocks/g' "$file"
  sed -i '' 's/jest\.restoreAllMocks/vi\.restoreAllMocks/g' "$file"
  
  # Update mock implementations to Vitest style
  sed -i '' 's/mockImplementation/mockImplementation/g' "$file"
  sed -i '' 's/mockResolvedValue/mockResolvedValue/g' "$file"
  sed -i '' 's/mockRejectedValue/mockRejectedValue/g' "$file"
  
  # Replace Jest's requireActual with Vitest's require
  sed -i '' 's/jest\.requireActual/require/g' "$file"
  
  echo "$file migrated successfully."
done

echo "Migration complete. Please review the changes to ensure everything works correctly."
echo "You may need to make additional manual changes to some files." 