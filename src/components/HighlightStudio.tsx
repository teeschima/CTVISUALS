import React, { useState } from "react";
import { HighlightVideo, VideoStyle, Event } from "../types";
import { ROYALTY_FREE_TRACKS } from "../data";
import { Video, Sparkles, Music, Trash2, Play, Pause, Film, Check, Wand2, Download, Share2, Eye } from "lucide-react";

interface HighlightStudioProps {
  event: Event;
  onAddHighlight: (highlight: HighlightVideo) => void;
}

const STYLES = [
  { id: VideoStyle.CINEMATIC, name: "Cinematic Elegance", desc: "Symphonic tracks, gentle transitions, vintage filters", icon: Film },
  { id: VideoStyle.PARTY_VIBES, name: "Owambe Party Energy", desc: "Upbeat party rhythms, rapid cuts, high saturation", icon: Film },
  { id: VideoStyle.LOVE_STORY, name: "Romantic Storybook", desc: "Soft warm overlays, elegant fades, gentle piano tones", icon: Film },
  { id: VideoStyle.BEAT_SYNC, name: "Afrobeats Beat Sync", desc: "Hard sync drops, electric pulses, modern Lagos transitions", icon: Film },
  { id: VideoStyle.TIKTOK_CUTS, name: "Modern TikTok Cuts", desc: "9:16 portrait canvas, snap effects, voiceover support", icon: Film },
];

