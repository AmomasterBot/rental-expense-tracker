# Developer Notes - US-2 & US-3

Quick reference for developers working with these components.

---

## Files Created/Modified

### New Components
```
✅ src/components/FileUpload.jsx (NEW)
   - 400 lines
   - Reusable file upload component
   - Drag-drop + click-browse
   - Mobile camera support
   - File validation
   - Progress indicator

✅ src/components/ExpenseForm.jsx (UPDATED from 200 → 550 lines)
   - Form validation
   - Error handling
   - FileUpload integration
   - Mobile responsive
   - Backend-ready
```

### Documentation
```
✅ src/components/COMPONENTS.md
   - Component specs
   - API documentation
   - Usage examples
   - Testing checklist
   - ~450 lines

✅ FEATURE_VERIFICATION.md
   - Acceptance criteria
   - Quality metrics
   - Testing evidence
   - ~450 lines

✅ INTEGRATION_GUIDE.md
   - Backend integration steps
   - API contracts
   - Error handling
   - Examples
   - ~650 lines

✅ DELIVERY_SUMMARY.md
   - What was delivered
   - Technical specs
   - File sizes
   - Next steps
   - ~400 lines

✅ DEVELOPER_NOTES.md
   - This file
   - Quick reference
   - Common tasks
   - Troubleshooting
```

---

## Quick Commands

### Development
```bash
cd frontend

# Start dev server
npm run dev
# → http://localhost:5173/expenses/new

# Build production
npm run build

# Check linting
npm run lint
```

### File Locations
```bash
# Components
cd src/components/
ls -la FileUpload.jsx
ls -la ExpenseForm.jsx

# Docs
cd /
ls -la *.md
```

---

## Component Props Reference

### FileUpload
```javascript
<FileUpload
  onFileSelect={(fileInfo) => {}}    // File selected callback
  onError={() => {}}                  // Error callback
  allowedTypes={[                     // File types (optional)
    'image/jpeg',
    'image/png',
    'image/heic',
    'application/pdf'
  ]}
  maxSizeMB={10}                      // Max size in MB (optional)
/>
```

### ExpenseForm
```javascript
<ExpenseForm
  properties={[                       // Property objects
    { id: '1', name: 'Main House' }
  ]}
  onSave={(formData) => {}}          // Form submitted
  onCancel={() => {}}                 // Cancel clicked
/>
```

---

## Common Tasks

### Add a new category
1. Open `ExpenseForm.jsx`
2. Find the `mockCategories` array in `useEffect`
3. Add new object: `{ id: 'category-id', name: 'Category Name' }`
4. Test in form

### Change max file size
1. Open `FileUpload.jsx`
2. Find props: `maxSizeMB = 10`
3. Change default or pass via props
4. Update validation logic

### Customize error messages
1. Open relevant component
2. Find error setting: `setError('message')`
3. Modify message text
4. Test error state

### Style modifications
1. All styling uses Tailwind CSS
2. Check `index.css` for base classes
3. Modify classes directly in JSX
4. Run build to verify

---

## State Management

### FileUpload State
```javascript
selectedFile          // File object
preview              // Base64 preview
uploadProgress       // 0-100 number
isUploading          // Boolean
error                // Error message or null
isDragging           // Boolean
```

### ExpenseForm State
```javascript
formData             // Form values object
errors               // Field errors object
touched              // Which fields user edited
isSubmitting         // During submit
submitSuccess        // Success animation
categories           // Category list
```

---

## Error Codes & Messages

### FileUpload Errors
```
"Invalid file type. Allowed types: JPEG, PNG, HEIC, PDF"
"File size exceeds 10MB limit. Your file is X.XXmb"
"Error reading file. Please try again."
```

### Form Validation Errors
```
"Date is required"
"Date cannot be in the future"
"Property is required"
"Provider name is required"
"Provider name must be at least 2 characters"
"Amount is required"
"Amount must be a positive number"
"Amount is too large"
"Category is required"
```

---

## Browser DevTools Tips

### React DevTools
```
FileUpload props:
- onFileSelect: ƒ(fileInfo)
- onError: ƒ()
- allowedTypes: Array(4)
- maxSizeMB: 10

ExpenseForm state:
- formData: { date, propertyId, provider, ... }
- errors: { ... }
- touched: { ... }
```

### Network Tab
Expected endpoints (once API ready):
```
GET /api/properties
GET /api/categories
POST /api/expenses
```

