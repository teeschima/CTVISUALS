import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Zap,
  Upload, 
  Trash2, 
  Check, 
  FileText, 
  ChevronRight, 
  FolderLock, 
  ShieldCheck, 
  BookOpen, 
  Activity, 
  Eye, 
  Download, 
  Share2, 
  Copy, 
  ArrowRight,
  Info,
  Wand2,
  Trash,
  Heart,
  Smile,
  Maximize2,
  RefreshCw,
  Sliders,
  DollarSign,
  TrendingUp,
  Award,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  BookOpenCheck,
  Smartphone,
  Flame,
  UserCheck
} from "lucide-react";

// Mock preset photo URLs representing premium high fidelity images
const MOCK_GALLERY_IMAGES = [
  { id: "img-1", url: "https://picsum.photos/id/1025/800/600", category: "Behind The Scenes", caption: "Groom final touch-ups", resolution: "4200 x 2800", rating: 4.9 },
  { id: "img-2", url: "https://picsum.photos/id/64/800/600", category: "Event Opening", caption: "Breathtaking Lekki layout and florals", resolution: "3800 x 2600", rating: 4.8 },
  { id: "img-3", url: "https://picsum.photos/id/1062/800/600", category: "Event Opening", caption: "Guests arrival & traditional greetings", resolution: "4500 x 3000", rating: 4.7 },
  { id: "img-4", url: "https://picsum.photos/id/129/800/600", category: "Main Event", caption: "Bride and Groom traditional cup shared", resolution: "5100 x 3400", rating: 5.0 },
  { id: "img-5", url: "https://picsum.photos/id/249/800/600", category: "Main Event", caption: "Family dancing and spraying money", resolution: "4000 x 2600", rating: 4.9 },
  { id: "img-6", url: "https://picsum.photos/id/338/800/600", category: "Emotional Moments", caption: "Aunties crying with supreme happiness", resolution: "3605 x 2400", rating: 4.8 },
  { id: "img-7", url: "https://picsum.photos/id/319/800/600", category: "Emotional Moments", caption: "Joyous laughter after the toast", resolution: "4200 x 2800", rating: 4.9 },
  { id: "img-8", url: "https://picsum.photos/id/1024/800/600", category: "Grand Finale", caption: "Closing joint prayers & congratulations", resolution: "4400 x 2933", rating: 4.85 },
  { id: "img-9", url: "https://picsum.photos/id/325/800/600", category: "Grand Finale", caption: "Aso-ebi girls squad final portrait", resolution: "4800 x 3200", rating: 5.0 },
];

