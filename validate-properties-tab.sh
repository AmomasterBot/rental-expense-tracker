#!/bin/bash

# Validation script for Properties Tab Fix (#26)
# Tests both desktop and mobile endpoints

API_URL="http://localhost:3001"
DESKTOP_URL="http://localhost:3000"
MOBILE_URL="http://100.68.145.54:3000"

TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
REPORT_FILE="ISSUE-26-VALIDATION-REPORT.md"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Properties Tab Validation - Issue #26"
echo "Timestamp: $TIMESTAMP"
echo "=========================================="
echo ""

# Initialize report
cat > "$REPORT_FILE" << 'EOF'
# Properties Tab Validation Report - Issue #26

**Date:** $(date "+%Y-%m-%d %H:%M:%S")  
**Validator:** ALun (Subagent)  
**Related Issues:** #25 (bug fix), #26 (validation)  
**Related PR:** #27

## Executive Summary

This report validates the Properties tab fix after resolving the white screen crash (Issue #25).

---

## Validation Results

EOF

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Helper function to log test results
log_test() {
    local test_name=$1
    local result=$2
    local details=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$result" == "PASS" ]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo -e "${GREEN}✓${NC} $test_name"
        echo "- [x] $test_name" >> "$REPORT_FILE"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo -e "${RED}✗${NC} $test_name"
        echo "- [ ] $test_name ${RED}FAILED${NC}" >> "$REPORT_FILE"
        [ -n "$details" ] && echo "  - Error: $details" >> "$REPORT_FILE"
    fi
    
    [ -n "$details" ] && echo "  $details"
}

echo "### API Integration Tests" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Test 1: GET /api/properties
echo -e "\n${YELLOW}[1] Testing GET /api/properties${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/properties")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    count=$(echo "$body" | grep -o '"count":[0-9]*' | cut -d: -f2)
    properties=$(echo "$body" | grep -o '"properties":\[' | wc -l)
    
    if [ "$properties" -eq 1 ]; then
        log_test "GET /api/properties returns 200" "PASS" "Found $count properties"
    else
        log_test "GET /api/properties returns 200" "FAIL" "Response missing 'properties' array"
    fi
else
    log_test "GET /api/properties returns 200" "FAIL" "HTTP $http_code"
fi

# Test 2: Create new property
echo -e "\n${YELLOW}[2] Testing POST /api/properties (Create)${NC}"
new_property='{
  "address": "789 Test Validation Ave",
  "city": "ValidationCity",
  "state": "VC",
  "zip_code": "99999",
  "property_type": "test-validation"
}'

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/properties" \
  -H "Content-Type: application/json" \
  -d "$new_property")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "201" ]; then
    created_id=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
    log_test "POST /api/properties creates property" "PASS" "Created property ID: $created_id"
    TEST_PROPERTY_ID=$created_id
else
    log_test "POST /api/properties creates property" "FAIL" "HTTP $http_code"
    TEST_PROPERTY_ID=""
fi

# Test 3: GET single property
if [ -n "$TEST_PROPERTY_ID" ]; then
    echo -e "\n${YELLOW}[3] Testing GET /api/properties/:id${NC}"
    response=$(curl -s -w "\n%{http_code}" "$API_URL/api/properties/$TEST_PROPERTY_ID")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" == "200" ]; then
        address=$(echo "$body" | grep -o '"address":"[^"]*"' | head -1 | cut -d'"' -f4)
        if [ "$address" == "789 Test Validation Ave" ]; then
            log_test "GET /api/properties/:id returns correct data" "PASS" "Address: $address"
        else
            log_test "GET /api/properties/:id returns correct data" "FAIL" "Address mismatch"
        fi
    else
        log_test "GET /api/properties/:id returns correct data" "FAIL" "HTTP $http_code"
    fi
fi

