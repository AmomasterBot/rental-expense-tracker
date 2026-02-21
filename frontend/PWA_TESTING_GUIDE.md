# PWA Testing Guide - Rental Expense Tracker

This guide covers testing all aspects of the PWA functionality to ensure the app meets the acceptance criteria.

## Quick Reference

| Feature | Status | Test Method |
|---------|--------|-------------|
| Install Banner | ✅ Implemented | Desktop/Android browsers |
| iPhone Install | ✅ Implemented | Safari on iPhone |
| Service Worker | ✅ Registered | DevTools Application tab |
| Offline Mode | ✅ Caching | Turn off network |
| Icons | ✅ Generated | Check manifest icons |
| Manifest | ✅ Complete | Validate with tools |

---

## Part 1: Browser Setup & Local Testing

### Step 1: Build the App

```bash
cd frontend
npm run build
# This will:
# 1. Generate all PWA icons (192x192, 512x512, maskable variants)
# 2. Build the production app
```

### Step 2: Serve Locally

```bash
# Option A: Using Vite preview
npm run preview

# Option B: Using a simple HTTP server (required for Service Worker)
# Make sure to serve over localhost (HTTP is OK for localhost testing)
python3 -m http.server 8000 --directory dist
# Then visit: http://localhost:8000
```

**Important:** Service Workers require HTTPS on production, but HTTP works on localhost for testing.

---

## Part 2: Chrome DevTools Testing

### 2.1: Check Service Worker Registration

**Steps:**
1. Open DevTools (F12 / Cmd+Option+I)
2. Go to **Application** tab → **Service Workers**
3. Look for `/sw.js` entry

**Expected Result:**
- Status shows "activated and running"
- Green indicator next to service worker
- Console shows: `✅ Service Worker registered successfully:`

**Test Console Logs:**
```javascript
// In DevTools Console, verify:
navigator.serviceWorker.ready.then(reg => console.log('SW Ready:', reg))

// Check installed caches:
caches.keys().then(names => console.log('Caches:', names))
```

### 2.2: Verify Manifest.json

**Steps:**
1. Go to **Application** tab → **Manifest**
2. Verify the loaded manifest shows:

**Checklist:**
- ✅ `name`: "Rental Expense Tracker"
- ✅ `short_name`: "RentTracker"
- ✅ `start_url`: "/"
- ✅ `display`: "standalone"
- ✅ `theme_color`: "#3b82f6"
- ✅ `background_color`: "#ffffff"
- ✅ `orientation`: "portrait-primary"
- ✅ Icons present (192x192, 512x512, maskable)
- ✅ Shortcuts defined (Add Expense, View Expenses)

### 2.3: Check Icons

**Steps:**
1. Go to **Application** tab → **Manifest** → Scroll to Icons section
2. Each icon should show a preview thumbnail

**Expected:**
- 4 icons listed (192, 192-maskable, 512, 512-maskable)
- Each shows a blue building/home icon
- No broken image icons

### 2.4: Test Install Prompt (Android/Chrome)

**Steps:**
1. Go to **Application** tab → **Manifest**
2. Scroll down to "Install" button
3. Click the install button

**OR** from the address bar:
- Chrome shows "Install app" icon on the right side
- Click it to trigger the install prompt

**Expected:**
- Install dialog appears
- Shows app icon and name
- Can customize app name
- "Install" button available

---

## Part 3: Offline Functionality Testing

### Test Network Disconnection

**Using Chrome DevTools:**

1. **Method A - DevTools Offline Mode:**
   - Open DevTools (F12)
   - Go to **Network** tab
   - Check the **Offline** checkbox
   - Try navigating the app

2. **Method B - Service Worker Offline Simulation:**
   - Application tab → Service Workers → Check "Offline"
   - Refresh the page
   - App should still load from cache

**Expected Behavior:**
- ✅ Index page loads from cache
- ✅ Previous visited pages load
- ✅ Offline banner appears: "⚠️ You are offline..."
- ✅ Icons and styling load correctly
- ✅ Navigation works (client-side routing)
- ❌ API calls fail gracefully (no data updates)

### Test Cache Strategy

**Steps:**
1. Open **Application** tab → **Cache Storage**
2. Navigate the app (add expense, view properties, etc.)
3. Expand the `rental-expense-tracker-v1` cache
4. Check what's cached

**Expected:**
- `index.html` is cached
- `manifest.json` is cached
- JS/CSS bundles are in runtime cache
- Network requests are cached when successful

---

## Part 4: Mobile Testing

### 4.1: Android Testing (Chrome/Edge)

**Prerequisites:**
- Build the app: `npm run build`
- Deploy to a server with HTTPS, OR
- Use Android phone connected to dev machine via USB

