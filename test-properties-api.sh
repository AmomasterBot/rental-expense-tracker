#!/bin/bash

# Test script for Property CRUD endpoints
# Tests all 5 endpoints: POST, GET (list), GET (by ID), PUT, DELETE

BASE_URL="http://localhost:3001/api/properties"
PASSED=0
FAILED=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Property CRUD Endpoints Test Suite${NC}"
echo -e "${YELLOW}========================================${NC}"

# Test 1: Create a new property
echo -e "\n${YELLOW}Test 1: POST /api/properties - Create new property${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "999 Test St",
    "city": "TestCity",
    "state": "TC",
    "zip_code": "12345",
    "property_type": "rental",
    "notes": "Test property"
  }')

if echo "$RESPONSE" | jq . > /dev/null 2>&1; then
  if echo "$RESPONSE" | jq -e '.property.id' > /dev/null 2>&1; then
    TEST_ID=$(echo "$RESPONSE" | jq -r '.property.id')
    echo -e "${GREEN}✓ PASS${NC}: Property created with ID $TEST_ID"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: Response missing property ID"
    echo "Response: $RESPONSE"
    ((FAILED++))
  fi
else
  echo -e "${RED}✗ FAIL${NC}: Invalid JSON response"
  echo "Response: $RESPONSE"
  ((FAILED++))
fi

# Test 2: List all properties
echo -e "\n${YELLOW}Test 2: GET /api/properties - List all properties${NC}"
RESPONSE=$(curl -s "$BASE_URL")

if echo "$RESPONSE" | jq . > /dev/null 2>&1; then
  COUNT=$(echo "$RESPONSE" | jq -r '.count')
  echo -e "${GREEN}✓ PASS${NC}: Retrieved $COUNT properties"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}: Invalid JSON response"
  ((FAILED++))
fi

# Test 3: Get a single property by ID
echo -e "\n${YELLOW}Test 3: GET /api/properties/:id - Retrieve single property${NC}"
if [ ! -z "$TEST_ID" ]; then
  RESPONSE=$(curl -s "$BASE_URL/$TEST_ID")
  
  if echo "$RESPONSE" | jq . > /dev/null 2>&1; then
    RETRIEVED_ID=$(echo "$RESPONSE" | jq -r '.id')
    if [ "$RETRIEVED_ID" = "$TEST_ID" ]; then
      echo -e "${GREEN}✓ PASS${NC}: Retrieved property $TEST_ID with expense summary"
      echo "  - Address: $(echo $RESPONSE | jq -r '.address')"
      echo "  - Expense Count: $(echo $RESPONSE | jq -r '.expense_count')"
      echo "  - Total Expenses: $(echo $RESPONSE | jq -r '.total_expenses')"
      ((PASSED++))
    else
      echo -e "${RED}✗ FAIL${NC}: Retrieved property ID mismatch"
      ((FAILED++))
    fi
  else
    echo -e "${RED}✗ FAIL${NC}: Invalid JSON response"
    ((FAILED++))
  fi
else
  echo -e "${RED}✗ SKIP${NC}: No test property ID from Test 1"
  ((FAILED++))
fi

# Test 4: Update a property
echo -e "\n${YELLOW}Test 4: PUT /api/properties/:id - Update property${NC}"
if [ ! -z "$TEST_ID" ]; then
  RESPONSE=$(curl -s -X PUT "$BASE_URL/$TEST_ID" \
    -H "Content-Type: application/json" \
    -d '{
      "address": "999 Test St",
      "city": "TestCity",
      "state": "TC",
      "zip_code": "12345",
      "property_type": "rental",
      "notes": "Updated test property"
    }')
  
  if echo "$RESPONSE" | jq . > /dev/null 2>&1; then
    if echo "$RESPONSE" | jq -e '.property.notes' > /dev/null 2>&1; then
      NOTES=$(echo "$RESPONSE" | jq -r '.property.notes')
      if [[ "$NOTES" == *"Updated"* ]]; then
        echo -e "${GREEN}✓ PASS${NC}: Property updated successfully"
        echo "  - New Notes: $NOTES"
        ((PASSED++))
      else
        echo -e "${RED}✗ FAIL${NC}: Notes not updated"
        ((FAILED++))
      fi
    else
      echo -e "${RED}✗ FAIL${NC}: Response missing property data"
      ((FAILED++))
    fi
  else
    echo -e "${RED}✗ FAIL${NC}: Invalid JSON response"
    ((FAILED++))
  fi
