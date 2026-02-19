"use client";

import { useState } from 'react';
import { Download } from 'lucide-react';

export default function DownloadButton({ fileKey, fileName }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Call API to get presigned URL
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate download link');
      }

      const { downloadUrl } = await response.json();

      // Open download in new tab
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black py-4 px-6 rounded-lg font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-5 h-5" />
      {isDownloading ? 'Generating Link...' : 'Download Product'}
    </button>
  );
}
