/*
 * Adds zoom (in / out / reset) and fullscreen controls to every Mermaid diagram
 * rendered by astro-mermaid.
 *
 * astro-mermaid renders `<pre class="mermaid">` into an inline <svg> on the client
 * and RE-renders (replacing the <pre>'s innerHTML) on theme toggle / view
 * transitions. So the toolbar must live in a WRAPPER around the <pre> (which
 * survives re-render), and pan/zoom is (re)bound to whatever <svg> is current.
 */
(function () {
  'use strict';

  var WRAP = 'mh-mz-wrap';
  var MIN = 0.5;
  var MAX = 8;
  var state = new WeakMap(); // wrap element -> { scale, x, y }

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  function getState(wrap) {
    var s = state.get(wrap);
    if (!s) { s = { scale: 1, x: 0, y: 0 }; state.set(wrap, s); }
    return s;
  }

  function svgOf(wrap) {
    var pre = wrap.querySelector('pre.mermaid');
    return pre ? pre.querySelector('svg') : null;
  }

  function apply(wrap) {
    var s = getState(wrap);
    var svg = svgOf(wrap);
    if (!svg) return;
    svg.style.transformOrigin = 'center center';
    svg.style.transform = 'translate(' + s.x + 'px,' + s.y + 'px) scale(' + s.scale + ')';
    svg.style.cursor = s.scale > 1 ? 'grab' : '';
  }

  function zoom(wrap, factor) {
    var s = getState(wrap);
    s.scale = clamp(s.scale * factor, MIN, MAX);
    if (s.scale === 1) { s.x = 0; s.y = 0; }
    apply(wrap);
  }

  function reset(wrap) {
    var s = getState(wrap);
    s.scale = 1; s.x = 0; s.y = 0;
    apply(wrap);
  }

  // In-page modal overlay (not the native Fullscreen API). Moves the wrapper into a
  // fixed overlay and back, preserving its toolbar, SVG, and zoom state.
  var openWrap = null;      // currently maximized wrapper
  var placeholder = null;   // marks where to move it back
  var modal = null;

  function openModal(wrap) {
    if (openWrap) closeModal();
    placeholder = document.createComment('mh-mz-placeholder');
    wrap.parentNode.insertBefore(placeholder, wrap);

    modal = document.createElement('div');
    modal.className = 'mh-mz-modal';
    modal.appendChild(wrap);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    wrap.classList.add('mh-mz-fs');
    openWrap = wrap;
    reset(wrap);

    // Backdrop click (outside the diagram) closes.
    modal.addEventListener('pointerdown', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  function closeModal() {
    if (!openWrap) return;
    openWrap.classList.remove('mh-mz-fs');
    reset(openWrap);
    placeholder.parentNode.insertBefore(openWrap, placeholder);
    placeholder.remove();
    modal.remove();
    document.body.style.overflow = '';
    openWrap = null; placeholder = null; modal = null;
  }

  function toggleFullscreen(wrap) {
    if (openWrap === wrap) closeModal();
    else openModal(wrap);
  }

  function makeBtn(label, title, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'mh-mz-btn';
    b.title = title;
    b.setAttribute('aria-label', title);
    b.innerHTML = label;
    b.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });
    return b;
  }

  function bindSvg(wrap) {
    var pre = wrap.querySelector('pre.mermaid');
    var svg = pre && pre.querySelector('svg');
    if (!svg || svg.dataset.mzBound) return;
    svg.dataset.mzBound = '1';

    // Wheel zoom — require Ctrl/Cmd unless maximized, so page scroll isn't hijacked.
    pre.addEventListener('wheel', function (e) {
      if (openWrap !== wrap && !e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoom(wrap, e.deltaY < 0 ? 1.1 : 1 / 1.1);
    }, { passive: false });

    // Drag to pan when zoomed in.
    var dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
    svg.addEventListener('pointerdown', function (e) {
      var s = getState(wrap);
      if (s.scale <= 1) return;
      dragging = true; sx = e.clientX; sy = e.clientY; ox = s.x; oy = s.y;
      try { svg.setPointerCapture(e.pointerId); } catch (_) {}
      svg.style.cursor = 'grabbing';
    });
    svg.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var s = getState(wrap);
      s.x = ox + (e.clientX - sx);
      s.y = oy + (e.clientY - sy);
      apply(wrap);
    });
    function end() { if (dragging) { dragging = false; svg.style.cursor = 'grab'; } }
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);
  }

  function enhance(pre) {
    var wrap = pre.parentElement;
    if (!wrap || !wrap.classList.contains(WRAP)) {
      wrap = document.createElement('div');
      wrap.className = WRAP;
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      var bar = document.createElement('div');
      bar.className = 'mh-mz-bar';
      bar.appendChild(makeBtn('−', 'Zoom out', function () { zoom(wrap, 1 / 1.2); }));
      bar.appendChild(makeBtn('↺', 'Reset zoom', function () { reset(wrap); }));
      bar.appendChild(makeBtn('+', 'Zoom in', function () { zoom(wrap, 1.2); }));
      bar.appendChild(makeBtn('⛶', 'Fullscreen', function () { toggleFullscreen(wrap); }));
      wrap.appendChild(bar);
    }
    bindSvg(wrap);
    apply(wrap);
  }

  function scan() {
    var list = document.querySelectorAll('pre.mermaid[data-processed]');
    for (var i = 0; i < list.length; i++) enhance(list[i]);
  }

  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () { scheduled = false; scan(); });
  }

  function start() {
    scan();
    new MutationObserver(schedule).observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-processed']
    });
  }

  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);

  // Astro View Transitions swap in new content without a full reload.
  document.addEventListener('astro:after-swap', function () {
    if (openWrap) closeModal();
    setTimeout(scan, 50);
  });

  // Escape closes the maximized view.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openWrap) closeModal();
  });
})();
