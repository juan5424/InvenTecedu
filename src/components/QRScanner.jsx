
import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

function QRScanner({ onScan, onClose }) {
  const [scanner, setScanner] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    qrScanner.render(success, error);
    setScanner(qrScanner);

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const success = (result) => {
    if (scanner) {
      scanner.clear();
    }
    onScan(result);
  };

  const error = (err) => {
    console.warn(err);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
      isDark ? "text-white" : "text-gray-900"
    )}>
      <div className={cn(
        "p-6 rounded-lg shadow-xl max-w-md w-full mx-4",
        isDark ? "bg-gray-800" : "bg-white"
      )}>
        <h3 className="text-xl font-semibold mb-4">Escanear Código QR</h3>
        <div id="reader" className="mb-4"></div>
        <Button onClick={onClose} className="w-full">
          Cancelar
        </Button>
      </div>
    </div>
  );
}

export default QRScanner;
