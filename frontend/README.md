# Rental Expense Tracker - Frontend

A modern, responsive Progressive Web App (PWA) for managing rental property expenses. Built with React, Vite, and Tailwind CSS with offline-first support.

## Features

✨ **Progressive Web App (PWA)**
- Installable on iOS and Android (Add to Home Screen)
- Works offline with service worker caching
- Fast load times and smooth interactions

📱 **Mobile-First Design**
- Fully responsive on all screen sizes
- Touch-friendly interface
- Optimized for mobile devices first

💼 **Expense Management**
- Track rental property expenses by category
- Add receipts and attachments
- Filter and search expenses
- Export data to CSV

🏠 **Property Management**
- Add and manage multiple rental properties
- Track expenses per property
- View property details and notes

🔒 **Offline Support**
- All data synced to localStorage
- Works without internet connection
- Automatic sync when back online

## Tech Stack

- **React 18+** - UI library
- **Vite** - Build tool and dev server (fast!)
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **Service Workers** - PWA offline support

## Prerequisites

- Node.js 16+ and npm 8+

## Installation & Setup

### 1. Clone and Navigate to Frontend Directory

```bash
cd /Users/masterbot/.openclaw/workspace/rental-expense-tracker/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Vite dev server with hot module replacement (HMR). Changes are reflected instantly in the browser.

### Build for Production

```bash
npm run build
```

Builds the app for production to the `dist/` folder. Optimized and minified.

### Preview Production Build Locally

```bash
npm run preview
```

Serves the production build locally to test before deploying.

## Folder Structure

```
frontend/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker for offline support
│   └── index.html             # Main HTML file
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx      # Home page with stats
│   │   ├── Properties.jsx     # Property management
│   │   ├── AddExpense.jsx     # Add new expense
│   │   └── ViewExpenses.jsx   # View & filter expenses
│   ├── components/
│   │   ├── Layout.jsx         # Main layout wrapper
│   │   ├── Header.jsx         # Top navigation
│   │   ├── Sidebar.jsx        # Navigation menu
│   │   ├── PropertyCard.jsx   # Property display
│   │   ├── PropertyForm.jsx   # Property input form
│   │   ├── ExpenseForm.jsx    # Expense input form
│   │   ├── ExpenseTable.jsx   # Expenses list with sorting
│   │   └── StatsCard.jsx      # Stats display cards
│   ├── hooks/
│   │   └── useOffline.js      # Hook to detect offline status
│   ├── utils/
│   │   ├── api.js             # API & localStorage utilities
│   │   └── formatters.js      # Date & currency formatting
│   ├── styles/
│   │   ├── layout.css         # Layout styles
│   │   ├── dashboard.css      # Dashboard styles
│   │   ├── properties.css     # Properties page styles
│   │   ├── add-expense.css    # Add expense styles
│   │   └── view-expenses.css  # View expenses styles
│   ├── App.jsx                # Main app component with routing
│   ├── App.css                # App styles
│   ├── index.css              # Global styles + Tailwind
│   └── main.jsx               # React DOM entry point
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## How to Use

### Adding a Property

1. Go to **Properties** page
2. Click **"Add Property"** button
3. Fill in property details (name, address, city, state, zip)
4. Click **"Add Property"**

### Adding an Expense

1. Go to **Add Expense** page (or click the button on Dashboard)
2. Select property, date, and provider
3. Enter amount and category
4. Optionally upload a receipt image
5. Click **"Add Expense"**

### Viewing & Filtering Expenses

1. Go to **View Expenses** page
2. Use filters to narrow down:
   - Filter by property
   - Filter by date range
3. Click column headers to sort
4. Click **Export** to download as CSV

### Installing as PWA

**On iPhone:**
1. Open Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

**On Android:**
1. Open Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"

### Offline Mode

- All data is automatically saved to your device
- Works without internet connection
- Changes sync when you reconnect
- Check online status in the header (top right)

## Component Library

### Layout Components

**Header**
- Top navigation with title and online status indicator

**Sidebar/Navigation**
- Mobile-responsive navigation menu
- Active page highlighting

**Layout**
- Wrapper component for page structure
- Offline banner notification

### Form Components

**PropertyForm**
- Reusable property input form
- Validation and error handling

**ExpenseForm**
- Expense input with file upload
- Support for receipt images/PDFs

### Display Components

**PropertyCard**
- Display property information
- Edit and delete buttons

**ExpenseTable**
- Sortable, filterable table
- Inline delete functionality

**StatsCard**
- Display statistics with icons
- Color-coded cards

## Styling

The project uses **Tailwind CSS** for utility-first styling.

### Custom Component Classes

Available in `index.css`:
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button
- `.btn-danger` - Destructive action button
- `.card` - Card container with shadow
- `.input-field` - Form input styling
- `.label` - Form label styling

### Responsive Design

Mobile-first approach:
- Base styles for mobile (< 768px)
- `md:` prefix for tablet and up (768px+)
- `lg:` prefix for desktop (1024px+)

## Offline Storage

Data is stored in browser's localStorage:
- `properties` - Array of property objects
- `expenses` - Array of expense objects

Data persists across browser sessions and works offline.

## Performance

- **Fast development** with Vite HMR
- **Optimized production builds** (minified, tree-shaken)
- **PWA caching** for instant loads
- **Code splitting** for smaller bundle sizes
- **Lazy loading** for pages

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements

- [ ] Backend API integration
- [ ] Real database (PostgreSQL/Firebase)
- [ ] User authentication
- [ ] Multi-user support
- [ ] Advanced reporting & analytics
- [ ] Receipt OCR
- [ ] Budget alerts
- [ ] Tax report generation

## Troubleshooting

### PWA Not Installing?
- Make sure you're on HTTPS (or localhost)
- Check that manifest.json is served correctly
- Clear cache and try again

### Offline Mode Not Working?
- Check browser's service worker registration (DevTools > Application > Service Workers)
- Verify public/sw.js exists and is served
- Check localStorage quota

### Styles Not Applying?
- Rebuild with `npm run build`
- Clear browser cache
- Check Tailwind purge configuration

## Development Workflow

1. Make changes to `.jsx` files
2. Vite hot reloads automatically
3. Test on mobile or use DevTools device emulation
4. Build and deploy when ready

## Commits

Follow the commit convention for this task:

```bash
git commit -m "Aubrey: [description] (#9)"
```

Example:
```bash
git commit -m "Aubrey: Setup React project with Vite and Tailwind (#9)"
git commit -m "Aubrey: Create page layouts and component structure (#9)"
git commit -m "Aubrey: Add PWA manifest and service worker (#9)"
```

## Getting Help

- Check GitHub issue #9 for requirements
- Review component examples in the codebase
- Check Tailwind docs: https://tailwindcss.com
- React docs: https://react.dev
- Vite docs: https://vitejs.dev

## License

Part of the Rental Expense Tracker project.
