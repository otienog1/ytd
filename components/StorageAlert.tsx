'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function StorageAlert() {
  const [show, setShow] = useState(false);
  const [fullProviders, setFullProviders] = useState<string[]>([]);

  useEffect(() => {
    checkStorage();
    const interval = setInterval(checkStorage, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkStorage = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://ytd.timobosafaris.com'}/api/storage/stats`
      );
      const data = await response.json();

      const full = data.providers
        .filter((p: any) => p.is_full)
        .map((p: any) => p.provider);

      setFullProviders(full);
      setShow(full.length > 0);

    } catch (error) {
      console.error('Failed to check storage:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Storage Capacity Warning
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            {fullProviders.length === 1
              ? `${fullProviders[0].toUpperCase()} storage is at capacity.`
              : `${fullProviders.join(', ').toUpperCase()} storage providers are at capacity.`}
            {' '}New downloads will use available providers.
          </p>
        </div>
        <button
          onClick={() => setShow(false)}
          className="ml-3 flex-shrink-0 text-yellow-600 hover:text-yellow-800 transition-colors"
          aria-label="Dismiss alert"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
