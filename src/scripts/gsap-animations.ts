import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  headerEntrance();
  headerParallax();
  galleryReveal();
  cardHover();
}

/** Header slide-up + fade with stagger */
function headerEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.header-title', {
    y: 30,
    opacity: 0,
    duration: 1,
  }).from(
    '.header-subtitle',
    {
      y: 20,
      opacity: 0,
      duration: 0.8,
    },
    '-=0.6'
  );
}

/** Header scrolls away with parallax */
function headerParallax() {
  gsap.to('.header', {
    scrollTrigger: {
      trigger: '.header',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    yPercent: -30,
    opacity: 0,
  });
}

/** Gallery cards batch reveal on scroll */
function galleryReveal() {
  gsap.set('.gallery-card', { opacity: 0, y: 40 });

  ScrollTrigger.batch('.gallery-card', {
    onEnter: (batch) => {
      gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      });
    },
    start: 'top 90%',
    once: true,
  });
}

/** Desktop-only card hover: scale + shadow lift */
function cardHover() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.gallery-card').forEach((card) => {
    const el = card as HTMLElement;

    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        scale: 1.03,
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        scale: 1,
        boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });
}

/** Lightbox open animation */
export function animateLightboxOpen(lightbox: HTMLElement) {
  gsap.set(lightbox, { visibility: 'visible', opacity: 0 });
  lightbox.classList.add('active');

  const tl = gsap.timeline();

  tl.to(lightbox, {
    opacity: 1,
    duration: 0.3,
    ease: 'power2.out',
  }).from(
    '.lightbox-content',
    {
      scale: 0.9,
      duration: 0.4,
      ease: 'back.out(1.4)',
    },
    '-=0.15'
  );

  return tl;
}

/** Lightbox close animation */
export function animateLightboxClose(lightbox: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        lightbox.classList.remove('active');
        gsap.set(lightbox, { visibility: 'hidden' });
        resolve();
      },
    });

    tl.to('.lightbox-content', {
      scale: 0.95,
      duration: 0.25,
      ease: 'power2.in',
    }).to(
      lightbox,
      {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      },
      '-=0.1'
    );
  });
}
