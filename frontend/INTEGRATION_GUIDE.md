# Integration Guide - FileUpload & ExpenseForm

This guide shows how to integrate the FileUpload and ExpenseForm components with your backend.

---

## Quick Start

### 1. Basic Setup (No Backend)

```javascript
// pages/AddExpense.jsx
import { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';

export default function AddExpense() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // For now, use mock properties from localStorage
    const storedProps = JSON.parse(localStorage.getItem('properties')) || [];
    setProperties(storedProps);
  }, []);

  const handleSave = (formData) => {
    console.log('Form data:', formData);
    // Save to localStorage or API
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push({
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));
  };

  return (
    <ExpenseForm
      properties={properties}
      onSave={handleSave}
      onCancel={() => window.history.back()}
    />
  );
}
```

---

## Integration with Real Backend

### Step 1: Fetch Properties from API

```javascript
// pages/AddExpense.jsx
useEffect(() => {
  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      // Data structure: [{ id: '1', name: 'Main House', ... }, ...]
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
      // Show error to user
    }
  };
  
  fetchProperties();
}, []);
```

### Step 2: Submit Expense to API

```javascript
// pages/AddExpense.jsx
const handleSave = async (formData) => {
  try {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Expense created:', result);
    
    // Navigate to expenses page
    navigate('/expenses');
  } catch (error) {
    console.error('Failed to save expense:', error);
    // Show error message to user
  }
};
```

---

## Form Data Structure

The ExpenseForm sends this data to `onSave()`:

```javascript
{
  date: "2026-02-18",              // Date string (YYYY-MM-DD)
  propertyId: "prop-123",           // Property ID from dropdown
  provider: "ABC Plumbing",         // Vendor name
  amount: 150.50,                   // Numeric amount
  categoryId: "maintenance",        // Category ID
  comments: "Fixed faucet leak",    // Optional notes
  receipt: {                        // Optional file
    name: "receipt.jpg",
    size: 245000,
    type: "image/jpeg",
    data: "data:image/jpeg;base64,/9j/4AAQSkZ..." // Base64 encoded
  }
}
```

### Backend expectations:
- `propertyId` should match an existing property
- `categoryId` should match an existing category
- `amount` should be stored as DECIMAL(10,2)
- `receipt.data` is base64 encoded (can decode and save as file)

---

## File Upload Handling

### Option A: Base64 in JSON (Current)

**Pros:**
- ✅ Simple - works anywhere
- ✅ No additional middleware needed
- ✅ Works with standard JSON API

**Cons:**
- ❌ Larger payload (~33% increase)
- ❌ Not suitable for >5MB files

**Backend handling:**
```javascript
// Example: Node.js / Express
app.post('/api/expenses', (req, res) => {
  const { receipt } = req.body;
  
  if (receipt?.data) {
    // Decode base64
    const buffer = Buffer.from(
      receipt.data.split(',')[1], 
      'base64'
    );
    
    // Save to disk or cloud storage
    fs.writeFileSync(`receipts/${receipt.name}`, buffer);
  }
  
  // ... save expense record
});
```

### Option B: Multipart Form Data (Alternative)

To use multipart instead of base64:

**Frontend:**
```javascript
// In ExpenseForm, modify form submission:
const formDataToSend = new FormData();
formDataToSend.append('date', formData.date);
formDataToSend.append('propertyId', formData.propertyId);
formDataToSend.append('provider', formData.provider);
// ... other fields

if (formData.fileData?.file) {
  formDataToSend.append('receipt', formData.fileData.file);
}

const response = await fetch('/api/expenses', {
  method: 'POST',
  // Don't set Content-Type header! Browser will set it correctly
  body: formDataToSend,
});
```

**Backend:**
```javascript
const multer = require('multer');
const upload = multer({ dest: 'receipts/' });

app.post('/api/expenses', upload.single('receipt'), (req, res) => {
  const { file, body } = req;
  // file contains original filename, mimetype, path, size
  // body contains form fields
});
```

---

## Error Handling

### Form Validation Errors

The form validates locally and shows errors before submission:

```javascript
// User sees these errors in the form UI:
- "Date is required"
- "Date cannot be in the future"
- "Property is required"
- "Provider name is required"
- "Provider name must be at least 2 characters"
- "Amount is required"
- "Amount must be a positive number"
- "Amount is too large"
- "Category is required"
// Plus FileUpload errors:
- "Invalid file type. Allowed types: JPEG, PNG, HEIC, PDF"
- "File size exceeds 10MB limit. Your file is 15.32MB"
```

### API Errors

Handle in parent component:

```javascript
const handleSave = async (formData) => {
  try {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      // Parse error response
      const error = await response.json();
      throw new Error(error.message || 'Failed to save expense');
    }

    navigate('/expenses');
  } catch (error) {
    console.error('Error:', error);
    // Show error toast/alert to user
    alert(`Error: ${error.message}`);
  }
};
```

---

## Properties API Contract

### GET /api/properties

**Expected response:**
```json
[
  {
    "id": "prop-123",
    "name": "Main House",
    "address": "123 Main St",
    "rooms": 3,
    "createdAt": "2026-01-15T10:30:00Z"
  },
  {
    "id": "prop-456",
    "name": "Investment Property",
    "address": "456 Oak Ave",
    "rooms": 2,
    "createdAt": "2026-02-01T14:20:00Z"
  }
]
```

**Minimum required fields:**
- `id` (string) - Unique identifier
- `name` (string) - Property name/address

**Form uses:**
- `id` → for `propertyId` in form submission
- `name` → for display in dropdown

---

## Categories API Contract

### GET /api/categories