# Test 4: Update property
if [ -n "$TEST_PROPERTY_ID" ]; then
    echo -e "\n${YELLOW}[4] Testing PUT /api/properties/:id${NC}"
    update_property='{
      "address": "789 Updated Test Ave",
      "city": "UpdatedCity",
      "state": "UC",
      "zip_code": "88888",
      "property_type": "updated-type"
    }'
    
    response=$(curl -s -w "\n%{http_code}" -X PUT "$API_URL/api/properties/$TEST_PROPERTY_ID" \
      -H "Content-Type: application/json" \
      -d "$update_property")
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" == "200" ]; then
        # Verify update
        verify=$(curl -s "$API_URL/api/properties/$TEST_PROPERTY_ID")
        updated_address=$(echo "$verify" | grep -o '"address":"[^"]*"' | head -1 | cut -d'"' -f4)
        
        if [ "$updated_address" == "789 Updated Test Ave" ]; then
            log_test "PUT /api/properties/:id updates property" "PASS" "Update verified"
        else
            log_test "PUT /api/properties/:id updates property" "FAIL" "Update not persisted"
        fi
    else
        log_test "PUT /api/properties/:id updates property" "FAIL" "HTTP $http_code"
    fi
fi

# Test 5: Delete property
if [ -n "$TEST_PROPERTY_ID" ]; then
    echo -e "\n${YELLOW}[5] Testing DELETE /api/properties/:id${NC}"
    response=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/api/properties/$TEST_PROPERTY_ID")
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" == "204" ] || [ "$http_code" == "200" ]; then
        # Verify deletion
        verify=$(curl -s -w "\n%{http_code}" "$API_URL/api/properties/$TEST_PROPERTY_ID")
        verify_code=$(echo "$verify" | tail -n1)
        
        if [ "$verify_code" == "404" ]; then
            log_test "DELETE /api/properties/:id removes property" "PASS" "Property deleted and verified"
        else
            log_test "DELETE /api/properties/:id removes property" "FAIL" "Property still exists (HTTP $verify_code)"
        fi
    else
        log_test "DELETE /api/properties/:id removes property" "FAIL" "HTTP $http_code"
    fi
fi

# Test 6: Frontend accessibility
echo "" >> "$REPORT_FILE"
echo "### Frontend Accessibility Tests" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo -e "\n${YELLOW}[6] Testing Frontend (Desktop)${NC}"
desktop_response=$(curl -s -w "\n%{http_code}" "$DESKTOP_URL")
desktop_code=$(echo "$desktop_response" | tail -n1)

if [ "$desktop_code" == "200" ]; then
    log_test "Desktop frontend accessible at $DESKTOP_URL" "PASS"
else
    log_test "Desktop frontend accessible at $DESKTOP_URL" "FAIL" "HTTP $desktop_code"
fi

echo -e "\n${YELLOW}[7] Testing Frontend (Mobile via Tailscale)${NC}"
mobile_response=$(curl -s -w "\n%{http_code}" --max-time 5 "$MOBILE_URL" 2>/dev/null)
mobile_code=$(echo "$mobile_response" | tail -n1)

if [ "$mobile_code" == "200" ]; then
    log_test "Mobile frontend accessible at $MOBILE_URL" "PASS"
else
    log_test "Mobile frontend accessible at $MOBILE_URL" "FAIL" "HTTP $mobile_code (Tailscale may be down)"
fi

# Test 7: Component structure validation
echo "" >> "$REPORT_FILE"
echo "### Component Structure Validation" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo -e "\n${YELLOW}[8] Checking Properties.jsx structure${NC}"
if [ -f "frontend/src/pages/Properties.jsx" ]; then
    # Check for key imports
    has_useState=$(grep -c "useState" frontend/src/pages/Properties.jsx)
    has_useEffect=$(grep -c "useEffect" frontend/src/pages/Properties.jsx)
    has_api_url=$(grep -c "API_BASE_URL" frontend/src/pages/Properties.jsx)
    has_fetch=$(grep -c "fetchProperties" frontend/src/pages/Properties.jsx)
    
    if [ "$has_useState" -gt 0 ] && [ "$has_useEffect" -gt 0 ] && [ "$has_api_url" -gt 0 ] && [ "$has_fetch" -gt 0 ]; then
        log_test "Properties component has correct structure" "PASS" "All required hooks and API calls present"
    else
        log_test "Properties component has correct structure" "FAIL" "Missing hooks or API configuration"
    fi
else
    log_test "Properties component has correct structure" "FAIL" "File not found"
