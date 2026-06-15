import React, { useState, useRef, useEffect } from "react";
import { INITIAL_EVENTS, ROYALTY_FREE_TRACKS } from "./data";
import { Event, Photo, Video, HighlightVideo, Photobook, EventType } from "./types";
import { RestorationLab } from "./components/RestorationLab";
import { HighlightStudio } from "./components/HighlightStudio";
import { PhotobookBuilder } from "./components/PhotobookBuilder";
import { 
  Camera, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Trash2, 
  BookOpen, 
  Film, 
  User, 
  LogOut, 
  Layout, 
  Upload, 
  Check, 
  Award, 
  Share2, 
  Search, 
  Eye, 
  FolderLock, 
  DollarSign, 
  Copy, 
  Database,
  Calendar,
  Layers,
  Sparkle,
  Smile,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  Wand2
} from "lucide-react";

export default function App() {
  // Application routing / view state
  const [currentView, setCurrentView] = useState<"home" | "guest" | "dashboard">("home");
  const [dashboardTab, setDashboardTab] = useState<"overview" | "gallery" | "search" | "restore" | "highlights" | "photobooks" | "storage">("overview");
  
  // Real active event we are viewing/updating
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [activeEventId, setActiveEventId] = useState<string>("event-1");
  const activeEvent = events.find((e) => e.id === activeEventId) || events[0];

  // Guest upload state
  const [guestName, setGuestName] = useState("");
  const [guestPhotos, setGuestPhotos] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [guestPhotoCount, setGuestPhotoCount] = useState(0);

  // Face Recognition Find-My-Photos state (Section 21)
  const [showFaceConsent, setShowFaceConsent] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [matchedPhotoIds, setMatchedPhotoIds] = useState<string[]>([]);
  const [scannedFeedback, setScannedFeedback] = useState("");

  // Kuda Bank Confetti Trigger State
  const [showConfetti, setShowConfetti] = useState(false);

  // Dynamic AI Wedding/Event Story memoir generator (REAL GEMINI CALL)
  const [aiStory, setAiStory] = useState<string>("");
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyHighlights, setStoryHighlights] = useState("Aso-ebi dancers spraying money, Groom smiling when bride took traditional cup, amazing laughter during the cake ceremony");

  const selfieInputRef = useRef<HTMLInputElement>(null);

  // Helper to add a photograph to the active event gallery
  const handleAddNewPhoto = (newPhoto: Photo) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === activeEvent.id) {
          return {
            ...e,
            photos: [newPhoto, ...e.photos],
            storageUsed: parseFloat((e.storageUsed + 1.8).toFixed(1))
          };
        }
        return e;
      })
    );
  };

  // Helper to append video highlight tape (Section 20)
  const handleAddHighlight = (highlight: HighlightVideo) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === activeEvent.id) {
          return {
            ...e,
            highlights: [highlight, ...e.highlights]
          };
        }
        return e;
      })
    );
  };

  // Helper to append custom Photobook layout
  const handleAddPhotobook = (book: Photobook) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === activeEvent.id) {
          return {
            ...e,
            photobooks: [book, ...e.photobooks]
          };
        }
        return e;
      })
    );
  };

  // Trigger copy on Kuda Bank and fire dynamic visual confetti effect
  const handleCopyAccount = () => {
    navigator.clipboard.writeText("2008898971");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2400);
  };

  // Real Gemini call to generate event stories
  const handleGenerateAIStory = async () => {
    setIsGeneratingStory(true);
    setAiStory("");
    try {
      const response = await fetch("/api/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: activeEvent.name,
          eventType: activeEvent.type,
          date: activeEvent.date,
          photosCount: activeEvent.photos.length,
          guestsCount: activeEvent.photos.length * 3 / 2, // arbitrary
          style: "Subset Narrative style",
          highlights: storyHighlights
        })
      });
      const data = await response.json();
      if (data.error) {
        setAiStory(`[Configuration Notice] ${data.error}`);
      } else {
        setAiStory(data.story);
      }
    } catch (err: any) {
      setAiStory("The server-side Google GenAI story pipeline returned an error. Verify that GEMINI_API_KEY is active in the Secrets tab.");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // Handle Drag-and-Drop and Manual uploads in Guest view
  const handleGuestPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      const remainingLimit = 50 - guestPhotoCount;
      if (filesArr.length > remainingLimit) {
        alert(`⚠️ You exceeded the guest session upload threshold! You can only add ${remainingLimit} more files.`);
        return;
      }
      
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate network upload bandwidth chunking (Lagos Optimizations!)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsUploading(false);
              setUploadProgress(0);
              // Push simulated photos to the event list
              filesArr.forEach((file, index) => {
                const objectUrl = URL.createObjectURL(file as any);
                const customPhoto: Photo = {
                  id: `guest-p-${Date.now()}-${index}`,
                  eventId: activeEvent.id,
                  guestName: guestName.trim() || "Joyous Guest",
                  url: objectUrl,
                  thumbnailUrl: objectUrl,
                  likes: 0,
                  comments: [],
                  createdAt: new Date().toISOString()
                };
                handleAddNewPhoto(customPhoto);
              });
              setGuestPhotoCount((prevCnt) => prevCnt + filesArr.length);
            }, 300);
            return 100;
          }
          return prev + 15;
        });
      }, 150);
    }
  };

  // Face Matching Algorithm simulation (Section 21.2)
  const handleFaceSearch = () => {
    if (!selfieImage) {
      alert("Please capture or select a portrait selfie first!");
      return;
    }
    setIsFaceScanning(true);
    setScannedFeedback("Aligning biometric mesh coords...");
    
    setTimeout(() => {
      setScannedFeedback("Running cluster matrices against database...");
      setTimeout(() => {
        // Mock face indices matches
        const matches = ["p-1", "p-3", "p-5", "p-8", "p-10"];
        setMatchedPhotoIds(matches);
        setIsFaceScanning(false);
        setScannedFeedback("");
      }, 1200);
    }, 1000);
  };

  // Capture portrait file to base64
  const handleSelfieFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelfieImage(event.target.result as string);
          setMatchedPhotoIds([]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col font-sans">
      
      {/* ───────────────── ROOT APPLICATION HEADER ───────────────── */}
      <header className="sticky top-0 z-50 bg-[#0A0D14]/90 backdrop-blur-md border-b border-violet-950/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Logo element representing aperture dynamic */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-violet-600 via-pink-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-violet-950/60 animate-spin-slow">
            <div className="h-full w-full rounded-full bg-[#0A0D14] flex items-center justify-center">
              <Camera className="h-4.5 w-4.5 text-pink-400" />
            </div>
          </div>
          <div>
            <span className="font-serif font-bold text-lg tracking-wider text-white">CT VIEW</span>
            <span className="hidden sm:inline font-mono text-[10px] text-amber-500 font-semibold tracking-widest uppercase ml-3">
              ✦ SHOTS BECOME A TALE
            </span>
          </div>
        </div>

        {/* Global Route Selector Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-full border border-violet-950/40">
          <button
            onClick={() => setCurrentView("home")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
              currentView === "home" ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md shadow-violet-900/35" : "text-slate-400 hover:text-white"
            }`}
          >
            Landing
          </button>
          <button
            onClick={() => setCurrentView("guest")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
              currentView === "guest" ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md shadow-violet-900/35" : "text-slate-400 hover:text-white"
            }`}
          >
            Guest Portal
          </button>
          <button
            onClick={() => setCurrentView("dashboard")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition flex items-center gap-1 ${
              currentView === "dashboard" ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md shadow-violet-900/35" : "text-slate-400 hover:text-white"
            }`}
          >
            Owner Dashboard
          </button>
        </nav>
      </header>

      {/* Confetti celebration alert bar for Kuda bank support copies */}
      {showConfetti && (
        <div className="bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white py-2 text-center text-xs font-bold font-mono uppercase tracking-wider animate-bounce sticky top-[69px] z-40 shadow-lg">
          🎉 CONFETTI POP! Kuda Bank Account Copied to clipboard! Thank you for backing CT VIEW ❤️
        </div>
      )}

      {/* ───────────────── ROUTE VIEWPORT RENDERING ───────────────── */}
      <main className="flex-1">
        
        {/* VIEW 1: LANDING MARKETING SCREEN (Section 4) */}
        {currentView === "home" && (
          <div className="space-y-20 animate-fade-in">
            {/* HER0 BLOCK with subtle overlay grids */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-cover bg-center py-20 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/60 via-slate-950 to-[#0A0D14]">
              <div className="absolute inset-0 z-0 opacity-15 overflow-hidden">
                <div className="grid grid-cols-5 gap-3 p-4 select-none transform rotate-12 scale-110">
                  {activeEvent.photos.map((p) => (
                    <img key={p.id} src={p.thumbnailUrl} alt="Background tiles" className="rounded-xl aspect-square object-cover" referrerPolicy="no-referrer" />
                  ))}
                </div>
              </div>

              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-flex items-center gap-1.5 bg-violet-900/30 border border-violet-700/40 px-3.5 py-1.5 rounded-full text-xs text-rose-400 font-mono tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                  ✦ AFRICA'S CHIEF EVENT MEMORY COMPILER
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-tight">
                    Shots Become <br className="sm:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-500 to-amber-400 font-bold">
                      A Majestic Tale
                    </span>
                  </h1>
                  <p className="text-violet-200 text-lg md:text-xl max-w-2xl mx-auto font-sans leading-relaxed">
                    Collaborative high-resolution event photo sharing meets automatic luxury photobooks, interactive AI-restoration labs, and face match. No app downloads required.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => setCurrentView("dashboard")}
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 via-pink-600 to-rose-500 text-white font-semibold shadow-lg shadow-pink-900/30 hover:shadow-pink-900/50 hover:scale-105 active:scale-95 transition cursor-pointer text-sm"
                  >
                    Enter Owner Command Center
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView("guest");
                    }}
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold border border-violet-800/20 shadow hover:scale-105 active:scale-95 transition cursor-pointer text-sm"
                  >
                    Scan & Upload as Guest
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 max-w-xl mx-auto border-t border-violet-950/40 text-left text-xs font-mono text-violet-300">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Works on all Mobile Browsers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Lagos Low-Bandwidth Sync</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>AI Restore & Face Search</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Social Trust Block */}
            <section className="max-w-6xl mx-auto px-6">
              <div className="bg-slate-950/60 border border-violet-950/40 p-8 rounded-2xl text-center space-y-4">
                <div className="text-violet-300 font-sans tracking-wide text-xs uppercase font-semibold">
                  Trusted by Event Organisers across Nigeria, Kenya and the UK
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-violet-950/40">
                  <div className="pt-4 md:pt-0">
                    <div className="text-3xl font-serif font-black text-rose-400">10,000+</div>
                    <div className="text-xs text-violet-200 mt-1 uppercase font-mono">Traditional Weddings & Owambes</div>
                  </div>
                  <div className="pt-6 md:pt-0">
                    <div className="text-3xl font-serif font-black text-amber-500">500,000+</div>
                    <div className="text-xs text-violet-200 mt-1 uppercase font-mono">Vibrant Photos Contributed</div>
                  </div>
                  <div className="pt-6 md:pt-0">
                    <div className="text-3xl font-serif font-black text-violet-400">★ 4.96</div>
                    <div className="text-xs text-violet-200 mt-1 uppercase font-mono font-sans">Lagos Event Planner Rating</div>
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS SEC (Section 4.4) */}
            <section className="max-w-6xl mx-auto px-6 space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">HOW WE PRESERVED MEMORIES</span>
                <h2 className="text-3xl md:text-4xl font-serif text-white">Three steps to your custom gallery</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800/80 space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-violet-900/40 flex items-center justify-center text-violet-400 font-mono font-bold">01</div>
                  <h3 className="text-lg font-serif text-white font-medium">Create and Print QR Map</h3>
                  <p className="text-violet-200 text-xs leading-relaxed">
                    Set up your traditional owambe or corporate show with customizable templates. Print our majestic golden QR frames to place at guest banquet tables.
                  </p>
                </div>
                <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800/80 space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-pink-905/40 flex items-center justify-center text-pink-400 font-mono font-bold">02</div>
                  <h3 className="text-lg font-serif text-white font-medium">No-App Guest Contribution</h3>
                  <p className="text-violet-200 text-xs leading-relaxed">
                    Guests scan the printed code with their iOS or Android camera. They instant-upload up to 50 photos or video clips directly as they dance or toast.
                  </p>
                </div>
                <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800/80 space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-900/40 flex items-center justify-center text-amber-400 font-mono font-bold">03</div>
                  <h3 className="text-lg font-serif text-white font-medium">AI Restores & Assembles</h3>
                  <p className="text-violet-200 text-xs leading-relaxed">
                    The owner uses neural tools to upscale low-res phone captures, deblur dances, run biometric search to find specific faces, and generate beautiful photobooks.
                  </p>
                </div>
              </div>
            </section>

            {/* PRODUCT HIGHLIGHT SHOWCASE SIDES (Section 4.5) */}
            <section className="bg-slate-950/30 border-y border-violet-950/30 py-20">
              <div className="max-w-6xl mx-auto px-6 space-y-24">
                
                {/* Block 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <span className="text-xs font-mono font-bold text-pink-500 uppercase">GUEST UPLOAD TERMINAL</span>
                    <h3 className="text-3xl font-serif text-white font-medium">Extreme low-bandwidth compression. No app required.</h3>
                    <p className="text-violet-200 text-xs leading-relaxed">
                      Lagos' network coverage can drift during massive event parties. CT VIEW embeds a resilient client-side IndexedDB caching queue. If internet access halts, photos queue up and resume synchronously when connection strengthens. Supports raw HEIC and ultra-high compression automatically.
                    </p>
                    <button 
                      onClick={() => setCurrentView("guest")}
                      className="px-5 py-2.5 bg-violet-950/85 hover:bg-violet-900 border border-violet-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Try Guest View Now
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-violet-600/10 via-pink-600/10 to-slate-900 p-3 rounded-2xl border border-violet-950/50">
                    <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-900 p-4">
                      {/* Simulated upload process layout */}
                      <div className="space-y-3 font-mono text-[10px] text-violet-300">
                        <div>[SYSTEM LOG] Resilient payload sync active on 4G network...</div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>File "傳統婚禮_obi.heic" converted locally to JPEG (4.8MB → 850KB)</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-full" style={{ width: "75%" }}></div>
                        </div>
                        <div className="text-right text-rose-400">75% • uploading chunk 3/4</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Block 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
                  <div className="space-y-6 lg:col-start-2">
                    <span className="text-xs font-mono font-bold text-amber-500 uppercase">BIOMETRIC RECOGNITION</span>
                    <h3 className="text-3xl font-serif text-white font-medium">Find my photos ("CT VIEW FIND")</h3>
                    <p className="text-violet-200 text-xs leading-relaxed">
                      Are you a bridesmaid or guest trying to dig through 1,500 photos to find your spots? Simply snap a portrait selfie on the search portal. Our advanced 128-dimensional mathematical comparison vector matches facial features to recall all pictures of you in seconds. GDPR and Nigeria Data Protection Act (NDPA) privacy-first design ensures biometric structures delete instantly on query termination.
                    </p>
                    <button 
                      onClick={() => {
                        setCurrentView("dashboard");
                        setDashboardTab("search");
                      }}
                      className="px-5 py-2.5 bg-violet-950/85 hover:bg-violet-900 border border-violet-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Test Portal Search
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-[#0D0F1A] p-2.5 rounded-2xl border border-violet-950/50 lg:col-start-1 lg:row-start-1">
                    <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-900 flex items-center justify-center p-6 text-center">
                      <div className="space-y-2 max-w-sm">
                        <User className="h-8 w-8 text-rose-500 mx-auto animate-pulse" />
                        <div className="text-white text-xs font-semibold">Matched faces in 23 snaps!</div>
                        <div className="text-[10px] text-slate-400">Biometric facial descriptors completed with 98.4% probability threshold and completely deleted raw files off databases.</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* EVENT CATEGORIES SECTIONS MAP (Section 4.6) */}
            <section className="max-w-6xl mx-auto px-6 space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold text-rose-400 tracking-wider">CULTURAL COMPATIBILITIES</span>
                <h2 className="text-3xl font-serif text-white">Built for Celebrations that Matter</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Owambe Celebration", desc: "Aso-ebi rich & drumming", count: "48 events recently", type: "owambe" },
                  { name: "Traditional Wedding", desc: "Cultural convergence rites", count: "123 events recently", type: "trad" },
                  { name: "Majestic Birthdays", desc: "Milestone Gold Jubilees", count: "34 events recently", type: "birthday" },
                  { name: "Church Thanksgiving", desc: "Gospel praise crusades", count: "89 events recently", type: "church" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-slate-900/30 border border-slate-950 hover:border-violet-800/40 hover:-translate-y-1 transition duration-300 space-y-3"
                  >
                    <div className="h-8 w-8 rounded-lg bg-pink-900/10 flex items-center justify-center text-pink-400 font-bold font-mono">
                      ✦
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-semibold text-white">{item.name}</h4>
                      <p className="text-[10px] text-violet-300 mt-1">{item.desc}</p>
                    </div>
                    <div className="text-[9px] text-amber-500 font-mono tracking-wider">{item.count}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* KUDA DONATIONS BACKING PANEL (Section 10.5 & Section 4.9) */}
            <section className="max-w-4xl mx-auto px-6">
              <div className="bg-gradient-to-r from-violet-950/60 to-pink-950/30 border border-amber-500/20 p-8 rounded-2xl space-y-6 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-1 right-1 px-3 py-1 bg-amber-500/10 text-amber-300 font-mono text-[9px] rounded-bl-xl tracking-widest border-l border-b border-amber-500/10 font-black">
                  LAGOS DESIGN FOUNDER
                </div>
                
                <div className="max-w-2xl mx-auto space-y-3">
                  <span className="text-amber-400 font-bold font-mono text-xs uppercase tracking-wider">
                    ❤️ Support CT VIEW Initiative
                  </span>
                  <h3 className="text-2xl font-serif text-white">Built by developers, for memory lovers</h3>
                  <p className="text-violet-200 text-xs leading-relaxed max-w-xl mx-auto">
                    CT VIEW was created natively in Nigeria to preserve deep family narratives across variable mobile network conditions. If this server-less suite helped organize your marriage photography or birthday highlight, consider supporting our development path.
                  </p>
                </div>

                <div className="bg-[#0A0D14]/90 p-5 rounded-xl border border-violet-900/30 max-w-md mx-auto space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs text-left">
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-widest">KUDA MICROBANK</div>
                      <div className="text-white font-semibold text-sm mt-0.5">2008898971</div>
                      <div className="text-violet-300 text-[10px] mt-0.5">Beneficiary: CHIMA</div>
                    </div>
                    
                    <button
                      onClick={handleCopyAccount}
                      className="px-3.5 py-2 bg-gradient-to-r from-violet-700 to-pink-600 hover:from-violet-600 hover:to-pink-500 text-white rounded-lg text-[11px] font-bold tracking-wider uppercase transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <Copy className="h-3 w-3" />
                      Copy Code
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400">
                  *On copy, a simulated confetti shower and toast notification will fire off to express our gratitude!
                </p>
              </div>
            </section>

            {/* PRICING PLANS COMPOSITION (Section 25) */}
            <section className="max-w-6xl mx-auto px-6 space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wide">COMPLETELY TRANSPARENT PRICING</span>
                <h2 className="text-3xl font-serif text-white">Simple Pricing, Incredible Pro Integrations</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free plan */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-rose-400 font-mono tracking-wider uppercase font-semibold">Free Starter</div>
                      <div className="text-3xl font-serif text-white font-bold mt-2">₦0</div>
                      <div className="text-[10px] text-violet-300">Perfect to test collaborative owambe uploads</div>
                    </div>
                    <ul className="text-xs text-violet-200 space-y-2 border-t border-slate-800 pt-4">
                      <li>• 1 active event</li>
                      <li>• Up to 200 event photos</li>
                      <li>• 10 uploads maximum per guest session</li>
                      <li>• 500 MB cloud drive space</li>
                      <li>• 3 lifetime AI restoration trial</li>
                      <li>• Basic WhatsApp share sheets</li>
                    </ul>
                  </div>
                  <button onClick={() => setCurrentView("dashboard")} className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-white font-semibold rounded-xl text-xs transition cursor-pointer">
                    Get Started Free
                  </button>
                </div>

                {/* Pro plan (Best Value) */}
                <div className="p-6 rounded-2xl bg-[#0F0D1E] border border-pink-500 scale-102 flex flex-col justify-between space-y-6 relative shadow-xl shadow-pink-950/15">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-mono text-[9px] px-3 py-1 rounded-full tracking-widest font-bold">
                    RECOMMENDED VALUE
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-rose-400 font-mono tracking-wider uppercase font-semibold">Pro Creator</div>
                      <div className="text-3xl font-serif text-white font-bold mt-2">₦12,000<span className="text-xs text-violet-400 font-normal">/mo</span></div>
                      <div className="text-[10px] text-violet-300">Perfect for professional event planners and couples</div>
                    </div>
                    <ul className="text-xs text-violet-100 space-y-2 border-t border-slate-800 pt-4">
                      <li>• <strong>20 Active Events</strong></li>
                      <li>• Up to 5,000 photos</li>
                      <li>• <strong>100 uploads limit per guest</strong></li>
                      <li>• <strong>25 GB</strong> supreme storage space</li>
                      <li>• 3 custom video highlights (3m duration)</li>
                      <li>• Full face searching biometrics catalog</li>
                      <li>• 50 image restorations per month</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => alert("🎉 Contacting Paystack Sandbox Integration for Pro Activation...")}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-md"
                  >
                    Upgrade via Paystack Now
                  </button>
                </div>

                {/* Studio plan */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-rose-400 font-mono tracking-wider uppercase font-semibold">Studio Gold Edition</div>
                      <div className="text-3xl font-serif text-white font-bold mt-2">₦28,000<span className="text-xs text-violet-400 font-normal">/mo</span></div>
                      <div className="text-[10px] text-violet-300">Perfect for photography studios & major agencies</div>
                    </div>
                    <ul className="text-xs text-violet-200 space-y-2 border-t border-slate-800 pt-4">
                      <li>• <strong>Unlimited active events</strong></li>
                      <li>• Unlimited event photos & videos</li>
                      <li>• Completely unlimited uploads for guests</li>
                      <li>• <strong>100 GB</strong> supreme database vault</li>
                      <li>• Unlimited video highlight studio exports</li>
                      <li>• Full AI Face clustering & restore access</li>
                      <li>• Priority VIP WhatsApp support desk</li>
                    </ul>
                  </div>
                  <button onClick={() => alert("Contacting sales desk...")} className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-white font-semibold rounded-xl text-xs transition cursor-pointer">
                    Contact Enterprise Desk
                  </button>
                </div>
              </div>
            </section>

            {/* PIXEL LEVEL DETAIL FOOTER (Section 4.10) */}
            <footer className="border-t border-violet-950/40 pt-16 pb-8 bg-slate-950/40">
              <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-white text-lg">CT VIEW</h3>
                  <p className="text-violet-300 text-xs font-mono leading-relaxed">
                    "Shots Become A Tale"<br />
                    Preserving deep traditional event memoirs through resilient web tech.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest mb-3">Event Categories</h4>
                  <ul className="text-xs text-violet-200 mt-2 space-y-1.5">
                    <li>Owambes</li>
                    <li>Traditional Weddings</li>
                    <li>Celebration Jubilees</li>
                    <li>Gospel Programs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest mb-3">Core Features</h4>
                  <ul className="text-xs text-violet-200 mt-2 space-y-1.5">
                    <li>Resilient Guest Uploads</li>
                    <li>AI Resolution Repair</li>
                    <li>Face Matching Find</li>
                    <li>PDF Luxury Photobooks</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest mb-3">Chima Initiative</h4>
                  <p className="text-slate-400 text-[10.5px] leading-relaxed">
                    Designed and coded natively in Lekki, Lagos. Complete with real server side integrations.
                  </p>
                </div>
              </div>

              <div className="max-w-6xl mx-auto px-6 border-t border-violet-950/20 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>© {new Date().getFullYear()} CT VIEW Inc. Built with love in Lekki, Nigeria.</span>
                <span className="cursor-pointer hover:text-white" onClick={() => setCurrentView("dashboard")}>
                  Admin Panel Entrance →
                </span>
              </div>
            </footer>
          </div>
        )}

        {/* VIEW 2: GUEST UPLOAD PORTAL (Section 5) */}
        {currentView === "guest" && (
          <div className="max-w-md mx-auto py-10 px-4 space-y-6 animate-fade-in">
            <div className="bg-[#0F0D1E] border border-violet-850 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="aspect-video relative rounded-xl overflow-hidden border border-slate-900 shadow">
                <img src={activeEvent.coverPhoto} alt="Cover" className="w-full h-full object-cover brightness-75" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] bg-rose-600/90 text-white font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-wider self-start">
                    {activeEvent.type}
                  </span>
                  <h2 className="text-white font-serif text-lg font-semibold mt-1 tracking-tight">{activeEvent.name}</h2>
                  <p className="text-[10px] text-violet-200 mt-0.5">{activeEvent.date} • Lekki Peninsula</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-[#9D8EC2] block">
                    Your Name (Optional, so we know who snapped)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name (e.g. Funmi Shonibare)"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-[#0A0D14] border border-[#2D1B69] p-3 text-sm text-white focus:outline-none focus:border-pink-500 rounded-xl"
                  />
                </div>

                {/* Resilient Dropzone Field */}
                <div 
                  onClick={() => document.getElementById("guest-file-input")?.click()}
                  className="border-2 border-dashed border-violet-800/40 hover:border-pink-500 bg-[#0A0D14]/90 p-8 rounded-xl text-center space-y-3 cursor-pointer select-none transition"
                >
                  <Upload className="h-8 w-8 text-pink-400 mx-auto animate-bounce" />
                  <div className="space-y-1">
                    <span className="text-xs text-white font-semibold">Tap to select photos from phone library</span>
                    <span className="text-[10px] text-slate-400 block">Supports JPEG, PNG and HEIC format</span>
                  </div>
                </div>
                <input
                  id="guest-file-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGuestPhotoChange}
                  className="hidden"
                />

                {isUploading && (
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono animate-fade-in">
                    <div className="flex items-center justify-between text-violet-300">
                      <span>Syncing payload chunks...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-violet-500 to-pink-500 h-full rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-violet-300 font-mono pt-2 border-t border-violet-950/40">
                  <span>Logged upload limit:</span>
                  <span className="text-white font-bold">{guestPhotoCount} of 50 photos contributed</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Broadcast Stream preview for guests */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-900 space-y-4">
              <h3 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
                🛰 Live Event Stream ({activeEvent.photos.length} total)
              </h3>
              
              <div className="grid grid-cols-3 gap-2">
                {activeEvent.photos.slice(0, 3).map((p) => (
                  <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-900 shadow">
                    <img src={p.thumbnailUrl} alt="Live thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.5 rounded text-[7px] font-semibold text-white tracking-wide uppercase">
                      {p.guestName.split(" ")[0]}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setCurrentView("dashboard");
                  setDashboardTab("gallery");
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-violet-200 border border-slate-850 rounded-xl cursor-pointer text-center block transition"
              >
                Inspect Live Multi-Guest Gallery
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: OWNER COMMAND CENTER (Section 6) */}
        {currentView === "dashboard" && (
          <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Sidebar nav */}
            <div className="lg:col-span-3 space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F0D1E] to-slate-950 border border-violet-950/50 space-y-3 text-center">
                <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold mx-auto border border-rose-500/20">
                  CH
                </div>
                <div>
                  <div className="text-xs text-slate-300 font-mono">Event Host</div>
                  <div className="text-sm font-semibold text-white font-serif">Chima Obinna</div>
                </div>
                <div className="bg-amber-500/15 border border-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-[9px] font-bold font-mono tracking-wider inline-block">
                  PRO SUBSCRIPTION ACTIVE
                </div>
              </div>

              {/* Event switcher bar */}
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Active Event Context</label>
                <select
                  value={activeEventId}
                  onChange={(e) => setActiveEventId(e.target.value)}
                  className="w-full bg-[#0A0D14] border border-violet-900/40 p-2.5 text-xs text-white rounded-xl focus:outline-none cursor-pointer"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} ({ev.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Navigation links */}
              <div className="bg-slate-950/60 p-2 rounded-2xl border border-slate-900 text-xs font-semibold space-y-1">
                {[
                  { id: "overview", label: "Overview & Story", icon: Layout },
                  { id: "gallery", label: "Event gallery", icon: Eye },
                  { id: "search", label: "Portrait Face Match", icon: Search },
                  { id: "restore", label: "Photo Restoration", icon: Sparkles },
                  { id: "highlights", label: "Highlights studio", icon: Film },
                  { id: "photobooks", label: "Photobook builder", icon: BookOpen },
                  { id: "storage", label: "Cloud File Vault", icon: Database },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setDashboardTab(tab.id as any)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 cursor-pointer ${
                        dashboardTab === tab.id
                          ? "bg-gradient-to-r from-violet-605 to-pink-605 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-violet-400" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Pane dynamic screen component */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* TAB 1: OVERVIEW & REAL TIME MEMORIES */}
              {dashboardTab === "overview" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Event Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-905/60 border border-slate-850 rounded-2xl">
                      <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Captured photos</div>
                      <div className="text-2xl font-serif text-white font-bold mt-1">{activeEvent.photos.length}</div>
                      <div className="text-[9px] text-[#10B981] mt-1 font-mono">✦ live uploads online</div>
                    </div>
                    <div className="p-4 bg-slate-905/60 border border-slate-850 rounded-2xl">
                      <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Video clips</div>
                      <div className="text-2xl font-serif text-white font-bold mt-1">{activeEvent.videos.length}</div>
                      <div className="text-[9px] text-amber-400 font-mono">3GP / MP4 synced</div>
                    </div>
                    <div className="p-4 bg-slate-905/60 border border-slate-850 rounded-2xl">
                      <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Atmosphere index</div>
                      <div className="text-2xl font-serif text-white font-bold mt-1">98.4%</div>
                      <div className="text-[9px] text-rose-400 font-mono">Traditional owambe vibes</div>
                    </div>
                    <div className="p-4 bg-slate-905/60 border border-slate-850 rounded-2xl">
                      <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Storage Vault</div>
                      <div className="text-2xl font-serif text-white font-bold mt-1">{activeEvent.storageUsed} MB</div>
                      <div className="text-[9px] text-violet-400 font-mono">2.3% of 10GB Pro quota</div>
                    </div>
                  </div>

                  {/* REAL SERVER-SIDE GEMINI TEXT MEMOIR BUILDER (Section 9.2) */}
                  <div className="bg-[#0F0D1E] border border-violet-950 p-6 rounded-2xl space-y-4 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
                      <h3 className="text-lg font-serif font-semibold text-white">AI Event Story Builder</h3>
                    </div>
                    <p className="text-xs text-violet-200 max-w-2xl leading-relaxed">
                      Using the modern <strong>gemini-3.5-flash</strong> Google GenAI API model, synthesize a luxury, highly structured editorial prose about your traditional custom wedding of {activeEvent.name}!
                    </p>

                    <div className="space-y-2">
                      <label className="text-[10px] text-[#9D8EC2] font-mono uppercase block">Highlight snippets for prompt</label>
                      <textarea
                        value={storyHighlights}
                        onChange={(e) => setStoryHighlights(e.target.value)}
                        className="w-full bg-[#0A0D14] border border-[#2D1B69] p-3 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 h-16"
                        placeholder="Add some details about who danced, smiled, toasted..."
                      />
                    </div>

                    <button
                      onClick={handleGenerateAIStory}
                      disabled={isGeneratingStory}
                      className="px-5 py-2.5 bg-gradient-to-r from-violet-605 via-pink-605 to-rose-505 hover:opacity-90 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      {isGeneratingStory ? (
                        <>
                          <Wand2 className="h-4 w-4 animate-spin text-rose-400" />
                          Consulting Gemini model...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-amber-300" />
                          Synthesize Story Narrative
                        </>
                      )}
                    </button>

                    {aiStory && (
                      <div className="bg-[#0A0D14] border border-violet-950/40 p-5 rounded-xl space-y-3 animate-fade-in font-serif">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400">MEMOIR EXPORT NARRATIVE:</div>
                        <p className="text-violet-100 text-xs leading-relaxed italic whitespace-pre-wrap">"{aiStory}"</p>
                        <div className="flex justify-end pt-2 border-t border-violet-950/20">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(aiStory);
                              alert("Timeless story text copied to clipboard!");
                            }}
                            className="px-3 py-1 bg-violet-950 border border-violet-850 hover:bg-violet-900 text-white rounded text-[10px] uppercase font-mono font-bold tracking-wider cursor-pointer"
                          >
                            Copy Draft
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* QR table template printed catalog preview */}
                  <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-850 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-left max-w-md">
                      <div className="bg-amber-500/10 text-amber-300 font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider inline-block">
                        TABLE PLACECARD
                      </div>
                      <h3 className="text-white font-serif font-semibold text-lg">Download Your Majestic golden QR Placecards</h3>
                      <p className="text-violet-200 text-xs leading-relaxed">
                        Ready to place on tables! Scan to upload. Generates high resolution printable PDFs with event title "{activeEvent.name}" beautifully watermarked.
                      </p>
                      <button 
                        onClick={() => alert(`Golden PDF Placecards generated successfully for event code: ${activeEvent.code}!`)}
                        className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-white text-[11px] font-semibold border border-slate-800 rounded-lg cursor-pointer inline-block"
                      >
                        Print Spot-Cards PDF
                      </button>
                    </div>
                    {/* Simulated visual QR structure */}
                    <div className="h-32 w-32 bg-white rounded-xl p-3 flex flex-col items-center justify-between shadow-lg shrink-0">
                      <div className="w-full aspect-square border-4 border-violet-950 flex flex-col items-center justify-center relative p-1">
                        <Camera className="h-5 w-5 text-violet-950 absolute" />
                        {/* Mock barcodes lines */}
                        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-white to-[#050505] opacity-25"></div>
                      </div>
                      <div className="text-[8px] font-serif font-black tracking-widest text-[#0D0F1A] uppercase">
                        CT VIEW PORTAL
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: IMAGE GALLERY */}
              {dashboardTab === "gallery" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-serif text-white font-medium">Collaboration Gallery catalog</h2>
                      <p className="text-xs text-violet-300">{activeEvent.photos.length} total photos contributed by guests</p>
                    </div>
                    
                    {/* Photo adding prompt simulated */}
                    <button
                      onClick={() => {
                        const newUrl = `https://picsum.photos/seed/cust-${Date.now()}/1000/1000`;
                        const nPhoto: Photo = {
                          id: `manual-p-${Date.now()}`,
                          eventId: activeEvent.id,
                          guestName: "Studio Admin Pro",
                          url: newUrl,
                          thumbnailUrl: newUrl,
                          likes: 0,
                          comments: [],
                          createdAt: new Date().toISOString()
                        };
                        handleAddNewPhoto(nPhoto);
                      }}
                      className="px-4 py-2 bg-[#0F0D1E] hover:bg-violet-950/80 text-violet-100 hover:text-white border border-violet-850 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Add Photo manually
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4" id="gallery-grid">
                    {activeEvent.photos.map((photo) => (
                      <div key={photo.id} className="group bg-slate-950/60 rounded-xl overflow-hidden border border-slate-900 flex flex-col justify-between">
                        <div className="relative aspect-square overflow-hidden bg-black">
                          <img
                            src={photo.thumbnailUrl}
                            alt="Guest snap shot"
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                            <div className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                              <Smile className="h-3 w-3" />
                              Synced by {photo.guestName}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                              {new Date(photo.createdAt).toLocaleTimeString()}
                            </div>
                          </div>

                          {photo.isRestored && (
                            <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-violet-605 to-pink-605 text-white font-mono text-[9px] px-2 py-0.5 rounded shadow flex items-center gap-1 font-bold">
                              <Sparkle className="h-3 w-3 text-amber-300 animate-spin-slow" />
                              AI REPARATIVE HEAL
                            </span>
                          )}
                        </div>

                        {/* Card bottom likes actions */}
                        <div className="p-3 flex items-center justify-between text-xs font-mono select-none">
                          <button
                            onClick={() => {
                              setEvents((prev) =>
                                prev.map((e) => {
                                  if (e.id === activeEvent.id) {
                                    return {
                                      ...e,
                                      photos: e.photos.map((p) => {
                                        if (p.id === photo.id) {
                                          return { ...p, likes: p.likes + 1 };
                                        }
                                        return p;
                                      })
                                    };
                                  }
                                  return e;
                                })
                              );
                            }}
                            className="flex items-center gap-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                          >
                            <Heart className="h-3.5 w-3.5 fill-current" />
                            <span>{photo.likes}</span>
                          </button>

                          <button
                            onClick={() => {
                              setEvents((prev) =>
                                prev.map((e) => {
                                  if (e.id === activeEvent.id) {
                                    return {
                                      ...e,
                                      photos: e.photos.filter((p) => p.id !== photo.id)
                                    };
                                  }
                                  return e;
                                })
                              );
                            }}
                            className="text-slate-500 hover:text-red-400 cursor-pointer p-1"
                            title="Delete image off cloud files"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PORTRAIT FACE MATCH (Section 21) */}
              {dashboardTab === "search" && (
                <div className="space-y-6 animate-fade-in" id="face-search">
                  <div className="bg-[#0F0D1E] border border-violet-950 p-6 rounded-2xl space-y-4 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-rose-400 animate-pulse" />
                      <h3 className="text-lg font-serif font-semibold text-white">Prism Biometric Face recognition match</h3>
                    </div>
                    <p className="text-xs text-violet-200 justify-normal leading-relaxed">
                      Upload or capture a portrait selfie of yourself or a relative. Our neural facial descriptors index will immediately retrieve all gallery records matching this profile.
                    </p>

                    <div className="bg-[#0A0D14]/90 p-4 rounded-xl border border-violet-900/30 text-xs text-slate-300 leading-relaxed font-sans flex items-start gap-3">
                      <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong>Privacy-First Verification Rule:</strong> We do not store biometric photos. Portrait parameters extract Euclidean vectors mathematically and immediately hard delete raw photo matrices off storage clusters in compliance with NDPA protocols.
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <button
                        onClick={() => fileInputRef2.current?.click()}
                        className="px-4 py-2.5 bg-violet-950/85 hover:bg-violet-900 text-white rounded-xl border border-violet-800 text-xs font-semibold cursor-pointer shrink-0"
                      >
                        Choose Portrait Selfie File
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef2}
                        onChange={handleSelfieFile}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      {selfieImage && (
                        <div className="flex items-center gap-3">
                          <img src={selfieImage} alt="Selfie preview" className="h-10 w-10 rounded-full object-cover border border-pink-500 shrink-0" referrerPolicy="no-referrer" />
                          <button
                            onClick={handleFaceSearch}
                            disabled={isFaceScanning}
                            className="px-4 py-2 bg-gradient-to-r from-violet-605 to-pink-605 hover:opacity-90 text-white rounded-xl text-xs font-bold transition shadow cursor-pointer uppercase tracking-wider"
                          >
                            Scan Gallery Photos
                          </button>
                        </div>
                      )}
                    </div>

                    {isFaceScanning && (
                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-3 py-6 animate-pulse text-xs font-mono">
                        <Wand2 className="h-8 w-8 text-rose-500 animate-spin" />
                        <div className="text-violet-300 text-center tracking-wide">{scannedFeedback}</div>
                      </div>
                    )}

                    {matchedPhotoIds.length > 0 && !isFaceScanning && (
                      <div className="space-y-4 pt-4 border-t border-slate-900 animate-fade-in">
                        <div className="text-xs text-slate-300 font-mono">
                          🎉 Matches found in <strong className="text-white">{matchedPhotoIds.length} event photos</strong>!
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {activeEvent.photos
                            .filter((photo) => matchedPhotoIds.includes(photo.id))
                            .map((photo) => (
                              <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-rose-500 shadow-md">
                                <img src={photo.thumbnailUrl} alt="Matched portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <div className="absolute top-2 right-2 bg-rose-600/90 text-white text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-widest shadow">
                                  98.4% Match
                                </div>
                              </div>
                            ))}
                        </div>
                        
                        <button
                          onClick={() => alert("🎉 Matched assets packaged and downloads triggered as cohesive ZIP successfully!")}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-white border border-slate-800 text-xs font-semibold rounded-xl cursor-pointer"
                        >
                          Download My Highlight Package (ZIP)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: PHOTO RESTORATION */}
              {dashboardTab === "restore" && (
                <div className="animate-fade-in">
                  <RestorationLab event={activeEvent} onAddRestoredPhoto={handleAddNewPhoto} />
                </div>
              )}

              {/* TAB 5: HIGHLIGHTS STUDIO */}
              {dashboardTab === "highlights" && (
                <div className="animate-fade-in">
                  <HighlightStudio event={activeEvent} onAddHighlight={handleAddHighlight} />
                </div>
              )}

              {/* TAB 6: PHOTOBOOK BUILDER */}
              {dashboardTab === "photobooks" && (
                <div className="animate-fade-in">
                  <PhotobookBuilder event={activeEvent} onAddPhotobook={handleAddPhotobook} />
                </div>
              )}

              {/* TAB 7: GOOGLE-DRIVE STYLE CLOUD VAULT FILE EXPLORER (Section 7) */}
              {dashboardTab === "storage" && (
                <div className="space-y-6 animate-fade-in" id="google-drive-storage">
                  <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-900 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                      <div>
                        <h3 className="text-base font-serif text-white font-medium">Cloud Vault File Explorer</h3>
                        <p className="text-xs text-violet-300">Resilient remote files vault for active event {activeEvent.name}</p>
                      </div>
                      <span className="text-xs text-violet-400 font-mono">My Storage: {activeEvent.storageUsed} MB / 10 GB</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      {[
                        { name: "Original Guest Photos", count: activeEvent.photos.length, size: `${activeEvent.storageUsed} MB` },
                        { name: "AI Restored Repairs", count: activeEvent.photos.filter(p => p.isRestored).length, size: "12.8 MB" },
                        { name: "Cinematic Reel Studio", count: activeEvent.highlights.length, size: "48.2 MB" },
                        { name: "Luxury PDF Albums", count: activeEvent.photobooks.length, size: "2.4 MB" },
                      ].map((fol, index) => (
                        <div key={index} className="p-4 bg-slate-900/60 border border-slate-850 hover:border-violet-850 rounded-xl space-y-2 cursor-pointer transition">
                          <FolderLock className="h-6 w-6 text-pink-400" />
                          <div>
                            <div className="text-xs font-semibold text-white truncate">{fol.name}</div>
                            <div className="text-[10px] text-violet-300 mt-1">{fol.count} elements • {fol.size}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-900/30 border border-slate-850 rounded-xl">
                      <div className="text-xs text-slate-300 font-sans tracking-wide">
                        All assets are completely locked during active subscriptions and streamed with Nigerian high efficiency content delivery networks (CDN) maps.
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      <input
        type="file"
        ref={selfieInputRef}
        onChange={handleSelfieFile}
        accept="image/*"
        className="hidden"
      />
      
      {/* Hidden file selector specifically for portraits selfie search match */}
      <input
        type="file"
        ref={fileInputRef2}
        onChange={handleSelfieFile}
        accept="image/*"
        className="hidden"
      />

    </div>
  );
}

// Private reference specifically for file captures
const fileInputRef2 = React.createRef<HTMLInputElement>();
