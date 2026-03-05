import { useCallback, useState } from "react";

export interface ScanResult {
  data: string;
  type: string;
  timestamp: number;
}

export interface ScanError {
  message: string;
  timestamp: number;
}

interface UseBarcodeScanner {
  result: ScanResult | null;
  error: ScanError | null;
  isScanning: boolean;
  scanHistory: ScanResult[];
  handleScan: (data: string, type: string) => void;
  handleError: (message: string) => void;
  reset: () => void;
  clearHistory: () => void;
}

export function useBarcodeScanner(): UseBarcodeScanner {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<ScanError | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const handleScan = useCallback((data: string, type: string) => {
    const scanResult: ScanResult = {
      data,
      type,
      timestamp: Date.now(),
    };

    setResult(scanResult);
    setError(null);
    setIsScanning(false);

    // Add to history
    setScanHistory((prev) => [scanResult, ...prev.slice(0, 9)]); // Keep last 10 scans
  }, []);

  const handleError = useCallback((message: string) => {
    const scanError: ScanError = {
      message,
      timestamp: Date.now(),
    };

    setError(scanError);
    setResult(null);
    setIsScanning(false);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsScanning(false);
  }, []);

  const clearHistory = useCallback(() => {
    setScanHistory([]);
  }, []);

  return {
    result,
    error,
    isScanning,
    scanHistory,
    handleScan,
    handleError,
    reset,
    clearHistory,
  };
}

// Validate barcode formats
export function validateBarcodeFormat(
  type: string,
  expectedFormats?: string[],
): boolean {
  if (!expectedFormats || expectedFormats.length === 0) {
    return true;
  }
  return expectedFormats.includes(type);
}

// Validate barcode data based on type
export function validateBarcodeData(data: string, type: string): boolean {
  if (!data || data.trim().length === 0) {
    return false;
  }

  // Add specific validation logic for different barcode types
  switch (type) {
    case "ean13":
      return /^\d{13}$/.test(data);
    case "ean8":
      return /^\d{8}$/.test(data);
    case "upc_a":
      return /^\d{12}$/.test(data);
    case "upc_e":
      return /^\d{6,8}$/.test(data);
    case "code39":
    case "code93":
    case "code128":
      return data.length > 0;
    case "qr":
    case "pdf417":
    case "datamatrix":
    case "aztec":
      return data.length > 0;
    default:
      return data.length > 0;
  }
}

// Format barcode type for display
export function formatBarcodeType(type: string): string {
  const typeMap: Record<string, string> = {
    qr: "QR Code",
    ean13: "EAN-13",
    ean8: "EAN-8",
    upc_a: "UPC-A",
    upc_e: "UPC-E",
    code39: "Code 39",
    code93: "Code 93",
    code128: "Code 128",
    pdf417: "PDF417",
    datamatrix: "Data Matrix",
    aztec: "Aztec",
    itf14: "ITF-14",
    codabar: "Codabar",
  };

  return typeMap[type.toLowerCase()] || type;
}
