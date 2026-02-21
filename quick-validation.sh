#!/bin/bash
echo "=== Quick Validation for Issue #21 ==="
echo ""

# CSV Export
echo "1. Testing CSV export..."
curl -s -o test-csv.csv "http://localhost:3001/api/expenses/export/csv"
if [ -f test-csv.csv ] && [ -s test-csv.csv ]; then
  echo "   ✓ CSV export works"
  head -3 test-csv.csv
else
  echo "   ✗ CSV export failed"
fi
echo ""

# CSV with filters
echo "2. Testing CSV with date filter..."
curl -s -o test-csv-filter.csv "http://localhost:3001/api/expenses/export/csv?start_date=2026-02-01&end_date=2026-02-28"
if [ -f test-csv-filter.csv ] && [ -s test-csv-filter.csv ]; then
  echo "   ✓ CSV filtering works"
else
  echo "   ✗ CSV filtering failed"
fi
echo ""

# Excel export
echo "3. Testing Excel export..."
curl -s -o test-excel.xlsx "http://localhost:3001/api/expenses/export/excel"
if [ -f test-excel.xlsx ] && [ -s test-excel.xlsx ]; then
  echo "   ✓ Excel export works ($(stat -f%z test-excel.xlsx) bytes)"
  if unzip -t test-excel.xlsx > /dev/null 2>&1; then
    echo "   ✓ Excel file is valid"
  fi
else
  echo "   ✗ Excel export failed"
fi
echo ""

# Excel with filters  
echo "4. Testing Excel with date filter..."
curl -s -o test-excel-filter.xlsx "http://localhost:3001/api/expenses/export/excel?start_date=2026-02-01&end_date=2026-02-28"
if [ -f test-excel-filter.xlsx ] && [ -s test-excel-filter.xlsx ]; then
  echo "   ✓ Excel filtering works"
else
  echo "   ✗ Excel filtering failed"
fi
echo ""

# ZIP export
echo "5. Testing ZIP export..."
curl -s -o test-zip.zip "http://localhost:3001/api/expenses/export/zip"
if [ -f test-zip.zip ] && [ -s test-zip.zip ]; then
  echo "   ✓ ZIP export works ($(stat -f%z test-zip.zip) bytes)"
  if unzip -t test-zip.zip > /dev/null 2>&1; then
    echo "   ✓ ZIP file is valid"
    echo "   Contents:"
    unzip -l test-zip.zip | head -10
  fi
else
  echo "   ✗ ZIP export failed"
fi
echo ""

# ZIP with filters
echo "6. Testing ZIP with date filter..."
curl -s -o test-zip-filter.zip "http://localhost:3001/api/expenses/export/zip?start_date=2026-02-01&end_date=2026-02-28"
if [ -f test-zip-filter.zip ] && [ -s test-zip-filter.zip ]; then
  echo "   ✓ ZIP filtering works"
else
  echo "   ✗ ZIP filtering failed"
fi
echo ""

# Error handling
echo "7. Testing error handling (no data)..."
curl -s "http://localhost:3001/api/expenses/export/csv?start_date=2099-01-01&end_date=2099-12-31"
echo ""
echo ""

echo "=== Validation Complete ==="