export function PhotobookAIPlatform() {
  // Navigation / Tab states
  const [activeTab, setActiveTab] = useState<"dashboard" | "creator">("creator");
  const [creatorStep, setCreatorStep] = useState<number>(1);

  // STEP 1: Upload States
  const [uploadSource, setUploadSource] = useState<string>("folder");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [totalPhotosCount, setTotalPhotosCount] = useState<number>(240); // default simulated
  
  // STEP 2: AI Audit States
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditProgress, setAuditProgress] = useState<number>(0);
  const [auditPhase, setAuditPhase] = useState<string>("Ready");
  const [isAuditComplete, setIsAuditComplete] = useState<boolean>(false);
  
  // AI Filtering stats
  const [deletedDuplicates, setDeletedDuplicates] = useState<number>(32);
  const [deletedBlurry, setDeletedBlurry] = useState<number>(14);
  const [selectedBest, setSelectedBest] = useState<number>(180);
  const [selectedHero, setSelectedHero] = useState<number>(45);
  const [selectedStorytelling, setSelectedStorytelling] = useState<number>(30);
  const [selectedCover, setSelectedCover] = useState<number>(8);

  // STEP 3: Categories & Customizations
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>(MOCK_GALLERY_IMAGES.map(img => img.id));

  // STEP 4: Specifications
  const [bookSize, setBookSize] = useState<string>("large");
  const [designTheme, setDesignTheme] = useState<string>("luxury-gold");
  const [colorScheme, setColorScheme] = useState<string>("gold");
  const [fontCombo, setFontCombo] = useState<string>("luxurious");
  const [titleText, setTitleText] = useState<string>("Chief Obinna & Sarah");
  const [subTitleText, setSubTitleText] = useState<string>("Royal traditional wedding celebration");
  const [welcomeText, setWelcomeText] = useState<string>("");
  const [dedicationText, setDedicationText] = useState<string>("");
  const [isGeneratingCopy, setIsGeneratingCopy] = useState<boolean>(false);

  // STEP 5: Layout / Flipbook
  const [activeLayoutVersion, setActiveLayoutVersion] = useState<"A" | "B" | "C" | "D">("A");
  const [activeSpreadPage, setActiveSpreadPage] = useState<number>(0); // 0 = Cover, 1 = Pages 2-3, 2 = Pages 4-5, 3 = End
  const [isPublicShared, setIsPublicShared] = useState<boolean>(true);
  const [isRenderingOutput, setIsRenderingOutput] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [hasRenderedOutput, setHasRenderedOutput] = useState<boolean>(false);

  // Photographer Dashboard Metrics
  const [studioRevenue, setStudioRevenue] = useState<number>(2450000); // in NGN
  const [activeClients, setActiveClients] = useState<number>(34);
  const [albumsCreated, setAlbumsCreated] = useState<number>(112);
  const [pendingOrders, setPendingOrders] = useState<number>(8);

  // Toggle selected images
  const togglePhotoSelection = (id: string) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(prev => prev.filter(pId => pId !== id));
    } else {
      setSelectedPhotos(prev => [...prev, id]);
    }
  };

  // Run Folder/ZIP simulation upload
  const triggerSimulatedUpload = () => {
    setIsUploading(true);
    setUploadPercent(0);
    const interval = setInterval(() => {
      setUploadPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setTotalPhotosCount(350);
            setCreatorStep(2); // Auto-advance to AI deep audit
          }, 400);
          return 100;
        }
        return prev + 12;
      });
    }, 150);
  };

  // Run Simulated AI Core Audits (Duplicates, closed eyes, smile metrics etc.)
  const executeAIAudit = () => {
    setIsAuditing(true);
    setAuditProgress(0);
    setAuditPhase("Scanning facial geometry...");

    setTimeout(() => {
      setAuditPhase("Analyzing smile quotient & eyes status...");
      setAuditProgress(35);
      
      setTimeout(() => {
        setAuditPhase("Mapping illumination histograms & blur detection...");
        setAuditProgress(70);
        
        setTimeout(() => {
          setAuditPhase("Optimizing chronological timeline layout spreads...");
          setAuditProgress(100);
          setIsAuditing(false);
          setIsAuditComplete(true);
          setCreatorStep(3); // Go to categories and story engine
        }, 1200);
      }, 1200);
    }, 1000);
  };

  // Call Gemini API on backing server to write beautiful copy
  const handleGenerateAICopy = async (type: "welcome" | "dedication" | "title") => {
    setIsGeneratingCopy(true);
    try {
      const resp = await fetch("/api/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: titleText,
          eventType: "Traditional Ceremony / Luxury Event",
          date: new Date().toLocaleDateString(),
          photosCount: selectedPhotos.length,
          guestsCount: 150,
          style: fontCombo,
          highlights: type === "welcome" 
            ? "exquisite guest gathering, premium traditional attire, talking drums and luxury cuisine" 
            : "everlasting family bonds, honoring generational lineage and grandparents presence"
        })
      });
      const data = await resp.json();
      if (data.story) {
        if (type === "welcome") {
          setWelcomeText(data.story.slice(0, 320) + "...");
        } else if (type === "dedication") {
          setDedicationText(data.story.slice(0, 240) + "...");
        }
      } else {
        // Fallback if key missing
        if (type === "welcome") {
          setWelcomeText(`"To our distinguished guests and families, this compilation represents the sacred timeline of our union. Let the vibrant colors, rhythmic smiles, and authentic moments contained herein evoke a deep lifetime of traditional warmth and elegant joy."`);
        } else {
          setDedicationText(`"We dedicate this luxury memorial album to our beloved parents, elders, and mentors whose constant prayers paved the golden pathway to this unforgettable historic celebration."`);
        }
      }
    } catch (e) {
      // Fallback
      if (type === "welcome") {
        setWelcomeText(`"To our distinguished guests and families, this compilation represents the sacred timeline of our union. Let the vibrant colors, rhythmic smiles, and authentic moments contained herein evoke a deep lifetime of traditional warmth and elegant joy."`);
      } else {
        setDedicationText(`"We dedicate this luxury memorial album to our beloved parents, elders, and mentors whose constant prayers paved the golden pathway to this unforgettable historic celebration."`);
      }
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  // Run simulated rendering process
  const triggerAlbumRender = () => {
    setIsRenderingOutput(true);
    setRenderProgress(0);
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRenderingOutput(false);
            setHasRenderedOutput(true);
          }, 350);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  // Font typography sets preview
  const getTypographyClasses = () => {
    switch (fontCombo) {
      case "classic":
        return { title: "font-serif tracking-tight", body: "font-serif italic" };
      case "luxurious":
        return { title: "font-serif uppercase tracking-widest text-amber-500", body: "font-serif text-sm tracking-wide text-amber-200/90" };
      case "editorial":
        return { title: "font-bold tracking-tighter text-stone-900 font-sans uppercase", body: "font-serif text-stone-750" };
      case "minimalist":
      default:
        return { title: "font-sans font-light tracking-wider", body: "font-sans font-normal text-xs text-slate-300" };
    }
  };

  return (
    <div className="bg-[#0A0D14] min-h-screen text-slate-200">
      
      {/* Dynamic Sub-header Navigation */}
      <div className="bg-gradient-to-r from-[#0F111A] to-[#121622] border-b border-violet-955/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpenCheck className="h-5 w-5 text-pink-400" />
          <div>
            <h2 className="text-sm font-serif font-bold text-white tracking-wider">MOMENTFLOW PHOTOBOOK PLATFORM</h2>
            <p className="text-[10px] text-violet-300 font-mono uppercase tracking-widest">Autonomous Luxury Layout Engine ✦ Native Cloud Render</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("creator")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              activeTab === "creator"
                ? "bg-violet-900 border border-violet-700 text-white"
                : "bg-[#0E0F16] border border-transparent text-slate-450 hover:text-white"
            }`}
          >
            Studio Creator
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              activeTab === "dashboard"
                ? "text-rose-450 bg-[#160E18] border border-rose-900/30"
                : "bg-[#0E0F16] border border-transparent text-slate-450 hover:text-white"
            }`}
          >
            Photographer Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ========================================================= */}
        {/* VIEW A: SAAS PHOTOGRAPHER TELEMETRY DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Stats banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#0E1119] border border-slate-900 p-6 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase tracking-wider font-mono">Total Revenue (NGN)</span>
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-serif font-semibold text-white">₦{studioRevenue.toLocaleString()}</div>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span>+28.5% compared to last month</span>
                </p>
              </div>

              <div className="bg-[#0E1119] border border-slate-900 p-6 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase tracking-wider font-mono">Active Client Vaults</span>
                  <Users className="h-4 w-4 text-violet-450" />
                </div>
                <div className="text-2xl font-serif font-semibold text-white">{activeClients}</div>
                <p className="text-[10px] text-violet-400">Pro 50GB Shared Drive active</p>
              </div>

              <div className="bg-[#0E1119] border border-slate-900 p-6 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase tracking-wider font-mono">AI Albums Created</span>
                  <BookOpen className="h-4 w-4 text-pink-400" />
                </div>
                <div className="text-2xl font-serif font-semibold text-white">{albumsCreated}</div>
                <p className="text-[10px] text-pink-400">100% cloud rendering success</p>
              </div>

              <div className="bg-[#0E1119] border border-slate-900 p-6 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase tracking-wider font-mono">Pending Print Shipping</span>
                  <Activity className="h-4 w-4 text-amber-500 animate-pulse" />
                </div>
                <div className="text-2xl font-serif font-semibold text-white">{pendingOrders} books</div>
                <p className="text-[10px] text-amber-500">Scheduled on Lagos Express Courier</p>
              </div>
            </div>

            {/* Dashboard details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-[#0C0E15] p-6 rounded-2xl border border-slate-900 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                  <div>
                    <h3 className="text-base font-serif font-medium text-white">Active Photobook Contracts</h3>
                    <p className="text-xs text-slate-400">Review status of your dynamic AI event photobooks</p>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab("creator");
                      setCreatorStep(1);
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-violet-700 to-pink-600 hover:opacity-90 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    + Setup New Album
                  </button>
                </div>

                <div className="space-y-3.5">
                  {[
                    { client: "Tobi & Adaeze Wedding", date: "2026-06-12", photos: 350, style: "Wedding Premium", price: "₦180,000", status: "Render Complete" },
                    { client: "Chief Alhaji 50th Jubilee", date: "2026-06-14", photos: 280, style: "Lagos Vogue Magazine", price: "₦150,500", status: "Processing AI Slicing" },
                    { client: "Praise Thanksgiving Church", date: "2026-05-30", photos: 540, style: "Sunset Narrative", price: "₦220,000", status: "Shipped via Courier" },
                    { client: "Zenith Bank Executive Gala", date: "2026-05-15", photos: 190, style: "Corporate Clean", price: "₦110,000", status: "Delivered Online" },
                  ].map((order, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-white font-serif">{order.client}</div>
                        <div className="text-[10px] text-slate-450 font-mono mt-1">
                          {order.date} • {order.photos} shots • {order.style} Theme
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono w-full sm:w-auto justify-between sm:justify-start">
                        <span className="text-white font-semibold">{order.price}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold ${
                          order.status.includes("Complete") || order.status.includes("Delivered") 
                            ? "bg-emerald-500/10 text-emerald-400"
                            : order.status.includes("Shipped")
                            ? "bg-violet-900/40 text-violet-300"
                            : "bg-amber-500/10 text-amber-300 animate-pulse"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar stats panel */}
              <div className="lg:col-span-4 bg-[#0C0E15] p-6 rounded-2xl border border-slate-900 space-y-6">
                <div className="border-b border-slate-900 pb-4">
                  <h3 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">Platform Storage Analytics</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs">
                    <span>Cloud Disk Capacity</span>
                    <span className="font-mono text-white">28.4 GB of 100 GB used</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-600 to-pink-500 h-full rounded-full" style={{ width: "28.4%" }}></div>
                  </div>

                  <div className="space-y-3 pt-2 text-[11px] leading-relaxed">
                    <div className="p-3 bg-slate-950 rounded-lg space-y-1">
                      <div className="font-semibold text-white font-serif flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-rose-500" />
                        Automated Image Restorations
                      </div>
                      <p className="text-slate-400 font-mono">112 of 300 free monthly high-res queries executed successfully.</p>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg space-y-1">
                      <div className="font-semibold text-white font-serif flex items-center gap-1.5">
                        <Smartphone className="h-3 w-3 text-pink-400" />
                        Guest Multi-Drive Shared Links
                      </div>
                      <p className="text-slate-400 font-mono">All albums contain pre-generated QR printable graphics representing live online flipping assets.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW B: HIGH RESOLUTION PHOTOBOOK CREATOR APP */}
        {activeTab === "creator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left side timeline navigation step ticks */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-[#0C0E15] p-5 rounded-2xl border border-slate-900 space-y-4">
                <h3 className="text-xs font-mono font-black text-[#9C8FCE] uppercase tracking-widest">
                  AI Assembly Pipelines
                </h3>

                <div className="space-y-2 font-sans">
                  {[
                    { step: 1, label: "Upload Photo Reservoir" },
                    { step: 2, label: "AI Quality & duplicate audit" },
                    { step: 3, label: "Curate story categories" },
                    { step: 4, label: "Tuning Editorial Theme & Copy" },
                    { step: 5, label: "Layout versions & Flipbook" },
                  ].map((s) => (
                    <button
                      key={s.step}
                      onClick={() => setCreatorStep(s.step)}
                      className={`w-full text-left p-3 rounded-xl border text-[11.5px] font-medium flex items-center gap-2.5 transition cursor-pointer ${
                        creatorStep === s.step
                          ? "bg-gradient-to-br from-violet-950/80 to-pink-950/20 border-pink-500 text-white font-semibold"
                          : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                        creatorStep === s.step 
                          ? "bg-pink-500 text-white" 
                          : creatorStep > s.step 
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {creatorStep > s.step ? "✓" : s.step}
                      </span>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic live event overview side card info */}
              <div className="bg-[#0C0E15] p-5 rounded-2xl border border-slate-900 space-y-3 font-sans text-xs">
                <div className="flex items-center gap-2 text-rose-400 font-mono font-bold tracking-wider uppercase text-[10px]">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  Live Album State
                </div>

                <div className="space-y-2 pt-1 font-mono text-[11px] text-slate-400">
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span>Title:</span>
                    <span className="text-white font-medium truncate max-w-[120px]">{titleText}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span>Active Style:</span>
                    <span className="text-white font-medium capitalize">{designTheme.replace("-", " ")}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1">
                    <span>Selected Swatches:</span>
                    <span className="text-rose-400 font-medium capitalize">{colorScheme} Colorized</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Total Elements:</span>
                    <span className="text-emerald-400 font-semibold">{selectedPhotos.length} Photos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side primary dynamic panel view */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* STATUS INDICATORS FOR STEPS */}
              
              {/* STEP 1: RESILIENT DROPZONE & PHOTOS RESERVOIR UPLOADS */}
              {creatorStep === 1 && (
                <div className="bg-[#0C0E15] p-6 rounded-2xl border border-slate-900 space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">Step 1 of 5</span>
                    <h3 className="text-xl font-serif font-medium text-white">Upload Your High Resolution Photos Folder</h3>
                    <p className="text-xs text-slate-400">
                      Our system automatically compress high-resolution image packages and processes raw HEIC/JPEG streams smoothly.
                    </p>
                  </div>

                  {/* Multi Cloud Sources Link tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-950 p-1 rounded-xl text-xs font-semibold">
                    {[
                      { id: "folder", label: "Local Folder/ZIP" },
                      { id: "google", label: "Google Drive" },
                      { id: "dropbox", label: "Dropbox" },
                      { id: "onedrive", label: "OneDrive" },
                      { id: "guest-album", label: "Guest App Drives" },
                    ].map((source) => (
                      <button
                        key={source.id}
                        onClick={() => setUploadSource(source.id)}
                        className={`py-2 px-1 text-center rounded-lg cursor-pointer text-[11px] whitespace-nowrap transition ${
                          uploadSource === source.id
                            ? "bg-slate-900 border border-slate-800 text-white"
                            : "text-slate-450 hover:text-white"
                        }`}
                      >
                        {source.label}
                      </button>
                    ))}
                  </div>

                  {/* Simulated Upload drag frame */}
                  {uploadSource === "folder" ? (
                    <div 
                      onClick={triggerSimulatedUpload}
                      className="border-2 border-dashed border-violet-900/30 bg-slate-950/80 p-12 rounded-2xl text-center space-y-4 cursor-pointer hover:border-pink-500 transition"
                    >
                      <Upload className="h-10 w-10 text-pink-500 mx-auto animate-bounce" />
                      <div className="space-y-1 text-xs">
                        <p className="text-white font-semibold">Drag and Drop Folder containing 50-500+ photos</p>
                        <p className="text-slate-400">Click to upload raw .ZIP archives, folder trees, or select individual JPEG / PNG formats</p>
                      </div>
                      <div className="text-[10px] text-slate-500">Maximum limit 2 GB per session upload in Pro Quota.</div>
                    </div>
                  ) : (
                    <div className="p-8 bg-slate-950/60 rounded-xl border border-slate-900 text-center space-y-4">
                      <FolderLock className="h-8 w-8 text-[#9887C9] mx-auto" />
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-white">OAuth Secure Cloud Interfacing</div>
                        <p className="text-[11px] justify-center leading-relaxed text-slate-400 max-w-sm mx-auto">
                          Import and stream images directly from your cloud directories with the secure Google Drive, Dropbox, or OneDrive API.
                        </p>
                      </div>
                      <button 
                        onClick={triggerSimulatedUpload}
                        className="px-5 py-2.5 bg-violet-950/80 hover:bg-violet-900 text-white text-xs font-semibold rounded-xl tracking-wide cursor-pointer transition shadow"
                      >
                        Authorize & Select Folder Path
                      </button>
                    </div>
                  )}

                  {isUploading && (
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-900 space-y-3 text-xs font-mono animate-fade-in text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Uploading event payload...</span>
                        <span>{uploadPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-600 to-pink-500 h-full rounded-full transition-all duration-150" style={{ width: `${uploadPercent}%` }}></div>
                      </div>
                      <p className="text-[10px] text-[#22C55E]">✦ Packaged 240 photos successfully into stream pipeline</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-900 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-350">Data encrypted in transit & delete indices on manual termination.</span>
                    </div>
                    <span className="text-violet-300 font-mono text-[11px]">Pro-Tier Shielded</span>
                  </div>
                </div>
              )}

              {/* STEP 2: AI DEEP AUDIT SCANS */}
              {creatorStep === 2 && (
                <div className="bg-[#0C0E15] p-6 rounded-2xl border border-slate-900 space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">Step 2 of 5</span>
                      <h3 className="text-xl font-serif font-medium text-white">AI Deep Quality & Duplicate Scans</h3>
                      <p className="text-xs text-slate-400">Our machine learning pipeline scans eyes state, illumination balance, and duplicate hashes.</p>
                    </div>

                    {!isAuditComplete && !isAuditing && (
                      <button
                        onClick={executeAIAudit}
                        className="px-5 py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg active:scale-95 transition"
                      >
                        Run Deep AI Scan
                      </button>
                    )}
                  </div>

                  {/* Processing display */}
                  {isAuditing && (
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-900 text-center space-y-4 animate-pulse">
                      <RefreshCw className="h-8 w-8 text-pink-500 animate-spin mx-auto" />
                      <div>
                        <div className="text-xs font-semibold font-mono text-pink-400 uppercase tracking-widest">{auditPhase}</div>
                        <p className="text-[11px] text-slate-400 mt-1">Inspecting smile vectors, debluring and sorting chronologically...</p>
                      </div>

                      <div className="w-56 bg-slate-900 h-1 rounded-full mx-auto overflow-hidden">
                        <div className="bg-pink-500 h-full rounded-full transition-all duration-200" style={{ width: `${auditProgress}%` }}></div>
                      </div>
                    </div>
                  )}

                  {/* Audit Outputs metrics on complete */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-1">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-slate-450 flex items-center gap-1">
                        <ImageIcon className="h-3 w-3 text-violet-400" /> Total Audited
                      </div>
                      <div className="text-xl font-serif text-white font-semibold">{totalPhotosCount} Elements</div>
                      <p className="text-[10px] text-slate-400">Scanned in 3.4 seconds</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-1">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-rose-400 flex items-center gap-1">
                        <Trash className="h-3 w-3 text-rose-450" /> Closed Eyes & Blurry Removed
                      </div>
                      <div className="text-xl font-serif text-[#F43F5E] font-semibold">{deletedBlurry} Photos</div>
                      <p className="text-[10px] text-slate-450">Resolution below 1080p filtered</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-1">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-yellow-400 flex items-center gap-1">
                        <Sliders className="h-3 w-3 text-yellow-450" /> Duplicates Deduped
                      </div>
                      <div className="text-xl font-serif text-[#EAB308] font-semibold">{deletedDuplicates} Matches</div>
                      <p className="text-[10px] text-slate-450">Pixel level hash similarity matched</p>
                    </div>

                    <div className="bg-[#101E17] p-4 rounded-xl border border-emerald-900/30 space-y-1">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-[#10B981] flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Best Photos Curated
                      </div>
                      <div className="text-xl font-serif text-[#10B981] font-semibold">{selectedBest} Custom Spreads</div>
                      <p className="text-[10px] text-slate-450">Tuned dynamically for pages</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-1">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-[#F43F5E] flex items-center gap-1">
                        <Heart className="h-3 w-3 text-rose-400" /> High Emotion & Hero Shots
                      </div>
                      <div className="text-xl font-serif text-white font-semibold">{selectedHero} Candid Spots</div>
                      <p className="text-[10px] text-slate-450">Excited smiles threshold matched</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-1">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400 flex items-center gap-1">
                        <Wand2 className="h-3 w-3 text-amber-400 animate-pulse" /> Cover Candidates
                      </div>
                      <div className="text-xl font-serif text-amber-300 font-semibold">{selectedCover} Elegant Snaps</div>
                      <p className="text-[10px] text-slate-450">Optimized aspect matching ratios</p>
                    </div>
                  </div>

                  {isAuditComplete && (
                    <div className="flex justify-end pt-3 text-xs">
                      <button
                        onClick={() => setCreatorStep(3)}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 rounded-xl font-semibold flex items-center gap-1 text-violet-300 cursor-pointer"
                      >
                        Next Step: Categories Storytelling
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: CATEGORIZATION & VISUAL STORY BLOCKS */}
              {creatorStep === 3 && (
                <div className="bg-[#0C0E15] p-6 rounded-2xl border border-slate-900 space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">Step 3 of 5</span>
                    <h3 className="text-xl font-serif font-medium text-white">Smart Photo Categorization & Storyboarding</h3>
                    <p className="text-xs text-slate-400">
                      The AI Automatically structures event segments. Tap individual photos to include or exclude from spreads.
                    </p>
                  </div>

                  {/* Categories chips selection */}
                  <div className="flex flex-wrap gap-1.5">
                    {["All", "Event Opening", "Main Event", "Behind The Scenes", "People", "Emotional Moments", "Grand Finale"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer transition ${
                          activeCategory === cat
                            ? "bg-rose-500 text-white"
                            : "bg-slate-950 hover:bg-slate-905 border border-slate-900 text-violet-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Storyboarding timeline sequence preview */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-amber-500 mb-2">TIMELINE STORY SEQUENCE</div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-[9.5px] font-mono text-slate-400">
                      {["Cover", "Introduction", "Getting Ready", "Arrival", "Opening", "Highlights", "Key Moments", "Guest Reactions", "Special Memories", "Closing", "Back Cover"].map((stepVal, idx) => (
                        <React.Fragment key={idx}>
                          <span className="bg-slate-900 border border-slate-800 text-white px-2.5 py-1 rounded-md shrink-0 font-medium">
                            {idx + 1}. {stepVal}
                          </span>
                          {idx < 10 && <span className="text-pink-500 shrink-0">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic mapped photos picker */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MOCK_GALLERY_IMAGES
                      .filter((img) => activeCategory === "All" || img.category === activeCategory)
                      .map((img) => {
                        const isChosen = selectedPhotos.includes(img.id);
                        return (
                          <div 
                            key={img.id}
                            onClick={() => togglePhotoSelection(img.id)}
                            className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 cursor-pointer transition group select-none ${
                              isChosen ? "border-pink-500 shadow-md shadow-pink-950/20 scale-98" : "border-transparent hover:border-violet-800"
                            }`}
                          >
                            <img src={img.url} alt={img.caption} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10 flex flex-col justify-between p-2">
                              <span className="text-[8px] bg-slate-900/90 border border-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded uppercase self-start">
                                {img.category}
                              </span>
                              <div>
                                <p className="text-[10px] text-white font-medium truncate">{img.caption}</p>
                                <p className="text-[8px] font-mono text-slate-400 truncate">{img.resolution} • {img.rating}★ rating</p>
                              </div>
                            </div>

                            {/* Badge state indicator */}
                            <div className="absolute top-2 right-2 flex items-center justify-center">
                              <span className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                isChosen ? "bg-pink-600 border-pink-400 text-white" : "bg-black/60 border-slate-650 text-transparent"
                              }`}>
                                <Check className="h-3 w-3" />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="flex justify-between items-center text-xs pt-4 border-t border-slate-900">
                    <span className="text-slate-400 font-mono">
                      Selected <span className="text-white font-bold">{selectedPhotos.length}</span> of {MOCK_GALLERY_IMAGES.length} story segments candidates
                    </span>

                    <button
                      onClick={() => setCreatorStep(4)}
                      className="px-5 py-2.5 bg-[#170E1B] hover:bg-[#201525] hover:text-white border border-pink-900/30 text-rose-400 font-semibold rounded-xl flex items-center gap-1 cursor-pointer transition shadow"
                    >
                      Configure Cover Specs
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: SPECS AND COVER ASSISTANCE */}
              {creatorStep === 4 && (
                <div className="bg-[#0C0E15] p-6 rounded-2xl border border-slate-900 space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">Step 4 of 5</span>
                    <h3 className="text-xl font-serif font-medium text-white">Photobook Specifications & AI Content Writer</h3>
                    <p className="text-xs text-slate-400">Specify design swatches, size parameters and generate high-fidelity welcomes via Gemini.</p>
                  </div>

                  {/* Size recommendations alerts (AI Recommendation) */}
                  <div className="p-4 bg-gradient-to-r from-violet-950/70 to-[#0F0D1E] rounded-xl border border-violet-900/30 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                      MomentFlow Recommended Dimension Format
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      <strong>Reason:</strong> You uploaded 180+ verified high-resolution portrait photos. We recommend the <strong className="text-rose-400">Luxury 12×12 inches square layout</strong> to center large families properly.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      
                      {/* Size selecting */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase font-mono tracking-wider text-slate-400 block">Photobook Cover Dimensions</label>
                        <select
                          value={bookSize}
                          onChange={(e) => setBookSize(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 p-3 text-xs text-white rounded-xl focus:outline-none cursor-pointer font-semibold"
                        >
                          <option value="small">Small (6×6 in) — Personal Memories</option>
                          <option value="medium">Medium (8×8 in) — Portfolio Best Seller</option>
                          <option value="large">Luxury Premium (12×12 in) — Traditional Weaving Albums</option>
                          <option value="landscape">Landscape (11×8.5 in) — Corporate Galas</option>
                          <option value="portrait">Portrait (8.5×11 in) — Academic Graduations</option>
                        </select>
                      </div>

                      {/* Themes selector */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase font-mono tracking-wider text-slate-400 block">Design Theme Preset</label>
                        <select
                          value={designTheme}
                          onChange={(e) => setDesignTheme(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 p-3 text-xs text-white rounded-xl focus:outline-none cursor-pointer font-semibold"
                        >
                          <option value="modern-minimal">Modern Minimal (Clean space panels)</option>
                          <option value="luxury-gold">Luxury Gold (Midnight Black and brass details)</option>
                          <option value="editorial-magazine">Editorial Magazine (High Fashion asymmetric shapes)</option>
                          <option value="classic">Classic Legacy (Warm vintage hues and soft texturing)</option>
                          <option value="sunset-narrative">Sunset Narrative (Vibrant Afrobeats color templates)</option>
                        </select>
                      </div>

                      {/* Theme Colors selection swatches */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase font-mono tracking-wider text-slate-400 block">Swatches Schema</label>
                        <div className="flex gap-2">
                          {[
                            { name: "gold", bg: "bg-yellow-600" },
                            { name: "cream", bg: "bg-amber-100" },
                            { name: "black", bg: "bg-slate-950 border border-slate-800" },
                            { name: "rose-gold", bg: "bg-rose-400" },
                            { name: "navy", bg: "bg-blue-900" },
                            { name: "emerald", bg: "bg-emerald-800" },
                          ].map((item) => (
                            <button
                              key={item.name}
                              onClick={() => setColorScheme(item.name)}
                              className={`h-7 w-7 rounded-full ${item.bg} cursor-pointer transition-all transform flex items-center justify-center ${
                                colorScheme === item.name ? "ring-2 ring-pink-500 scale-110" : "hover:scale-105"
                              }`}
                            >
                              {colorScheme === item.name && <Check className="h-3 w-3 text-white mix-blend-difference" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Typography selecting pairs */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase font-mono tracking-wider text-slate-400 block">Typography Font Selection Pairings</label>
                        <select
                          value={fontCombo}
                          onChange={(e) => setFontCombo(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 p-3 text-xs text-white rounded-xl focus:outline-none cursor-pointer font-semibold"
                        >
                          <option value="classic font-serif">Playfair Display / Cormorant (Elegant Romance)</option>
                          <option value="classic font-mono">JetBrains Mono / Space Grotesk (Tech Minimalist)</option>
                          <option value="luxurious">Cinzel Premium Title / Bodoni (Aspirant Editorial)</option>
                          <option value="minimalist font-sans">Poppins / Inter Standard (Clean Digital)</option>
                        </select>
                      </div>

                    </div>

                    {/* AI Content assistant panels */}
                    <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-900 col-span-1">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                        <div className="text-[11px] font-mono text-amber-500 flex items-center gap-1 uppercase tracking-widest font-bold">
                          <Wand2 className="h-4 w-4 text-amber-400 animate-pulse animate-spin-slow" />
                          Gemini Editorial copywriter
                        </div>
                      </div>

                      <div className="space-y-3 font-sans text-xs">
                        <div className="space-y-1">
                          <label className="text-slate-400 text-[10px] uppercase block tracking-wider">Book Main Title</label>
                          <input
                            type="text"
                            placeholder="Obinna & Sarah Wedding"
                            value={titleText}
                            onChange={(e) => setTitleText(e.target.value)}
                            className="w-full bg-slate-900 text-white rounded-lg border border-slate-800 p-2.5 text-xs focus:border-pink-500 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between items-center">
                            <label className="text-slate-400 text-[10px] uppercase block tracking-wider">Preface & Welcome Message</label>
                            <button
                              onClick={() => handleGenerateAICopy("welcome")}
                              disabled={isGeneratingCopy}
                              className="text-[10px] text-pink-400 hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              {isGeneratingCopy ? "Drafting..." : "✦ Auto-write"}
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            placeholder="Enter preface, or click Auto-write to generate with machine synthesis..."
                            value={welcomeText}
                            onChange={(e) => setWelcomeText(e.target.value)}
                            className="w-full bg-slate-900 text-white rounded-lg border border-slate-800 p-2.5 text-xs focus:border-pink-500 focus:outline-none leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between items-center">
                            <label className="text-slate-400 text-[10px] uppercase block tracking-wider">Dedication Note</label>
                            <button
                              onClick={() => handleGenerateAICopy("dedication")}
                              disabled={isGeneratingCopy}
                              className="text-[10px] text-pink-400 hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              {isGeneratingCopy ? "Drafting..." : "✦ Auto-write"}
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Who is this luxury portfolio album dedicated to?"
                            value={dedicationText}
                            onChange={(e) => setDedicationText(e.target.value)}
                            className="w-full bg-slate-900 text-white rounded-lg border border-slate-800 p-2.5 text-xs focus:border-pink-500 focus:outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-900">
                    <button
                      onClick={() => setCreatorStep(3)}
                      className="px-4 py-2 border border-slate-800 rounded-xl text-xs font-semibold cursor-pointer text-slate-400 hover:text-white transition"
                    >
                      Back to Storyboard
                    </button>

                    <button
                      onClick={() => setCreatorStep(5)}
                      className="px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg active:scale-95 transition"
                    >
                      Generate AI Layout Spreads
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: FLIPBOOK AND LAYOUT VERSIONS COMPARISONS */}
              {creatorStep === 5 && (
                <div className="bg-[#0C0E15] p-6 rounded-2xl border border-slate-900 space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">Step 5 of 5</span>
                    <h3 className="text-xl font-serif font-medium text-white">Album Spreads Rendering & Flipbook Preview</h3>
                    <p className="text-xs text-slate-400">Flip through designed spreads online, customize layouts, and export in 300 DPI high resolution.</p>
                  </div>

                  {/* Versions Selecting buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "A", name: "Version A", subtitle: "Roman Classic Elegance" },
                      { id: "B", name: "Version B", subtitle: "Swiss Modern Chic" },
                      { id: "C", name: "Version C", subtitle: "Sunset Storytelling" },
                      { id: "D", name: "Version D", subtitle: "Studio Gold Luxury" },
                    ].map((ver) => (
                      <button
                        key={ver.id}
                        onClick={() => {
                          setActiveLayoutVersion(ver.id as any);
                          setHasRenderedOutput(false);
                        }}
                        className={`p-3 text-left border rounded-xl transition cursor-pointer ${
                          activeLayoutVersion === ver.id
                            ? "border-pink-500 bg-gradient-to-br from-violet-950/50 to-pink-950/20 text-white"
                            : "bg-slate-950 border-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="font-bold text-xs">{ver.name}</div>
                        <div className="text-[10px] opacity-70 truncate mt-0.5">{ver.subtitle}</div>
                      </button>
                    ))}
                  </div>

                  {/* Rendering loader if any */}
                  {isRenderingOutput ? (
                    <div className="aspect-[16/9] bg-slate-950 rounded-2xl border border-slate-900 flex flex-col items-center justify-center gap-4 p-8 animate-pulse">
                      <Wand2 className="h-10 w-10 text-pink-500 animate-spin" />
                      <div className="text-center space-y-1">
                        <span className="text-white text-sm font-medium font-serif block">Assembling high resolution printable dimensions ({renderProgress}%)</span>
                        <span className="text-violet-300 font-mono text-[10px] uppercase tracking-widest">rendering vector layout boundaries • 300 DPI PDF</span>
                      </div>
                    </div>
                  ) : hasRenderedOutput ? (
                    <div className="space-y-6">
                      
                      {/* Interactive 3D / Flipbook simulation panel (Section 8) */}
                      <div className="bg-[#121420] border border-violet-950/30 p-8 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center text-xs text-slate-450 border-b border-slate-900 pb-3">
                          <span className="font-mono">ONLINE FLIPBOOK CANVAS [Version {activeLayoutVersion}]</span>
                          <span className="text-rose-450 font-bold uppercase font-mono tracking-widest bg-rose-500/10 px-2 py-0.5 rounded text-[10px]">Active</span>
                        </div>

                        {/* Interactive flipping content sheets */}
                        <div className="aspect-[16/9] bg-white text-stone-900 rounded-xl p-6 shadow-2xl relative select-none flex flex-col justify-between border border-stone-200">
                          
                          {/* PAGE VIEW 0: FRONT COVER */}
                          {activeSpreadPage === 0 && (
                            <div className="flex-1 flex flex-col justify-between text-center py-6 animate-fade-in">
                              <div className="space-y-1">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">EXCLUSIVE PORTFOLIO MEMOIR</p>
                                <h1 className={`${getTypographyClasses().title} text-2xl md:text-3.5xl text-stone-900`}>
                                  {titleText || "Traditional Wedding memoir"}
                                </h1>
                                <p className="text-xs text-stone-600 mt-1 uppercase tracking-wider">{subTitleText}</p>
                              </div>

                              <div className="max-w-[130px] mx-auto aspect-square rounded-full overflow-hidden border-2 border-stone-300 shadow">
                                <img src="https://picsum.photos/id/1025/300/300" alt="Cover photo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>

                              <div className="border-t border-stone-200 pt-3 text-[10px] font-mono text-stone-450">
                                DESIGNED BY {designTheme.replace("-", " ").toUpperCase()} • MEMORY SERIES
                              </div>
                            </div>
                          )}

                          {/* PAGE VIEW 1: PREFACE & WELCOME INTRO */}
                          {activeSpreadPage === 1 && (
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-fade-in">
                              
                              {/* Left sheet: intro words */}
                              <div className="space-y-4 pr-3 border-r border-stone-150 h-full flex flex-col justify-between py-2">
                                <div className="space-y-2">
                                  <span className="text-[9px] font-mono tracking-widest uppercase block text-stone-550">PAGE 1 ✦ PREFACE</span>
                                  <h2 className="font-serif font-semibold text-base text-stone-900 uppercase">Welcome Greeting</h2>
                                  <p className="text-[12px] text-stone-700 leading-relaxed font-serif italic text-justify">
                                    {welcomeText || `"To all our distinguished guests, families, and friends: we welcome you with warmth into this dynamic compilation of celebration. Each image is a direct representation of authentic collective love under Lagos' high-fidelity skies."`}
                                  </p>
                                </div>
                                <span className="font-mono text-[9px] text-stone-400">MOMENTFLOW PORTFOLIO ALBUM</span>
                              </div>

                              {/* Right sheet: cover candidates photo */}
                              <div className="space-y-3 h-full flex flex-col justify-between py-2 pl-3">
                                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-stone-250 shadow-sm">
                                  <img src="https://picsum.photos/id/64/400/300" alt="Spread illustration" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div className="flex justify-between items-center text-[9px] tracking-wide text-stone-450 font-mono">
                                  <span>MEMORIES AT LEKKI</span>
                                  <span>PAGE 2</span>
                                </div>
                              </div>

                            </div>
                          )}

                          {/* PAGE VIEW 2: DEDICATION AND FIRST STORYBOARD SHOTS */}
                          {activeSpreadPage === 2 && (
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-fade-in">
                              
                              {/* Left sheet: image layout */}
                              <div className="space-y-3 h-full flex flex-col justify-between py-2 pr-3 border-r border-stone-150">
                                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-stone-250 shadow-sm relative col-span-1">
                                  <img src="https://picsum.photos/id/1062/400/300" alt="Spread illustration" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div className="flex justify-between items-center text-[9px] tracking-wide text-stone-450 font-mono">
                                  <span>PAGE 3 ✦ TIMELINE CEREMONY</span>
                                  <span>ARRIVAL OF GUESTS</span>
                                </div>
                              </div>

                              {/* Right sheet: dedication */}
                              <div className="space-y-4 pl-3 h-full flex flex-col justify-between py-2">
                                <div className="space-y-3">
                                  <span className="text-[9px] font-mono tracking-widest uppercase block text-stone-550">PREMIUM EDITION</span>
                                  <h2 className="font-serif font-bold text-base text-stone-900 border-b border-stone-150 pb-1.5 uppercase">Dedication Section</h2>
                                  <p className="text-[11.5px] text-stone-700 leading-relaxed font-serif justify-center text-justify">
                                    {dedicationText || `"This majestic collection is dedicated entirely with everlasting gratitude to our beloved parents, elders, and wedding planner coaches without whom this celebration wouldn't have been compiled."`}
                                  </p>
                                </div>
                                <div className="text-right font-mono text-[9px] text-stone-400">PAGE 4</div>
                              </div>

                            </div>
                          )}

                          {/* PAGE VIEW 3: THE END BACK COVER */}
                          {activeSpreadPage === 3 && (
                            <div className="flex-1 flex flex-col justify-between text-center py-8 animate-fade-in">
                              <div className="space-y-1">
                                <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500">MOMENTFLOW PORTFOLIO SERVICES</p>
                                <h3 className="font-serif text-lg tracking-tight text-stone-950 uppercase border-b border-stone-150 max-w-[200px] mx-auto pb-1.5">
                                  Obinna & Sarah
                                </h3>
                              </div>

                              <div className="max-w-[280px] mx-auto space-y-1 text-center font-serif text-[11px] text-stone-605 italic">
                                <p>"Shots become a majestic tale of vibrant presence."</p>
                                <p className="font-mono text-[9px] text-stone-400 font-normal uppercase not-italic mt-2">© Lekki Peninsula, Lagos Nigeria</p>
                              </div>

                              <div className="text-[9px] font-mono text-stone-400">
                                BACK COVER • MANUFACTURED IN PREMIUM PRO PHOTO PRINT LABS
                              </div>
                            </div>
                          )}

                        </div>

                        {/* Pagination controllers (prev / next flip spreads) */}
                        <div className="flex justify-between items-center bg-slate-950 p-2 rounded-xl text-xs font-semibold">
                          <button
                            onClick={() => setActiveSpreadPage(prev => Math.max(0, prev - 1))}
                            disabled={activeSpreadPage === 0}
                            className={`px-3 py-1.5 rounded-lg cursor-pointer transition ${
                              activeSpreadPage === 0 ? "text-slate-600 cursor-not-allowed" : "text-white bg-slate-900 hover:bg-slate-800"
                            }`}
                          >
                            ◂ Previous Spread
                          </button>

                          <div className="flex items-center gap-1">
                            {[0, 1, 2, 3].map((num) => (
                              <button
                                key={num}
                                onClick={() => setActiveSpreadPage(num)}
                                className={`h-2.5 w-2.5 rounded-full transition-all ${
                                  activeSpreadPage === num ? "bg-pink-500 scale-120" : "bg-slate-700 hover:bg-slate-600"
                                }`}
                              />
                            ))}
                          </div>

                          <button
                            onClick={() => setActiveSpreadPage(prev => Math.min(3, prev + 1))}
                            disabled={activeSpreadPage === 3}
                            className={`px-3 py-1.5 rounded-lg cursor-pointer transition ${
                              activeSpreadPage === 3 ? "text-slate-600 cursor-not-allowed" : "text-white bg-slate-900 hover:bg-slate-800"
                            }`}
                          >
                            Next Spread ▸
                          </button>
                        </div>
                      </div>

                      {/* Download configurations & format triggers (Section 25.2) */}
                      <div className="space-y-4">
                        <div className="border-b border-slate-900 pb-2">
                          <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">Select Export Packages Format</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                          <button
                            onClick={() => alert("🎉 Compiling print-ready CMYK PDF vector album (300 DPI) success!")}
                            className="p-3 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-slate-300 font-semibold rounded-xl cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                          >
                            <Download className="h-4 w-4 text-rose-500 animate-bounce" />
                            <span>PDF (Print Ready)</span>
                          </button>

                          <button
                            onClick={() => alert("🎉 Packaging ultra-resolution ZIP (300 DPI lossless PNG structures)...")}
                            className="p-3 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-slate-300 font-semibold rounded-xl cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                          >
                            <Download className="h-4 w-4 text-violet-400" />
                            <span>Ultra PDF (300 DPI)</span>
                          </button>

                          <button
                            onClick={() => alert("🎉 Generated cloud offline flipbook. Copy link in share bar!")}
                            className="p-3 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-slate-300 font-semibold rounded-xl cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                          >
                            <BookOpenCheck className="h-4 w-4 text-amber-400" />
                            <span>HTML5 Flipbook</span>
                          </button>

                          <button
                            onClick={() => alert("🎉 Rendered absolute JPG pages sequence ZIP in 4K resolution!")}
                            className="p-3 bg-slate-900 hover:bg-slate-855 hover:text-white border border-slate-800 text-slate-300 font-semibold rounded-xl cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                          >
                            <ImageIcon className="h-4 w-4 text-pink-400" />
                            <span>JPG Page Sheets</span>
                          </button>

                          <button
                            onClick={() => alert("🎉 Rendered transparent background PNG spreads sequentials...")}
                            className="p-3 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-slate-300 font-semibold rounded-xl cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 transition active:scale-95"
                          >
                            <FileText className="h-4 w-4 text-emerald-400" />
                            <span>PNG Edit Templates</span>
                          </button>
                        </div>
                      </div>

                      {/* Professional Public Gallery with QR codes generator */}
                      <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-950 to-pink-905/10 border border-violet-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1.5 text-center md:text-left">
                          <div className="text-rose-400 font-mono text-xs uppercase tracking-wider font-bold">
                            ✦ EVENT PUBLIC SHARED COOPERATIVE REPOSITORY
                          </div>
                          <h4 className="text-white font-serif font-semibold text-sm">Create Public Moment Gallery Drive</h4>
                          <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
                            Publish this designed photobook layout and original reservoir assets on a clean public webpage, allowing guests to download raw files and check designs dynamically.
                          </p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => alert(`🔗 Copied interactive Public Gallery reference:\nhttps://ctview.app/shared/${titleText.toLowerCase().replace(" ", "-")}/portfolio`)}
                            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition active:scale-95"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copy Link
                          </button>

                          <button
                            onClick={() => alert("🎉 Generating live printable table banquet QR card PDF for your guests...")}
                            className="px-4 py-2.5 bg-gradient-to-r from-violet-700 to-pink-600 hover:opacity-90 text-white rounded-xl text-xs font-semibold cursor-pointer shadow flex items-center gap-1.5 transition active:scale-95"
                          >
                            <Smartphone className="h-3.5 w-3.5" />
                            Print Table QR card
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="p-12 text-center bg-slate-950/60 rounded-2xl border border-slate-900 space-y-4">
                      <Wand2 className="h-10 w-10 text-pink-500 mx-auto animate-pulse" />
                      <div className="space-y-1">
                        <div className="text-white text-xs font-semibold">Ready to compile layout spreads</div>
                        <p className="text-[11px] text-slate-450 max-w-sm mx-auto leading-relaxed">
                          Your specs and selected photo reservoir values are fully configured. Tap "Generate AI Layout Spreads" to start the layout process.
                        </p>
                      </div>
                      <button
                        onClick={triggerAlbumRender}
                        className="px-6 py-2.5 bg-gradient-to-r from-violet-600 via-pink-650 to-rose-500 hover:opacity-95 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg active:scale-95 transition"
                      >
                        Start Layout Spread Assembly
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-slate-900">
                    <button
                      onClick={() => setCreatorStep(4)}
                      className="px-4 py-2 border border-slate-850 rounded-xl text-xs font-semibold cursor-pointer text-slate-400 hover:text-white transition"
                    >
                      Back to Specs
                    </button>

                    <button
                      onClick={() => {
                        alert("🎉 Album order submitted to MomentFlow Custom Print Labs. Checking checkout state with Paystack...");
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg active:scale-95 transition flex items-center gap-2"
                    >
                      <Award className="h-4.5 w-4.5 text-amber-300 animate-pulse" />
                      Submit Order for Printing & Delivery
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
