import React, { useState } from "react";
import { Event, Photobook, PhotobookStyle, PhotobookSize } from "../types";
import { BookOpen, Sparkles, Wand2, Download, Check, Image as ImageIcon, FileText, LayoutGrid } from "lucide-react";

interface PhotobookBuilderProps {
  event: Event;
  onAddPhotobook: (photobook: Photobook) => void;
}

const STYLES = [
  { id: PhotobookStyle.WEDDING_PREMIUM, name: "Royal Wedding Premium", desc: "Plush margins, full-page gold accents, serif editorial headings" },
  { id: PhotobookStyle.MAGAZINE, name: "Lagos Vogue Magazine", desc: "Zesty oversized typography, high fashion asymmetric canvas frames" },
  { id: PhotobookStyle.LUXURY, name: "Luxury Bronze", desc: "Deep rich chocolate shades, glowing highlights, amber trims" },
  { id: PhotobookStyle.MINIMALIST, name: "Studio Minimalist", desc: "Generous pristine negative margins, clean modern sans typography" },
  { id: PhotobookStyle.CLASSIC, name: "Classic Legacy", desc: "Warm cozy textures, timeline photo grids, standard serif headers" },
  { id: PhotobookStyle.STORYTELLING, name: "Sunset Narrative", desc: "Vibrant Nigerian sunset color tamps, continuous memoir story panels" },
];

