import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Volume2, VolumeX, Play, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/lib/motion";
import { track } from "@/lib/analytics";

const VIDEO_ID = "OPygxyH19f0";
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
const POSTER = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
const POSTER_FALLBACK = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`;

type Phase = "loading" | "playing" | "failed";

type FilmApi = {
  phase: Phase;
  soundOn: boolean;
  toggleSound: () => void;
  enableSound: () => void;
};

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<any> | null = null;

function loadYouTubeApi(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("YouTube API timeout")), 9000);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      window.clearTimeout(timer);
      resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("YouTube API failed to load"));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

/**
 * Full-bleed cinematic hero film.
 * Level 1 autoplay muted → Level 2 tap to play → Level 3 poster → Level 4 external link.
 */
export function HeroFilm({
  children,
  mediaStyle,
}: {
  children: (api: FilmApi) => ReactNode;
  mediaStyle?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [phase, setPhase] = useState<Phase>(reduced ? "failed" : "loading");
  const [soundOn, setSoundOn] = useState(false);
  const [entered, setEntered] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    track("HERO_LOADED");
    const t = window.setTimeout(() => setEntered(true), 220);
    return () => window.clearTimeout(t);
  }, []);

  const boot = useCallback(() => {
    let cancelled = false;
    let watchdog = 0;

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !mountRef.current) return;
        playerRef.current = new YT.Player(mountRef.current, {
          videoId: VIDEO_ID,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            autoplay: 1,
            mute: 1,
            loop: 1,
            playlist: VIDEO_ID,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            iv_load_policy: 3,
            fs: 0,
          },
          events: {
            onReady: (e: any) => {
              try {
                e.target.mute();
                e.target.playVideo();
              } catch {
                /* ignore */
              }
              watchdog = window.setTimeout(() => {
                if (!cancelled && playerRef.current?.getPlayerState?.() !== 1) setPhase("failed");
              }, 5000);
            },
            onStateChange: (e: any) => {
              if (cancelled) return;
              if (e.data === 1) {
                window.clearTimeout(watchdog);
                setPhase("playing");
                track("VIDEO_PLAY");
              }
              if (e.data === 0) track("VIDEO_COMPLETE");
            },
            onError: () => {
              if (!cancelled) {
                setPhase("failed");
                track("VIDEO_FALLBACK", { reason: "player_error" });
              }
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          setPhase("failed");
          track("VIDEO_FALLBACK", { reason: "api_unavailable" });
        }
      });

    return () => {
      cancelled = true;
      window.clearTimeout(watchdog);
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (reduced && !manual) return;
    return boot();
  }, [boot, reduced, manual]);

  const enableSound = useCallback(() => {
    const p = playerRef.current;
    if (!p?.unMute) return;
    try {
      p.unMute();
      p.setVolume?.(100);
      setSoundOn(true);
      track("VIDEO_SOUND_ON");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSound = useCallback(() => {
    const p = playerRef.current;
    if (!p?.unMute) {
      // No player yet (reduced motion or fallback) — start the film on intent.
      setManual(true);
      setPhase("loading");
      return;
    }
    if (soundOn) {
      p.mute();
      setSoundOn(false);
      track("VIDEO_SOUND_OFF");
    } else {
      enableSound();
    }
  }, [soundOn, enableSound]);

  const showVideo = phase === "playing";

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-28 md:min-h-screen md:pb-20">
      {/* Film / poster layer */}
      <div className="absolute inset-0 overflow-hidden bg-[#050505]" style={mediaStyle}>
        <img
          src={POSTER}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = POSTER_FALLBACK;
          }}
          alt="Still frame from the Yomi Visuals film"
          fetchPriority="high"
          decoding="async"
          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          style={{
            opacity: showVideo ? 0 : 1,
            transition: "opacity 700ms var(--ease-out-expo, ease-out)",
          }}
        />

        {phase !== "failed" && (
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "max(100vw, calc(100svh * 16 / 9))",
              height: "max(100svh, calc(100vw * 9 / 16))",
              opacity: showVideo ? 1 : 0,
              transition: "opacity 900ms var(--ease-out-expo, ease-out)",
            }}
          >
            <div ref={mountRef} className="h-full w-full" />
          </div>
        )}

        {/* Cinematic readability gradients — text areas only */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[70%]"
          style={{ background: "linear-gradient(to top, rgba(5,5,5,0.92), rgba(5,5,5,0.55) 38%, transparent)" }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40"
          style={{ background: "linear-gradient(to bottom, rgba(5,5,5,0.7), transparent)" }}
        />
        {/* Entrance: lights go down, then the film starts */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#050505]"
          style={{
            opacity: entered ? 0 : 1,
            transition: "opacity 900ms var(--ease-out-expo, ease-out)",
          }}
        />
      </div>

      <div className="relative">{children({ phase, soundOn, toggleSound, enableSound })}</div>

      {/* Minimal YV sound control */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-end px-5 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] md:px-10 md:pb-8"
        style={{ opacity: entered ? 1 : 0, transition: "opacity 600ms ease-out" }}
      >
        {phase === "failed" ? (
          <a
            href={WATCH_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-sm border border-border-strong bg-background/70 px-4 text-[10.5px] uppercase tracking-[0.22em] text-foreground backdrop-blur-sm"
          >
            <Play className="h-3.5 w-3.5" aria-hidden />
            Watch the film
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        ) : (
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
            className="press pointer-events-auto inline-flex min-h-11 min-w-11 items-center gap-2 rounded-sm border border-border-strong bg-background/50 px-4 text-[10.5px] uppercase tracking-[0.22em] text-foreground backdrop-blur-sm transition-colors duration-[var(--motion-fast)] hover:bg-background/80"
          >
            {soundOn ? <Volume2 className="h-3.5 w-3.5 text-gold" aria-hidden /> : <VolumeX className="h-3.5 w-3.5" aria-hidden />}
            <span>{soundOn ? "Sound on" : "Sound off"}</span>
          </button>
        )}
      </div>
    </section>
  );
}
