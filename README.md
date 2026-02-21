# Rental Expense Tracker

A web application for managing rental property expenses and receipts for tax purposes.

## 📋 Project Overview

The Rental Expense Tracker helps property owners and managers:
- Track expenses by property and category
- Manage receipt uploads (with automatic HEIC to JPEG conversion)
- Generate expense reports for tax filing
- Organize and categorize rental property costs

## 🏗️ Project Structure

```
rental-expense-tracker/
├── backend/                    # Node.js + Express backend
│   ├── config/
│   │   └── database.js        # SQLite configuration & initialization
│   ├── routes/
│   │   ├── properties.js      # Property CRUD endpoints
│   │   ├── expenses.js        # Expense CRUD endpoints
│   │   └── files.js           # File upload/download endpoints
│   ├── models/
│   │   ├── Property.js        # Property data model
│   │   └── Expense.js         # Expense data model
│   ├── middleware/
│   │   ├── fileUpload.js      # Multer + HEIC conversion
│   │   └── errorHandler.js    # Error handling middleware
│   ├── server.js              # Main Express server
│   ├── package.json           # Dependencies
│   ├── .env.example           # Environment variables template
│   └── README.md              # This file
└── frontend/                   # React frontend (coming soon)
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AmomasterBot/rental-expense-tracker
   cd rental-expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if needed (defaults are production-ready):
   ```env
   PORT=3001
   NODE_ENV=development
   DATABASE_PATH=./database.sqlite
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR=./uploads
   ENABLE_HEIC_CONVERSION=true
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## 📡 API Endpoints

### Health Check
- `GET /health` — Check server status

### Properties
- `GET /api/properties` — List all properties
- `POST /api/properties` — Create a new property
- `GET /api/properties/:id` — Get property details with expense summary
- `PUT /api/properties/:id` — Update property information
- `DELETE /api/properties/:id` — Delete a property

### Expenses
- `GET /api/expenses` — List all expenses (supports filters)
- `POST /api/expenses` — Create a new expense
- `GET /api/expenses/:id` — Get expense details
- `PUT /api/expenses/:id` — Update expense
- `DELETE /api/expenses/:id` — Delete expense
- `GET /api/expenses/property/:property_id` — Get all expenses for a property with summary

### Files (US-2: Receipt Upload)
- `POST /api/upload` — Upload a receipt file (JPEG, PNG, HEIC, PDF)
- `GET /api/files` — List all files (supports filtering by expense_id)
- `GET /api/files/:id` — Download a file
- `DELETE /api/files/:id` — Delete a file

### Property Expenses (US-3: Expense CRUD)
- `GET /api/properties/:id/expenses` — Get all expenses for a specific property with summary

## 📝 API Usage Examples

### Create a Property
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Main St",
    "city": "Denver",
    "state": "CO",
    "zip_code": "80202",
    "property_type": "rental",
    "acquisition_date": "2023-01-15",
    "notes": "Commercial property"
  }'
```

### Create an Expense
```bash
curl -X POST http://localhost:3001/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": 1,
    "category": "Maintenance",
    "description": "Roof repair",
    "amount": 1500.00,
    "expense_date": "2024-02-15",
    "notes": "Fixed roof leak"
  }'
```

### Upload a Receipt
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@receipt.heic" \
  -F "expense_id=1"
```

### List Expenses for a Property
```bash
curl http://localhost:3001/api/expenses/property/1
```

### Filter Expenses by Date Range
```bash
curl "http://localhost:3001/api/expenses?property_id=1&start_date=2024-01-01&end_date=2024-12-31"
```

### Get Expenses for a Specific Property (with summary)
```bash
curl http://localhost:3001/api/properties/1/expenses
```

Response includes:
```json
{
  "property_id": 1,
  "property_address": "123 Main St",
  "expense_count": 5,
  "total_expenses": 3500.00,
  "expenses": [
    {
      "id": 1,
      "property_id": 1,
      "category": "Maintenance",
      "description": "Roof repair",
      "amount": 1500.00,
      "expense_date": "2024-02-15",
      "receipt_file_id": 1,
      "notes": "Fixed roof leak",
      "created_at": "2024-02-15 10:30:00",
      "updated_at": "2024-02-15 10:30:00"
    }
  ],
  "category_summary": [
    {
      "category": "Maintenance",
      "count": 2,
      "total": 2000.00
    }
  ]
}
```

## 📤 File Upload (US-2)

### Features
- Accepts: **JPEG, PNG, HEIC, PDF** files
- Max file size: **10 MB** per file
- Automatic **HEIC → JPEG** conversion using Sharp
- Secure file storage with unique filenames
- File metadata stored in database
- Proper error handling with HTTP status codes

### Upload a Receipt
```bash
# Upload a single file
curl -X POST http://localhost:3001/api/upload \
  -F "file=@receipt.jpg"

# Upload and link to an expense
curl -X POST http://localhost:3001/api/upload \
  -F "file=@receipt.heic" \
  -F "expense_id=1"
```

### Upload Response
```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": 5,
    "original_filename": "receipt.heic",
    "stored_filename": "1708084800000-123456789.jpg",
    "file_size": 245678,
    "mime_type": "image/jpeg"
  }
}
```

### Supported File Types
| Type | MIME Type | Auto-Convert |
|------|-----------|--------------|
| JPEG | image/jpeg | ✗ |
| PNG | image/png | ✗ |
| HEIC | image/heic | ✓ (→ JPEG) |
| PDF | application/pdf | ✗ |

