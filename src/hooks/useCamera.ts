import { useEffect, useState } from 'react';

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    async function start() {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (mounted) setStream(media);
      } catch (err) {
        console.error(err);
        if (mounted) setError('Akses kamera ditolak. Harap izinkan penggunaan kamera di browser Anda.');
      }
    }
    start();
    return () => {
      mounted = false;
      setStream(prev => {
        if (prev) prev.getTracks().forEach(t => t.stop());
        return null;
      });
    };
  }, []);

  const capture = (videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return null;
    const canvas = document.createElement('canvas');
    
    // We want a 4:3 crop from the video feed (mostly 16:9 natively)
    const vw = videoEl.videoWidth;
    const vh = videoEl.videoHeight;
    
    let targetWidth = vw;
    let targetHeight = vw * (3/4);
    
    if (targetHeight > vh) {
      targetHeight = vh;
      targetWidth = vh * (4/3);
    }
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Default cameras mirror the feed visually via CSS
    // So we apply proper scaling translation to capture as user sees it
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    const offsetX = (vw - targetWidth) / 2;
    const offsetY = (vh - targetHeight) / 2;
    
    ctx.drawImage(
      videoEl, 
      offsetX, offsetY, targetWidth, targetHeight, 
      0, 0, targetWidth, targetHeight
    );
    
    return canvas.toDataURL('image/jpeg', 0.9);
  };

  return { stream, error, capture };
}
