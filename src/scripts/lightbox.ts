import { animateLightboxOpen, animateLightboxClose } from './gsap-animations';

interface WallpaperData {
  src: string;
  filename: string;
  width: string;
  height: string;
  alt: string;
  index: number;
}

let currentIndex = -1;
let isOpen = false;
let isAnimating = false;
let cards: WallpaperData[] = [];

const $ = (id: string) => document.getElementById(id)!;

export function initLightbox() {
  // Collect card data
  document.querySelectorAll('.gallery-card').forEach((card) => {
    const el = card as HTMLElement;
    cards.push({
      src: el.dataset.src!,
      filename: el.dataset.filename!,
      width: el.dataset.width!,
      height: el.dataset.height!,
      alt: el.dataset.alt!,
      index: parseInt(el.dataset.index!, 10),
    });

    el.addEventListener('click', () => open(parseInt(el.dataset.index!, 10)));
  });

  // Close handlers
  $('lightbox-close').addEventListener('click', close);
  $('lightbox-backdrop')?.addEventListener('click', close);

  // Navigation
  $('lightbox-prev').addEventListener('click', prev);
  $('lightbox-next').addEventListener('click', next);

  // Keyboard
  document.addEventListener('keydown', onKeyDown);

  // Touch swipe
  let touchStartX = 0;
  const lightbox = $('lightbox');
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = (e as TouchEvent).touches[0].clientX;
  });
  lightbox.addEventListener('touchend', (e) => {
    const dx = (e as TouchEvent).changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx > 0 ? prev() : next();
    }
  });
}

// Fix: get backdrop element properly
function getBackdrop(): HTMLElement | null {
  return document.querySelector('.lightbox-backdrop');
}

function open(index: number) {
  if (isAnimating) return;
  currentIndex = index;
  isOpen = true;
  document.body.style.overflow = 'hidden';
  loadImage(cards[index]);
  animateLightboxOpen($('lightbox'));
}

async function close() {
  if (isAnimating || !isOpen) return;
  isAnimating = true;
  isOpen = false;
  await animateLightboxClose($('lightbox'));
  document.body.style.overflow = '';
  isAnimating = false;
}

function prev() {
  if (!isOpen || isAnimating) return;
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  loadImage(cards[currentIndex]);
}

function next() {
  if (!isOpen || isAnimating) return;
  currentIndex = (currentIndex + 1) % cards.length;
  loadImage(cards[currentIndex]);
}

function loadImage(data: WallpaperData) {
  const img = $('lightbox-image') as HTMLImageElement;
  const spinner = $('lightbox-spinner');

  img.classList.remove('loaded');
  spinner.classList.add('loading');

  const preload = new Image();
  preload.onload = () => {
    img.src = data.src;
    img.alt = data.alt;
    img.classList.add('loaded');
    spinner.classList.remove('loading');
  };
  preload.src = data.src;

  // Update info
  $('lightbox-name').textContent = data.alt;
  $('lightbox-resolution').textContent = `${data.width} × ${data.height}`;

  // Update download link
  const dl = $('lightbox-download') as HTMLAnchorElement;
  dl.href = data.src;
  dl.download = data.filename;
}

function onKeyDown(e: KeyboardEvent) {
  if (!isOpen) return;
  switch (e.key) {
    case 'Escape':
      close();
      break;
    case 'ArrowLeft':
      prev();
      break;
    case 'ArrowRight':
      next();
      break;
  }
}