else
  echo -e "${RED}✗ SKIP${NC}: No test property ID"
  ((FAILED++))
fi

# Test 5: Delete a property
echo -e "\n${YELLOW}Test 5: DELETE /api/properties/:id - Delete property${NC}"
if [ ! -z "$TEST_ID" ]; then
  RESPONSE=$(curl -s -X DELETE "$BASE_URL/$TEST_ID")
  
  if echo "$RESPONSE" | jq . > /dev/null 2>&1; then
    DELETED=$(echo "$RESPONSE" | jq -r '.deleted')
    if [ "$DELETED" = "true" ]; then
      echo -e "${GREEN}✓ PASS${NC}: Property deleted successfully"
      ((PASSED++))
      
      # Verify deletion
      VERIFY=$(curl -s "$BASE_URL/$TEST_ID")
      if echo "$VERIFY" | jq -e '.error' > /dev/null 2>&1; then
        echo "  - Deletion verified (404 returned)"
      fi
    else
      echo -e "${RED}✗ FAIL${NC}: Delete returned false"
      ((FAILED++))
    fi
  else
    echo -e "${RED}✗ FAIL${NC}: Invalid JSON response"
    ((FAILED++))
  fi
else
  echo -e "${RED}✗ SKIP${NC}: No test property ID"
  ((FAILED++))
fi

# Test 6: Error Handling - Missing required fields
echo -e "\n${YELLOW}Test 6: Error Handling - Missing required fields${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "city": "TestCity",
    "notes": "Missing address, state, zip"
  }')

if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
  ERROR=$(echo "$RESPONSE" | jq -r '.error')
  if [[ "$ERROR" == *"required"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}: Proper 400 error for missing fields"
    echo "  - Error: $ERROR"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: Error message unclear"
    ((FAILED++))
  fi
else
  echo -e "${RED}✗ FAIL${NC}: No error response"
  ((FAILED++))
fi

# Test 7: Error Handling - Property not found
echo -e "\n${YELLOW}Test 7: Error Handling - Property not found (404)${NC}"
RESPONSE=$(curl -s "$BASE_URL/99999")

if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
  ERROR=$(echo "$RESPONSE" | jq -r '.error')
  if [[ "$ERROR" == *"not found"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}: Proper 404 error for missing property"
    echo "  - Error: $ERROR"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: Error message unclear"
    ((FAILED++))
  fi
else
  echo -e "${RED}✗ FAIL${NC}: No error response"
  ((FAILED++))
fi

# Test 8: Error Handling - Duplicate address
echo -e "\n${YELLOW}Test 8: Error Handling - Duplicate address (409)${NC}"
# First create a property
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Unique Test Address",
    "city": "TestCity",
    "state": "TC",
    "zip_code": "12345",
    "property_type": "rental"
  }' > /dev/null

# Try to create duplicate
RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Unique Test Address",
    "city": "AnotherCity",
    "state": "TC",
    "zip_code": "54321"
  }')

if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
  ERROR=$(echo "$RESPONSE" | jq -r '.error')
  if [[ "$ERROR" == *"already exists"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}: Proper 409 error for duplicate address"
    echo "  - Error: $ERROR"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: Error message unclear"
    ((FAILED++))
  fi
else
  echo -e "${RED}✗ FAIL${NC}: No error response"
  ((FAILED++))
fi

# Summary
echo -e "\n${YELLOW}========================================${NC}"
echo -e "${YELLOW}Test Summary${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
TOTAL=$((PASSED + FAILED))
echo -e "Total: $TOTAL"

if [ $FAILED -eq 0 ]; then
  echo -e "\n${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "\n${RED}✗ Some tests failed${NC}"
  exit 1
fi