### Console
```
// FileUpload logs
console.log('File selected:', fileInfo)

// Form logs
console.log('Form submitted:', submissionData)
console.log('Validation errors:', errors)
```

---

## Testing Scenarios

### Quick Test: File Upload
1. Open Dev Tools → Elements
2. Find upload area
3. Drag image file onto it
4. Verify preview shows
5. Click Remove button
6. Verify reset

### Quick Test: Form Validation
1. Leave date empty → blur
2. Verify error shows
3. Type in date field
4. Verify error clears
5. Leave amount empty → blur
6. Verify error shows

### Quick Test: Mobile
1. Open DevTools
2. Toggle device toolbar (mobile)
3. Reload page
4. Verify responsive layout
5. On iPhone: verify camera button

---

## Performance Tips

1. **Large files:** Compress images before uploading
2. **Many properties:** Implement search/filter
3. **Slow API:** Add loading skeleton
4. **Memory:** Close form to release preview data

---

## Debugging Checklist

### Component won't render
- [ ] Check console for errors
- [ ] Verify props passed correctly
- [ ] Check CSS classes exist
- [ ] Verify imports work

### Validation not working
- [ ] Check `validateForm()` function
- [ ] Check `touched` state tracking
- [ ] Check error state update
- [ ] Verify blur handlers attached

### File not uploading
- [ ] Check file type is allowed
- [ ] Check file size < 10MB
- [ ] Check `onFileSelect` callback
- [ ] Check browser console errors

### Mobile issues
- [ ] Check device type detection
- [ ] Test camera input separately
- [ ] Verify file input capture attribute
- [ ] Check touch event handlers

---

## Git Workflow

### Commit Messages
```
✨ feat: Add FileUpload component (US-2)
✨ feat: Add ExpenseForm validation (US-3)
📝 docs: Add integration guide
🐛 fix: File upload error handling
```

### Branch Names
```
feature/us-2-file-upload
feature/us-3-expense-form
docs/integration-guide
```

---

## Useful Links

- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- React Icons: https://react-icons.github.io/react-icons
- HTML File Input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
- Drag & Drop API: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

---

## FAQ

**Q: Can I remove the camera button on iPhone?**  
A: Remove the iPhone section in FileUpload's JSX, or set a prop to disable it.

**Q: Can I increase file size limit?**  
A: Pass `maxSizeMB={20}` prop to FileUpload component.

**Q: How do I add more categories?**  
A: Add to `mockCategories` in ExpenseForm, or integrate with API.

**Q: Can I preview PDFs?**  
A: Currently shows icon only. Could add PDF.js library.

**Q: How do I customize styling?**  
A: All Tailwind classes can be modified directly in JSX.

**Q: Is form data encrypted?**  
A: No. Validate & encrypt on backend before storing.

**Q: Can I auto-save form?**  
A: Yes, can add localStorage auto-save in an effect hook.

**Q: How large can files be?**  
A: Limited by base64 encoding to ~5MB practical limit. Switch to multipart for larger.

---

## Architecture Decisions

### Why Tailwind CSS?
- Already in project
- Responsive out of box
- No additional styling needed
- Easy to customize

### Why Base64 for files?
- Simple to implement
- Works with JSON APIs
- No multipart complexity
- Good for receipts (<10MB)

### Why touch tracking?
- Better UX (only show errors after interaction)
- More professional feel
- Reduces error noise
- Industry standard

### Why separate FileUpload?
- Reusable in other forms
- Single responsibility
- Easy to test
- Easier to maintain

---

## Future Enhancements

1. **File compression** - Compress images before upload
2. **Drag reorder** - Allow reordering multiple files
3. **Bulk upload** - Handle multiple files
4. **PDF preview** - Show actual PDF content
5. **Auto-save** - Save progress to localStorage
6. **Undo/redo** - Track form changes
7. **Templates** - Save & reuse form templates
8. **OCR** - Extract text from receipts
9. **Analytics** - Track form completion rates
10. **A/B testing** - Test different UX flows

---

## Support & Escalation

### Issues
1. Check code comments
2. Check COMPONENTS.md
3. Check FEATURE_VERIFICATION.md
4. Check INTEGRATION_GUIDE.md
5. Check inline console.logs
6. Ask in team chat

### Backend Dependencies
- Properties endpoint needed by: FormData
- Categories endpoint needed by: FormData  
- Expenses endpoint needed by: Form submit
- Ask ALun about ETA

---

## Last Updated
2026-02-18 by Aubrey

---

**Status:** ✅ Complete and ready to use
