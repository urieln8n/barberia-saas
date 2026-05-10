/*!
 * BarberiaOS Booking Widget v1.0.0
 *
 * Installation:
 * <script src="https://barberiaos.com/widget.js" data-barbershop="slug-barberia" async></script>
 *
 * Optional attributes:
 * - data-theme: "dark" | "light" | "gold"
 * - data-position: "bottom-right" | "bottom-left" | "top-right" | "top-left"
 * - data-label: custom button text
 *
 * Privacy:
 * - No cookies.
 * - No personal data collection.
 * - No external dependencies.
 */
(function () {
  "use strict";

  var GLOBAL_KEY = "__barberiaOSWidgetMounted";
  var ROOT_ID = "barberiaos-widget-root";
  var SCRIPT_FLAG = "data-barberiaos-widget-script";
  var BOOKING_ORIGIN = "https://barberiaos.com";
  var DEFAULT_LABEL = "Reservar ahora";
  var VALID_THEMES = { dark: true, light: true, gold: true };
  var VALID_POSITIONS = {
    "bottom-right": true,
    "bottom-left": true,
    "top-right": true,
    "top-left": true
  };

  function warn(message) {
    if (typeof window.console !== "undefined" && typeof window.console.warn === "function") {
      window.console.warn("[BarberiaOS Widget] " + message);
    }
  }

  function getCurrentScript() {
    if (document.currentScript) {
      return document.currentScript;
    }

    var scripts = document.getElementsByTagName("script");
    for (var index = scripts.length - 1; index >= 0; index -= 1) {
      var script = scripts[index];
      var src = script.getAttribute("src") || "";
      if (src.indexOf("widget.js") !== -1 && !script.hasAttribute(SCRIPT_FLAG)) {
        return script;
      }
    }

    return null;
  }

  function normalizeSlug(value) {
    return (value || "").replace(/^\s+|\s+$/g, "").toLowerCase();
  }

  function isValidSlug(slug) {
    return /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/.test(slug);
  }

  function readConfig(script) {
    var rawSlug = script ? script.getAttribute("data-barbershop") : "";
    var slug = normalizeSlug(rawSlug);

    if (!slug) {
      warn("Falta data-barbershop. El widget no se mostrara.");
      return null;
    }

    if (!isValidSlug(slug)) {
      warn("data-barbershop no es valido. El widget no se mostrara.");
      return null;
    }

    var label = (script.getAttribute("data-label") || DEFAULT_LABEL).replace(/^\s+|\s+$/g, "");
    var theme = (script.getAttribute("data-theme") || "dark").toLowerCase();
    var position = (script.getAttribute("data-position") || "bottom-right").toLowerCase();

    return {
      slug: slug,
      label: label || DEFAULT_LABEL,
      theme: VALID_THEMES[theme] ? theme : "dark",
      position: VALID_POSITIONS[position] ? position : "bottom-right"
    };
  }

  function alreadyMounted() {
    return Boolean(window[GLOBAL_KEY] || document.getElementById(ROOT_ID));
  }

  function setPosition(host, position) {
    var offset = "20px";

    host.style.position = "fixed";
    host.style.zIndex = "2147483647";
    host.style.pointerEvents = "none";
    host.style.lineHeight = "1";

    if (position.indexOf("top") === 0) {
      host.style.top = offset;
      host.style.bottom = "auto";
    } else {
      host.style.bottom = offset;
      host.style.top = "auto";
    }

    if (position.indexOf("left") !== -1) {
      host.style.left = offset;
      host.style.right = "auto";
    } else {
      host.style.right = offset;
      host.style.left = "auto";
    }
  }

  function createIcon() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    var paths = [
      ["path", { d: "M8 2v4" }],
      ["path", { d: "M16 2v4" }],
      ["rect", { x: "3", y: "4", width: "18", height: "18", rx: "3" }],
      ["path", { d: "M3 10h18" }],
      ["path", { d: "m9 16 2 2 4-4" }]
    ];

    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("class", "bos-icon");

    paths.forEach(function (item) {
      var element = document.createElementNS(ns, item[0]);
      var attrs = item[1];
      Object.keys(attrs).forEach(function (key) {
        element.setAttribute(key, attrs[key]);
      });
      svg.appendChild(element);
    });

    return svg;
  }

  function mount(config) {
    if (!document.body || alreadyMounted()) {
      return;
    }

    window[GLOBAL_KEY] = true;

    var host = document.createElement("div");
    host.id = ROOT_ID;
    host.setAttribute("data-theme", config.theme);
    setPosition(host, config.position);

    var shadow = host.attachShadow ? host.attachShadow({ mode: "closed" }) : host;
    var style = document.createElement("style");
    var link = document.createElement("a");
    var label = document.createElement("span");

    style.textContent = [
      ":host{all:initial;}",
      ".bos-theme-dark{",
      "  --bos-bg:#080a0f;",
      "  --bos-bg-hover:#121720;",
      "  --bos-text:#f6d17a;",
      "  --bos-border:rgba(246,209,122,.35);",
      "  --bos-shadow:0 18px 45px rgba(0,0,0,.24),0 4px 14px rgba(0,0,0,.16);",
      "}",
      ".bos-theme-light{",
      "  --bos-bg:#ffffff;",
      "  --bos-bg-hover:#f6f1e8;",
      "  --bos-text:#111827;",
      "  --bos-border:rgba(17,24,39,.16);",
      "  --bos-shadow:0 18px 45px rgba(17,24,39,.18),0 4px 14px rgba(17,24,39,.10);",
      "}",
      ".bos-theme-gold{",
      "  --bos-bg:#c9922a;",
      "  --bos-bg-hover:#b8832a;",
      "  --bos-text:#080a0f;",
      "  --bos-border:rgba(8,10,15,.12);",
      "  --bos-shadow:0 18px 45px rgba(201,146,42,.30),0 4px 14px rgba(0,0,0,.14);",
      "}",
      ".bos-button{",
      "  box-sizing:border-box;",
      "  display:inline-flex;",
      "  align-items:center;",
      "  justify-content:center;",
      "  gap:10px;",
      "  min-height:48px;",
      "  max-width:calc(100vw - 32px);",
      "  padding:0 20px;",
      "  border:1px solid var(--bos-border);",
      "  border-radius:999px;",
      "  background:var(--bos-bg);",
      "  color:var(--bos-text);",
      "  box-shadow:var(--bos-shadow);",
      "  font:700 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;",
      "  letter-spacing:0;",
      "  text-decoration:none;",
      "  white-space:nowrap;",
      "  cursor:pointer;",
      "  pointer-events:auto;",
      "  user-select:none;",
      "  -webkit-tap-highlight-color:transparent;",
      "  transform:translateZ(0);",
      "  transition:transform .18s ease,box-shadow .18s ease,background-color .18s ease;",
      "}",
      ".bos-button:hover{",
      "  background:var(--bos-bg-hover);",
      "  transform:translateY(-2px);",
      "}",
      ".bos-button:active{",
      "  transform:translateY(0);",
      "}",
      ".bos-button:focus-visible{",
      "  outline:3px solid rgba(201,146,42,.55);",
      "  outline-offset:3px;",
      "}",
      ".bos-icon{",
      "  width:18px;",
      "  height:18px;",
      "  flex:0 0 18px;",
      "  fill:none;",
      "  stroke:currentColor;",
      "  stroke-width:2;",
      "  stroke-linecap:round;",
      "  stroke-linejoin:round;",
      "}",
      ".bos-label{",
      "  overflow:hidden;",
      "  text-overflow:ellipsis;",
      "}",
      "@media (max-width:480px){",
      "  .bos-button{min-height:46px;padding:0 18px;font-size:14px;}",
      "}",
      "@media (prefers-reduced-motion:reduce){",
      "  .bos-button{transition:none;}",
      "}"
    ].join("\n");

    link.className = "bos-button bos-theme-" + config.theme;
    link.href = BOOKING_ORIGIN + "/r/" + encodeURIComponent(config.slug);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", config.label);

    label.className = "bos-label";
    label.textContent = config.label;

    link.appendChild(createIcon());
    link.appendChild(label);
    shadow.appendChild(style);
    shadow.appendChild(link);
    document.body.appendChild(host);
  }

  if (alreadyMounted()) {
    return;
  }

  var script = getCurrentScript();
  if (script) {
    script.setAttribute(SCRIPT_FLAG, "true");
  }

  var config = readConfig(script);
  if (!config) {
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      mount(config);
    }, { once: true });
  } else {
    mount(config);
  }
}());
