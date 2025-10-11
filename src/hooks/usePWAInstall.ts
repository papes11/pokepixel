import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'mobile'];
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isMobileScreen = window.innerWidth <= 768;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      return isMobileUA || (isMobileScreen && isTouchDevice);
    };
    
    setIsMobile(checkMobile());
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isIOSStandalone);

    // Check if user has already dismissed the install prompt
    const hasSeenInstallPrompt = localStorage.getItem('pokepixel_install_prompt_seen');
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setIsInstallable(true);
      
      // Only show install prompt on mobile devices if user hasn't seen it and app isn't installed
      if (!hasSeenInstallPrompt && !isInstalled && checkMobile()) {
        setShowInstallPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during installation:', error);
      return false;
    }
  };

  const dismissPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pokepixel_install_prompt_seen', 'true');
  };

  const showPromptAgain = () => {
    localStorage.removeItem('pokepixel_install_prompt_seen');
    if (isInstallable && !isInstalled && isMobile) {
      setShowInstallPrompt(true);
    }
  };

  return {
    showInstallPrompt,
    isInstallable,
    isInstalled,
    isMobile,
    installApp,
    dismissPrompt,
    showPromptAgain
  };
};