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

  /* ---- Architecture connectors: pause SVG motion for reduced-motion users ---- */
  if (reduceMotion) {
    document.querySelectorAll('.arch svg').forEach(function (svg) {
      if (typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
    });
  }

  /* ---- Capability accordion: one open at a time, animated height ---- */
  var capItems = Array.prototype.slice.call(document.querySelectorAll('.cap-item'));
  if (capItems.length) {
    function closeItem(item) {
      var btn = item.querySelector('.cap-summary');
      var panel = item.querySelector('.cap-panel');
      btn.setAttribute('aria-expanded', 'false');
      panel.style.maxHeight = null;
      item.classList.remove('open');
    }
    function openItem(item) {
      var btn = item.querySelector('.cap-summary');
      var panel = item.querySelector('.cap-panel');
      btn.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
      item.classList.add('open');
    }
    capItems.forEach(function (item) {
      var btn = item.querySelector('.cap-summary');
      btn.addEventListener('click', function () {
        var wasOpen = item.classList.contains('open');
        capItems.forEach(closeItem);
        if (!wasOpen) openItem(item);
      });
    });
    // Keep an open panel correctly sized if the viewport reflows it
    var capResizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(capResizeTimer);
      capResizeTimer = setTimeout(function () {
        var openItemEl = document.querySelector('.cap-item.open');
        if (openItemEl) {
          var panel = openItemEl.querySelector('.cap-panel');
          panel.style.maxHeight = 'none';
          var h = panel.scrollHeight;
          panel.style.maxHeight = h + 'px';
        }
      }, 120);
    });
  }

  /* ---- Live activity feed: prepend new platform events ---- */
  var activityList = document.getElementById('activity-list');
  if (activityList && !reduceMotion) {
    var eventPool = [
      { text: 'Shipment #4812 delayed — alternate route suggested', tag: 'Ops', cls: 'warn' },
      { text: 'Invoice anomaly flagged for review', tag: 'Finance', cls: 'danger' },
      { text: 'Customer refund resolved in chat', tag: 'Support', cls: 'success' },
      { text: 'Demand forecast refreshed for Q3', tag: 'AI', cls: 'info' },
      { text: 'New lead auto-assigned to sales', tag: 'CRM', cls: 'success' },
      { text: 'Nightly ETL completed — 42 systems synced', tag: 'Platform', cls: 'info' },
      { text: 'Stock-out risk detected for SKU 2218', tag: 'AI', cls: 'warn' },
      { text: 'Weekly KPI digest sent to leadership', tag: 'Reports', cls: 'success' }
    ];
    var poolIndex = 0;

    function clockNow() {
      var d = new Date();
      return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    }

    setInterval(function () {
      var evt = eventPool[poolIndex];
      poolIndex = (poolIndex + 1) % eventPool.length;

      var li = document.createElement('li');
      li.className = 'evt evt-' + evt.cls + ' enter';

      var time = document.createElement('span');
      time.className = 'evt-time';
      time.textContent = clockNow();

      var text = document.createElement('span');
      text.className = 'evt-text';
      text.textContent = evt.text;

      var tag = document.createElement('span');
      tag.className = 'evt-tag';
      tag.textContent = evt.tag;

      li.appendChild(time);
      li.appendChild(text);
      li.appendChild(tag);
      activityList.insertBefore(li, activityList.firstChild);

      requestAnimationFrame(function () {
        requestAnimationFrame(function () { li.classList.remove('enter'); });
      });

      while (activityList.children.length > 6) {
        activityList.removeChild(activityList.lastChild);
      }
    }, 3600);
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