**Testing Install Prompt:**

1. Open Chrome on Android phone
2. Visit the app URL
3. Look for install banner at bottom of page
4. Tap "Install" button

**Verification:**
- ✅ Install banner shows: "Install RentTracker App"
- ✅ Shows download icon
- ✅ Has "Install" and "Not Now" buttons
- ✅ App installs to home screen
- ✅ App opens fullscreen (no browser chrome)
- ✅ Icon appears on home screen

**Test Installed App:**
1. Tap app icon on home screen
2. App should open fullscreen
3. Verify online indicator and functionality
4. Turn off WiFi → offline banner appears
5. Turn on WiFi → offline banner disappears

### 4.2: iPhone Testing (Safari)

**Prerequisites:**
- iPhone with iOS 12.2+
- Safari browser
- Web server with HTTPS (PWAs require HTTPS on real devices)

**Testing Install Prompt:**

1. Open Safari on iPhone
2. Visit the app URL
3. iPhone-specific banner should appear: "📱 Add RentTracker to Home Screen"
4. Tap the "How" button to see instructions

**Following Instructions:**
- Tap the **Share** button (arrow in box, bottom center)
- Scroll down → "Add to Home Screen"
- Customize name if desired (or keep "RentTracker")
- Tap **Add**

**Verification Checklist:**

✅ **Installation:**
- Icon appears on home screen
- Icon shows the building design (not just browser icon)
- Name displays as "RentTracker" (or custom name)

✅ **Fullscreen Launch:**
- Tapping home screen icon opens the app fullscreen
- No browser address bar visible
- No browser navigation buttons visible
- Takes up full screen (except status bar)

✅ **Status Bar Behavior:**
- Status bar (time, battery) visible at top
- Background color matches theme (blue)
- Text in status bar is readable

✅ **Splash Screen:**
- When first launching from home screen, splash screen appears briefly
- Shows app name and icon
- Displays theme background color
- Smooth transition to app content

✅ **Offline Functionality:**
- Close Safari completely
- Turn off WiFi
- Tap app icon to launch
- App loads from cache (offline banner appears)
- Navigation works
- Data persists

✅ **Update Behavior:**
- If app was updated, notification appears
- Can dismiss notification
- Can reload app to get latest version

---

## Part 5: PWA Features Verification

### 5.1: Install Banner

**Desktop (Chrome/Edge):**
```
Expected Banner Text:
"Install RentTracker App"
"Get quick access, offline support, and native app experience"
[Install] [Not Now] buttons
```

**Mobile (iOS):**
```
Expected Banner Text:
"📱 Add RentTracker to Home Screen"
"Access the app offline, directly from your iPhone"
[How] [X] buttons
```

### 5.2: Service Worker Logs

Open DevTools Console and verify these logs:

```
✅ Service Worker registered successfully: ...
✅ App update available! (if update detected)
✨ App is running in standalone mode (if installed)
🟢 Back online (when connectivity restored)
🔴 App is offline (when connection lost)
[Service Worker] Loaded and ready
```

### 5.3: Offline Page Caching

Test the cache strategy:

1. **First Visit (Online):**
   - Load the app at `http://localhost:8000`
   - Navigate to different pages
   - Go to DevTools → Network tab
   - All requests show status 200

2. **Offline Simulation:**
   - Go to DevTools → Network → Check "Offline"
   - Refresh the page
   - App still loads
   - Status shows "200 (from cache)"

3. **Fallback Testing:**
   - Try navigating to a non-existent route while offline
   - Should fallback to index.html

---

## Part 6: Console Error Checking

**Acceptance Criteria:** No critical console errors

**Steps:**
1. Open DevTools → Console tab
2. Clear the console
3. Reload the page
4. Navigate through the app
5. Test offline mode
6. Check for errors

**Expected Result:**
- ✅ No red error messages
- ⚠️ Warnings are OK (yellow)
- ✅ Service Worker logs (blue) are informational
- ❌ Network errors when offline are expected (gray)

**Common Safe Errors:**
```
⚠️ Failed to fetch (expected when offline)
⚠️ Service Worker failed to fetch (expected when offline)
```

**Check For Problems:**
```
❌ Uncaught TypeError: ...
❌ Manifest could not be found or was invalid
❌ Service Worker failed to register
❌ Cross-origin request blocked
```

---

## Part 7: Responsive Design Check

While testing PWA features, also verify:

**Mobile (375px width):**
- ✅ Install banner fits on screen
- ✅ No horizontal scrolling
- ✅ Touch targets are at least 44x44px
- ✅ Text is readable (≥12px)

**Tablet (768px width):**
- ✅ Layout adapts properly
- ✅ Install banner is not overwhelming
- ✅ Content is readable