Currently using mock categories, but ready for API:

```javascript
// Current mock data in ExpenseForm:
const mockCategories = [
  { id: 'maintenance', name: 'Maintenance' },
  { id: 'repair', name: 'Repair' },
  { id: 'utilities', name: 'Utilities' },
  { id: 'insurance', name: 'Insurance' },
  { id: 'property-tax', name: 'Property Tax' },
  { id: 'mortgage', name: 'Mortgage' },
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'other', name: 'Other' },
];

// Expected API response format:
[
  { "id": "maintenance", "name": "Maintenance" },
  { "id": "repair", "name": "Repair" },
  // ... etc
]

// To integrate, replace mock with:
useEffect(() => {
  fetch('/api/categories')
    .then(r => r.json())
    .then(data => setCategories(data))
    .catch(err => console.error('Failed to load categories', err));
}, []);
```

---

## Expenses API Contract

### POST /api/expenses

**Request body:**
```json
{
  "date": "2026-02-18",
  "propertyId": "prop-123",
  "provider": "ABC Plumbing",
  "amount": 150.50,
  "categoryId": "repair",
  "comments": "Fixed leaking faucet",
  "receipt": {
    "name": "receipt.jpg",
    "size": 245000,
    "type": "image/jpeg",
    "data": "data:image/jpeg;base64,/9j/4AAQSkZ..."
  }
}
```

**Expected response (201 Created):**
```json
{
  "id": "exp-789",
  "date": "2026-02-18",
  "propertyId": "prop-123",
  "provider": "ABC Plumbing",
  "amount": 150.50,
  "categoryId": "repair",
  "comments": "Fixed leaking faucet",
  "receiptId": "receipt-123",
  "createdAt": "2026-02-18T14:30:00Z",
  "updatedAt": "2026-02-18T14:30:00Z"
}
```

**Error responses:**
```json
// 400 Bad Request
{
  "error": "Invalid amount: must be positive",
  "code": "VALIDATION_ERROR"
}

// 404 Not Found
{
  "error": "Property not found",
  "code": "NOT_FOUND"
}

// 409 Conflict
{
  "error": "Duplicate expense entry",
  "code": "CONFLICT"
}
```

---

## Complete Example: Full Integration

```javascript
// pages/AddExpense.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';

export default function AddExpense() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/properties');
        if (!response.ok) throw new Error('Failed to load properties');
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Save expense
  const handleSaveExpense = async (formData) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save expense');
      }

      // Success - redirect
      navigate('/expenses', { 
        state: { message: 'Expense added successfully!' } 
      });
    } catch (err) {
      console.error('Save error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/expenses');
  };

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="add-expense-container">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Add New Expense</h2>
        <p className="text-gray-600">Record a rental property expense</p>
      </div>

      <div className="max-w-2xl">
        <div className="card">
          {properties.length > 0 ? (
            <ExpenseForm
              properties={properties}
              onSave={handleSaveExpense}
              onCancel={handleCancel}
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 mb-4">
                Add a property first before creating expenses.
              </p>
              <button
                onClick={() => navigate('/properties')}
                className="btn-primary"
              >
                Go to Properties
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Testing the Integration

### Manual Testing Checklist

- [ ] Properties load from API
- [ ] Form shows loaded properties in dropdown
- [ ] Can select a property
- [ ] Date validation works
- [ ] Provider validation works
- [ ] Amount validation works
- [ ] Category loads and selects correctly
- [ ] Comments are optional
- [ ] File upload works and shows preview
- [ ] Submit button sends data to API
- [ ] Success redirects to expenses page
- [ ] Error message shows on API error
- [ ] Form validates before submitting

### API Testing (cURL)

```bash
# Test properties endpoint
curl http://localhost:3000/api/properties

# Test expense creation
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-02-18",
    "propertyId": "prop-123",
    "provider": "Test Vendor",
    "amount": 99.99,
    "categoryId": "maintenance",
    "comments": "Test expense"
  }'
```

---

## Troubleshooting

### Form doesn't show properties
- Check: Properties array is populated
- Check: Properties have `id` and `name` fields
- Check: API endpoint returns correct format

### File upload shows error
- Check: File size is <10MB
- Check: File type is JPEG, PNG, HEIC, or PDF
- Check: File input is not disabled

### Submit button doesn't work
- Check: All required fields are filled
- Check: Amount is positive number
- Check: Date is not in future
- Check: API endpoint is responding

### CORS errors
- Add to backend:
  ```javascript
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  ```

---

## Performance Tips

1. **Debounce API calls:** Use `useCallback` + `useRef` to avoid duplicate requests
2. **Cache properties:** Store in state/context, don't refetch every time
3. **Lazy load categories:** Load on demand, not on page load
4. **Image compression:** Compress large images before uploading
5. **Pagination:** If many properties, use pagination/search

---

## Security Considerations

1. **Validate on backend:** Never trust client-side validation alone
2. **Rate limiting:** Limit expense creation per user
3. **File scanning:** Scan uploaded files for malware
4. **Size limits:** Enforce max file sizes on backend
5. **Authorization:** Only allow users to add expenses for their own properties
6. **SQL injection:** Use prepared statements for all queries
7. **CSRF tokens:** Add CSRF protection if using cookies

---

## Next Steps

1. **Complete backend endpoints** (ALun's work)
2. **Swap mock data for API calls** (Aubrey)
3. **Add error boundaries** (Optional)
4. **Add loading states** (Optional)
5. **Add success notifications** (Optional)
6. **E2E testing** (Testing phase)
7. **Production deployment** (Release)

---

**Last Updated:** 2026-02-18  
**Status:** Ready for backend integration ✅
