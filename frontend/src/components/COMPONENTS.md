# Frontend Components - US-2 & US-3

## Overview

This document describes the two new frontend components built for the Rental Expense Tracker:
- **FileUpload Component** (US-2) - Receipt upload with drag-drop, validation, and preview
- **ExpenseForm Component** (US-3) - Complete expense creation form with validation

---

## US-2: FileUpload Component

**File:** `FileUpload.jsx`

### Purpose
Reusable file upload component with drag-drop support, file validation, preview, and mobile camera integration.

### Features
✅ Drag-and-drop file area
✅ Click-to-browse file selection
✅ File type validation (JPEG, PNG, HEIC, PDF)
✅ File size validation (configurable, default 10MB)
✅ Upload progress indicator (circular progress bar)
✅ Image preview with thumbnail
✅ PDF file indicator
✅ iPhone camera button for direct photo capture
✅ Error messages with retry option
✅ Change/Remove buttons
✅ Mobile-friendly responsive design

### Props

```javascript
<FileUpload
  onFileSelect={(fileInfo) => {}}    // Called when file is selected
  onError={() => {}}                  // Called when validation fails
  allowedTypes={[                     // Optional, defaults shown
    'image/jpeg',
    'image/png',
    'image/heic',
    'application/pdf'
  ]}
  maxSizeMB={10}                      // Optional, default 10MB
/>
```

### Callback Data Structure

When a file is successfully selected, `onFileSelect` receives:

```javascript
{
  file: File,                    // Native File object
  preview: string,               // Base64 data URL
  name: string,                  // Filename
  size: number,                  // Bytes
  type: string,                  // MIME type
}
```

### Usage Example

```javascript
import FileUpload from './FileUpload';

function MyComponent() {
  const [fileData, setFileData] = useState(null);

  const handleFileSelect = (file) => {
    console.log('File selected:', file.name, file.size, file.type);
    setFileData(file);
  };

  const handleFileError = () => {
    console.log('File validation failed');
  };

  return (
    <div>
      <FileUpload
        onFileSelect={handleFileSelect}
        onError={handleFileError}
        maxSizeMB={10}
      />
      {fileData && <p>Selected: {fileData.name}</p>}
    </div>
  );
}
```

### Mobile Support
- **iPhone/iPad:** Detects device and shows "Take Photo with Camera" button
- **Camera button:** Opens native camera app with `capture="environment"`
- **File input fallback:** Also supports traditional file selection
- Both methods work seamlessly with the same handler

### Error Handling
- **Invalid file type:** Shows list of allowed types
- **File too large:** Shows actual file size vs. limit
- **Read error:** Shows error message with retry option
- **No console errors:** All errors handled gracefully

---

## US-3: ExpenseForm Component

**File:** `ExpenseForm.jsx`

### Purpose
Complete form for creating rental expenses with validation, file upload, and backend integration readiness.

### Features

✅ Date picker (required, validates future dates)
✅ Property dropdown (linked to properties array)
✅ Provider/Vendor text field (required, min 2 chars)
✅ Amount input (required, numeric, positive, validated)
✅ Category dropdown (from mock data/backend)
✅ Comments textarea (optional, character limit visual)
✅ File upload using FileUpload component (optional)
✅ Form validation with field-level errors
✅ Touch tracking for UX (only show errors after blur)
✅ Submit button with loading state
✅ Success feedback animation
✅ Error alerts with retry option
✅ Mobile-responsive design
✅ Form summary display (desktop)
✅ Disabled state during submission

### Props

```javascript
<ExpenseForm
  properties={[                  // Array of property objects
    { id: 'p1', name: 'Main Property' },
    { id: 'p2', name: 'Rental Unit 2' }
  ]}
  onSave={(data) => {}}         // Called on successful submission
  onCancel={() => {}}           // Called when cancel is clicked
/>
```

### Form Data Structure (submitted to backend)

```javascript
{
  date: "2026-02-18",
  propertyId: "p1",
  provider: "ABC Plumbing",
  amount: 150.50,
  categoryId: "maintenance",
  comments: "Fixed leaking faucet",
  receipt: {
    name: "receipt.jpg",
    size: 245000,
    type: "image/jpeg",
    data: "data:image/jpeg;base64,..."  // Base64 encoded
  }
}
```

### Validation Rules

| Field | Rules | Error Message |
|-------|-------|---------------|
| **Date** | Required, not future | "Date is required" / "Date cannot be in the future" |
| **Property** | Required | "Property is required" |
| **Provider** | Required, ≥2 chars | "Provider name is required" / "Provider name must be at least 2 characters" |
| **Amount** | Required, >0, ≤999999.99 | "Amount is required" / "Amount must be a positive number" / "Amount is too large" |
| **Category** | Required | "Category is required" |
| **Comments** | Optional | None |
| **Receipt** | Optional | File validation handled by FileUpload component |

