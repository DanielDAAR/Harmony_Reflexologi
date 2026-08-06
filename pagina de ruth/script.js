(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initMobileMenu() {
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!burger || !mobileMenu) return;

    burger.addEventListener('click', () => {
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !isOpen);
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        burger.focus();
      }
    });
  }

  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const threshold = 20;

    function onScroll() {
      const currentScroll = window.scrollY;
      if (currentScroll > threshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
      return;
    }

    const revealElements = document.querySelectorAll('.reveal');
    const footMapContainer = document.getElementById('footMapContainer');

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    if (footMapContainer) {
      const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            footMapContainer.classList.add('in-view');
            mapObserver.unobserve(entry.target);
          }
        });
      }, { ...observerOptions, threshold: 0.25 });
      mapObserver.observe(footMapContainer);
    }
  }

  function initSmoothAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 72;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });

          target.focus({ preventScroll: true });
        }
      });
    });
  }

  function initFloatWA() {
    const floatWA = document.querySelector('.float-wa');
    if (!floatWA) return;

    let lastScroll = 0;
    let ticking = false;

    function onScroll() {
      const currentScroll = window.scrollY;
      const direction = currentScroll > lastScroll ? 'down' : 'up';

      if (direction === 'down' && currentScroll > 200) {
        floatWA.style.transform = 'translateY(80px) scale(0.8)';
        floatWA.style.opacity = '0.6';
        floatWA.style.pointerEvents = 'none';
      } else {
        floatWA.style.transform = 'translateY(0) scale(1)';
        floatWA.style.opacity = '1';
        floatWA.style.pointerEvents = 'auto';
      }
      lastScroll = currentScroll;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  function initFocusVisiblePolyfill() {
    if (!CSS.supports('selector(:focus-visible)')) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('using-keyboard');
        }
      });
      document.addEventListener('mousedown', () => {
        document.body.classList.remove('using-keyboard');
      });
    }
  }

  function init() {
    initMobileMenu();
    initHeaderScroll();
    initScrollReveal();
    initSmoothAnchorScroll();
    initFloatWA();
    initFocusVisiblePolyfill();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();