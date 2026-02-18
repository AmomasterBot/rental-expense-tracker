# Issue #18: FileUpload Component Validation (US-2 Frontend)

## Status: IN PROGRESS

### Test Checklist

#### 1. Basic Rendering & UI Elements
- [x] Component renders without errors
- [ ] Drag-drop area displays with dashed border
- [ ] Upload icon visible
- [ ] "Drag and drop" text visible
- [ ] "Click to browse" link visible
- [ ] File type hints visible (JPEG, PNG, HEIC, PDF)
- [ ] Max size hint visible (10MB)
- [ ] Mobile camera button visible on iPhone

#### 2. Drag-Drop Functionality
- [ ] Drag over file activates hover state (border changes to blue)
- [ ] Background highlights on drag
- [ ] Drop file triggers file handling
- [ ] Drop resets hover state
- [ ] Accepts valid file types
- [ ] Rejects invalid file types with error message

#### 3. Click-to-Browse Functionality
- [ ] "Click to browse" link opens file picker
- [ ] File picker accepts JPEG files
- [ ] File picker accepts PNG files
- [ ] File picker accepts HEIC files
- [ ] File picker accepts PDF files
- [ ] Selected file is processed

#### 4. iPhone Camera Button
- [ ] Camera button appears on iPhone/iPad/iPod user agents
- [ ] Camera button does NOT appear on other devices
- [ ] Button has correct styling (green, with camera icon)
- [ ] Button opens camera with environment capture
- [ ] Photo from camera can be selected and processed

#### 5. File Type Validation
- [ ] Rejects .txt files with error message
- [ ] Rejects .doc files with error message
- [ ] Accepts .jpg/.jpeg files
- [ ] Accepts .png files
- [ ] Accepts .heic/.heif files
- [ ] Accepts .pdf files
- [ ] Error message displays correct file types

#### 6. File Size Validation
- [ ] Rejects files > 10MB with error message
- [ ] Shows actual file size in error
- [ ] Accepts files <= 10MB
- [ ] Error message clearly states 10MB limit
- [ ] Accepts exactly 10MB file

#### 7. Upload Progress Indicator
- [ ] Progress bar appears during upload simulation
- [ ] Progress percentage shown (0-100%)
- [ ] Progress increments smoothly
- [ ] "Uploading..." text visible
- [ ] Progress completes to 100%
- [ ] Progress disappears after upload finishes

#### 8. Preview Display
- [ ] Image preview shows for image files
- [ ] Image preview dimensions appropriate (max-h-48)
- [ ] PDF shows PDF placeholder (red background, "PDF" text)
- [ ] File name displayed
- [ ] File size displayed in KB
- [ ] File type displayed
- [ ] Success checkmark icon visible
- [ ] "File selected" text visible

#### 9. Action Buttons
- [ ] "Change File" button visible in preview
- [ ] "Remove" button visible in preview
- [ ] "Change File" opens file picker again
- [ ] "Remove" clears preview and resets form
- [ ] "Remove" clears input values

#### 10. Error Handling
- [ ] Error alert displays with warning icon
- [ ] Error text clearly explains issue
- [ ] "Try again" link visible in error state
- [ ] "Try again" opens file picker
- [ ] Error clears when new valid file selected

#### 11. Mobile Responsiveness
- [ ] Layout adapts on mobile screens
- [ ] Touch targets are adequate (>44x44px)
- [ ] File preview scales properly on mobile
- [ ] Buttons stack or resize appropriately
- [ ] Text remains readable at small sizes

#### 12. Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Safari on iOS
- [ ] File input works correctly in each browser

#### 13. Data Format & Parent Integration
- [ ] onFileSelect callback fires with correct data
- [ ] Callback includes: file, preview, name, size, type
- [ ] Preview is base64 DataURL
- [ ] Parent form can receive file data
- [ ] FileUpload integrates with ExpenseForm

### Code Review Findings

#### Strengths
✅ Props allow customization (allowedTypes, maxSizeMB)
✅ iPhone detection works correctly
✅ File validation comprehensive
✅ Error messages helpful and specific
✅ Progress indicator implementation (using canvas-like SVG)
✅ FileReader API properly used
✅ Proper state management with useState/useRef
✅ Good accessibility with aria-labels

#### Issues Found
🔴 **CRITICAL**: Missing CSS classes imported/defined
  - `.input-field` - defined in index.css
  - `.label` - defined in index.css
  - Custom button classes may be missing styling

🟡 **ISSUE**: FileReader success doesn't show clear feedback
  - Progress reaches 100% then disappears, but preview shows immediately
  - Timing could be confusing to users

🟡 **ISSUE**: Camera input accepts any image format
  - Camera capture has `accept="image/*"` instead of specific types
  - Should be more restrictive to match allowed types

### Testing Plan

1. Start with component rendering checks
2. Test drag-drop with valid files
3. Test drag-drop with invalid files
4. Test click-to-browse with various file types
5. Test file size validation with edge cases
6. Test progress indicator behavior
7. Test preview accuracy
8. Test action buttons
9. Test error recovery
10. Test mobile responsiveness
11. Test browser compatibility
12. Test parent form integration

### Test Results

Will be updated as testing progresses...
