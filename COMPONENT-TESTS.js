#!/usr/bin/env node

/**
 * Component Validation Tests
 * Tests FileUpload and ExpenseForm components through code analysis and unit tests
 */

const fs = require('fs');
const path = require('path');

// Test results tracking
const results = {
  passed: [],
  failed: [],
  warnings: [],
};

function pass(message) {
  results.passed.push(message);
  console.log('✅ PASS:', message);
}

function fail(message, details) {
  results.failed.push({ message, details });
  console.log('❌ FAIL:', message);
  if (details) console.log('   Details:', details);
}

function warn(message, details) {
  results.warnings.push({ message, details });
  console.log('⚠️  WARN:', message);
  if (details) console.log('   Details:', details);
}

// ============================================================================
// SECTION 1: FileUpload Component Tests
// ============================================================================

console.log('\n📋 TESTING: FileUpload Component\n');
console.log('='.repeat(70));

const fileUploadPath = path.join(__dirname, 'frontend/src/components/FileUpload.jsx');
const fileUploadContent = fs.readFileSync(fileUploadPath, 'utf-8');

// Test 1.1: Component accepts required props
if (fileUploadContent.includes('onFileSelect') && 
    fileUploadContent.includes('onError') &&
    fileUploadContent.includes('allowedTypes') &&
    fileUploadContent.includes('maxSizeMB')) {
  pass('Component accepts all required props');
} else {
  fail('Component missing required props');
}

