import { IntroVideo } from "./IntroVideo";

/*
  Script síncrono (parser-blocking) que decide ANTES do primeiro paint se a
  intro aparece: só na 1ª visita da sessão e nunca com prefers-reduced-motion.
  Quando a intro vai rodar, injeta o preload do poster (o vídeo em si começa
  na hidratação — preload as="video" não é suportado pelo Chrome). Visitante
  recorrente não baixa nada. Precisa ser dangerouslySetInnerHTML: em navegação
  client-side de volta à Home o React re-executa o script, mas o sessionStorage
  já está marcado.
*/
const BOOT_SCRIPT = `try{if(!sessionStorage.getItem("solida-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){var d=document;d.documentElement.dataset.intro="1";var l=d.createElement("link");l.rel="preload";l.href="/assets/video/intro-poster.webp";l.as="image";l.fetchPriority="high";d.head.appendChild(l)}}catch(e){}`;

export function IntroGate() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      <IntroVideo />
    </>
  );
}
