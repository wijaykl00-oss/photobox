/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCamera } from './hooks/useCamera';
import { downloadStrip } from './utils/canvas';
import hantuKameraImg from '@/item/Hantukamera.png';
import blobbyFrameImg from '@/item/The Blobby Frame.png';

const STRIP_COLORS = [
  { name: 'Dark', hex: '#18181b', text: '#ffffff' },
  { name: 'Light', hex: '#ffffff', text: '#18181b' },
  { name: 'Rose', hex: '#ffe4e6', text: '#881337' },
  { name: 'Ice', hex: '#e0f2fe', text: '#0c4a6e' },
  { name: 'Lavender', hex: '#f3e8ff', text: '#581c87' },
  { name: 'Mint Candy', hex: '#d3f9d8', text: '#2b8a3e' },
  { name: 'Lemon Chiffon', hex: '#fff3bf', text: '#d9480f' },
  { name: 'Peach Punch', hex: '#ffe3e3', text: '#c92a2a' },
  { name: 'Bubblegum', hex: 'linear-gradient(to bottom, #ffc9c9, #decbe4)', text: '#862e9c' },
  { name: 'Sunset Kiss', hex: 'linear-gradient(to bottom, #ffe3e3, #ffd8a8)', text: '#d9480f' },
  { name: 'Blobby Jelly', hex: 'linear-gradient(to bottom, #d7fdec, #ffebf0)', text: '#86198f', isBlobby: true }
];

const BACKGROUND_STICKERS = [
  { emoji: "🍒", className: "top-[16%] left-[10%] rotate-[-12deg] text-5xl sm:text-6xl" },
  { emoji: "☁️", className: "top-[42%] left-[4%] rotate-[10deg] text-6xl sm:text-7xl" },
  { emoji: "✨", className: "top-[26%] left-[18%] rotate-[15deg] text-4xl sm:text-5xl" },
  { emoji: "💖", className: "top-[64%] left-[14%] rotate-[-8deg] text-5xl sm:text-6xl" },
  { emoji: "👾", className: "top-[14%] right-[34%] rotate-[12deg] text-5xl sm:text-6xl" },
  { emoji: "✌️", className: "top-[34%] right-[38%] rotate-[-15deg] text-5xl sm:text-6xl" },
  { emoji: "🎨", className: "top-[58%] right-[35%] rotate-[8deg] text-4xl sm:text-5xl" },
];

const Sticker = ({ 
  emoji, 
  src, 
  className = "", 
  style = {} 
}: { 
  emoji?: string; 
  src?: string; 
  className?: string; 
  style?: React.CSSProperties; 
  key?: React.Key;
}) => {
  const floatDuration = useRef(3 + Math.random() * 3).current;
  const floatDelay = useRef(Math.random() * 2).current;

  return (
    <motion.div
      animate={{ 
        y: [0, -12, 0] 
      }}
      transition={{ 
        y: {
          repeat: Infinity, 
          duration: floatDuration, 
          delay: floatDelay,
          ease: "easeInOut" 
        }
      }}
      whileHover={{ 
        scale: 1.25, 
        rotate: [0, -12, 12, -8, 8, 0],
        transition: { duration: 0.45, ease: "easeInOut" }
      }}
      className={`absolute cursor-pointer select-none filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.15)] hover:drop-shadow-[0_12px_24px_rgba(6,182,212,0.45)] transition-all duration-300 pointer-events-auto z-10 ${className}`}
      style={style}
    >
      {src ? (
        <img src={src} alt="sticker" className="w-full h-full object-contain" />
      ) : (
        <span className="inline-block select-none">{emoji}</span>
      )}
    </motion.div>
  );
};

