;(function ($, window, document, undefined) {
  'use strict';

  var $winW = () => $(window).width();
  var screencheck = (px) => (window.matchMedia ? window.matchMedia(`(max-width:${px}px)`).matches : $winW() <= px);

  $(function () {
    // ---------------- PRELOADER ----------------
    $(window).on('load', function () { $('.preloader').fadeOut(300); });
    setTimeout(function () { $('.preloader').fadeOut(300); }, 2000);

    // ---------------- ANIMATIONS ----------------
    $('.animated-row').each(function () {
      $(this).find('.animate').each(function (i) {
        var $item = $(this), anim = $item.data('animate');
        $item.on('inview', function (e, inView) {
          if (inView) setTimeout(() => $item.addClass('animated ' + anim).removeClass('animate'), i * 50);
          else if (!screencheck(767)) $item.removeClass('animated ' + anim).addClass('animate');
        });
      });
    });

    // ---------------- FACTS CAROUSEL ----------------
    if ($('.facts-list').length) {
      $('.facts-list').owlCarousel({
        loop:true, nav:false, dots:true, smartSpeed:700, autoplay:false,
        responsive:{0:{items:1,margin:0},576:{items:2,margin:20},992:{items:3,margin:30}}
      });
    }

    // ---------------- SERVICES CAROUSEL ----------------
    if ($('.services-list').length) {
      $('.services-list').owlCarousel({
        loop:false, nav:false, dots:true, smartSpeed:700, autoplay:false,
        responsive:{0:{items:1,margin:0},576:{items:2,margin:20},992:{items:2,margin:30}}
      });
    }

    // ---------------- PROJECTS CAROUSEL ----------------
    if ($('.gallery-list').length) {
      var $owl = $('.gallery-list').owlCarousel({
        loop:true, nav:false, dots:true, smartSpeed:650,
        autoplay:true, autoplayTimeout:4000, autoplayHoverPause:true,
        responsive:{
          0:   { items:1, margin:0  },
          576: { items:2, margin:18 },
          992: { items:3, margin:24 }
        }
      });

      // Guard clicks during drag so full-card links still open
      (function(){
        var dragging = false;
        $owl.on('drag.owl.carousel', function(){ dragging = true; });
        $owl.on('dragged.owl.carousel', function(){ setTimeout(function(){ dragging = false; }, 0); });
        $owl.on('click', 'a.portfolio-link', function(e){
          if (dragging) { e.preventDefault(); return; }
        });
      })();
    }

    // ---------------- TESTIMONIALS CAROUSEL ----------------
    if ($('.testimonials-slider').length) {
      $('.testimonials-slider').owlCarousel({
        loop:true, nav:false, dots:true, items:1, margin:30, smartSpeed:700, autoplay:false
      });
    }

    // ---------------- FULLPAGE / NATIVE SCROLL ----------------
    try {
      if ($('.fullpage-default').length && window.fullpage) {
        if (window.fullpage_api && typeof fullpage_api.destroy === 'function') {
          fullpage_api.destroy('all');
        }
        new fullpage('.fullpage-default', {
          licenseKey: 'C7F41B00-5E824594-9A5EFB99-B556A3D5',
          anchors: ['slide01','slide02','slide03','slide04','slide05','slide06','slide07'],
          menu: '#nav',
          navigation: true,
          navigationPosition: 'right',

          // native scroll, no snapping
          autoScrolling: false,
          fitToSection: false,
          scrollBar: true,
          scrollOverflow: false,

          // let carousels handle their own wheel/touch
          normalScrollElements: '.gallery-list, .owl-carousel, .testimonials-slider',

          css3: true,
          scrollingSpeed: 700,
          paddingTop: (($('#header').outerHeight() || 0)) + 'px'
        });
      }
    } catch (e) {
      console.error('fullPage init error:', e);
      $('.preloader').fadeOut(300);
    }

    // ---------------- MOBILE NAV (stable; no instant close) ----------------
    (function mobileNavFix(){
      var $navBox = $('.nav-box, .navbar-collapse').first();   // supports both class names
      var OPEN = 'is-open';

      // wipe any earlier conflicting handlers
      $(document).off('.navfix');
      $('.navbar-toggle').off('.navfix');
      $navBox.off('.navfix');
      $('.navigation-menu > li > a').off('.navfix');

      // toggle on hamburger
      $('.navbar-toggle').on('click.navfix', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if ($navBox.hasClass(OPEN)) {
          $navBox.stop(true, true).slideUp(200).removeClass(OPEN);
          $('body').removeClass('nav-open');
        } else {
          $navBox.stop(true, true).slideDown(220).addClass(OPEN);
          $('body').addClass('nav-open');
        }
      });

      // clicks inside menu shouldn't close it
      $navBox.on('click.navfix', function (e) { e.stopPropagation(); });

      // close when clicking a nav link (mobile only)
      $('.navigation-menu > li > a').on('click.navfix', function(){
        if (window.innerWidth < 992) {
          $navBox.stop(true, true).slideUp(200).removeClass(OPEN);
          $('body').removeClass('nav-open');
        }
      });

      // click outside closes
      $(document).on('click.navfix', function(){
        if ($navBox.hasClass(OPEN)) {
          $navBox.stop(true, true).slideUp(200).removeClass(OPEN);
          $('body').removeClass('nav-open');
        }
      });

      // ESC closes
      $(document).on('keydown.navfix', function(e){
        if (e.key === 'Escape' && $navBox.hasClass(OPEN)) {
          $navBox.stop(true, true).slideUp(200).removeClass(OPEN);
          $('body').removeClass('nav-open');
        }
      });

      // reset state on resize
      $(window).on('resize.navfix', function(){
        if (window.innerWidth >= 992) {
          $navBox.show().removeClass(OPEN);
          $('body').removeClass('nav-open');
        } else {
          $navBox.hide().removeClass(OPEN);
          $('body').removeClass('nav-open');
        }
      }).trigger('resize.navfix');
    })();

    // ---------------- COUNTERS ----------------
    $('.facts-row').on('inview', function () {
      $('.count-number').each(function () {
        $(this).prop('Counter', 0).animate({ Counter: $(this).text() }, {
          duration: 1000, easing: 'swing',
          step: function (now) { $(this).text(Math.ceil(now)); }
        });
        setTimeout(function () { $('.count-number').removeClass('count-number').addClass('counted'); }, 1000);
      });
    });

    // ---------------- SMOOTH SCROLL NAVIGATION ----------------
    document.querySelectorAll('#nav a[href^="#slide"]').forEach(a => {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        const anchor = this.getAttribute('href').slice(1);
        const target = document.querySelector(`[data-section="${anchor}"]`) || document.getElementById(anchor);
        if (!target) return;

        const header = document.getElementById('header');
        const offset = (header ? header.offsetHeight : 0) + 8;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, '', '#' + anchor);
      });
    });

    // ---------------- KEEP HEADER HEIGHT SYNCED ----------------
    (function setHeaderHeightVar(){
      const set = () => {
        const h = (document.getElementById('header') || {}).offsetHeight || 80;
        document.documentElement.style.setProperty('--header-h', h + 'px');
      };
      set();
      window.addEventListener('resize', set);
    })();

    // ---------------- STICKY HEADER + ACTIVE UNDERLINE ----------------
    $(window).on('scroll', function () {
      $('#header').toggleClass('is-stuck', window.scrollY > 10);
    });

    (function trackActiveSection(){
      const header = document.getElementById('header');
      const headerH = (header ? header.offsetHeight : 80);

      const setActive = (id) => {
        document.querySelectorAll('#nav li').forEach(li => {
          const a = li.querySelector('a[href^="#slide"]');
          li.classList.toggle('active', !!(a && a.getAttribute('href') === '#' + id));
        });
      };

      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            if (id) setActive(id);
          }
        });
      }, {
        root: null,
        rootMargin: `-${headerH + 8}px 0px -40% 0px`,
        threshold: 0.2
      });

      document.querySelectorAll('[data-section]').forEach(sec => io.observe(sec));

      const initial = (location.hash || '#slide01').replace('#','');
      setActive(initial);

      document.querySelectorAll('#nav a[href^="#slide"]').forEach(a => {
        a.addEventListener('click', () => {
          const id = a.getAttribute('href').slice(1);
          setActive(id);
        });
      });
    })();

  });
})(jQuery, window, document);