fi

# Test 8: Check for PropertyCard and PropertyForm components
echo -e "\n${YELLOW}[9] Checking dependent components${NC}"
if [ -f "frontend/src/components/PropertyCard.jsx" ] && [ -f "frontend/src/components/PropertyForm.jsx" ]; then
    log_test "PropertyCard and PropertyForm components exist" "PASS"
else
    log_test "PropertyCard and PropertyForm components exist" "FAIL" "Missing component files"
fi

# Test 9: Error handling
echo "" >> "$REPORT_FILE"
echo "### Error Handling Tests" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo -e "\n${YELLOW}[10] Testing error handling (invalid property)${NC}"
invalid_property='{"address": ""}'
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/properties" \
  -H "Content-Type: application/json" \
  -d "$invalid_property")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" == "400" ] || [ "$http_code" == "422" ]; then
    log_test "API rejects invalid property data" "PASS" "HTTP $http_code"
else
    log_test "API rejects invalid property data" "FAIL" "Expected 400/422, got $http_code"
fi

# Test 10: Non-existent property
echo -e "\n${YELLOW}[11] Testing 404 handling${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/properties/999999")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" == "404" ]; then
    log_test "API returns 404 for non-existent property" "PASS"
else
    log_test "API returns 404 for non-existent property" "FAIL" "HTTP $http_code"
fi

# Generate summary
echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "## Test Summary" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "- **Total Tests:** $TOTAL_TESTS" >> "$REPORT_FILE"
echo "- **Passed:** $PASSED_TESTS" >> "$REPORT_FILE"
echo "- **Failed:** $FAILED_TESTS" >> "$REPORT_FILE"

if [ $FAILED_TESTS -eq 0 ]; then
    echo "- **Status:** ✅ ALL TESTS PASSED" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "## Conclusion" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "The Properties tab fix has been successfully validated. All CRUD operations, API integration, error handling, and component structure tests passed." >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "### What Was Validated" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "1. **API Integration** - All endpoints working correctly" >> "$REPORT_FILE"
    echo "2. **CRUD Operations** - Create, Read, Update, Delete all functional" >> "$REPORT_FILE"
    echo "3. **Error Handling** - Invalid data and 404 responses properly handled" >> "$REPORT_FILE"
    echo "4. **Component Structure** - Properties.jsx has correct hooks and API configuration" >> "$REPORT_FILE"
    echo "5. **Frontend Accessibility** - Both desktop and mobile endpoints responding" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "### Manual Testing Still Required" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "The following items require manual browser testing:" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "- [ ] Visual rendering (no white screen)" >> "$REPORT_FILE"
    echo "- [ ] UI interactions (button clicks, form inputs)" >> "$REPORT_FILE"
    echo "- [ ] Console errors/warnings" >> "$REPORT_FILE"
    echo "- [ ] Mobile touch interactions" >> "$REPORT_FILE"
    echo "- [ ] Modal dialogs and confirmations" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "### Next Steps" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "1. Perform manual browser testing on both desktop and mobile" >> "$REPORT_FILE"
    echo "2. If all manual tests pass, commit with message: \`ALun: Validate Properties tab fix - all checks passed (#26)\`" >> "$REPORT_FILE"
    echo "3. Close issue #26" >> "$REPORT_FILE"
else
    echo "- **Status:** ❌ SOME TESTS FAILED" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "## Issues Found" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "Please review the failed tests above and address the issues before closing issue #26." >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"
echo "---" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "**Generated:** $(date "+%Y-%m-%d %H:%M:%S")" >> "$REPORT_FILE"

# Print summary
echo ""
echo "=========================================="
echo "VALIDATION SUMMARY"
echo "=========================================="
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
if [ $FAILED_TESTS -gt 0 ]; then
    echo -e "${RED}Failed: $FAILED_TESTS${NC}"
else
    echo -e "${GREEN}Failed: 0${NC}"
fi
echo ""
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All automated tests passed!${NC}"
else
    echo -e "${RED}✗ Some tests failed - review report${NC}"
fi
echo ""
echo "Full report saved to: $REPORT_FILE"
echo "=========================================="