**Desktop (1024px+ width):**
- ✅ Sidebar visible/functional
- ✅ Banner doesn't take up too much space
- ✅ All features accessible

---

## Part 8: Real-Device Testing Checklist

### iOS Checklist

- [ ] Safari on iPhone opens the app
- [ ] Install prompt banner visible on first visit
- [ ] "How" button shows instructions
- [ ] Following instructions allows adding to home screen
- [ ] Home screen icon displays correctly
- [ ] Launching from home screen opens fullscreen
- [ ] No browser chrome visible (address bar, navigation)
- [ ] Status bar visible and readable
- [ ] Offline mode works (turn off WiFi)
- [ ] Offline banner appears when offline
- [ ] App can be closed and relaunched
- [ ] Return to app from home screen is fast
- [ ] No console errors

### Android Checklist

- [ ] Chrome opens the app
- [ ] Install prompt banner visible
- [ ] Clicking "Install" shows system dialog
- [ ] App installs to home screen
- [ ] Home screen icon displays correctly
- [ ] Launching from home screen opens fullscreen
- [ ] No browser chrome visible
- [ ] Status bar matches theme color
- [ ] Offline mode works
- [ ] Offline banner appears
- [ ] Background sync works (if implemented)
- [ ] No console errors

---

## Part 9: Debugging Tips

### Service Worker Not Registering?

**Checklist:**
1. Is the file served from root? (/sw.js, not /public/sw.js)
2. Is it HTTPS? (HTTP works on localhost)
3. Check DevTools → Application → Service Workers for errors
4. Check Console for error messages

**Fix:**
```javascript
// Add this to check registration
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Registrations:', regs);
})
```

### Icons Not Showing?

1. Verify files exist in `/public`:
   - icon-192.png
   - icon-512.png
   - icon-192-maskable.png
   - icon-512-maskable.png

2. Check manifest.json paths are correct:
   ```json
   "icons": [
     {
       "src": "/icon-192.png",  // Must be /filename, not ./
       "sizes": "192x192"
     }
   ]
   ```

3. Clear cache and rebuild:
   ```bash
   npm run build
   npm run preview
   ```

### Install Prompt Not Showing?

**Chrome/Android:**
- Event fires only once per app
- Must click "Not Now" or dismiss first
- Clear site data to reset: Settings → Storage → Clear site data

**iOS:**
- Built-in iOS behavior, no beforeinstallprompt event
- Shows custom banner with instructions
- User must manually follow "Add to Home Screen" in Safari

---

## Part 10: Deployment Checklist

Before deploying to production:

- [ ] `npm run build` completes without errors
- [ ] Icons are generated and present in `dist/`
- [ ] `manifest.json` is in `dist/`
- [ ] `sw.js` is in `dist/` root (not nested)
- [ ] Service Worker is served with correct headers:
  - `Content-Type: application/javascript`
  - `Cache-Control: no-cache` (important!)
- [ ] SSL/HTTPS configured (required for Production)
- [ ] Test on real device before production release
- [ ] Monitor console errors in production

### Nginx Configuration Example:

```nginx
location /sw.js {
  add_header Cache-Control "no-cache, no-store, must-revalidate";
  add_header Content-Type "application/javascript; charset=utf-8";
}

location /manifest.json {
  add_header Content-Type "application/manifest+json";
}

location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Quick Test Summary

**5-Minute Smoke Test:**
1. Build: `npm run build`
2. Serve: `npm run preview`
3. Open DevTools → Application → Service Workers ✅
4. Check manifest icons load ✅
5. Go offline: DevTools → Network → Offline ✅
6. Refresh page → loads from cache ✅
7. Check Console → no major errors ✅

**Full Test (15 minutes):**
- Complete Part 2-3 (Browser DevTools)
- Test on actual iPhone or Android device
- Verify install prompt
- Test offline functionality
- Check all console logs

---

## Useful Tools & Resources

- **PWA Manifest Validator:** https://www.pwabuilder.com/
- **Lighthouse:** Built into Chrome DevTools (Audits tab)
- **Web App Manifest Spec:** https://www.w3.org/TR/appmanifest/
- **Service Worker Spec:** https://w3c.github.io/ServiceWorker/
- **PWA Checklist:** https://web.dev/pwa-checklist/

---

## Support & Troubleshooting

For issues:
1. Check Console (F12 → Console)
2. Check Service Worker logs (F12 → Application → Service Workers)
3. Verify network requests (F12 → Network)
4. Check cache contents (F12 → Application → Cache Storage)
5. Clear cache and reload: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

---

**Last Updated:** February 2026  
**Version:** PWA Polish v1.0
