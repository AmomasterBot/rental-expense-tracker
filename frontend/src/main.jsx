import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Register service worker for PWA support
let swRegistration = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      swRegistration = registration;
      console.log('✅ Service Worker registered successfully:', registration);

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available, notify user
            console.log('📦 App update available!');
            notifyUpdateAvailable();
          }
        });
      });

      // Check for updates periodically (every hour)
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  });

  // Handle messages from service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('[Main] Message from Service Worker:', event.data);
  });
}

// Notify user of available update
function notifyUpdateAvailable() {
  // Create a notification banner or toast
  const message = document.createElement('div');
  message.id = 'update-notification';
  message.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #3b82f6;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    max-width: 300px;
  `;
  
  message.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span>🔄 App update available</span>
      <button id="update-btn" style="
        background: white;
        color: #3b82f6;
        border: none;
        padding: 4px 12px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
      ">Reload</button>
    </div>
  `;
  
  document.body.appendChild(message);
  
  document.getElementById('update-btn').addEventListener('click', () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  });
  
  // Auto-remove after 10 seconds if not clicked
  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 10000);
}

// Log PWA status on startup
if (window.navigator.standalone === true) {
  console.log('✨ App is running in standalone mode (installed on home screen)');
}

// Log cache support
if ('caches' in window) {
  caches.keys().then((names) => {
    console.log('💾 Available caches:', names);
  });
}

// Monitor online/offline status
window.addEventListener('online', () => {
  console.log('🟢 Back online');
});

window.addEventListener('offline', () => {
  console.log('🔴 App is offline');
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