const HantuKameraDecor = () => {
  const [blink, setBlink] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      setBlink(true);
      await sleep(150);
      setBlink(false);
      
      setFlash(true);
      await sleep(250);
      setFlash(false);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      animate={{ 
        y: [0, -12, 0],
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 3.5, 
        ease: "easeInOut" 
      }}
      whileHover={{ 
        scale: 1.08,
        rotate: [0, -3, 3, 0]
      }}
      className="absolute bottom-[-40px] left-[-60px] w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] lg:w-[560px] lg:h-[560px] cursor-pointer z-30 select-none pointer-events-auto hidden md:block filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:drop-shadow-[0_25px_45px_rgba(139,92,246,0.45)] transition-all duration-300"
    >
      <img 
        src={hantuKameraImg} 
        alt="Hantu Kamera" 
        className={`w-full h-full object-contain transition-transform duration-150 ${
          blink ? 'scale-y-90' : 'scale-y-100'
        }`}
      />
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: [1, 1.4, 1] }}
            exit={{ opacity: 0, scale: 0.2 }}
            className="absolute top-[28%] left-[54%] -translate-x-1/2 -translate-y-1/2 z-35 pointer-events-none w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96"
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M50 0L64 36L100 50L64 64L50 100L36 64L0 50L36 36Z" fill="#ffeb3b" />
              <circle cx="50" cy="50" r="12" fill="#ffffff" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Cute Flower Component