export function HighlightStudio({ event, onAddHighlight }: HighlightStudioProps) {
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>(VideoStyle.BEAT_SYNC);
  const [selectedDuration, setSelectedDuration] = useState<number>(60); // standard 1 min
  const [selectedTrack, setSelectedTrack] = useState<string>("t-1");
  const [titleCard, setTitleCard] = useState<string>(event.name);
  const [tagline, setTagline] = useState<string>("Shots Become A Tale");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeHighlight, setActiveHighlight] = useState<HighlightVideo | null>(
    event.highlights[0] || null
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = () => {
    setIsProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            const newHighlight: HighlightVideo = {
              id: `high-${Date.now()}`,
              eventId: event.id,
              title: `${titleCard} - ${STYLES.find(s => s.id === selectedStyle)?.name}`,
              style: selectedStyle,
              musicTrack: ROYALTY_FREE_TRACKS.find(t => t.id === selectedTrack)?.name || "Lagos Sunset Groove",
              duration: selectedDuration,
              status: "DONE",
              // Premium copyright-free stock video to feel real
              outputUrl: "https://assets.mixkit.co/videos/preview/mixkit-friends-toasting-at-an-outdoor-dinner-party-41808-large.mp4",
              thumbnailUrl: "https://picsum.photos/seed/highlight_out/480/270",
              createdAt: new Date().toISOString()
            };
            onAddHighlight(newHighlight);
            setActiveHighlight(newHighlight);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 280);
  };

  return (
    <div className="space-y-8" id="highlight-studio">
      <div className="bg-gradient-to-r from-violet-950 via-purple-900/30 to-slate-900 border border-violet-800/40 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <Film className="h-4 w-4 text-rose-400 animate-pulse" />
              ✦ CT VIEW REEL STUDIO
            </div>
            <h2 className="text-2xl font-serif text-white font-medium">Collaborative Video Highlight Reels</h2>
            <p className="text-violet-200 text-sm max-w-xl">
              Compile up to {event.photos.length} photos and {event.videos.length} videos uploaded by guests into a custom, beat-synchronized cinematic highlights tape.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form panel */}
        <div className="lg:col-span-6 space-y-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60">
          <div className="space-y-3">
            <label className="text-white font-medium text-xs uppercase tracking-wider block">
              Step 1 — Choose Cinematic Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 text-left rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                    selectedStyle === style.id
                      ? "border-pink-500 bg-gradient-to-br from-violet-900/40 to-pink-900/30 text-white"
                      : "border-slate-800 bg-slate-950 hover:border-violet-800 text-violet-200"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${
                    selectedStyle === style.id ? "bg-rose-500/20 text-rose-400" : "bg-slate-800 text-violet-400"
                  }`}>
                    <Film className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs">{style.name}</div>
                    <div className="text-[10px] opacity-70 truncate max-w-[160px]">{style.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-white font-medium text-xs uppercase tracking-wider block">
              Step 2 — Duration Limit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "30s (IG reel)", value: 30 },
                { label: "1 min (Standard)", value: 60 },
                { label: "3 min (Premium)", value: 180 },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setSelectedDuration(item.value)}
                  className={`py-2 px-3 text-center rounded-xl border text-xs font-semibold cursor-pointer transition ${
                    selectedDuration === item.value
                      ? "border-pink-500 bg-rose-500/10 text-rose-400"
                      : "border-slate-800 bg-slate-950 hover:border-violet-800 text-violet-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-white font-medium text-xs uppercase tracking-wider block">
              Step 3 — Soundtrack Selection
            </label>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {ROYALTY_FREE_TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs cursor-pointer transition ${
                    selectedTrack === track.id
                      ? "border-pink-500 bg-violet-950/40 text-rose-400"
                      : "border-slate-800 bg-slate-950/50 text-violet-200 hover:bg-slate-950"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Music className={`h-4 w-4 ${selectedTrack === track.id ? "text-pink-500 animate-bounce" : "text-violet-400"}`} />
                    <div>
                      <div className="font-semibold">{track.name}</div>
                      <div className="text-[10px] opacity-70">{track.artist} • {track.genre}</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] opacity-70">{track.duration}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-white font-medium text-xs uppercase tracking-wider block">
              Step 4 — Introductory Title Card
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Title Text"
                value={titleCard}
                onChange={(e) => setTitleCard(e.target.value)}
                className="w-full bg-slate-950 text-white rounded-xl border border-slate-800 p-3 text-xs focus:border-rose-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Tagline Caption"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-950 text-white rounded-xl border border-slate-800 p-3 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
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
                FFmpeg rendering highlight video ({progress}%)
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                Generate My Event Highlight Video
              </>
            )}
          </button>
        </div>

        {/* Video preview & history player panel */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full bg-slate-950 border border-slate-800/80 p-6 rounded-2xl justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <span className="text-sm font-semibold text-white">Active Highlight Screen</span>
              <span className="bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                {activeHighlight ? "RENDER_COMPLETE" : "PENDING_GENERATION"}
              </span>
            </div>

            {isProcessing ? (
              <div className="aspect-video rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col items-center justify-center gap-4 animate-pulse">
                <Wand2 className="h-10 w-10 text-pink-500 animate-spin" />
                <div className="text-center space-y-1">
                  <div className="text-white text-sm font-medium">Baking transitions and color matrices...</div>
                  <div className="text-violet-300 text-[10px] font-mono">mixing music decibels • 1080p codec</div>
                </div>
              </div>
            ) : activeHighlight ? (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 group shadow-lg">
                  {isPlaying ? (
                    <video
                      src={activeHighlight.outputUrl}
                      controls
                      autoPlay
                      onEnded={() => setIsPlaying(false)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={activeHighlight.thumbnailUrl}
                        alt="Highlight Output poster"
                        className="w-full h-full object-cover brightness-95"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                        <button
                          onClick={() => setIsPlaying(true)}
                          className="h-14 w-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition transform hover:scale-115 active:scale-90 cursor-pointer"
                        >
                          <Play className="h-6 w-6 fill-current ml-1" />
                        </button>
                      </div>
                      
                      {/* Interactive Branded Title Card Overlay preview */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-violet-950/90 to-black/80 p-3 rounded-lg border border-violet-800/30 max-w-[80%]">
                        <div className="text-rose-400 font-mono text-[9px] uppercase tracking-wider">{tagline}</div>
                        <div className="text-white font-serif font-semibold text-xs mt-0.5 truncate">{titleCard}</div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-white text-base font-semibold">{activeHighlight.title}</h3>
                  <p className="text-xs text-violet-300 font-mono">
                    Soundtrack: <span className="text-amber-400">{activeHighlight.musicTrack}</span> • Duration: {activeHighlight.duration}s
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-slate-900/60 border border-dashed border-slate-800 flex flex-col items-center justify-center gap-2 text-violet-400 text-center p-6">
                <Film className="h-10 w-10 text-violet-500 animate-bounce mb-2" />
                <div className="text-xs font-semibold text-slate-300">No highlight reels rendered yet</div>
                <div className="text-[10px] text-slate-400 max-w-xs">Configure your specifications on the left pane and generate a beautiful story clip!</div>
              </div>
            )}
          </div>

          {activeHighlight && !isProcessing && (
            <div className="flex gap-2.5 mt-6 animate-fade-in border-t border-slate-900 pt-4">
              <a
                href={activeHighlight.outputUrl}
                download
                className="flex-1 py-2.5 bg-gradient-to-r from-violet-700 to-pink-600 hover:from-violet-600 hover:to-pink-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="h-4 w-4" />
                Download MP4 (1080p)
              </a>
              <button
                onClick={() => alert(`🔗 Share link copied to clipboard!\nhttps://ctview.app/e/${event.code}/reel`)}
                className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white text-violet-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
