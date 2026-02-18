# Manual Test Plan - FileUpload & ExpenseForm Components

## Prerequisites
1. Frontend dev server running on http://localhost:3000
2. Backend server running (for data persistence)
3. Browser with DevTools available
4. Test files prepared:
   - Valid image (JPEG, PNG, HEIC)
   - Valid PDF
   - Invalid file (TXT, DOC)
   - File > 10MB for size validation
   - File exactly 10MB for edge case

---

## Test Suite 1: FileUpload Component

Navigate to: `http://localhost:3000/expenses/add` (ExpenseForm includes FileUpload)

### T1.1: Basic Rendering
**Steps:**
1. Load the Add Expense page
2. Scroll to "Receipt/Proof" section

**Expected Results:**
- Drag-drop area visible with dashed border
- Upload icon visible
- "Drag and drop your file here or" text visible
- "click to browse" link visible (blue color)
- File type hints: "JPEG, PNG, HEIC, or PDF"
- Size limit hint: "Max 10MB"

**Status:** ⏳ TO BE TESTED

---

### T1.2: iPhone Camera Button (Mobile Only)
**Steps:**
1. Use Safari on iOS device OR
2. Use browser DevTools to emulate iPhone 15 user agent
3. Refresh page
4. Look for camera button below upload area

**Expected Results:**
- Green button visible with camera icon
- Text says "Take Photo with Camera"
- Button styled with green color
- Separator line above button

**Status:** ⏳ TO BE TESTED

---

### T1.3: Drag-Drop with Valid File
**Steps:**
1. Prepare a valid JPEG/PNG/PDF file
2. Drag file over the upload area
3. Observe hover state
4. Drop file on upload area

