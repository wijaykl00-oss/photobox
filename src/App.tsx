/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useRef, useEffect } from 'react';
import { Camera, Download, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCamera } from './hooks/useCamera';
import { downloadStrip } from './utils/canvas';

const STRIP_COLORS = [
  { name: 'Dark', hex: '#18181b', text: '#ffffff' },
  { name: 'Light', hex: '#ffffff', text: '#18181b' },
  { name: 'Rose', hex: '#ffe4e6', text: '#881337' },
  { name: 'Ice', hex: '#e0f2fe', text: '#0c4a6e' },
  { name: 'Lavender', hex: '#f3e8ff', text: '#581c87' },
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, error, capture } = useCamera();
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [stripColor, setStripColor] = useState(STRIP_COLORS[0]);
  const [mode, setMode] = useState<'idle' | 'capturing' | 'review'>('idle');
  const [count, setCount] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  // Attach stream to video tag whenever stream changes or we come back from review mode
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, mode]);

  const startSession = async () => {
    setPhotos([]);
    setMode('capturing');

    for (let i = 0; i < 4; i++) {
      // Countdown
      for (let c = 3; c > 0; c--) {
        setCount(c);
        await sleep(1000);
      }
      setCount(null);

      // Flash & Capture
      setFlash(true);
      const photoUrl = capture(videoRef.current);
      if (photoUrl) {
        setPhotos(prev => [...prev, photoUrl]);
      }
      setTimeout(() => setFlash(false), 150);

      // Wait before next shot
      if (i < 3) {
        await sleep(1000);
      }
    }

    await sleep(600);
    setMode('review');
  };

  const handleDownload = () => {
    downloadStrip(photos, stripColor.hex, stripColor.text);
  };

  // Dedicated component to render the photostrip UI cleanly
  const Strip = ({ isReviewing = false }: { isReviewing?: boolean }) => (
    <motion.div
      layout
      initial={isReviewing ? { opacity: 0, y: 50 } : false}
      animate={{ opacity: 1, y: 0 }}
      className={`shadow-2xl flex flex-col mx-auto ${
        isReviewing ? 'w-[280px] sm:w-[320px]' : 'w-[240px]'
      }`}
      style={{ backgroundColor: stripColor.hex }}
    >
      <div className={`flex flex-col p-3 ${isReviewing ? 'gap-3 pb-16 pt-4' : 'gap-2 pb-14 pt-3'}`}>
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i} 
            className="bg-black/10 w-full aspect-[4/3] rounded overflow-hidden relative border border-black/5"
          >
            {photos[i] ? (
              <img src={photos[i]} alt={`Shot ${i+1}`} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-black/20 font-medium">
                {i + 1}
              </div>
            )}
          </div>
        ))}
        {/* Strip Branding */}
        <div
          className="w-full flex flex-col items-center justify-center mt-2 tracking-tight"
          style={{ color: stripColor.text }}
        >
          <span className="font-display font-bold text-xl sm:text-2xl pt-1">PHOTOBOX</span>
          <span className="font-sans text-[10px] sm:text-xs opacity-70">
            {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex text-sm sm:text-base relative overflow-hidden">
      {/* 
        ========================================
        LEFT COLUMN / MAIN VIEW (Camera & Controls)
        ========================================
      */}
      <div className="flex-1 flex flex-col relative h-screen">
        {/* Top Header */}
        <header className="absolute top-0 inset-x-0 p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <div className="font-display font-bold text-xl sm:text-2xl flex items-center gap-2 drop-shadow-md">
            <Camera className="w-6 h-6 sm:w-7 sm:h-7" /> PHOTOBOX
          </div>

          {/* Progress Indicator for Desktop & Mobile */}
          {(mode === 'capturing' || photos.length > 0) && mode !== 'review' && (
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors drop-shadow-md ${
                    photos.length > i 
                      ? 'bg-white' 
                      : photos.length === i && mode === 'capturing' 
                      ? 'bg-red-500 animate-pulse' 
                      : 'bg-white/30'
                  }`} 
                />
              ))}
            </div>
          )}
        </header>

        {/* Camera Feed */}
        <main className="flex-1 relative border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-900 overflow-hidden">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-red-500 bg-black/40">
              <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 max-w-md">
                {error}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pb-24 md:pb-0">
              {/* Aspect Ratio Constraint 4:3 */}
              <div className="relative w-full max-w-3xl aspect-[4/3] bg-black sm:rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl sm:ring-1 ring-white/10 md:m-12 lg:m-24">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover -scale-x-100" 
                />
                
                {stream === null && mode !== 'review' && (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-400 font-medium">
                    <span className="animate-pulse">Mengakses Kamera...</span>
                  </div>
                )}
                
                {/* 3...2...1 Overlay */}
                <AnimatePresence>
                  {count !== null && (
                    <motion.div
                      key={count}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex items-center justify-center z-10"
                    >
                      <span className="text-8xl sm:text-[180px] font-display font-bold text-white drop-shadow-[0_0_40px_rgba(0,0,0,0.6)]">
                        {count}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* White Flash Effect Overlay */}
                <AnimatePresence>
                  {flash && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute inset-0 bg-white z-20 pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 flex flex-col items-center justify-center gap-6 bg-gradient-to-t from-black via-black/80 to-transparent">
            {/* Color controls shown prominently on Mobile (bottom) when idle */}
            <div className="flex gap-4 md:hidden">
              {mode === 'idle' && STRIP_COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => setStripColor(c)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-10 h-10 rounded-full shadow-lg ring-2 ring-offset-4 ring-offset-neutral-950 transition-transform ${
                    stripColor.name === c.name ? 'ring-blue-500 scale-110' : 'ring-transparent opacity-80 hover:scale-105'
                  }`}
                />
              ))}
            </div>

            <div className="mx-auto transform-gpu pb-2 md:pb-0">
              {mode === 'idle' && stream && (
                <button
                  onClick={startSession}
                  className="h-16 sm:h-20 px-10 sm:px-14 rounded-full bg-white text-black font-display font-bold text-xl sm:text-2xl flex items-center gap-3 hover:bg-neutral-200 hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.4)] active:scale-95"
                >
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8" /> Mulai Foto
                </button>
              )}
              {mode === 'capturing' && (
                <div className="h-16 sm:h-20 px-8 sm:px-12 rounded-full bg-red-500/20 text-red-500 font-display font-bold text-xl sm:text-2xl flex items-center justify-center border border-red-500/50 backdrop-blur-md">
                  <span className="animate-pulse flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-500" /> Sesi Aktif...
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* 
        ========================================
        RIGHT COLUMN (DESKTOP) - STRIP PREVIEW
        ========================================
      */}
      <div className="hidden md:flex w-[380px] lg:w-[480px] bg-neutral-950 flex-col relative z-30 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-900/40 via-neutral-950 to-neutral-950 pointer-events-none" />
        
        <div className="relative h-full flex flex-col p-8 z-10 w-full overflow-y-auto">
          <div className="flex justify-between items-end mb-10 pt-2">
            <div>
              <h2 className="font-display font-bold text-2xl text-white">Pratinjau</h2>
              <p className="text-neutral-400 mt-1">Pilih warna bingkai Anda</p>
            </div>
            {/* Color Pickers for Desktop */}
            <div className="flex gap-2">
              {STRIP_COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => setStripColor(c)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-7 h-7 rounded-full transition-transform ring-2 ring-offset-2 ring-offset-neutral-950 ${
                    stripColor.name === c.name ? 'ring-blue-500 scale-110' : 'ring-transparent opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 flex justify-center py-4">
            <Strip isReviewing={false} />
          </div>
        </div>
      </div>

      {/* 
        ========================================
        REVIEW FULL-SCREEN MODAL
        ========================================
      */}
      <AnimatePresence>
        {mode === 'review' && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-50 bg-neutral-950/80 flex flex-col items-center justify-center py-6 sm:py-12 overflow-y-auto"
          >
             <div className="flex-1 min-h-0 flex items-center justify-center p-4 py-8">
               {/* 
                 Slightly scale up the strip for Review Mode, or keep it standard depending on screen size.
                 The `isReviewिंग` flag makes it visually prominent.
               */}
               <Strip isReviewing={true} />
            </div>
            <div className="flex shrink-0 w-full max-w-sm gap-4 mt-auto mb-6 px-6 relative z-10 flex-col sm:flex-row">
              <button
                onClick={() => { setMode('idle'); setPhotos([]); }}
                className="flex-1 py-4 sm:py-5 rounded-full bg-neutral-800/80 backdrop-blur-md border border-neutral-700 text-white font-medium flex items-center justify-center gap-2 hover:bg-neutral-700 transition active:scale-95"
              >
                <RefreshCcw className="w-5 h-5" /> Retake
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 py-4 sm:py-5 rounded-full bg-white text-black font-display font-bold text-lg flex items-center justify-center gap-2 hover:bg-neutral-200 transition shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95"
              >
                <Download className="w-5 h-5" /> Simpan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
