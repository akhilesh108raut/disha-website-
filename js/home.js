/* DISHA homepage interactions.
   Real values live in the HTML, so everything degrades gracefully without JS. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ---- Count-up stats (counts up TO the value already in the markup) ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (isNaN(target)) return;
    var duration = 900;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    }
    requestAnimationFrame(tick);
  }

  var countEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    countEls.forEach(function (el) { countObserver.observe(el); });
  }
  /* If no observer or reduced motion: markup already shows the final numbers. */

  /* ---- Hub graph: pause SVG motion for reduced-motion users ---- */
  var graph = document.querySelector('.hub-graph');
  if (graph && reduceMotion && typeof graph.pauseAnimations === 'function') {
    graph.pauseAnimations();
  }

  /* ---- Live event feed: cycle through pipeline events ---- */
  var liveBody = document.getElementById('live-body');
  if (liveBody && !reduceMotion) {
    var events = [
      { title: '6 systems synced to the warehouse', src: 'via Unified Warehouse' },
      { title: 'Customer question resolved instantly', src: 'via Customer Chat' },
      { title: 'Policy question answered — role-scoped', src: 'via Team Chat' },
      { title: 'Weekly digest generated for leadership', src: 'via Leadership View' }
    ];
    var liveIndex = 0;
    var titleEl = liveBody.querySelector('.live-title');
    var srcEl = liveBody.querySelector('.live-src');
    setInterval(function () {
      liveBody.classList.add('out');
      setTimeout(function () {
        liveIndex = (liveIndex + 1) % events.length;
        titleEl.textContent = events[liveIndex].title;
        srcEl.textContent = events[liveIndex].src;
        liveBody.classList.remove('out');
      }, 300);
    }, 3400);
  }

  /* ---- Subtle magnetic hover on the hero CTA ---- */
  var cta = document.getElementById('hero-cta');
  if (cta && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    var strength = 3;
    cta.addEventListener('mousemove', function (e) {
      var r = cta.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width - 0.5) * 2 * strength;
      var y = ((e.clientY - r.top) / r.height - 0.5) * 2 * strength;
      cta.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    });
    cta.addEventListener('mouseleave', function () {
      cta.style.transform = '';
    });
  }
})();
