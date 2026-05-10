/**
 * BarberíaOS Booking Widget v1.0.0
 * ─────────────────────────────────
 * Renders an isolated floating "Reservar ahora" button on any external website.
 *
 * Usage:
 *   <script src="https://barberiaos.com/widget.js"
 *           data-barbershop="slug-de-tu-barberia"
 *           async></script>
 *
 * Optional attributes:
 *   data-label        Custom button text (default: "Reservar ahora")
 *   data-position     "bottom-right" | "bottom-left"  (default: "bottom-right")
 *   data-offset-x     Horizontal offset in px  (default: 20)
 *   data-offset-y     Vertical offset in px    (default: 20)
 *
 * Security:
 *   - No cookies set.
 *   - No user data collected.
 *   - No external requests made.
 *   - Shadow DOM isolates all styles from the host page.
 */
(function () {
  "use strict";

  /* ── Constants ────────────────────────────────────────────────────────── */

  var WIDGET_ID   = "barberiaos-widget-root";
  var SLUG_RE     = /^[a-z0-9][a-z0-9-]{0,78}[a-z0-9]$|^[a-z0-9]{2}$/;
  var FALLBACK_ORIGIN = "https://barberiaos.com";

  /* ── Find our own script tag ─────────────────────────────────────────── */
  // document.currentScript is null for async scripts, so we search by attribute.
  var scriptEl = document.querySelector("script[data-barbershop]");
  if (!scriptEl) return;

  /* ── Read configuration from script attributes ──────────────────────── */

  var slug = (scriptEl.getAttribute("data-barbershop") || "").trim().toLowerCase();
  if (!slug || !SLUG_RE.test(slug)) {
    if (typeof console !== "undefined") {
      console.warn("[BarberíaOS] data-barbershop inválido o ausente. El widget no se cargará.");
    }
    return;
  }

  var label    = (scriptEl.getAttribute("data-label") || "Reservar ahora").trim();
  var position = scriptEl.getAttribute("data-position") === "bottom-left" ? "bottom-left" : "bottom-right";
  var offsetX  = parseInt(scriptEl.getAttribute("data-offset-x") || "20", 10) || 20;
  var offsetY  = parseInt(scriptEl.getAttribute("data-offset-y") || "20", 10) || 20;

  /* ── Derive base URL from the script's own src ──────────────────────── */

  var origin = FALLBACK_ORIGIN;
  try {
    var rawSrc = scriptEl.getAttribute("src") || "";
    if (rawSrc.indexOf("http") === 0) {
      origin = new URL(rawSrc).origin;
    }
  } catch (_) { /* keep fallback */ }

  var bookingUrl = origin + "/r/" + slug;

  /* ── Prevent double-init ─────────────────────────────────────────────── */

  if (document.getElementById(WIDGET_ID)) return;

  /* ── Build and mount the widget ─────────────────────────────────────── */

  function mount() {
    /* Guard: body must exist */
    if (!document.body) return;

    /* ── Host element (position: fixed, full isolation) ── */
    var host = document.createElement("div");
    host.id = WIDGET_ID;

    var hostStyle = host.style;
    hostStyle.position = "fixed";
    hostStyle.bottom   = offsetY + "px";
    hostStyle.zIndex   = "2147483647";  /* max possible z-index */
    hostStyle.display  = "block";
    hostStyle.lineHeight = "1";
    hostStyle.pointerEvents = "none"; /* host itself is click-through */

    if (position === "bottom-left") {
      hostStyle.left  = offsetX + "px";
      hostStyle.right = "auto";
    } else {
      hostStyle.right = offsetX + "px";
      hostStyle.left  = "auto";
    }

    /* ── Shadow DOM (full CSS isolation) ── */
    var shadow = host.attachShadow({ mode: "open" });

    /* ── Styles ── */
    var styleEl = document.createElement("style");
    styleEl.textContent = [
      /* CSS custom properties — theme-ready for future dark/light overrides */
      ":host {",
      "  --bos-bg:          #080A0F;",
      "  --bos-bg-hover:    #111520;",
      "  --bos-text:        #D5A84C;",
      "  --bos-border:      rgba(213,168,76,0.28);",
      "  --bos-shadow:      0 4px 24px rgba(8,10,15,0.32), 0 1px 4px rgba(8,10,15,0.18);",
      "  --bos-shadow-hover:0 8px 32px rgba(8,10,15,0.42), 0 2px 6px rgba(8,10,15,0.20);",
      "  --bos-radius:      100px;",
      "  --bos-font:        -apple-system,BlinkMacSystemFont,'Inter','Segoe UI',system-ui,sans-serif;",
      "  all: initial;",
      "}",

      ".btn {",
      "  display:         inline-flex;",
      "  align-items:     center;",
      "  gap:             8px;",
      "  padding:         13px 22px;",
      "  background:      var(--bos-bg);",
      "  color:           var(--bos-text);",
      "  font-family:     var(--bos-font);",
      "  font-size:       14px;",
      "  font-weight:     700;",
      "  letter-spacing:  0.01em;",
      "  line-height:     1;",
      "  border-radius:   var(--bos-radius);",
      "  border:          1.5px solid var(--bos-border);",
      "  text-decoration: none;",
      "  cursor:          pointer;",
      "  white-space:     nowrap;",
      "  user-select:     none;",
      "  -webkit-user-select: none;",
      "  pointer-events:  auto;",
      "  box-shadow:      var(--bos-shadow);",
      "  transition:      transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;",
      "  animation:       bos-enter 0.38s cubic-bezier(0.34,1.56,0.64,1) both;",
      "  animation-delay: 0.6s;",   /* slight delay so it doesn't distract on load */
      "}",

      ".btn:hover {",
      "  background:  var(--bos-bg-hover);",
      "  box-shadow:  var(--bos-shadow-hover);",
      "  transform:   translateY(-2px);",
      "}",

      ".btn:active {",
      "  transform:   translateY(0px);",
      "  box-shadow:  var(--bos-shadow);",
      "}",

      ".btn:focus-visible {",
      "  outline:        2px solid #2563EB;",
      "  outline-offset: 3px;",
      "}",

      ".icon {",
      "  flex-shrink: 0;",
      "  width:       16px;",
      "  height:      16px;",
      "}",

      "@keyframes bos-enter {",
      "  from { opacity: 0; transform: translateY(10px) scale(0.95); }",
      "  to   { opacity: 1; transform: translateY(0)    scale(1);    }",
      "}",

      "@media (prefers-reduced-motion: reduce) {",
      "  .btn { animation: none; transition: none; }",
      "}",

      "@media (max-width: 480px) {",
      "  .btn { padding: 12px 18px; font-size: 13px; }",
      "}",
    ].join("\n");

    /* ── Calendar-check SVG icon (inline, no external request) ── */
    var NS   = "http://www.w3.org/2000/svg";
    var svg  = document.createElementNS(NS, "svg");
    svg.setAttribute("class",           "icon");
    svg.setAttribute("viewBox",         "0 0 24 24");
    svg.setAttribute("fill",            "none");
    svg.setAttribute("stroke",          "currentColor");
    svg.setAttribute("stroke-width",    "2");
    svg.setAttribute("stroke-linecap",  "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden",     "true");

    /* calendar-check paths from Lucide */
    var paths = [
      ["rect", { x:"3", y:"4", width:"18", height:"18", rx:"2", ry:"2" }],
      ["line", { x1:"16", y1:"2",  x2:"16", y2:"6"  }],
      ["line", { x1:"8",  y1:"2",  x2:"8",  y2:"6"  }],
      ["line", { x1:"3",  y1:"10", x2:"21", y2:"10" }],
      ["path", { d:"m9 16 2 2 4-4" }],
    ];

    paths.forEach(function (def) {
      var el = document.createElementNS(NS, def[0]);
      var attrs = def[1];
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
      svg.appendChild(el);
    });

    /* ── Anchor element ── */
    var link = document.createElement("a");
    link.className  = "btn";
    link.href       = bookingUrl;
    link.target     = "_blank";
    link.rel        = "noopener noreferrer";
    link.setAttribute("aria-label", label + " — BarberíaOS");

    var labelSpan = document.createElement("span");
    labelSpan.textContent = label;

    link.appendChild(svg);
    link.appendChild(labelSpan);

    /* ── Assemble ── */
    shadow.appendChild(styleEl);
    shadow.appendChild(link);
    document.body.appendChild(host);
  }

  /* ── Init: wait for DOM if needed ─────────────────────────────────────── */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }

})();