**Expected Results:**
- On drag: border changes to blue (#3b82f6), background becomes light blue
- On drop: file is processed
- Progress indicator appears (circular progress 0-100%)
- "Uploading..." text shown
- After completion: preview appears

**Status:** ⏳ TO BE TESTED

---

### T1.4: Click-to-Browse
**Steps:**
1. Click "click to browse" link
2. Select a valid PNG file from file picker
3. Verify file picker accepts PNG

**Expected Results:**
- File picker dialog opens
- File picker shows file type hints matching accepttypes
- Can select and open PNG file
- File processes after selection

**Status:** ⏳ TO BE TESTED

---

### T1.5: File Type Validation - JPEG
**Steps:**
1. Use click-to-browse
2. Select a JPEG file
3. Wait for processing

**Expected Results:**
- File passes validation
- Progress bar completes
- Preview shows image thumbnail
- "File selected" checkmark appears
- File info shows: Name, Size (KB), Type (image/jpeg)

**Status:** ⏳ TO BE TESTED

---

### T1.6: File Type Validation - PNG
**Steps:**
1. Use click-to-browse
2. Select a PNG file

**Expected Results:**
- Same as JPEG test
- Preview shows correct PNG image

**Status:** ⏳ TO BE TESTED

---

### T1.7: File Type Validation - HEIC
**Steps:**
1. On iOS: Use camera button to take photo
2. Select HEIC image
3. Or use click-to-browse with HEIC file

**Expected Results:**
- File passes validation
- Preview shows image
- File type shown as "image/heic"

**Status:** ⏳ TO BE TESTED

---

### T1.8: File Type Validation - PDF
**Steps:**
1. Use click-to-browse
2. Select a PDF file

**Expected Results:**
- File passes validation
- Preview shows PDF placeholder (red background, "PDF" text)
- File info shows: Name, Size, Type (application/pdf)

**Status:** ⏳ TO BE TESTED

---

### T1.9: File Type Validation - Invalid File
**Steps:**
1. Use click-to-browse
2. Try to select a .TXT file
3. If blocked by picker, proceed to next test

**Expected Results:**
- If not blocked: file picker rejects it
- Or if file is selected, validation error shows:
  - Red alert box with warning icon
  - "Invalid file type. Allowed types: JPEG, PNG, HEIC, PDF"
  - "Try again" link visible

**Status:** ⏳ TO BE TESTED

---

### T1.10: File Size Validation - Large File
**Steps:**
1. Use click-to-browse
2. Select a file > 10MB

**Expected Results:**
- Validation error shows:
  - Red alert box
  - "File size exceeds 10MB limit. Your file is [actual size]MB"
  - "Try again" link
  - Actual file size displayed (e.g., 15.32MB)

**Status:** ⏳ TO BE TESTED

---

### T1.11: File Size Validation - Edge Case (10MB Exactly)
**Steps:**
1. Prepare a file exactly 10MB
2. Upload using click-to-browse

**Expected Results:**
- File should be accepted (>= 10MB not > 10MB)
- Wait, check: is the limit inclusive or exclusive?
- Code says: `if (file.size > maxSizeBytes)` - so 10MB exactly should PASS

**Status:** ⏳ TO BE TESTED

---

### T1.12: Upload Progress Indicator
**Steps:**
1. Upload any valid file
2. Watch progress bar carefully

**Expected Results:**
- Circular progress bar appears
- Percentage increases from 0% to 100%
- Progress stops at 90% before file loading completes
- "Uploading..." text visible during upload
- Timing: should take ~1 second total (0-90% fast, then 100% on completion)

**Status:** ⏳ TO BE TESTED

---

### T1.13: Preview Display - Image File
**Steps:**
1. Upload a JPEG image
2. Examine preview area

**Expected Results:**
- Image thumbnail shows in preview (max-height: 192px)
- Image is properly scaled
- Rounded corners
- File name shown: "Name: [filename.jpg]"
- File size shown in KB: "Size: [X] KB"
- File type shown: "Type: image/jpeg"
- Green checkmark icon with "File selected" text
- Two buttons: "Change File" (blue) and "Remove" (red)

**Status:** ⏳ TO BE TESTED

---

### T1.14: Preview Display - PDF File
**Steps:**
1. Upload a PDF file
2. Examine preview area

**Expected Results:**
- PDF placeholder shows (not thumbnail, but red box with "PDF" text)
- File info displayed correctly
- Same success indicators and buttons as image

**Status:** ⏳ TO BE TESTED

---

### T1.15: Change File Button
**Steps:**
1. Upload a file
2. Click "Change File" button
3. Select a different file

**Expected Results:**
- File picker opens again
- New file replaces previous preview
- Preview updates
- File info updates

**Status:** ⏳ TO BE TESTED

---

### T1.16: Remove Button
**Steps:**
1. Upload a file
2. Click "Remove" button

**Expected Results:**
- Preview disappears
- Upload area reappears
- Form resets to empty state
- File input cleared

**Status:** ⏳ TO BE TESTED

---

### T1.17: Mobile Responsiveness
**Steps:**
1. Use DevTools to set viewport to mobile (375px width)
2. Navigate to upload section
3. Drag-drop area with file

**Expected Results:**
- Upload area remains usable on small screen
- Buttons have adequate touch target size (>44x44px)
- Text is readable
- Preview scales appropriately
- Action buttons stack properly

**Status:** ⏳ TO BE TESTED

---

### T1.18: Browser Compatibility
**Steps:**
1. Test in Chrome
2. Test in Firefox
3. Test in Safari
4. Test in Safari on iOS

**Expected Results:**
- All functionality works in each browser
- Drag-drop supported (all modern browsers)
- File input works correctly
- FileReader API works
- Canvas API works (for progress circle)

**Status:** ⏳ TO BE TESTED

---

## Test Suite 2: ExpenseForm Component

Navigate to: `http://localhost:3000/expenses/add`

### T2.1: All 7 Form Fields Present
**Steps:**
1. Load Add Expense page
2. Look for all form fields

**Expected Results:**
1. Date field (date input)
2. Property field (select dropdown)
3. Provider/Vendor field (text input)
4. Amount field (number input with $ symbol)
5. Category field (select dropdown)
6. Comments field (textarea)
7. Receipt/Proof section (FileUpload component)

**Status:** ⏳ TO BE TESTED

---

### T2.2: Form Fields Rendering
**Steps:**
1. Inspect each field
2. Check labels

**Expected Results:**
- Each field has a clear label
- Required fields marked with red * (date, property, provider, amount, category)
- Optional fields marked with "(Optional)" (comments, receipt)
- Placeholders provided where appropriate
- Input types are correct (date, text, number, select, textarea)

**Status:** ⏳ TO BE TESTED

---

### T2.3: Date Picker
**Steps:**
1. Click date field
2. Calendar picker should appear (browser default)
3. Select a date from the past
4. Select today's date
5. Try to select a future date

**Expected Results:**
- Date input type="date" works in browser
- Can select any past date
- Can select today
- Selecting future date should show validation error on blur/submit

**Status:** ⏳ TO BE TESTED

---

### T2.4: Property Dropdown
**Steps:**
1. Assuming properties exist in localStorage:
2. Click property dropdown
3. Observe options

**Expected Results:**
- Dropdown opens
- "Select a property..." placeholder visible
- All properties from `properties` prop listed
- Can select a property
- Selected value stays selected

**Status:** ⏳ TO BE TESTED

---

### T2.5: Category Dropdown
**Steps:**
1. Click category dropdown
2. Observe options

**Expected Results:**
- Dropdown opens
- "Select a category..." placeholder visible
- 8 categories visible:
  1. Maintenance
  2. Repair
  3. Utilities
  4. Insurance
  5. Property Tax
  6. Mortgage
  7. Cleaning
  8. Other
- "Maintenance" is pre-selected by default
- Can change selection

**Status:** ⏳ TO BE TESTED

---

### T2.6: Form Validation - All Required Fields Empty
**Steps:**
1. Click "Add Expense" button without filling any fields

**Expected Results:**
- Form doesn't submit (preventDefault works)
- Error messages appear for all required fields:
  - Date: "Date is required"
  - Property: "Property is required"
  - Provider: "Provider name is required"
  - Amount: "Amount is required"
  - Category: "Category is required"

**Status:** ⏳ TO BE TESTED

---

### T2.7: Form Validation - Required Fields
**Steps:**
1. Fill only optional fields (comments, no receipt)
2. Try to submit

**Expected Results:**
- Validation fails
- Required field errors shown

**Status:** ⏳ TO BE TESTED

---

### T2.8: Form Validation - Provider Length
**Steps:**
1. Fill date, property, amount, category correctly
2. Enter "A" in provider field
3. Blur the field
4. Try to submit

**Expected Results:**
- On blur: Error shows "Provider name must be at least 2 characters"
- Form cannot submit

**Status:** ⏳ TO BE TESTED

---

### T2.9: Form Validation - Future Date
**Steps:**
1. Select a date 30 days in the future
2. Blur date field

**Expected Results:**
- Error shows: "Date cannot be in the future"
- Form cannot submit

**Status:** ⏳ TO BE TESTED

---

### T2.10: Form Validation - Invalid Amount
**Steps:**
1. Enter "abc" in amount field
2. Blur field

**Expected Results:**
- Field shows validation error
- Amount must be a positive number
- parseFloat("abc") returns NaN, triggers error

**Status:** ⏳ TO BE TESTED

---

### T2.11: Form Validation - Zero Amount
**Steps:**
1. Enter "0" in amount field
2. Blur field

**Expected Results:**
- Error shows: "Amount must be a positive number"
- 0 is not > 0

**Status:** ⏳ TO BE TESTED

---

### T2.12: Form Validation - Negative Amount
**Steps:**
1. Enter "-50" in amount field
2. Blur field

**Expected Results:**
- Error shows: "Amount must be a positive number"

**Status:** ⏳ TO BE TESTED

---

### T2.13: Form Validation - Excessive Amount
**Steps:**
1. Enter "1000000" in amount field
2. Blur field

**Expected Results:**
- Error shows: "Amount is too large"
- Max is 999999.99

**Status:** ⏳ TO BE TESTED

---

### T2.14: Error Message Clearing
**Steps:**
1. Trigger an error (e.g., enter "A" in provider)
2. Edit the field to fix the error
3. See if error clears

**Expected Results:**
- Error message disappears as soon as valid text entered
- No need to blur again
- User gets immediate feedback

**Status:** ⏳ TO BE TESTED

---

### T2.15: FileUpload Integration
**Steps:**
1. Upload a valid receipt file
2. Check form data

**Expected Results:**
- FileUpload component works within form
- File data is captured by form
- File info visible in form
- onFileSelect callback works
- File is included in submission data

**Status:** ⏳ TO BE TESTED

---

### T2.16: Form Submission - Valid Data
**Steps:**
1. Fill all required fields with valid data:
   - Date: Today or past date
   - Property: Select one
   - Provider: "ABC Plumbing"
   - Amount: "150.50"
   - Category: "Maintenance"
   - Comments: (optional, can be empty)
   - Receipt: (optional, can be empty)
2. Click "Add Expense" button

**Expected Results:**
- Button changes to "Adding..." with spinner
- Button becomes disabled
- 500ms wait (simulated API call)
- Button changes to green with checkmark "Success!"
- After 1 second: onSave callback fires
- User redirected to expenses list (based on AddExpense.jsx)

**Status:** ⏳ TO BE TESTED

---

### T2.17: Form Submission Data Format
**Steps:**
1. Submit form with data
2. Check browser console or network tab
3. Inspect submitted data structure

**Expected Results:**
- Data matches expected format:
```javascript
{
  date: "2026-02-18",
  propertyId: "prop-id",
  provider: "ABC Plumbing",
  amount: 150.50,
  categoryId: "maintenance",
  comments: "null or string",
  receipt: null or {
    name: "receipt.jpg",
    size: 12345,
    type: "image/jpeg",
    data: "data:image/jpeg;base64,..."
  }
}
```

**Status:** ⏳ TO BE TESTED

---

### T2.18: Error Messages Display
**Steps:**
1. Trigger validation error
2. Observe error message UI

**Expected Results:**
- Error text appears below field
- Red color (#dc2626)
- Alert icon shown
- Error message is clear and actionable

**Status:** ⏳ TO BE TESTED

---

### T2.19: Mobile Responsiveness
**Steps:**
1. Set viewport to 375px width
2. Fill form on mobile

**Expected Results:**
- Form fields stack vertically
- Dropdowns and inputs are touch-friendly
- Buttons are adequate size
- Form summary hidden (only shown on sm and up)
- Text readable
- No horizontal scrolling needed

**Status:** ⏳ TO BE TESTED

---

### T2.20: Tablet Responsiveness
**Steps:**
1. Set viewport to 768px width
2. Fill form

**Expected Results:**
- Date and Property in 2-column grid
- Amount and Category in 2-column grid
- Comments and Receipt full-width
- Form summary visible (helpful for review)
- Form looks balanced

**Status:** ⏳ TO BE TESTED

---

### T2.21: Browser Compatibility
**Steps:**
1. Test form in Chrome
2. Test form in Firefox
3. Test form in Safari
4. Test form in Safari iOS

**Expected Results:**
- All form inputs work
- Date picker works (browser-native)
- Dropdowns work
- Textarea works
- Validation works
- FileUpload component works
- No JS errors

**Status:** ⏳ TO BE TESTED

---

### T2.22: Characters Counter - Comments
**Steps:**
1. Click comments field
2. Type text
3. Observe character count

**Expected Results:**
- Character count updates as you type
- Format: "[X]/500 characters"
- Count is accurate
- Increases from 0 to 500

**Status:** ⏳ TO BE TESTED

---

### T2.23: Form Reset / Cancel
**Steps:**
1. Fill some form fields
2. Click "Cancel" button

**Expected Results:**
- onCancel callback fires
- User navigated back to previous page
- Form data not saved

**Status:** ⏳ TO BE TESTED

---

### T2.24: Backend Integration Readiness
**Steps:**
1. Inspect the submission data format
2. Compare with backend API specification

**Expected Results:**
- Data format matches API expectations
- All required fields present
- Data types correct
- Receipt structure compatible with backend
- Ready for API endpoint integration

**Status:** ⏳ TO BE TESTED

---

## Summary Checklist

### FileUpload Component
- [ ] Rendering & UI elements
- [ ] Drag-drop functionality
- [ ] Click-to-browse
- [ ] iPhone camera button
- [ ] File type validation (JPEG, PNG, HEIC, PDF)
- [ ] File type validation (rejection)
- [ ] File size validation (<10MB)
- [ ] File size validation (>10MB)
- [ ] Upload progress indicator
- [ ] Preview display (images)
- [ ] Preview display (PDF)
- [ ] Change file action
- [ ] Remove file action
- [ ] Mobile responsiveness
- [ ] Browser compatibility (Chrome, Firefox, Safari)
- [ ] Parent form integration

**Overall Status:** ⏳ TO BE TESTED

### ExpenseForm Component
- [ ] All 7 form fields render
- [ ] Field labels and indicators
- [ ] Date picker functionality
- [ ] Property dropdown
- [ ] Category dropdown
- [ ] Form validation (all required fields)
- [ ] Provider name validation
- [ ] Date validation (future prevention)
- [ ] Amount validation (positive number)
- [ ] Amount validation (max value)
- [ ] Error message display
- [ ] Error clearing on edit
- [ ] FileUpload component integration
- [ ] Form submission flow
- [ ] Success state display
- [ ] Form data format
- [ ] Characters counter
- [ ] Cancel action
- [ ] Mobile responsiveness
- [ ] Browser compatibility
- [ ] Backend integration readiness

**Overall Status:** ⏳ TO BE TESTED

---

## Notes for Tester
- All field validations use "touched" state - only show errors after user interacts with field
- Components use Tailwind CSS - check that all classes render correctly
- Progress indicator uses custom SVG circle - verify in all browsers
- FileUpload uses FileReader API - ensure browser supports
- Camera input only shows on iOS - test with appropriate user agent
- Form redirects after success (AddExpense.jsx) - may need to mock navigation for testing
