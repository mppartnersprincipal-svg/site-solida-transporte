"use client";

import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "solida-intro";
const VIDEO_MOBILE = "/assets/video/intro-720.mp4";
const VIDEO_DESKTOP = "/assets/video/intro-1080.mp4";

/**
 * Overlay da intro em tela cheia. Só fica visível quando o script inline do
 * IntroGate marcou html[data-intro="1"] antes do paint (1ª visita da sessão);
 * as regras de exibição e o scroll lock vivem em globals.css.
 */
export function IntroVideo() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const finishRef = useRef<() => void>(() => {});
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.intro !== "1") {
      setGone(true);
      return;
    }

    const overlay = overlayRef.current;
    const video = videoRef.current;
    if (!overlay || !video) return;

    let finished = false;
    const timers: number[] = [];

    const unlock = () => {
      delete document.documentElement.dataset.intro;
    };

    const done = () => {
      unlock();
      setGone(true);
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* sem sessionStorage (ex.: modo privado antigo) a intro apenas repete */
      }
      setLeaving(true);
      const fallback = window.setTimeout(done, 700);
      timers.push(fallback);
      overlay.addEventListener(
        "transitionend",
        () => {
          window.clearTimeout(fallback);
          done();
        },
        { once: true },
      );
    };
    finishRef.current = finish;

    // Watchdog: se o vídeo não começar a tocar em 4s (rede lenta, codec,
    // autoplay bloqueado), o poster segurou a tela até aqui e o site libera.
    const watchdog = window.setTimeout(finish, 4000);
    timers.push(watchdog);
    const onPlaying = () => {
      window.clearTimeout(watchdog);
      setPlaying(true);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
      // Único elemento focável do diálogo — Tab não pode vazar para o site atrás
      if (event.key === "Tab") {
        event.preventDefault();
        skipRef.current?.focus();
      }
    };

    video.addEventListener("ended", finish);
    video.addEventListener("error", finish);
    video.addEventListener("playing", onPlaying);
    document.addEventListener("keydown", onKeyDown);

    video.src = matchMedia("(max-width: 767px)").matches
      ? VIDEO_MOBILE
      : VIDEO_DESKTOP;
    // React não serializa o atributo `muted` no SSR — sem setar via ref o
    // autoplay é bloqueado no mobile.
    video.muted = true;
    video.play().catch(finish);

    skipRef.current?.focus({ preventScroll: true });

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", finish);
      video.removeEventListener("playing", onPlaying);
      document.removeEventListener("keydown", onKeyDown);
      // Navegação no meio da intro: nunca deixar o scroll travado
      unlock();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={overlayRef}
      id="intro-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Vídeo de apresentação da Sólida Transporte"
      className={`fixed inset-0 z-[70] items-center justify-center bg-ink transition-opacity duration-500 ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        poster="/assets/video/intro-poster.webp"
        playsInline
        disablePictureInPicture
        preload="auto"
        aria-hidden
        className="h-full w-full object-contain"
      />
      {/* Primeiro frame como <img> real por cima do vídeo até o playback começar:
          pinta junto com o FCP (é o elemento LCP da 1ª visita) e garante imagem
          na tela mesmo antes da hidratação. <img> cru de propósito — next/image
          reescreveria a URL e duplicaria o download do preload do IntroGate. */}
      {!playing && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/assets/video/intro-poster.webp"
          alt=""
          fetchPriority="high"
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
      <button
        ref={skipRef}
        type="button"
        onClick={() => finishRef.current()}
        aria-label="Pular vídeo de apresentação"
        className="absolute bottom-6 right-6 cursor-pointer rounded-full border border-white/25 bg-ink/60 px-5 py-2 text-sm font-semibold text-white/90 transition-colors hover:bg-ink/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Pular
      </button>
    </div>
  );
}
