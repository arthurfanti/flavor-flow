'use client';

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import type { PWAInstallElement } from '@khmyznikov/pwa-install';
import '@khmyznikov/pwa-install';

export interface PWAInstallHandle {
  install: () => void;
  showDialog: () => void;
  hideDialog: () => void;
  isInstallAvailable: boolean;
  isUnderStandaloneMode: boolean;
}

interface PWAInstallProps {
  manifestUrl?: string;
  name?: string;
  description?: string;
  icon?: string;
  tintColor?: string;
  onInstallSuccess?: () => void;
  onInstallFail?: () => void;
  onInstallAvailable?: () => void;
  children?: React.ReactNode;
}

export const PWAInstall = forwardRef<PWAInstallHandle, PWAInstallProps>(
  function PWAInstall(
    {
      manifestUrl = '/manifest.webmanifest',
      name = 'Flavor Flow',
      description = 'Transform video recipes into a shopping list',
      icon = '/icon-512.png',
      tintColor = '#e05d44',
      onInstallSuccess,
      onInstallFail,
      onInstallAvailable,
      children,
    },
    ref
  ) {
    const pwaRef = useRef<PWAInstallElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isInstallAvailable, setIsInstallAvailable] = useState(false);
    const [isUnderStandaloneMode, setIsUnderStandaloneMode] = useState(false);

    const handleInstallSuccess = useCallback(() => {
      onInstallSuccess?.();
    }, [onInstallSuccess]);

    const handleInstallFail = useCallback(() => {
      onInstallFail?.();
    }, [onInstallFail]);

    const handleInstallAvailable = useCallback(() => {
      onInstallAvailable?.();
    }, [onInstallAvailable]);

    useEffect(() => {
      setMounted(true);
    }, []);

    useImperativeHandle(ref, () => ({
      install: () => pwaRef.current?.install(),
      showDialog: () => pwaRef.current?.showDialog(),
      hideDialog: () => pwaRef.current?.hideDialog(),
      get isInstallAvailable() {
        return pwaRef.current?.isInstallAvailable ?? false;
      },
      get isUnderStandaloneMode() {
        return pwaRef.current?.isUnderStandaloneMode ?? false;
      },
    }), []);

    useEffect(() => {
      const pwaElement = pwaRef.current;
      if (!pwaElement) return;

      pwaElement.addEventListener(
        'pwa-install-success-event',
        handleInstallSuccess
      );
      pwaElement.addEventListener('pwa-install-fail-event', handleInstallFail);
      pwaElement.addEventListener(
        'pwa-install-available-event',
        handleInstallAvailable
      );

      if (tintColor) {
        pwaElement.styles = { '--tint-color': tintColor };
      }

      return () => {
        pwaElement.removeEventListener(
          'pwa-install-success-event',
          handleInstallSuccess
        );
        pwaElement.removeEventListener(
          'pwa-install-fail-event',
          handleInstallFail
        );
        pwaElement.removeEventListener(
          'pwa-install-available-event',
          handleInstallAvailable
        );
      };
    }, [tintColor, handleInstallSuccess, handleInstallFail, handleInstallAvailable]);

    useEffect(() => {
      const checkStatus = () => {
        if (pwaRef.current) {
          setIsInstallAvailable(pwaRef.current.isInstallAvailable);
          setIsUnderStandaloneMode(pwaRef.current.isUnderStandaloneMode);
        }
      };

      checkStatus();
      const interval = setInterval(checkStatus, 1000);
      return () => clearInterval(interval);
    }, []);

    if (!mounted) {
      return null;
    }

    return (
      <pwa-install
        ref={pwaRef}
        manifest-url={manifestUrl}
        name={name}
        description={description}
        icon={icon}
        manual-chrome="true"
        manual-apple="true"
        use-local-storage="true"
        data-install-available={isInstallAvailable}
        data-standalone-mode={isUnderStandaloneMode}
      >
        {children as any}
      </pwa-install>
    );
  }
);

export function usePWAInstall(ref: React.RefObject<PWAInstallHandle | null>) {
  const [isInstallAvailable, setIsInstallAvailable] = useState(false);
  const [isUnderStandaloneMode, setIsUnderStandaloneMode] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      if (ref.current) {
        setIsInstallAvailable(ref.current.isInstallAvailable);
        setIsUnderStandaloneMode(ref.current.isUnderStandaloneMode);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 500);
    return () => clearInterval(interval);
  }, [ref]);

  const showDialog = useCallback(() => {
    ref.current?.showDialog();
  }, [ref]);

  const install = useCallback(() => {
    ref.current?.install();
  }, [ref]);

  const hideDialog = useCallback(() => {
    ref.current?.hideDialog();
  }, [ref]);

  return {
    isInstallAvailable,
    isUnderStandaloneMode,
    install,
    showDialog,
    hideDialog,
  };
}
