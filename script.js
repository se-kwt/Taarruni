(function () {
  'use strict';

  const navToggle = document.querySelector('.header__toggle');
  const nav = document.querySelector('.header__nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      }
    });
  }

  // Services dropdown (hover to open, click still works for touch/mobile)
  var servicesDropdown = document.getElementById('header-services-dropdown');
  var servicesTrigger = document.getElementById('header-services-trigger');
  var servicesMenu = document.getElementById('header-services-menu');
  var servicesCloseTimeout;
  function openServicesDropdown() {
    if (servicesCloseTimeout) clearTimeout(servicesCloseTimeout);
    servicesCloseTimeout = null;
    servicesDropdown.classList.add('is-open');
    servicesTrigger.setAttribute('aria-expanded', 'true');
  }
  function closeServicesDropdown() {
    servicesDropdown.classList.remove('is-open');
    servicesTrigger.setAttribute('aria-expanded', 'false');
  }
  function scheduleCloseServices() {
    if (servicesCloseTimeout) clearTimeout(servicesCloseTimeout);
    servicesCloseTimeout = setTimeout(closeServicesDropdown, 120);
  }
  if (servicesDropdown && servicesTrigger && servicesMenu) {
    servicesDropdown.addEventListener('mouseenter', openServicesDropdown);
    servicesDropdown.addEventListener('mouseleave', scheduleCloseServices);
    servicesMenu.addEventListener('mouseenter', openServicesDropdown);
    servicesMenu.addEventListener('mouseleave', scheduleCloseServices);
    servicesTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = servicesDropdown.classList.toggle('is-open');
      servicesTrigger.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', function (e) {
      if (servicesDropdown.classList.contains('is-open') && !servicesDropdown.contains(e.target)) {
        closeServicesDropdown();
      }
    });
    servicesMenu.querySelectorAll('.header__dropdown-item').forEach(function (item) {
      item.addEventListener('click', function () {
        closeServicesDropdown();
        if (nav && nav.classList.contains('open') && navToggle) {
          nav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Smooth scroll for anchor links (handled by CSS scroll-behavior; this is for any extra behavior)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nav && nav.classList.contains('open')) {
          navToggle.setAttribute('aria-expanded', 'false');
          nav.classList.remove('open');
        }
      }
    });
  });

  // Portfolio tabs: filter by category
  const portfolioTabs = document.querySelectorAll('[data-portfolio-tab]');
  const portfolioCards = document.querySelectorAll('[data-portfolio-category]');

  function applyPortfolioFilter(value) {
    portfolioCards.forEach(function (card) {
      var show = value === 'all' || card.getAttribute('data-portfolio-category') === value;
      card.classList.toggle('is-hidden', !show);
    });
  }

  if (portfolioTabs.length && portfolioCards.length) {
    applyPortfolioFilter('all');
    portfolioTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var value = this.getAttribute('data-portfolio-tab');
        portfolioTabs.forEach(function (t) {
          t.classList.toggle('is-active', t === tab);
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        applyPortfolioFilter(value);
      });
    });
  }

  // Clients image carousel – infinite loop
  var carouselTrack = document.querySelector('.clients-carousel-track');
  var carouselViewport = document.querySelector('.clients-carousel-viewport');
  var prevBtn = document.querySelector('.clients-carousel-btn--prev');
  var nextBtn = document.querySelector('.clients-carousel-btn--next');
  if (carouselTrack && carouselViewport && prevBtn && nextBtn) {
    var slides = carouselTrack.querySelectorAll('.clients-slide');
    var count = slides.length;
    for (var i = 0; i < count; i++) {
      carouselTrack.appendChild(slides[i].cloneNode(true));
    }
    var slideWidth = 160;
    var gap = 24;
    var step = slideWidth + gap;
    var visible = 4;
    var current = 0;

    function applyTransform(noTransition) {
      if (noTransition) carouselTrack.style.transition = 'none';
      carouselTrack.style.transform = 'translateX(-' + (current * step) + 'px)';
      if (noTransition) {
        carouselTrack.offsetHeight;
        carouselTrack.style.transition = '';
      }
    }

    function onTransitionEnd() {
      if (current >= count) {
        current = 0;
        applyTransform(true);
      }
    }

    carouselTrack.addEventListener('transitionend', onTransitionEnd);

    function next() {
      current++;
      applyTransform(false);
    }

    function prev() {
      if (current <= 0) {
        current = count;
        applyTransform(true);
        setTimeout(function () {
          current--;
          applyTransform(false);
        }, 20);
      } else {
        current--;
        applyTransform(false);
      }
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    setInterval(next, 4000);
  }

  // Entrance Animations
  const onAnimationEnd = (e) => {
    if (e.animationName === 'fadeUp' || e.animationName === 'zoomIn' || e.animationName === 'fadeRight') {
      const el = e.target;
      el.classList.remove('reveal', 'zoom-in', 'fade-right', 'active');
      el.style.animationDelay = '';
      el.removeEventListener('animationend', onAnimationEnd);
    }
  };

  const animOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const animOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add("active");
        observer.unobserve(el);
      }
    });
  }, animOptions);

  // Hero section animations on load
  const heroItems = document.querySelectorAll('.hero-badge, .hero-title, .hero-desc, .hero-actions, .hero-meta, .hero-stack');
  heroItems.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.animationDelay = `${index * 0.1}s`;
    el.addEventListener('animationend', onAnimationEnd);
    setTimeout(() => {
      el.classList.add('active');
    }, 100);
  });

  const heroCodeCard = document.querySelector('.code-window');
  if (heroCodeCard) {
    heroCodeCard.classList.add('zoom-in');
    heroCodeCard.style.animationDelay = '0.6s';
    heroCodeCard.addEventListener('animationend', onAnimationEnd);
    setTimeout(() => {
      heroCodeCard.classList.add('active');
    }, 100);
  }

  // Staggered section headers & text contents
  const textBlocks = document.querySelectorAll('.section-label, .section-title, .section-sub, .about-label, .about-heading, .about-lead, .about-body, .about-points li, .about-cta-wrap, .contact-form__heading');
  textBlocks.forEach((el) => {
    el.classList.add('reveal');
    el.addEventListener('animationend', onAnimationEnd);
    animOnScroll.observe(el);
  });

  // Footer staggering
  const footerItems = document.querySelectorAll('.footer__left, .footer__right');
  footerItems.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.animationDelay = `${index * 0.2}s`;
    el.addEventListener('animationend', onAnimationEnd);
    animOnScroll.observe(el);
  });

  // Grids with staggered zoom-in
  const grids = document.querySelectorAll('.services-grid, .blog-grid, .portfolio-bento, .testimonials-grid');
  grids.forEach(grid => {
    Array.from(grid.children).forEach((child, index) => {
      child.classList.add('zoom-in');
      child.style.animationDelay = `${index * 0.15}s`;
      child.addEventListener('animationend', onAnimationEnd);
      animOnScroll.observe(child);
    });
  });

  // Specific isolated zoom-in elements
  const singleZoom = document.querySelectorAll('.about-figure img, .contact-card, .contact-form, .contact-map-wrap');
  singleZoom.forEach((el, index) => {
    el.classList.add('zoom-in');
    el.style.animationDelay = `${(index % 3) * 0.15}s`;
    el.addEventListener('animationend', onAnimationEnd);
    animOnScroll.observe(el);
  });

})();
