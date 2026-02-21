import React, { useState, useEffect } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';

function InstallBanner({ onDismiss }) {
  const [showBanner, setShowBanner] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.navigator.standalone === true;
    
    setIsIOS(isAppleDevice && !isInStandaloneMode);

    // Listen for beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.navigator.standalone === true) {
      setShowBanner(false);
    }

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('✅ Service Worker is ready:', registration);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    if (onDismiss) {
      onDismiss();
    }
    // Store dismissal in localStorage to not show for 7 days
    localStorage.setItem('installBannerDismissed', JSON.stringify({
      timestamp: Date.now(),
      daysToWait: 7
    }));
  };

  // Check if banner was recently dismissed
  useEffect(() => {
    const dismissedData = localStorage.getItem('installBannerDismissed');
    if (dismissedData) {
      try {
        const { timestamp, daysToWait } = JSON.parse(dismissedData);
        const daysPassed = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
        if (daysPassed < daysToWait) {
          setShowBanner(false);
        } else {
          localStorage.removeItem('installBannerDismissed');
        }
      } catch (e) {
        console.log('Error parsing dismissal data');
      }
    }
  }, []);

  if (!showBanner) {
    return null;
  }

  // Show iOS instructions
  if (isIOS && showIOSInstructions) {
    return (
      <div className="ios-install-modal bg-white border-b border-gray-200 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📱 Add RentTracker to Home Screen
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Tap the <strong>Share</strong> button (box with arrow)</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                <li>Customize the name (optional)</li>
                <li>Tap <strong>"Add"</strong> in the top-right corner</li>
                <li>Your app will appear on your home screen! 🎉</li>
              </ol>
              <p className="text-xs text-gray-600 mt-3">
                💡 <strong>Benefits:</strong> Works offline, quick access from home screen, fullscreen experience
              </p>
            </div>
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              aria-label="Close instructions"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show iOS banner
  if (isIOS) {
    return (
      <div className="bg-blue-50 border-b border-blue-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xl">📱</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Add RentTracker to your home screen
                </p>
                <p className="text-xs text-gray-700">
                  Access the app offline, directly from your iPhone
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setShowIOSInstructions(true)}
                className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                How
              </button>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Dismiss"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show Android/Web banner (with install prompt)
  if (isInstallable) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <FiDownload className="text-blue-600 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Install RentTracker App
                </p>
                <p className="text-xs text-gray-700">
                  Get quick access, offline support, and native app experience
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default InstallBanner;