### Error Codes
- `400` — Invalid file type (only JPEG, PNG, HEIC, PDF allowed)
- `413` — File size exceeds 10 MB limit
- `500` — Server error during conversion

### Configuration
Adjust in `.env`:
```env
MAX_FILE_SIZE=10485760        # 10 MB in bytes
UPLOAD_DIR=./uploads           # Directory to store files
ENABLE_HEIC_CONVERSION=true    # Enable HEIC→JPEG conversion
```

## 💰 Expense Management (US-3)

### Create Expense with File Attachment
```bash
curl -X POST http://localhost:3001/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": 1,
    "category": "Maintenance",
    "description": "Roof repair",
    "amount": 1500.00,
    "expense_date": "2024-02-15",
    "receipt_file_id": 5,
    "notes": "Fixed roof leak"
  }'
```

### Filter Expenses
```bash
# By property
curl "http://localhost:3001/api/expenses?property_id=1"

# By category
curl "http://localhost:3001/api/expenses?category=Maintenance"

# By date range
curl "http://localhost:3001/api/expenses?start_date=2024-01-01&end_date=2024-12-31"

# Multiple filters (AND logic)
curl "http://localhost:3001/api/expenses?property_id=1&category=Maintenance&start_date=2024-01-01"
```

### Update Expense
```bash
curl -X PUT http://localhost:3001/api/expenses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": 1,
    "category": "Insurance",
    "amount": 2000.00,
    "expense_date": "2024-02-15"
  }'
```

### Delete Expense
```bash
curl -X DELETE http://localhost:3001/api/expenses/1
```

### Required Fields for Expenses
- `property_id` — Must reference an existing property
- `category` — See categories table for valid options
- `amount` — Numeric value (in dollars)
- `expense_date` — ISO date format (YYYY-MM-DD)

### Optional Fields
- `description` — Short description of expense
- `receipt_file_id` — ID of uploaded file (from `POST /api/upload`)
- `notes` — Additional notes or comments

### Category Validation
The following categories are pre-loaded:
- Mortgage/Rent
- Property Tax
- Insurance
- Maintenance
- Utilities
- Management Fees
- HOA Fees
- Advertising
- Legal/Professional
- Supplies

## 💾 Database Schema

### properties
- `id` — Primary key
- `address` — Property address (unique)
- `city` — City
- `state` — State/province
- `zip_code` — ZIP code
- `property_type` — Type of property (rental, commercial, etc.)
- `acquisition_date` — When property was acquired
- `notes` — Additional notes
- `created_at` — Timestamp
- `updated_at` — Timestamp

### expenses
- `id` — Primary key
- `property_id` — Foreign key to properties
- `category` — Expense category
- `description` — Expense description
- `amount` — Amount in dollars
- `expense_date` — Date of expense
- `receipt_file_id` — Foreign key to files (optional)
- `notes` — Additional notes
- `created_at` — Timestamp
- `updated_at` — Timestamp

### files
- `id` — Primary key
- `original_filename` — Original file name
- `stored_filename` — Name stored on disk
- `file_type` — File extension
- `file_size` — File size in bytes
- `file_path` — Path to file on disk
- `mime_type` — MIME type
- `expense_id` — Foreign key to expenses (optional)
- `created_at` — Timestamp

### categories
- `id` — Primary key
- `name` — Category name (unique)
- `description` — Category description
- `created_at` — Timestamp

## 🔄 Development Workflow

### Commit Convention
Use this format for all commits:
```
ALun: [brief description] (#issue-number)
```

Example:
```bash
git commit -m "ALun: Initialize express server and sqlite setup (#8)"
```

### Common Tasks

**View API logs:**
```bash
npm start
```

**Reset database:**
```bash
rm database.sqlite
npm start
```

**Test file upload:**
```bash
# Convert HEIC to JPEG (macOS)
sips -s format jpeg input.heic --out input.jpg

# Then upload
curl -X POST http://localhost:5000/api/upload \
  -F "file=@input.jpg"
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use a different port
PORT=3000 npm start
```

### Database Locked
If you see "database is locked" errors:
1. Make sure only one instance is running
2. Stop the server and try again
3. Delete `database.sqlite` to reset

### HEIC Conversion Fails
- Ensure `sharp` is properly installed: `npm install sharp`
- On macOS, you may need to install additional dependencies
- Set `ENABLE_HEIC_CONVERSION=false` to disable HEIC support

### File Upload Issues
- Check file size is under 10MB (configurable via `MAX_FILE_SIZE`)
- Ensure `uploads/` directory has write permissions
- Verify file type is: JPEG, PNG, HEIC, or PDF

## 📚 Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js 4.18
- **Database:** SQLite3 5.1
- **File Processing:** 
  - Multer 1.4.5 — File uploads
  - Sharp 0.33 — Image processing (HEIC→JPEG)
  - Heic2Any — HEIC detection (fallback)
- **Utilities:**
  - CORS 2.8.5 — Cross-origin requests
  - dotenv 16.3.1 — Environment variables

## 📖 Documentation

- [GitHub Issues](https://github.com/AmomasterBot/rental-expense-tracker/issues) — Feature requests & bug reports
- [TEAM-ONBOARDING.md](./TEAM-ONBOARDING.md) — Workflow & collaboration guide
- API docs coming soon

## 🤝 Team

- **Backend:** ALun
- **Frontend:** Aubrey
- **Sponsor:** Aaron Wu

## 📄 License

ISC

---

**Version:** 1.0.0  
**Status:** Active Development  
**Last Updated:** 2026-02-17