export function PhotobookBuilder({ event, onAddPhotobook }: PhotobookBuilderProps) {
  const [selectedStyle, setSelectedStyle] = useState<PhotobookStyle>(PhotobookStyle.WEDDING_PREMIUM);
  const [selectedSize, setSelectedSize] = useState<PhotobookSize>(PhotobookSize.A3);
  const [useAICuration, setUseAICuration] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeBook, setActiveBook] = useState<Photobook | null>(event.photobooks[0] || null);

  const handleBuildBook = () => {
    setIsProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            const newBook: Photobook = {
              id: `book-${Date.now()}`,
              eventId: event.id,
              title: `${event.name} Official Memoir`,
              style: selectedStyle,
              size: selectedSize,
              status: "DONE",
              downloadUrl: "#pdf-download",
              createdAt: new Date().toISOString()
            };
            onAddPhotobook(newBook);
            setActiveBook(newBook);
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 180);
  };

  return (
    <div className="space-y-8" id="photobook-builder">
      <div className="bg-gradient-to-r from-violet-950 via-pink-900/10 to-slate-900 border border-violet-800/20 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="h-4 w-4 text-pink-400" />
              ✦ CT VIEW COLLABORATIVE PHOTOBOOKS
            </div>
            <h2 className="text-2xl font-serif text-white font-medium">Automatic Luxury Print-Ready Photobooks</h2>
            <p className="text-violet-200 text-sm max-w-xl">
              Render pristine, high-fidelity album files in PDF, PPTX presentation panels, and PNG sequence formats. Perfect formatting automatically.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Specification form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <label className="text-white font-medium text-xs uppercase tracking-wider block">
              1. Choose Editorial Layout Style
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-[290px] overflow-y-auto pr-2">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    selectedStyle === style.id
                      ? "bg-gradient-to-r from-violet-900/60 to-pink-900/40 border-pink-500 text-white"
                      : "bg-slate-900/60 border-slate-850 hover:border-violet-850 text-violet-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-xs flex items-center gap-1">
                      {style.name}
                      {style.id === PhotobookStyle.WEDDING_PREMIUM && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono px-1 rounded">POPULAR</span>
                      )}
                    </div>
                    <div className="text-[10px] opacity-75 max-w-[280px] leading-relaxed">{style.desc}</div>
                  </div>
                  {selectedStyle === style.id && <Check className="h-4 w-4 text-pink-500" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-white font-medium text-xs uppercase tracking-wider block">
              2. Dimensions & Print Format
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as PhotobookSize)}
              className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-white text-xs font-semibold focus:border-rose-500 focus:outline-none cursor-pointer"
            >
              {Object.values(PhotobookSize).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">AI Face-Curation Filtering</div>
              <div className="text-[10px] text-violet-300">Exclude duplicates or low-quality/blurry shots automatically</div>
            </div>
            <button
              onClick={() => setUseAICuration(!useAICuration)}
              className={`w-12 h-6.5 rounded-full p-0.5 transition ${
                useAICuration ? "bg-rose-600" : "bg-slate-800"
              }`}
            >
              <div className={`h-5.5 w-5.5 rounded-full bg-white transition-all transform ${
                useAICuration ? "translate-x-5.5" : "translate-x-0"
              }`}></div>
            </button>
          </div>

          <button
            onClick={handleBuildBook}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition ${
              isProcessing
                ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 via-pink-600 to-rose-500 hover:from-violet-500 hover:via-pink-500 hover:to-rose-400 text-white"
            }`}
          >
            {isProcessing ? (
              <>
                <Wand2 className="h-4 w-4 animate-spin text-pink-400" />
                Auto-formatting pages ({progress}%)
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                Assemble PDF Album Portfolio
              </>
            )}
          </button>
        </div>

        {/* Right Preview panels representing pages */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-semibold text-violet-400 uppercase font-sans tracking-wide">
            Interactive Spreads Preview ({selectedSize})
          </div>

          {isProcessing ? (
            <div className="aspect-[4/3] rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center gap-4 animate-pulse">
              <BookOpen className="h-10 w-10 text-pink-500 animate-spin" />
              <div className="text-center space-y-1">
                <div className="text-white text-sm font-medium font-serif">Aesthetic layout grids syncing...</div>
                <div className="text-violet-400 text-[10px] font-mono">balancing margins • centering cover text • compiling {event.photos.length} elements</div>
              </div>
            </div>
          ) : activeBook ? (
            <div className="space-y-4">
              {/* Photobook page emulation display */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 aspect-[4/3] text-stone-900 flex flex-col justify-between border border-stone-200">
                {/* Book Header block */}
                <div className="text-center space-y-1">
                  <div className="text-[10px] uppercase font-mono tracking-widest text-stone-500">
                    MEMORIES PORTFOLIO SERIES
                  </div>
                  <h1 className="font-serif font-semibold text-xl tracking-tight text-stone-900 uppercase">
                    {event.name}
                  </h1>
                </div>

                {/* Cover Spread layout content */}
                <div className="grid grid-cols-3 gap-3 my-6 flex-1 items-center">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-stone-250 shadow-sm relative">
                    <img
                      src={event.photos[0]?.thumbnailUrl || "https://picsum.photos/seed/pbe1/300/400"}
                      alt="Photobook p1"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 left-1.5 font-mono text-[8px] text-white bg-black/60 px-1 rounded">Page 1</div>
                  </div>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-stone-250 shadow-md relative scale-110 z-10 border-amber-600 border-2">
                    <img
                      src={event.photos[3]?.thumbnailUrl || "https://picsum.photos/seed/pbe2/300/400"}
                      alt="Photobook p2"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 left-1.5 font-mono text-[8px] text-white bg-black/60 px-1 rounded">Center Spread</div>
                  </div>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-stone-250 shadow-sm relative">
                    <img
                      src={event.photos[4]?.thumbnailUrl || "https://picsum.photos/seed/pbe3/300/400"}
                      alt="Photobook p3"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 left-1.5 font-mono text-[8px] text-white bg-black/60 px-1 rounded">Page 3</div>
                  </div>
                </div>

                {/* Footer block */}
                <div className="flex items-center justify-between border-t border-stone-200 pt-3 text-[10px] text-stone-500 font-mono">
                  <span>CT VIEW © {new Date().getFullYear()}</span>
                  <span>Premium {selectedStyle} Album</span>
                  <span>Page 1 of 24</span>
                </div>
              </div>

              {/* Downloads tray */}
              <div className="flex flex-col sm:flex-row gap-2.5 animate-fade-in">
                <button
                  onClick={() => alert("🎉 Premium PDF exported with full luxury CMYK colors and layout print margins success!")}
                  className="flex-1 py-3 bg-slate-900 border border-slate-800 text-white font-medium hover:bg-slate-800 hover:text-white rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow"
                >
                  <Download className="h-4 w-4 text-rose-500" />
                  Download Print PDF (Aspirant vector fonts)
                </button>
                <button
                  onClick={() => alert("🎉 PPTX Presentation template generated with editable frames!")}
                  className="px-4 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-violet-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <FileText className="h-4 w-4" />
                  Presentation PPTX
                </button>
              </div>
            </div>
          ) : (
            <div className="aspect-[4/3] rounded-2xl bg-slate-900/40 border border-dashed border-slate-850 flex flex-col items-center justify-center text-violet-400 text-center p-6 gap-2">
              <LayoutGrid className="h-10 w-10 text-violet-500 mb-2 animate-pulse" />
              <div className="text-xs font-semibold text-slate-300">Design preview pending</div>
              <div className="text-[10px] text-slate-400 max-w-xs">Confirm your parameters left and assemble your layout to inspect the visual spread formats.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