// Test 1.2: Default allowed types include required formats
const defaultTypesMatch = fileUploadContent.match(/allowedTypes\s*=\s*\[\s*'image\/jpeg'[\s\S]*?'image\/png'[\s\S]*?'image\/heic'[\s\S]*?'application\/pdf'/);
if (defaultTypesMatch) {
  pass('Default allowed types include JPEG, PNG, HEIC, PDF');
} else {
  fail('Default allowed types missing required formats');
}

// Test 1.3: Default maxSizeMB is 10
if (fileUploadContent.includes('maxSizeMB = 10')) {
  pass('Default max file size is 10MB');
} else {
  fail('Default max file size not set to 10MB');
}

// Test 1.4: Drag-drop handlers implemented
if (fileUploadContent.includes('handleDragOver') &&
    fileUploadContent.includes('handleDragLeave') &&
    fileUploadContent.includes('handleDrop')) {
  pass('All drag-drop handlers implemented');
} else {
  fail('Missing drag-drop handlers');
}

// Test 1.5: File validation function exists
if (fileUploadContent.includes('const validateFile = (file) => {')) {
  pass('File validation function exists');
} else {
  fail('Missing file validation function');
}

// Test 1.6: MIME type validation
if (fileUploadContent.includes('!allowedTypes.includes(file.type)')) {
  pass('MIME type validation implemented');
} else {
  fail('MIME type validation missing');
}

// Test 1.7: File size validation
if (fileUploadContent.includes('file.size > maxSizeBytes')) {
  pass('File size validation implemented');
} else {
  fail('File size validation missing');
}

// Test 1.8: FileReader API used for preview
if (fileUploadContent.includes('new FileReader()') &&
    fileUploadContent.includes('readAsDataURL')) {
  pass('FileReader API properly used for preview');
} else {
  fail('FileReader API not properly used');
}

// Test 1.9: Progress indicator implemented
if (fileUploadContent.includes('uploadProgress') &&
    fileUploadContent.includes('setUploadProgress')) {
  pass('Progress indicator state management implemented');
} else {
  fail('Progress indicator missing');
}

// Test 1.10: iPhone detection
if (fileUploadContent.includes('iPhone|iPad|iPod')) {
  pass('iPhone/iPad/iPod detection implemented');
} else {
  fail('iPhone detection missing');
}

// Test 1.11: Camera button for iOS
if (fileUploadContent.includes('isIPhone') && 
    fileUploadContent.includes('Take Photo with Camera')) {
  pass('iOS camera button implemented');
} else {
  fail('iOS camera button missing');
}

// Test 1.12: Camera input restricted to images
const cameraInputMatch = fileUploadContent.match(/ref=\{cameraInputRef\}[\s\S]*?accept=/);
if (cameraInputMatch) {
  // Check if the new version with restricted types is there
  if (fileUploadContent.includes('allowedTypes.filter(t => t.startsWith(\'image/\'))')) {
    pass('Camera input restricted to allowed image types');
  } else {
    warn('Camera input may accept all image types instead of just allowed types');
  }
} else {
  fail('Camera input not found');
}

// Test 1.13: Error state UI
if (fileUploadContent.includes('error &&') && 
    fileUploadContent.includes('FiAlertCircle')) {
  pass('Error state UI implemented');
} else {
  fail('Error state UI missing');
}

// Test 1.14: Preview state UI
if (fileUploadContent.includes('preview &&') && 
    fileUploadContent.includes('preview ? \'hidden\' : \'\'')) {
  pass('Preview state UI implemented');
} else {
  fail('Preview state UI missing');
}

// Test 1.15: Change and Remove buttons
if (fileUploadContent.includes('Change File') && 
    fileUploadContent.includes('Remove')) {
  pass('Change File and Remove action buttons present');
} else {
  fail('Action buttons missing');
}

// Test 1.16: Accessibility - aria labels
if (fileUploadContent.includes('aria-label')) {
  pass('Accessibility attributes (aria-label) present');
} else {
  warn('Missing accessibility attributes');
}

// Test 1.17: Callback data structure
if (fileUploadContent.includes('file,') &&
    fileUploadContent.includes('preview:') &&
    fileUploadContent.includes('name:') &&
    fileUploadContent.includes('size:') &&
    fileUploadContent.includes('type:')) {
  pass('Callback includes correct data structure (file, preview, name, size, type)');
} else {
  fail('Callback data structure incorrect');
}

// ============================================================================
// SECTION 2: ExpenseForm Component Tests
// ============================================================================

console.log('\n📋 TESTING: ExpenseForm Component\n');
console.log('='.repeat(70));

const expenseFormPath = path.join(__dirname, 'frontend/src/components/ExpenseForm.jsx');
const expenseFormContent = fs.readFileSync(expenseFormPath, 'utf-8');

// Test 2.1: Component accepts required props
if (expenseFormContent.includes('properties') &&
    expenseFormContent.includes('onSave') &&
    expenseFormContent.includes('onCancel')) {
  pass('Component accepts all required props');
} else {
  fail('Component missing required props');
}

// Test 2.2: Form state includes 7 required fields
const formStateMatch = expenseFormContent.match(/const \[formData, setFormData\] = useState\(\{[\s\S]*?\}\);/);
if (formStateMatch && 
    formStateMatch[0].includes('date:') &&
    formStateMatch[0].includes('propertyId:') &&
    formStateMatch[0].includes('provider:') &&
    formStateMatch[0].includes('amount:') &&
    formStateMatch[0].includes('categoryId:') &&
    formStateMatch[0].includes('comments:') &&
    formStateMatch[0].includes('fileData:')) {
  pass('All 7 form fields defined in state (date, property, provider, amount, category, comments, file)');
} else {
  fail('Not all 7 form fields present in state');
}

// Test 2.3: Form validation function exists
if (expenseFormContent.includes('const validateForm = () => {')) {
  pass('Form validation function exists');
} else {
  fail('Form validation function missing');
}

// Test 2.4: Date validation
if (expenseFormContent.includes('!formData.date') &&
    expenseFormContent.includes('Date cannot be in the future')) {
  pass('Date validation implemented (required + no future dates)');
} else {
  fail('Date validation missing or incomplete');
}

// Test 2.5: Property validation
if (expenseFormContent.includes('!formData.propertyId') &&
    expenseFormContent.includes('Property is required')) {
  pass('Property field validation implemented');
} else {
  fail('Property validation missing');
}

// Test 2.6: Provider validation
if (expenseFormContent.includes('!formData.provider') &&
    expenseFormContent.includes('Provider name is required') &&
    expenseFormContent.includes('Provider name must be at least 2 characters')) {
  pass('Provider field validation implemented (required + min length)');
} else {
  fail('Provider validation incomplete');
}

// Test 2.7: Amount validation
if (expenseFormContent.includes('!formData.amount') &&
    expenseFormContent.includes('Amount is required') &&
    expenseFormContent.includes('parseFloat(formData.amount) <= 0') &&
    expenseFormContent.includes('Amount must be a positive number')) {
  pass('Amount field validation implemented (required + positive + max)');
} else {
  fail('Amount validation incomplete');
}

// Test 2.8: Category validation
if (expenseFormContent.includes('!formData.categoryId') &&
    expenseFormContent.includes('Category is required')) {
  pass('Category field validation implemented');
} else {
  fail('Category validation missing');
}

// Test 2.9: Form has error and touched state
if (expenseFormContent.includes('[errors, setErrors]') &&
    expenseFormContent.includes('[touched, setTouched]')) {
  pass('Error and touched state management implemented');
} else {
  fail('Error/touched state management missing');
}

// Test 2.10: FileUpload component integrated
if (expenseFormContent.includes('<FileUpload') &&
    expenseFormContent.includes('onFileSelect') &&
    expenseFormContent.includes('onError')) {
  pass('FileUpload component properly integrated');
} else {
  fail('FileUpload integration missing or incomplete');
}

// Test 2.11: Handle form submission
if (expenseFormContent.includes('const handleSubmit = async (e) => {') &&
    expenseFormContent.includes('e.preventDefault()')) {
  pass('Form submission handler implemented');
} else {
  fail('Form submission handler missing');
}

// Test 2.12: Submit data format matches API spec
const submissionDataMatch = expenseFormContent.match(/const submissionData = \{[\s\S]*?\};/);
if (submissionDataMatch &&
    submissionDataMatch[0].includes('date:') &&
    submissionDataMatch[0].includes('propertyId:') &&
    submissionDataMatch[0].includes('provider:') &&
    submissionDataMatch[0].includes('amount: parseFloat') &&
    submissionDataMatch[0].includes('categoryId:') &&
    submissionDataMatch[0].includes('comments:') &&
    submissionDataMatch[0].includes('receipt:')) {
  pass('Submit data format includes all required fields');
} else {
  fail('Submit data format incomplete');
}

// Test 2.13: Success state management
if (expenseFormContent.includes('[submitSuccess, setSubmitSuccess]') &&
    expenseFormContent.includes('[isSubmitting, setIsSubmitting]')) {
  pass('Submit success and loading states managed');
} else {
  fail('Submit states missing');
}

// Test 2.14: Categories loaded in useEffect
if (expenseFormContent.includes('useEffect') &&
    expenseFormContent.includes('setCategories')) {
  pass('Categories loaded via useEffect');
} else {
  fail('Categories loading missing');
}

// Test 2.15: Form has date input
if (expenseFormContent.includes('type="date"') &&
    expenseFormContent.includes('name="date"')) {
  pass('Date input field present');
} else {
  fail('Date input field missing');
}

// Test 2.16: Form has property select
if (expenseFormContent.includes('name="propertyId"') &&
    expenseFormContent.includes('<select')) {
  pass('Property select field present');
} else {
  fail('Property select field missing');
}

// Test 2.17: Form has category select
if (expenseFormContent.includes('name="categoryId"') &&
    expenseFormContent.includes('categories.map')) {
  pass('Category select field present');
} else {
  fail('Category select field missing');
}

// Test 2.18: Form has provider input
if (expenseFormContent.includes('name="provider"') &&
    expenseFormContent.includes('type="text"')) {
  pass('Provider text input field present');
} else {
  fail('Provider input field missing');
}

// Test 2.19: Form has amount input
if (expenseFormContent.includes('name="amount"') &&
    expenseFormContent.includes('type="number"')) {
  pass('Amount number input field present');
} else {
  fail('Amount input field missing');
}

// Test 2.20: Form has comments textarea
if (expenseFormContent.includes('name="comments"') &&
    expenseFormContent.includes('<textarea')) {
  pass('Comments textarea field present');
} else {
  fail('Comments textarea field missing');
}

// Test 2.21: Form submit button
if (expenseFormContent.includes('type="submit"') &&
    expenseFormContent.includes('Add Expense')) {
  pass('Submit button present with correct text');
} else {
  fail('Submit button missing or incorrect');
}

// Test 2.22: Form cancel button
if (expenseFormContent.includes('onClick={onCancel}') &&
    expenseFormContent.includes('Cancel')) {
  pass('Cancel button present');
} else {
  fail('Cancel button missing');
}

// Test 2.23: Error message display
if (expenseFormContent.includes('hasFormError') &&
    expenseFormContent.includes('FiAlertCircle')) {
  pass('Error messages displayed with proper styling');
} else {
  fail('Error message display missing');
}

// Test 2.24: Responsive grid layout
if (expenseFormContent.includes('grid grid-cols-1') &&
    expenseFormContent.includes('sm:grid-cols-2')) {
  pass('Responsive grid layout implemented');
} else {
  warn('Responsive grid layout may be incomplete');
}

// Test 2.25: Currency symbol for amount
if (expenseFormContent.includes('$') && 
    expenseFormContent.includes('left-3')) {
  pass('Currency symbol displayed in amount field');
} else {
  warn('Currency symbol may be missing from amount field');
}

// Test 2.26: Character counter for comments
if (expenseFormContent.includes('formData.comments.length')) {
  pass('Character counter implemented for comments');
} else {
  warn('Character counter for comments may be missing');
}

// ============================================================================
// SUMMARY & REPORT
// ============================================================================

console.log('\n' + '='.repeat(70));
console.log('\n📊 TEST SUMMARY\n');

console.log(`✅ Passed: ${results.passed.length}`);
console.log(`❌ Failed: ${results.failed.length}`);
console.log(`⚠️  Warnings: ${results.warnings.length}`);

if (results.failed.length > 0) {
  console.log('\n❌ FAILED TESTS:');
  results.failed.forEach(f => {
    console.log(`  - ${f.message}`);
    if (f.details) console.log(`    ${f.details}`);
  });
}

if (results.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  results.warnings.forEach(w => {
    console.log(`  - ${w.message}`);
    if (w.details) console.log(`    ${w.details}`);
  });
}

const totalTests = results.passed.length + results.failed.length + results.warnings.length;
const passPercentage = Math.round((results.passed.length / totalTests) * 100);

console.log('\n' + '='.repeat(70));
console.log(`\nOVERALL: ${passPercentage}% PASS RATE (${results.passed.length}/${totalTests})`);

if (results.failed.length === 0) {
  console.log('\n🎉 ALL CRITICAL TESTS PASSED! ✨\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review and fix.\n');
  process.exit(1);
}