### Validation Behavior
- **Real-time:** Validates on blur (after field is touched)
- **Touch tracking:** Only shows errors after user interacts with field
- **Clear on edit:** Clears field error when user starts typing
- **Form-level:** Final validation before submission
- **No crashes:** All invalid inputs handled gracefully

### Usage Example

```javascript
import ExpenseForm from './ExpenseForm';

function AddExpense() {
  const properties = [
    { id: '1', name: 'Main House' },
    { id: '2', name: 'Investment Property' }
  ];

  const handleSave = (formData) => {
    console.log('Saving expense:', formData);
    // API call would go here
    // POST /api/expenses with formData
  };

  const handleCancel = () => {
    // Navigate back or close form
  };

  return (
    <ExpenseForm
      properties={properties}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
```

### Backend Integration

The form is ready for backend integration. To connect to real APIs:

1. **Properties:** Replace mock data with `GET /api/properties`
2. **Categories:** Replace mock categories with `GET /api/categories`
3. **Submit:** Replace mock `onSave` with `POST /api/expenses`

Example integration:

```javascript
// In parent component
useEffect(() => {
  // Fetch properties
  fetch('/api/properties')
    .then(r => r.json())
    .then(data => setProperties(data));
}, []);

// In form submit
const handleSave = (formData) => {
  fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
    .then(r => r.json())
    .then(data => navigate('/expenses'));
};
```

### Mobile Responsiveness
- **Desktop:** 2-column grid for date/property and amount/category
- **Mobile:** 1-column grid, full-width inputs
- **Camera:** iPhone shows camera button for receipt capture
- **Textarea:** Responsive height, character counter
- **Buttons:** Full-width on mobile, side-by-side on desktop

### State Management

The form manages its own state with:
- `formData` - current field values
- `errors` - field validation errors
- `touched` - track which fields user has interacted with
- `isSubmitting` - disable inputs during submission
- `submitSuccess` - show success animation
- `categories` - loaded from mock data

---

## Integration Checklist

### For AddExpense.jsx:
- [x] Import updated ExpenseForm
- [x] Pass properties array correctly (with id field)
- [x] Handle onSave callback
- [x] Handle onCancel navigation

### For Mock Data:
- [x] FileUpload accepts all required file types
- [x] ExpenseForm validates all fields
- [x] Error messages are user-friendly
- [x] No console errors on any interaction

### For Backend (ALun):
- [ ] `GET /api/properties` - returns `[{ id, name, ... }]`
- [ ] `GET /api/categories` - returns `[{ id, name }]`
- [ ] `POST /api/expenses` - accepts form data structure above
- [ ] File upload: accept base64 in `receipt.data` or handle multipart

---

## Testing Checklist

### FileUpload Component
- [x] Component renders without errors
- [x] Drag-drop area works
- [x] Click to browse works
- [x] File validation works (type & size)
- [x] Preview displays correctly for images
- [x] Preview displays correctly for PDFs
- [x] Remove button resets component
- [x] Change button allows new selection
- [x] Error messages show for invalid files
- [x] iPhone camera button appears on mobile
- [x] No console errors

### ExpenseForm Component
- [x] Component renders cleanly
- [x] All required fields visible
- [x] Date picker works and validates
- [x] Property dropdown populates
- [x] Provider field validates
- [x] Amount field validates numeric input
- [x] Category dropdown works
- [x] Comments textarea works
- [x] FileUpload component integrates
- [x] Validation shows errors on blur
- [x] Validation clears on edit
- [x] Submit button has loading state
- [x] Success feedback shows
- [x] Cancel button works
- [x] Responsive design works
- [x] No console errors
- [x] Mobile layout looks good

### Integration
- [x] Build completes without errors
- [x] No TypeScript/ESLint errors
- [x] Form data structure matches backend expectations

---

## Known Limitations & Future Improvements

1. **File Upload Size:** Currently uses base64 encoding (doubles size). For large files, consider multipart form data.
2. **Categories:** Mock data included. Will be replaced with API call once backend ready.
3. **File Preview:** PDFs show icon, not actual preview. Could add PDF.js integration.
4. **Auto-save:** Form doesn't auto-save progress. Could add with localStorage.
5. **Date Picker:** Uses native HTML date input. Could use calendar library for better UX.

---

## Component Tree

```
AddExpense (page)
├── ExpenseForm (component)
│   ├── FileUpload (component)
│   │   └── File input (native)
│   ├── Date input (native)
│   ├── Select dropdowns (native)
│   ├── Textarea (native)
│   └── Submit/Cancel buttons
```

---

Generated: 2026-02-18
Status: Complete and tested ✅
