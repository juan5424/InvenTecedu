
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

function QRCode({ data }) {
  const { isDark } = useTheme();
  
  return (
    <div className={cn(
      "p-4 rounded-lg",
      isDark ? "bg-gray-800" : "bg-white"
    )}>
      <QRCodeSVG
        value={JSON.stringify(data)}
        size={128}
        bgColor={isDark ? "#1f2937" : "#ffffff"}
        fgColor={isDark ? "#ffffff" : "#000000"}
        level="H"
        includeMargin={true}
      />
    </div>
  );
}

export default QRCode;
