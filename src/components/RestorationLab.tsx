import React, { useState, useRef, useEffect } from "react";
import { Photo, Event } from "../types";
import { Wand2, Image as ImageIcon, Sparkles, RefreshCw, Check, ArrowRight, Download, Save } from "lucide-react";

interface RestorationLabProps {
  event: Event;
  onAddRestoredPhoto: (photo: Photo) => void;
}

const MODES = [
  { id: "deblur", name: "Deblur & Sharpen", desc: "Correct camera shake, focus issues, and motion blur", icon: Sparkles },
  { id: "denoise", name: "Denoise & Enhance", desc: "Remove digital artifact grain and compression pixellation", icon: Sparkles },
  { id: "upscale", name: "AI 4× Upscale", desc: "Upsample old or low-resolution images to crystal clarity", icon: Sparkles },
  { id: "colorize", name: "Colorize B&W", desc: "Turn vintage black-and-white family portraits into life", icon: Sparkles },
  { id: "full", name: "Full Restoration", desc: "Complete repair of tears, water stains, fading, and blur", icon: Wand2 },
];

export function RestorationLab({ event, onAddRestoredPhoto }: RestorationLabProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(event.photos[2] || event.photos[0] || null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<string>("full");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [restoredUrl, setRestoredUrl] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getSourceImage = () => {
    if (customImage) return customImage;
    if (selectedPhoto) return selectedPhoto.url;
    return "https://picsum.photos/seed/vintage/800/800";
  };

  // Generate a customized "restored" URL based on activeMode and source seed
  const generateRestoredImage = (sourceUrl: string, mode: string) => {
    // We append specific picsum search queries or filters to represent high quality
    if (mode === "colorize") {
      return sourceUrl + "?colorized=true&contrast=high";
    } else if (mode === "deblur") {
      return sourceUrl + "?sharpen=true";
    } else if (mode === "upscale") {
      return sourceUrl + "?resolution=4k";
    }
    return sourceUrl + "?restored=true&vibrancy=high";
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
          setSelectedPhoto(null);
          setRestoredUrl(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRestore = () => {
    setIsProcessing(true);
    setProgress(0);
    setRestoredUrl(null);

    // Simulate progress counting up
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setRestoredUrl(generateRestoredImage(getSourceImage(), activeMode));
          }, 400);
          return 100;
        }
        return prev + 12;
      });
    }, 200);
  };

  const handleSaveToGallery = () => {
    if (!restoredUrl) return;
    const newPhoto: Photo = {
      id: `restored-${Date.now()}`,
      eventId: event.id,
      guestName: "AI Restore Lab",
      url: restoredUrl,
      thumbnailUrl: restoredUrl,
      originalUrl: getSourceImage(),
      likes: 1,
      comments: [
        {
          id: `comment-${Date.now()}`,
          photoId: `restored-${Date.now()}`,
          author: "CT VIEW AI",
          body: `✨ Restored using the [${MODES.find(m => m.id === activeMode)?.name}] model. Beautiful preservation!`,
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      isRestored: true,
      restorationMode: MODES.find((m) => m.id === activeMode)?.name
    };
    onAddRestoredPhoto(newPhoto);
    alert("🎉 Restored photo pushed directly into the event gallery!");
  };

  // Slider Mouse Drag Events
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Left click held down
      handleSliderMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleSliderClick = (e: React.MouseEvent) => {
    handleSliderMove(e.clientX);
  };

  return (
    <div className="space-y-8" id="restoration-lab">
      <div className="bg-gradient-to-r from-violet-900/40 via-pink-900/30 to-slate-900 border border-violet-800/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
            ✦ CT VIEW AI RESTORE LAB
          </div>
          <h2 className="text-2xl font-serif text-white font-medium">Give your memories a second life</h2>
          <p className="text-violet-200 text-sm max-w-xl">
            Bring vintage, blurry, watercolor, or damaged family pictures back to outstanding high-resolution quality. Drag to compare our composite neural model instantly.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-violet-950/80 hover:bg-violet-900 text-violet-100 hover:text-white border border-violet-800/50 rounded-xl text-sm font-medium transition cursor-pointer"
          >
            Upload From Phone
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left pane: Options & Picker */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-3">
            <label className="text-white font-medium text-xs uppercase tracking-wider block font-sans">
              1. Choose Photo source
            </label>
            <div className="grid grid-cols-4 gap-2">
              {event.photos.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPhoto(p);
                    setCustomImage(null);
                    setRestoredUrl(null);
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                    selectedPhoto?.id === p.id && !customImage
                      ? "border-rose-500 scale-95 shadow-md shadow-rose-500/20"
                      : "border-transparent hover:border-violet-600"
                  }`}
                >
                  <img src={p.thumbnailUrl} alt="Source option" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {selectedPhoto?.id === p.id && !customImage && (
                    <div className="absolute inset-0 bg-rose-500/10 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {customImage && (
              <div className="flex items-center gap-3 bg-violet-950/30 p-2.5 rounded-xl border border-violet-800/30">
                <ImageIcon className="h-5 w-5 text-pink-400 shrink-0" />
                <span className="text-xs text-white truncate max-w-[150px]">Custom uploaded source</span>
                <button 
                  onClick={() => {
                    setCustomImage(null);
                    setSelectedPhoto(event.photos[0] || null);
                    setRestoredUrl(null);
                  }}
                  className="ml-auto text-xs text-rose-400 hover:underline cursor-pointer"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-white font-medium text-xs uppercase tracking-wider block font-sans">
              2. Select Restoration Mode
            </label>
            <div className="space-y-2">
              {MODES.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setActiveMode(mode.id);
                      setRestoredUrl(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3.5 cursor-pointer ${
                      activeMode === mode.id
                        ? "bg-gradient-to-r from-violet-900/60 to-pink-900/40 border-pink-500 text-white"
                        : "bg-slate-900/60 border-slate-800 hover:border-violet-800 text-violet-200"
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      activeMode === mode.id ? "bg-rose-500/20 text-rose-400" : "bg-slate-800 text-violet-400"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">{mode.name}</div>
                      <div className="text-xs opacity-80 leading-relaxed">{mode.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleRestore}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition active:scale-95 ${
              isProcessing
                ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 via-pink-600 to-rose-500 hover:from-violet-500 hover:via-pink-500 hover:to-rose-400 text-white shadow-rose-950/20"
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-rose-400" />
                Restoring with AI ({progress}%)
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 text-amber-300" />
                Improve & Heal Memory Now
              </>
            )}
          </button>
        </div>

        {/* Right pane: Interactive before/after slider comparison */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div className="text-xs text-violet-300 font-mono flex items-center justify-between px-1">
            <span>Original (Before)</span>
            <span>Restored AI output (After)</span>
          </div>

          <div 
            ref={sliderRef}
            onClick={handleSliderClick}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-violet-800/20 shadow-2xl select-none cursor-ew-resize group"
          >
            {/* Background Left: Original Image (grayscale/faint if doing colorize, blurry etc) */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src={getSourceImage()} 
                alt="Before" 
                className={`w-full h-full object-cover select-none ${
                  activeMode === "colorize" ? "grayscale contrast-95" : ""
                } ${
                  activeMode === "deblur" || activeMode === "full" ? "blur-[2.5px]" : ""
                } ${
                  activeMode === "denoise" ? "brightness-105 contrast-110 saturate-50" : ""
                }`} 
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 text-white font-mono text-[10px] px-2 py-1 rounded-md tracking-wider">
                BEFORE
              </div>
            </div>

            {/* Foreground Right: Beautifully restored output */}
            <div 
              className="absolute inset-y-0 right-0 overflow-hidden"
              style={{ left: `${sliderPosition}%` }}
            >
              <div 
                className="absolute inset-y-0 right-0 w-full h-full"
                style={{ width: sliderRef.current ? `${sliderRef.current.getBoundingClientRect().width}px` : "100%" }}
              >
                <img 
                  src={restoredUrl || getSourceImage()} 
                  alt="After" 
                  className="absolute inset-0 w-full h-full object-cover select-none brightness-105 saturate-105 contrast-105" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 right-4 bg-rose-600/90 text-white font-mono text-[10px] px-2 py-1 rounded-md tracking-wider flex items-center gap-1.5 shadow-md">
                  <Sparkles className="h-3 w-3 text-amber-200" />
                  AFTER RESTORATION
                </div>
              </div>
            </div>

            {/* Splitter Line handle */}
            <div 
              className="absolute inset-y-0 w-1 bg-gradient-to-b from-violet-400 via-rose-500 to-pink-400 cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="h-8 w-8 rounded-full bg-white text-slate-900 border-2 border-rose-500 flex items-center justify-center shadow-lg transform -translate-x-[47%]">
                <div className="flex gap-0.5 text-rose-500 font-bold text-xs select-none">
                  <span>‹</span><span>›</span>
                </div>
              </div>
            </div>

            {/* Loader overlay during crunching */}
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-fade-in">
                <RefreshCw className="h-10 w-10 text-rose-500 animate-spin" />
                <div className="text-center space-y-1">
                  <div className="text-white text-base font-medium">Reconstruction Pipeline Running...</div>
                  <div className="text-violet-300 text-xs font-mono">{progress}% complete • optimizing pixel matrices</div>
                </div>
                <div className="w-48 bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            {/* Inactive state help badge overlay */}
            {!restoredUrl && !isProcessing && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] pointer-events-none flex items-center justify-center">
                <div className="bg-slate-900/90 border border-violet-800/40 px-4 py-2.5 rounded-xl text-xs text-violet-200 flex items-center gap-2 shadow-lg max-w-[280px] text-center leading-relaxed">
                  <Wand2 className="h-4 w-4 text-pink-400 shrink-0" />
                  Select settings left & tap "Heal Memory" to inspect comparison.
                </div>
              </div>
            )}
          </div>

          {/* Action buttons under viewport */}
          {restoredUrl && (
            <div className="flex gap-3 mt-2 animate-fade-in-up">
              <button
                onClick={handleSaveToGallery}
                className="flex-1 py-3 bg-gradient-to-r from-violet-700 to-pink-600 hover:from-violet-600 hover:to-pink-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-pink-950/20 active:scale-95 transition"
              >
                <Save className="h-4 w-4" />
                Push to Active Event Gallery
              </button>
              <a
                href={restoredUrl}
                download="healed-memory-ctview.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-violet-200 border border-slate-800 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <Download className="h-4 w-4" />
                Download Original
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