const CuteFlower = ({ 
  size = 24, 
  color = "#ffb6c1", 
  centerColor = "#ffd700", 
  className = "" 
}: { 
  size?: number; 
  color?: string; 
  centerColor?: string; 
  className?: string; 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
  >
    <circle cx="50" cy="25" r="18" fill={color} />
    <circle cx="26" cy="42" r="18" fill={color} />
    <circle cx="35" cy="71" r="18" fill={color} />
    <circle cx="65" cy="71" r="18" fill={color} />
    <circle cx="74" cy="42" r="18" fill={color} />
    <circle cx="50" cy="50" r="15" fill={centerColor} />
  </svg>
);

// Cute Leaf Component
const CuteLeaf = ({ 
  size = 24, 
  color = "#a8e6cf", 
  className = "" 
}: { 
  size?: number; 
  color?: string; 
  className?: string; 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
  >
    <path 
      d="M50 80C50 80 80 55 80 30C80 15 65 15 50 30C35 15 20 15 20 30C20 55 50 80 50 80Z" 
      fill={color} 
    />
  </svg>
);

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, error, capture } = useCamera();
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [stripColor, setStripColor] = useState(STRIP_COLORS[0]);
  const [frameStyle, setFrameStyle] = useState<'classic' | 'blobby' | 'minimal'>('classic');
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
    downloadStrip(photos, stripColor.hex, stripColor.text, frameStyle);
  };

  // Dedicated component to render the photostrip UI cleanly
  const Strip = ({ isReviewing = false }: { isReviewing?: boolean }) => (
    <motion.div
      layout
      initial={isReviewing ? { opacity: 0, y: 50 } : false}
      animate={{ opacity: 1, y: 0 }}
      className={`shadow-2xl flex flex-col mx-auto relative overflow-hidden transition-all ${
        frameStyle === 'blobby'
          ? (isReviewing ? 'w-[340px] sm:w-[380px]' : 'w-[270px] sm:w-[290px]')
          : (isReviewing ? 'w-[300px] sm:w-[340px]' : 'w-[240px] sm:w-[260px]')
      }`}
      style={{ background: stripColor.hex }}
    >
      {/* Blobby Mascot hugging the frame if isBlobby theme is chosen (only if not using full blobby frame style) */}
      {frameStyle !== 'blobby' && stripColor.isBlobby && (
        <motion.img 
          src={blobbyFrameImg} 
          alt="Blobby Mascot" 
          animate={{ scale: [1, 1.03, 1], y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -bottom-5 -right-6 w-24 sm:w-28 z-20 pointer-events-none filter drop-shadow-md select-none"
        />
      )}

      {/* Decorative Flowers and Leaves (only in classic style) */}
      {frameStyle === 'classic' && (
        <>
          {/* Top-Left Flower & Leaf */}
          <div className="absolute top-2.5 left-2.5 flex items-center select-none pointer-events-none z-10">
            <CuteFlower size={isReviewing ? 28 : 22} color="#ffb6c1" centerColor="#ffd700" />
            <CuteLeaf size={isReviewing ? 18 : 14} color="#a8e6cf" className="rotate-45 -ml-1 -mt-2.5" />
          </div>

          {/* Top-Right Flower */}
          <div className="absolute top-3 right-3 select-none pointer-events-none z-10">
            <CuteFlower size={isReviewing ? 24 : 18} color="#fffdd0" centerColor="#ffb6c1" />
          </div>

          {/* Left Side Flower (between photo 2 and 3) */}
          <div className="absolute top-[48%] left-1.5 sm:left-2 -translate-y-1/2 select-none pointer-events-none z-10">
            <CuteFlower size={isReviewing ? 22 : 16} color="#b3cde3" centerColor="#ffffff" />
          </div>

          {/* Right Side Flower & Leaf (between photo 3 and 4) */}
          <div className="absolute top-[71%] right-2 sm:right-2.5 -translate-y-1/2 flex items-center select-none pointer-events-none z-10">
            <CuteLeaf size={isReviewing ? 16 : 12} color="#a8e6cf" className="-rotate-45 -mr-1" />
            <CuteFlower size={isReviewing ? 24 : 18} color="#decbe4" centerColor="#ffd700" />
          </div>
        </>
      )}

      <div className={`flex flex-col relative transition-all ${
        frameStyle === 'blobby'
          ? (isReviewing ? 'p-8 sm:p-10 gap-6 pb-32 pt-12' : 'p-7 gap-5 pb-26 pt-9')
          : (isReviewing ? 'p-6 gap-4 pb-24 pt-8' : 'p-5 gap-3 pb-20 pt-6')
      }`}>
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-full aspect-[4/3] relative ${
              frameStyle === 'blobby' ? 'p-2 sm:p-2.5 z-0' : 'bg-black/10 rounded overflow-hidden border border-black/5 z-0'
            }`}
          >
            {/* The photo, rounded at the corners underneath the Blobby Frame */}
            <div className="w-full h-full overflow-hidden rounded-[8px]">
              {photos[i] ? (
                <img src={photos[i]} alt={`Shot ${i+1}`} className="w-full h-full object-cover" />
              ) : (
                <div className={`absolute inset-0 flex items-center justify-center font-medium ${
                  frameStyle === 'blobby' ? 'text-neutral-400 bg-neutral-200/50' : 'text-black/20'
                }`}>
                  {i + 1}
                </div>
              )}
            </div>

            {/* Blobby Frame overlaying the photo box */}
            {frameStyle === 'blobby' && (
              <img 
                src={blobbyFrameImg} 
                alt="Blobby Frame" 
                className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-10 scale-[1.16] filter drop-shadow-sm" 
              />
            )}
          </div>
        ))}
        {/* Strip Branding */}
        <div
          className="w-full flex flex-col items-center justify-center mt-3 tracking-tight relative z-10"
          style={{ color: frameStyle === 'blobby' ? '#86198f' : stripColor.text }}
        >
          {/* Decorative flowers on branding (only in classic style) */}
          {frameStyle === 'classic' && (
            <>
              {/* Left branding flower */}
              <div className="absolute left-0 bottom-2 select-none pointer-events-none">
                <CuteFlower size={isReviewing ? 26 : 20} color="#ffb6c1" centerColor="#ffd700" />
              </div>

              {/* Right branding flower & leaf */}
              <div className="absolute right-0 bottom-2 select-none pointer-events-none flex items-center">
                <CuteLeaf size={isReviewing ? 18 : 14} color="#a8e6cf" className="rotate-90 -mr-1.5" />
                <CuteFlower size={isReviewing ? 22 : 16} color="#fffdd0" centerColor="#ffb6c1" />
              </div>
            </>
          )}

          <span className="font-playfair font-bold text-2xl sm:text-3xl pt-1 italic tracking-wide">Dapinoy</span>
          <span className="font-sans text-[10px] sm:text-xs opacity-60 tracking-wider mt-1 uppercase">
            {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen text-white font-sans flex text-sm sm:text-base relative overflow-hidden bg-slate-950">
      {/* Y2K Futuristic Cyber-Kawaii Background */}
      <div className="y2k-mesh-bg" />
      <div className="y2k-grid" />
      <div className="cyber-floor" />

      {/* Background Stickers Overlay - Floating above floor but below camera card */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-25">
        {BACKGROUND_STICKERS.map((s, idx) => (
          <Sticker key={idx} emoji={s.emoji} className={s.className} />
        ))}
        {/* Animated Blinking HantuKamera (3x larger!) */}
        <HantuKameraDecor />
        {/* Floating Blobby Mascot sticker */}
        <Sticker src={blobbyFrameImg} className="bottom-[14%] right-[33%] w-32 h-32 hidden xl:block rotate-[6deg]" />
      </div>

      {/* 
        ========================================
        LEFT COLUMN / MAIN VIEW (Camera & Controls)
        ========================================
      */}
      <div className="flex-1 flex flex-col relative h-screen z-20">
        {/* Top Header */}
        <header className="absolute top-0 inset-x-0 p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <div className="font-display font-bold text-xl sm:text-2xl flex items-center gap-2 drop-shadow-md text-white">
            <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" /> PHOTOBOX
          </div>

          {/* Progress Indicator for Desktop & Mobile */}
          {(mode === 'capturing' || photos.length > 0) && mode !== 'review' && (
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors drop-shadow-sm ${
                    photos.length > i 
                      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' 
                      : photos.length === i && mode === 'capturing' 
                      ? 'bg-red-500 animate-pulse' 
                      : 'bg-white/20'
                  }`} 
                />
              ))}
            </div>
          )}
        </header>

        {/* Camera Feed */}
        <main className="flex-1 relative border-b md:border-b-0 md:border-r border-slate-900 bg-transparent overflow-hidden">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-red-500 bg-slate-950/60 backdrop-blur-md">
              <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 max-w-md">
                {error}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pb-24 md:pb-0">
              {/* Aspect Ratio Constraint 4:3 with neon cyber border */}
              <div className="relative w-full max-w-3xl aspect-[4/3] bg-black sm:rounded-[2rem] overflow-hidden shadow-2xl shadow-cyan-500/10 border-[6px] border-cyan-400/80 md:m-12 lg:m-24 z-10 transition-all">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover -scale-x-100" 
                />
                
                {stream === null && mode !== 'review' && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium bg-slate-950/95">
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
          <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-20">
            {/* Color & Frame controls shown on Mobile (bottom) when idle */}
            {mode === 'idle' && (
              <div className="flex flex-col gap-3 w-full max-w-sm md:hidden pointer-events-auto">
                <div className="flex gap-1 bg-slate-900/80 p-1 rounded-full border border-slate-800 shadow-lg text-center">
                  <button
                    onClick={() => setFrameStyle('classic')}
                    className={`flex-1 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      frameStyle === 'classic' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow' : 'text-slate-400'
                    }`}
                  >
                    🌸 Classic
                  </button>
                  <button
                    onClick={() => setFrameStyle('blobby')}
                    className={`flex-1 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      frameStyle === 'blobby' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow' : 'text-slate-400'
                    }`}
                  >
                    🍮 Blobby
                  </button>
                  <button
                    onClick={() => setFrameStyle('minimal')}
                    className={`flex-1 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      frameStyle === 'minimal' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow' : 'text-slate-400'
                    }`}
                  >
                    ✨ Minimal
                  </button>
                </div>
                
                {/* Mobile color swatches (hidden in blobby frame style) */}
                {frameStyle !== 'blobby' && (
                  <div className="flex gap-2 overflow-x-auto max-w-full px-2 pb-1 justify-center">
                    {STRIP_COLORS.map(c => (
                      <button
                        key={c.name}
                        onClick={() => setStripColor(c)}
                        style={{ background: c.hex }}
                        className={`w-8 h-8 rounded-full shrink-0 shadow-md ring-2 ring-offset-2 ring-offset-slate-950 transition-transform ${
                          stripColor.name === c.name ? 'ring-cyan-400 scale-110' : 'ring-transparent opacity-85 hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mx-auto transform-gpu pb-2 md:pb-0 pointer-events-auto">
              {mode === 'idle' && stream && (
                <button
                  onClick={startSession}
                  className="h-16 sm:h-20 px-10 sm:px-14 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-display font-bold text-xl sm:text-2xl flex items-center gap-3 hover:from-cyan-600 hover:to-violet-600 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer shadow-lg"
                >
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8" /> Mulai Foto
                </button>
              )}
              {mode === 'capturing' && (
                <div className="h-16 sm:h-20 px-8 sm:px-12 rounded-full bg-red-500/10 text-red-400 font-display font-bold text-xl sm:text-2xl flex items-center justify-center border border-red-500/30 backdrop-blur-md shadow-sm">
                  <span className="animate-pulse flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" /> Sesi Aktif...
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
      <div className="hidden md:flex w-[380px] lg:w-[480px] bg-slate-950/70 backdrop-blur-2xl flex-col relative z-30 shadow-2xl border-l border-slate-900 text-white shadow-violet-500/5">
        <div className="relative h-full flex flex-col p-8 z-10 w-full overflow-y-auto">
          <div className="flex justify-between items-end mb-6 pt-2">
            <div>
              <h2 className="font-display font-bold text-2xl text-white">Pratinjau</h2>
              <p className="text-slate-400 mt-1">
                {frameStyle === 'blobby' ? 'Tipe Bingkai: Blobby Frame' : 'Pilih warna bingkai Anda'}
              </p>
            </div>
            {/* Color Pickers for Desktop */}
            {frameStyle !== 'blobby' && (
              <div className="flex flex-wrap gap-2 max-w-[180px] justify-end pointer-events-auto">
                {STRIP_COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setStripColor(c)}
                    style={{ background: c.hex }}
                    className={`w-6 h-6 rounded-full transition-transform ring-2 ring-offset-2 ring-offset-slate-950 cursor-pointer ${
                      stripColor.name === c.name ? 'ring-cyan-400 scale-110' : 'ring-transparent opacity-85 hover:opacity-100 hover:scale-105'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Frame Style Selector */}
          <div className="mb-8 pointer-events-auto">
            <h3 className="font-sans font-semibold text-xs text-slate-400 uppercase tracking-wider mb-2">Tipe Bingkai</h3>
            <div className="flex gap-1.5 bg-slate-900/60 p-1 rounded-full border border-slate-800 text-center">
              <button
                onClick={() => setFrameStyle('classic')}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  frameStyle === 'classic' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🌸 Classic
              </button>
              <button
                onClick={() => setFrameStyle('blobby')}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  frameStyle === 'blobby' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🍮 Blobby Frame
              </button>
              <button
                onClick={() => setFrameStyle('minimal')}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  frameStyle === 'minimal' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                ✨ Minimal
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center py-4 select-none">
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
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex flex-col items-center justify-center py-6 sm:py-12 overflow-y-auto text-white"
          >
             <div className="flex-1 min-h-0 flex items-center justify-center p-4 py-8 select-none">
               {/* 
                 Slightly scale up the strip for Review Mode, or keep it standard depending on screen size.
                 The `isReviewing` flag makes it visually prominent.
               */}
               <Strip isReviewing={true} />
            </div>
            <div className="flex shrink-0 w-full max-w-sm gap-4 mt-auto mb-6 px-6 relative z-10 flex-col sm:flex-row pointer-events-auto">
              <button
                onClick={() => { setMode('idle'); setPhotos([]); }}
                className="flex-1 py-4 sm:py-5 rounded-full bg-slate-900 border border-slate-800 text-white font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition active:scale-95 cursor-pointer shadow-md"
              >
                <RefreshCcw className="w-5 h-5 text-slate-400" /> Retake
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 py-4 sm:py-5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-display font-bold text-lg flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-violet-600 transition shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer"
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
